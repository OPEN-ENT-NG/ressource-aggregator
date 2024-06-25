package fr.openent.mediacentre.service.impl;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.FutureHelper;
import fr.openent.mediacentre.helper.IModelHelper;
import fr.openent.mediacentre.model.GlobalResource;
import fr.openent.mediacentre.model.PinnedResource;
import fr.openent.mediacentre.service.PinnedService;
import fr.wseduc.mongodb.MongoDb;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.mongodb.MongoDbResult;

import java.util.List;
import java.util.Optional;

public class DefaultPinnedService implements PinnedService {
    private final String collection;
    private final MongoDb mongo;
    private static final Logger log = LoggerFactory.getLogger(DefaultPinnedService.class);


    public DefaultPinnedService(String collection) {
        this.collection = collection;
        this.mongo = MongoDb.getInstance();
    }

    public Future<JsonObject> create(JsonObject resource) {
        Promise<JsonObject> promise = Promise.promise();
        if (!resource.containsKey(Field.ID) || !resource.containsKey(Field.SOURCE)) {
            promise.fail("Missing required fields id or source");
            return promise.future();
        }
        PinnedResource pinned = new PinnedResource(resource);
        String errorMessage = "[Mediacentre@DefaultPinnedService::create] Failed to create pinned resource : ";
        mongo.insert(collection, pinned.toJson(), MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise, errorMessage)));
        return promise.future();
    }

    public Future<List<PinnedResource>> list() {
        Promise<List<PinnedResource>> promise = Promise.promise();
        mongo.find(collection, new JsonObject(), MongoDbResult.validResultsHandler(result -> {
            if (result.isLeft()) {
                log.error("[Mediacentre@DefaultPinnedService::list] Can't find pinned resources : ", result.left().getValue());
                promise.fail(result.left().getValue());
                return;
            }
            promise.complete(IModelHelper.toList(result.right().getValue(), PinnedResource.class));
        }));
        return promise.future();
    }

    public Future<JsonObject> delete(String idPinned, String source) {
        Promise<JsonObject> promise = Promise.promise();
        JsonObject query = new JsonObject().put(Field.ID, idPinned).put(Field.SOURCE, source);
        mongo.delete(collection, query, MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise)));
        return promise.future();
    }

    public Future<Optional<PinnedResource>> put(String id, String source, JsonObject resource) {
        Promise<Optional<PinnedResource>> promise = Promise.promise();
        JsonObject query = new JsonObject().put("id", id).put("source", source);
        JsonObject update = new JsonObject().put(Field.MONGO_SET, resource);
        mongo.update(collection, query, update, MongoDbResult.validResultHandler(IModelHelper.uniqueResultToIModel(promise, PinnedResource.class)));
        return promise.future();
    }
}
