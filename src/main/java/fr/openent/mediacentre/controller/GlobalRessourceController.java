package fr.openent.mediacentre.controller;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.service.GlobalRessourceService;
import fr.openent.mediacentre.service.impl.GlobalRessourceServiceMongoImpl;
import fr.wseduc.rs.Delete;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.rs.Put;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.http.filter.SuperAdminFilter;

public class GlobalRessourceController extends ControllerHelper {

    private final EventBus eb;
    private final GlobalRessourceService globalRessourceService;

    public GlobalRessourceController(EventBus eb) {
        super();
        this.eb = eb;
        this.globalRessourceService = new GlobalRessourceServiceMongoImpl(Field.GLOBAL_COLLECTION);
    }

    @Get("/global/ressources")
    @ResourceFilter(SuperAdminFilter.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getRessources() {
        globalRessourceService.list()
            .onSuccess(ressources -> renderJson(ressources))
            .onFailure(this::renderError);
    }

    @Post("/global/ressources")
    @ResourceFilter(SuperAdminFilter.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void createRessource(HttpServerRequest request) {
        RequestUtils.bodyToJson(request, ressource -> globalRessourceService.create(ressource)
            .onSuccess(result -> ok(request))
            .onFailure(error -> {
                String message = String.format("[GlobalRessourceController@%s::CreateRessource] Failed to create ressource : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            }));
    }

    @Put("/global/ressources/:id")
    @ResourceFilter(SuperAdminFilter.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void updateRessource(HttpServerRequest request) {
        RequestUtils.bodyToJson(request, ressource -> globalRessourceService.update(ressource)
            .onSuccess(result -> ok(request))
            .onFailure(error -> {
                String message = String.format("[GlobalRessourceController@%s::UpdateRessource] Failed to update ressource : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            }));
    }

    @Delete("/global/ressources/:id")
    @ResourceFilter(SuperAdminFilter.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void deleteRessource(HttpServerRequest request) {
        globalRessourceService.delete(request.getParam("id"))
            .onSuccess(result -> ok(request))
            .onFailure(error -> {
                String message = String.format("[GlobalRessourceController@%s::DeleteRessource] Failed to delete ressource : %s",
                        this.getClass().getSimpleName(), error.getMessage());
                log.error(message);
                renderError(request);
            });
    }
}
