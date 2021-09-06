package fr.openent.mediacentre.controller;

import fr.openent.mediacentre.Mediacentre;
import fr.openent.mediacentre.service.NeoService;
import fr.openent.mediacentre.service.SignetService;
import fr.openent.mediacentre.service.SignetSharesService;
import fr.openent.mediacentre.service.impl.DefaultNeoService;
import fr.openent.mediacentre.service.impl.DefaultSignetService;
import fr.openent.mediacentre.service.impl.DefaultSignetSharesService;
import fr.wseduc.rs.*;
import fr.wseduc.security.ActionType;
import fr.wseduc.security.SecuredAction;
import fr.wseduc.webutils.http.Renders;
import fr.wseduc.webutils.request.RequestUtils;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.controller.ControllerHelper;
import org.entcore.common.user.UserUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;
import static org.entcore.common.http.response.DefaultResponseHandler.defaultResponseHandler;

public class SignetController extends ControllerHelper {
    private static final Logger log = LoggerFactory.getLogger(SignetController.class);
    private final SignetService signetService;
    private final SignetSharesService signetShareService;
    private final NeoService neoService;

    public SignetController(EventBus eb) {
        super();
        this.eb = eb;
        this.signetService = new DefaultSignetService();
        this.signetShareService = new DefaultSignetSharesService();
        this.neoService = new DefaultNeoService();

    }

    // API

