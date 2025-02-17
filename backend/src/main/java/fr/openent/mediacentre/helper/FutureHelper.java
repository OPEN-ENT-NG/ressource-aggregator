package fr.openent.mediacentre.helper;

import fr.wseduc.webutils.Either;
import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

public class FutureHelper {

    private static final Logger LOGGER = LoggerFactory.getLogger(FutureHelper.class);

    private FutureHelper() {
    }

    public static <T> Handler<AsyncResult<T>> handlerAsyncJsonArray(Promise<T> promise) {
        return jsonArrayAsyncResult -> {
            if (jsonArrayAsyncResult.succeeded()) {
                promise.complete(jsonArrayAsyncResult.result());
            } else {
                promise.fail(jsonArrayAsyncResult.cause());
            }
        };
    }

    public static Handler<Either<String, JsonArray>> handlerJsonArray(Promise<JsonArray> promise) {
        return event -> {
            if (event.isRight()) {
                promise.complete(event.right().getValue());
            } else {
                LOGGER.error(event.left().getValue());
                promise.fail(event.left().getValue());
            }
        };
    }

    public static Handler<Either<String, JsonArray>> handlerJsonArray(Promise<JsonArray> promise, String errorMessage) {
        return event -> {
            if (event.isRight()) {
                promise.complete(event.right().getValue());
            } else {
                LOGGER.error(errorMessage + event.left().getValue());
                promise.fail(event.left().getValue());
            }
        };
    }

    public static Handler<Either<String, JsonObject>> handlerJsonObject(Promise<JsonObject> promise) {
        return event -> {
            if (event.isRight()) {
                promise.complete(event.right().getValue());
            } else {
                LOGGER.error(event.left().getValue());
                promise.fail(event.left().getValue());
            }
        };
    }

    public static Handler<Either<String, JsonObject>> handlerJsonObject(Promise<JsonObject> promise, String errorMessage) {
        return event -> {
            if (event.isRight()) {
                promise.complete(event.right().getValue());
            } else {
                LOGGER.error((errorMessage != null ? errorMessage : "") + event.left().getValue());
                promise.fail(event.left().getValue());
            }
        };
    }

    public static Handler<Either<String, Void>> handlerVoid(Promise<Void> promise, String errorMessage) {
        return event -> {
            if (event.isRight()) {
                promise.complete();
            } else {
                LOGGER.error((errorMessage != null ? errorMessage : "") + event.left().getValue());
                promise.fail(event.left().getValue());
            }
        };
    }

    public static Handler<Either<String, JsonObject>> handlerJsonObjectVoid(Promise<Void> promise, String errorMessage) {
        return event -> {
            if (event.isRight()) {
                promise.complete();
            } else {
                LOGGER.error((errorMessage != null ? errorMessage : "") + event.left().getValue());
                promise.fail(event.left().getValue());
            }
        };
    }
}
