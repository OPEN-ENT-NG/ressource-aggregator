package fr.openent.mediacentre.controller;

import fr.openent.mediacentre.Mediacentre;
import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.IModelHelper;
import fr.openent.mediacentre.security.ViewRight;
import fr.openent.mediacentre.security.PinRight;
import fr.openent.mediacentre.service.PinsService;
import fr.openent.mediacentre.service.UserService;
import fr.openent.mediacentre.service.impl.DefaultPinsService;
import fr.openent.mediacentre.service.impl.DefaultUserService;
import fr.openent.mediacentre.source.Source;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.http.Renders;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.Future;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.notification.TimelineHelper;
import org.entcore.common.user.UserUtils;

import java.util.List;
import java.util.Map;

public class PinsController extends ControllerHelper {

    private final EventBus eb;
    private final PinsService pinsService;
    private final UserService userService;
    private final List<Source> sources;

    public PinsController(EventBus eb, List<Source> sources, Map<String, fr.wseduc.webutils.security.SecuredAction> securedActions, TimelineHelper timelineHelper) {
        super();
        this.eb = eb;
        this.pinsService = new DefaultPinsService(Field.PINS_COLLECTION, securedActions, eb, timelineHelper);
        this.userService = new DefaultUserService(eb);
        this.sources = sources;
    }

    @Get("/structures/:idStructure/pins")
    @ApiDoc("List all pinned resources for a structure")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value="", type=ActionType.RESOURCE)
    public void getResources(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> pinsService.list(request.getParam(Field.IDSTRUCTURE))
            .compose(resources -> pinsService.getData(resources, user, sources))
            .compose(resources -> pinsService.getStructureIsParent(resources, user))
            .onSuccess(resources -> renderJson(request, resources))
            .onFailure(error -> {
                String message = String.format("[PinnedController@%s::getResources] Failed to get resources : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            })
        );
    }

    @Post("/structures/:idStructure/pins")
    @ApiDoc("Create a pinned resource for a structure")
    @ResourceFilter(PinRight.class)
    @SecuredAction(value="", type=ActionType.RESOURCE)
    public void createResource(HttpServerRequest request) {
        String idStructure = request.getParam(Field.IDSTRUCTURE);
        RequestUtils.bodyToJson(request, pinned -> pinsService.checkPinDontExist(pinned, idStructure)
            .compose(v -> pinsService.checkParentPin(idStructure, pinned))
            .compose(v -> userService.getSubstructureIds(idStructure))
            .compose(structures -> pinsService.checkChildPin(structures, pinned)
                .compose(v -> pinsService.create(pinned, idStructure, structures))
                .compose(result -> {
                    Renders.created(request);
                    return Future.succeededFuture((Void) null);
                })
                .onSuccess(result -> pinsService.sendNotification(request, pinned, structures, idStructure))
                .onFailure(error -> {
                    String message = String.format("[PinnedController@%s::createResource] Failed to create resource : %s",
                            this.getClass().getSimpleName(), error.getMessage());
                    log.error(message);
                    Renders.badRequest(request, error.getMessage());
                })
            )
            .onFailure(error -> {
                String message = String.format("[PinnedController@%s::createResource] Failed to create resource : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                Renders.badRequest(request, error.getMessage());
            })
        );
    }

    @Put("/structures/:idStructure/pins/:idPin")
    @ApiDoc("Update a pinned resource")
    @ResourceFilter(PinRight.class)
    @SecuredAction(value="", type=ActionType.RESOURCE)
    public void updateResource(HttpServerRequest request) {
        String idStructure = request.getParam(Field.IDSTRUCTURE);
        String idPin = request.getParam(Field.IDPIN);
        RequestUtils.bodyToJson(request, resource -> pinsService.put(idStructure, idPin, resource)
                .onSuccess(result -> Renders.noContent(request))
                .onFailure(error -> {
                    String message = String.format("[PinnedController@%s::updateResource] Failed to update resource : %s",
                            this.getClass().getSimpleName(), error.getMessage());
                    log.error(message);
                    Renders.badRequest(request, error.getMessage());
                })
        );
    }

    @Delete("/structures/:idStructure/pins/:idPin")
    @ApiDoc("Delete a pinned resource")
    @ResourceFilter(PinRight.class)
    @SecuredAction(value="", type=ActionType.RESOURCE)
    public void deleteResource(HttpServerRequest request) {
        String idPinned = request.getParam(Field.IDPIN);
        pinsService.delete(idPinned)
            .onSuccess(result -> Renders.noContent(request))
            .onFailure(error -> {
                String message = String.format("[PinnedController@%s::deleteResource] Failed to delete resource : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                Renders.badRequest(request, error.getMessage());
            });
    }
}