    @Get("/signets")
    @ApiDoc("List all the signets created by me or shared with me")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void list(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user != null) {
                final List<String> groupsAndUserIds = new ArrayList<>();
                groupsAndUserIds.add(user.getUserId());
                if (user.getGroupsIds() != null) {
                    groupsAndUserIds.addAll(user.getGroupsIds());
                }
                signetService.list(groupsAndUserIds, user, arrayResponseHandler(request));
            } else {
                log.error("User not found in session.");
                Renders.unauthorized(request);
            }
        });
    }

    @Get("/signets/:signetId")
    @ApiDoc("Get a specific signet by id")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void get(HttpServerRequest request) {
        String signetId = request.getParam("signetId");
        signetService.get(signetId, defaultResponseHandler(request));
    }

    @Post("/signets")
    @ApiDoc("Create a signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void create(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user != null) {
                RequestUtils.bodyToJson(request, signet -> {
                    signetService.create(signet, user, defaultResponseHandler(request));
                });
            } else {
                log.error("User not found in session.");
                Renders.unauthorized(request);
            }
        });
    }

    @Put("/signets/:signetId")
    @ApiDoc("Update a specific signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void update(HttpServerRequest request) {
        String signetId = request.getParam("signetId");
        RequestUtils.bodyToJson(request, signet -> {
            signetService.update(signetId, signet, defaultResponseHandler(request));
        });
    }

    @Delete("/signets/:signetId")
    @ApiDoc("Delete a scpecific signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void delete(HttpServerRequest request) {
        String signetId = request.getParam("signetId");
        signetService.delete(signetId, defaultResponseHandler(request));
    }

    @Get("/signets/:signetId/rights")
    @ApiDoc("Get my rights for a specific signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void getMyFormRights(HttpServerRequest request) {
        String signetId = request.getParam("signetId");
        UserUtils.getUserInfos(eb, request, user -> {
            if (user != null) {
                List<String> groupsAndUserIds = new ArrayList();
                groupsAndUserIds.add(user.getUserId());
                if (user.getGroupsIds() != null) {
                    groupsAndUserIds.addAll(user.getGroupsIds());
                }
                signetService.getMyFormRights(signetId, groupsAndUserIds, arrayResponseHandler(request));
            } else {
                log.error("User not found in session.");
                Renders.unauthorized(request);
            }
        });
    }

    @Get("/signets/rights/all")
    @ApiDoc("Get my rights for all the signets")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void getAllMyFormRights(HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user != null) {
                List<String> groupsAndUserIds = new ArrayList();
                groupsAndUserIds.add(user.getUserId());
                if (user.getGroupsIds() != null) {
                    groupsAndUserIds.addAll(user.getGroupsIds());
                }
                signetService.getAllMyFormRights(groupsAndUserIds, arrayResponseHandler(request));
            } else {
                log.error("User not found in session.");
                Renders.unauthorized(request);
            }
        });
    }



    // Share/Sending functions

    @Override
    @Get("/share/json/:id")
    @ApiDoc("List rights for a given signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void shareJson(final HttpServerRequest request) {
        super.shareJson(request, false);
    }

    @Put("/share/json/:id")
    @ApiDoc("Add rights for a given signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void shareSubmit(final HttpServerRequest request) {
        UserUtils.getUserInfos(eb, request, user -> {
            if (user != null) {
                request.pause();
                final String signetId = request.params().get("id");
                signetService.get(signetId, getFormHandler -> {
                    request.resume();
                    final String signetName = getFormHandler.right().getValue().getString("title");
                    JsonObject params = new fr.wseduc.webutils.collections.JsonObject();
                    SignetController.super.shareJsonSubmit(request, null, false, params, null);
                });
            }
            else {
                log.error("User not found in session.");
                unauthorized(request);
            }
        });
    }

    @Put("/share/resource/:id")
    @ApiDoc("Add rights for a given signet")
    @SecuredAction(value = "", type = ActionType.AUTHENTICATED)
    public void shareResource(final HttpServerRequest request) {
        RequestUtils.bodyToJson(request, pathPrefix + "share", shareFormObject -> {
            UserUtils.getUserInfos(eb, request, user -> {
                if (user != null) {
                    // Get all ids, filter the one about sending (response right)
                    final String signetId = request.params().get("id");
                    Map<String, Object> idUsers = shareFormObject.getJsonObject("users").getMap();
                    Map<String, Object> idGroups = shareFormObject.getJsonObject("groups").getMap();
                    Map<String, Object> idBookmarks = shareFormObject.getJsonObject("bookmarks").getMap();

                    JsonArray usersIds = new JsonArray();
                    JsonArray groupsIds = new JsonArray();
                    JsonArray bookmarksIds = new JsonArray();

                    // Get group ids and users ids from bookmarks and add them to previous lists
                    neoService.getIdsFromBookMarks(bookmarksIds, eventBookmarks -> {
                        if (eventBookmarks.isRight()) {
                            JsonArray ids = eventBookmarks.right().getValue().getJsonObject(0).getJsonArray("ids").getJsonObject(0).getJsonArray("ids");
                            for (int i = 0; i < ids.size(); i++) {
                                JsonObject id = ids.getJsonObject(i);
                                boolean isGroup = id.getString("name") != null;
                                (isGroup ? groupsIds : usersIds).add(id.getString("id"));
                            }
                        } else {
                            log.error("[Formulaire@getUserIds] Fail to get ids from bookmarks' ids");
                        }
                    });

                    // Update 'collab' property as needed
                    List<Map<String, Object>> idsObjects = new ArrayList<>();
                    idsObjects.add(idUsers);
                    idsObjects.add(idGroups);
                    idsObjects.add(idBookmarks);
                    // Fix bug auto-unsharing
                    signetShareService.getSharedWithMe(signetId, user, event -> {
                        if (event.isRight() && event.right().getValue() != null) {
                            JsonArray rights = event.right().getValue();
                            String id = user.getUserId();
                            shareFormObject.getJsonObject("users").put(id, new JsonArray());

                            for (int i = 0; i < rights.size(); i++) {
                                JsonObject right = rights.getJsonObject(i);
                                shareFormObject.getJsonObject("users").getJsonArray(id).add(right.getString("action"));
                            }

                            // Classic sharing stuff (putting or removing ids from signet_shares table accordingly)
                            this.getShareService().share(user.getUserId(), signetId, shareFormObject, (r) -> {
                                if (r.isRight()) {
                                    this.doShareSucceed(request, signetId, user, shareFormObject, (JsonObject)r.right().getValue(), false);
                                } else {
                                    JsonObject error = (new JsonObject()).put("error", (String)r.left().getValue());
                                    Renders.renderJson(request, error, 400);
                                }
                            });
                        }
                        else {
                            log.error("[Formulaire@getSharedWithMe] Fail to get user's shared rights");
                        }
                    });
                } else {
                    log.error("User not found in session.");
                    unauthorized(request);
                }
            });
        });
    }

}