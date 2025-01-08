package fr.openent.mediacentre.helper;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.service.FavoriteService;
import fr.openent.mediacentre.service.TextBookService;
import fr.openent.mediacentre.service.impl.DefaultFavoriteService;
import fr.openent.mediacentre.service.impl.DefaultTextBookService;
import fr.openent.mediacentre.source.GAR;
import fr.openent.mediacentre.source.Source;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.user.UserInfos;

import java.util.List;
import java.util.stream.Collectors;


public class TextBookHelper {

    private final FavoriteService favoriteService = new DefaultFavoriteService();
    private final TextBookService textBookService = new DefaultTextBookService();
    private final Logger log = LoggerFactory.getLogger(TextBookHelper.class);
    private final FavoriteHelper favoriteHelper = new FavoriteHelper();

    public void retrieveTextBooks(String state, UserInfos user, List<Source> sources, List<String> idStructures, ResponseHandlerHelper answer) {
        Future<JsonArray> getTextBookFuture = getTextBooks(user.getUserId());
        Future<JsonArray> getFavoritesResourcesFuture = getFavorite(GAR.class.getName(), user.getUserId());

        Future.all(getTextBookFuture, getFavoritesResourcesFuture).onComplete(event -> {
            if (event.failed()) {
                log.error("[textBook@get] Failed to retrieve user textbooks" + event.cause().toString());
                answer.answerFailure(new JsonObject().put("error", "Field to retrieve textbooks").put("status", "ko").encode());
                return;
            }

            JsonArray textBooks = getTextBookFuture.result();
            favoriteHelper.matchFavorite(getFavoritesResourcesFuture, textBooks);


            if (textBooks.isEmpty()) {
                initUserTextBooks(state, user, sources, idStructures, answer);
            } else {
                answer.answerSuccess(HelperUtils.frameLoad(
                        Field.TEXTBOOKS_RESULT,
                        state,
                        Field.OK,
                        new JsonObject().put(Field.TEXTBOOKS, textBooks)
                ).encode());
            }
        });
    }

    public Future<JsonArray> getTextBooks(String userId) {
        Promise<JsonArray> promise = Promise.promise();
        textBookService.get(userId)
            .onSuccess(promise::complete)
            .onFailure(promise::fail);
        return promise.future();
    }

    private Future<JsonArray> getFavorite(String source, String userId) {
        Promise<JsonArray> promise = Promise.promise();
        favoriteService.get(source.getClass().getName(), userId, FutureHelper.handlerJsonArray(promise));
        return promise.future();
    }

    public void initUserTextBooks(String state, UserInfos user, List<Source> sources, List<String> idStructures, ResponseHandlerHelper answer) {
        sources = sources.stream().filter(source -> source instanceof GAR).collect(Collectors.toList());
        if (sources.isEmpty()) {
            answer.answerFailure(HelperUtils.frameLoad(
                    Field.TEXTBOOKS_RESULT,
                    state,
                    Field.KO,
                    new JsonObject().put(Field.ERROR, "[TextBookHelper] Failed to retrieve GAR textbooks")
            ).encode());
        } else {
            retrieveUserTextbooks(state, user, sources.get(0), idStructures, answer);
        }
    }

    private void retrieveUserTextbooks(String state, UserInfos user, Source source, List<String> idStructures, ResponseHandlerHelper answer) {
        ((GAR) source).initTextBooks(user, idStructures, event -> {
            if (event.isLeft()) {
                log.error("[TextBookHelper] Failed to retrieve GAR resources" + event.left().getValue());
                answer.answerSuccess(new JsonObject().put("error", "Failed to retrieve GAR resources").put("status", "ko").encode());
                return;
            }
            JsonObject resources = event.right().getValue();
            JsonArray textbooks = resources.getJsonArray(Field.TEXTBOOKS, new JsonArray());
            JsonArray externalResources = resources.getJsonArray(Field.EXTERNAL_RESOURCES, new JsonArray());
            if (externalResources != null && !externalResources.isEmpty()) {
                textBookService.insertExternalResources(user.getUserId(), externalResources)
                    .onFailure(err -> log.error("[Mediacentre@TextbookHelper:retrieveUserTextbooks] Failed to insert external resources" + err.getMessage()));
            }
            if (textbooks == null || textbooks.isEmpty()) {
                answer.answerSuccess(HelperUtils.frameLoad(Field.TEXTBOOKS_RESULT,
                        state,
                        Field.OK,
                        new JsonObject().put(Field.TEXTBOOKS, textbooks)).encode());
                return;
            }
            textBookService.insert(user.getUserId(), textbooks, either -> {
                if (either.isLeft()) {
                    log.error("[TextBookHelper] Failed to insert user textbooks" + either.left().getValue());
                    answer.answerFailure(new JsonObject()
                            .put(Field.ERROR, "Failed to insert GAR textbooks")
                            .put(Field.STATUS, Field.KO)
                            .encode());
                    return;
                }

                JsonObject frame = new JsonObject();
                HelperUtils.frameLoad(Field.TEXTBOOKS_RESULT, "get", Field.OK);
                frame.put(Field.DATA, new JsonObject().put(Field.TEXTBOOKS, textbooks));
                answer.answerSuccess(HelperUtils.frameLoad(Field.TEXTBOOKS_RESULT,
                        state,
                        Field.OK,
                        new JsonObject().put(Field.TEXTBOOKS, textbooks)).encode()
                );
            });
        });
    }

    public void refreshTextBooks(String state,List<Source> sources, UserInfos user, List<String> idStructures, ResponseHandlerHelper answer) {
        textBookService.deleteExternalResources(user.getUserId())
            .onSuccess(voidResult -> textBookService.delete(user.getUserId(), event -> {
                if (event.isLeft()) {
                    log.error("[TextBookHelper@refreshTextBooks] Failed to delete user textbooks");
                    answer.answerFailure(new JsonObject()
                        .put(Field.ERROR, "Failed to delete user textbooks")
                        .put(Field.STATUS, Field.KO).encode());
                    return;
                }
                retrieveTextBooks(state, user, sources, idStructures, answer);
            }))
            .onFailure(err -> {
                log.error("[TextBookHelper@refreshTextBooks] Failed to delete user external resources" + err.getMessage());
                answer.answerFailure(new JsonObject()
                    .put(Field.ERROR, "Failed to delete user external resources")
                    .put(Field.STATUS, Field.KO).encode());
            });
    }
}
