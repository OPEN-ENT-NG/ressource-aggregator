package fr.openent.mediacentre.controller;

import fr.openent.mediacentre.Mediacentre;
import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.IModelHelper;
import fr.openent.mediacentre.security.ViewRight;
import fr.openent.mediacentre.service.PinsService;
import fr.openent.mediacentre.service.UserService;
import fr.openent.mediacentre.service.impl.DefaultPinsService;
import fr.openent.mediacentre.service.impl.DefaultUserService;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.http.Renders;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;

public class PinsController extends ControllerHelper {

    private final EventBus eb;
    private final PinsService pinsService;
    private final UserService userService;

    public PinsController(EventBus eb) {
        super();
        this.eb = eb;
        this.pinsService = new DefaultPinsService(Field.PINS_COLLECTION);
        this.userService = new DefaultUserService(eb);
    }

    @Get("/structures/:idStructure/pins")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(Mediacentre.PIN_VIEW_RIGHT)
    public void getResources(HttpServerRequest request) {
        pinsService.list(request.getParam(Field.IDSTRUCTURE))
            .compose(pinsService::getData)
            .onSuccess(resources -> renderJson(request, resources))
            .onFailure(error -> {
                String message = String.format("[PinnedController@%s::getResources] Failed to get resources : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            });
    }

    @Post("/structures/:idStructure/pins")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(Mediacentre.PIN_CREATION_RIGHT)
    public void createResource(HttpServerRequest request) {
        String idStructure = request.getParam(Field.IDSTRUCTURE);
        RequestUtils.bodyToJson(request, pinned -> pinsService.checkPinDontExist(pinned, idStructure)
            .compose(v -> pinsService.checkParentPin(idStructure, pinned))
            .compose(v -> userService.getNSubstructureIds(idStructure))
            .compose(structures -> pinsService.checkChildPin(structures, pinned)
                .compose(v -> pinsService.create(pinned, idStructure, structures))
                    .onSuccess(result -> Renders.created(request))
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
    @ResourceFilter(ViewRight.class)
    @SecuredAction(Mediacentre.PIN_CREATION_RIGHT)
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
    @ResourceFilter(ViewRight.class)
    @SecuredAction(Mediacentre.PIN_CREATION_RIGHT)
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