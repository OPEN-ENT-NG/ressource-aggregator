package fr.openent.mediacentre.controller;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.HelperUtils;
import fr.openent.mediacentre.security.ViewRight;
import fr.openent.mediacentre.service.PinnedService;
import fr.openent.mediacentre.service.impl.DefaultPinnedService;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonObject;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;

import static fr.openent.mediacentre.core.constants.Field.ID;
import static fr.openent.mediacentre.core.constants.Field.SOURCE;

public class PinnedController extends ControllerHelper {

    private final EventBus eb;
    private final PinnedService pinnedService;

    public PinnedController(EventBus eb) {
        super();
        this.eb = eb;
        this.pinnedService = new DefaultPinnedService(Field.PINNED_COLLECTION);
    }

    @Get("/pinned/resources")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getResources(HttpServerRequest request) {
        pinnedService.list()
            .onSuccess(resources -> renderJson(request, new JsonObject(HelperUtils.frameLoad(
                    Field.PINNED_RESULT,
                    Field.GET,
                    Field.OK,
                    new JsonObject().put(Field.PINNED, resources)).encode()))
            )
            .onFailure(error -> {
                String message = String.format("[PinnedController@%s::getResources] Failed to get resources : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            });
    }

    @Post("/pinned/resources")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void createResource(HttpServerRequest request) {
        // check if user have good rights here
        // get all children structures of structure owner and add them to structures_children
        RequestUtils.bodyToJson(request, pinned -> pinnedService.create(pinned)
                .onSuccess(result -> ok(request))
                .onFailure(error -> {
                    String message = String.format("[PinnedController@%s::createResource] Failed to create resource : %s",
                            this.getClass().getSimpleName(), error.getMessage());
                    log.error(message);
                    renderError(request);
                })
        );
    }

    @Put("/pinned/resources")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void updateResource(HttpServerRequest request) {
        if (!request.params().contains(ID) && !request.params().contains(SOURCE)) {
            badRequest(request);
            return;
        }
        String pinnedId = request.getParam(ID);
        String source = request.getParam(SOURCE);
        // check if user have good rights here
        RequestUtils.bodyToJson(request, pinned -> pinnedService.put(pinnedId, source, pinned)
                .onSuccess(result -> ok(request))
                .onFailure(error -> {
                    String message = String.format("[PinnedController@%s::updateResource] Failed to update resource : %s",
                            this.getClass().getSimpleName(), error.getMessage());
                    log.error(message);
                    renderError(request);
                })
        );
    }

    @Delete("/pinned/resources")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void deleteResource(HttpServerRequest request) {
        if (!request.params().contains(ID) && !request.params().contains(SOURCE)) {
            badRequest(request);
            return;
        }
        // check if user have good rights here
        String idPinned = request.getParam(ID);
        String source = request.getParam(SOURCE);
        pinnedService.delete(idPinned, source)
            .onSuccess(result -> ok(request))
            .onFailure(error -> {
                String message = String.format("[PinnedController@%s::deleteResource] Failed to delete resource : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            });
    }
}