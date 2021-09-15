package fr.openent.mediacentre.controller;

import fr.openent.mediacentre.Mediacentre;
import fr.openent.mediacentre.security.ShareAndOwner;
import fr.openent.mediacentre.security.ViewRight;
import fr.openent.mediacentre.service.impl.DefaultMediacentreEventBus;
import fr.openent.mediacentre.service.impl.DefaultModuleSQLRequestService;
import fr.wseduc.rs.ApiDoc;
import fr.wseduc.rs.Get;
import fr.wseduc.rs.Post;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.Either;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.http.filter.ResourceFilter;
import org.entcore.common.user.UserUtils;

import static fr.openent.mediacentre.Mediacentre.mediacentreConfig;
import static fr.wseduc.webutils.http.response.DefaultResponseHandler.arrayResponseHandler;

public class PublishedController extends ControllerHelper {

    private final fr.openent.mediacentre.service.moduleSQLRequestService moduleSQLRequestService;
    private fr.openent.mediacentre.service.mediacentreEventBus mediacentreEventBus;

    public PublishedController(EventBus eb) {
        super();
        this.moduleSQLRequestService = new DefaultModuleSQLRequestService(Mediacentre.mediacentreSchema, "signet");
        this.mediacentreEventBus = new DefaultMediacentreEventBus(eb);

    }

    @Get("/levels")
    @ApiDoc("get all levels")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getLevels (HttpServerRequest request) {
        moduleSQLRequestService.getLevels(arrayResponseHandler(request));
    }


    @Get("/disciplines")
    @ApiDoc("get all disciplines")
    @ResourceFilter(ViewRight.class)
    @SecuredAction(value = "", type = ActionType.RESOURCE)
    public void getDisciplines (HttpServerRequest request) {
        moduleSQLRequestService.getDisciplines(arrayResponseHandler(request));
    }

    @Post("/signet/publish/:id")
    @ApiDoc("Publish a signet in BP")
    @ResourceFilter(ShareAndOwner.class)
    @SecuredAction(value = Mediacentre.MANAGER_RESOURCE_RIGHT, type = ActionType.RESOURCE)
    public void publish (HttpServerRequest request) {
        RequestUtils.bodyToJson(request, signet -> {
                            callMediacentreEventBusForPublish(signet, mediacentreEventBus, event -> {
                                request.response()
                                        .setStatusCode(200)
                                        .end();
                            });
    });
    }

    static public void callMediacentreEventBusForPublish(JsonObject signet, fr.openent.mediacentre.service.mediacentreEventBus eventBus,
                                                         final Handler<Either<String, JsonObject>> handler) {
        eventBus.publishInMediacentre(signet, handler);
    }
}
