package fr.openent.mediacentre.service.impl;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.FutureHelper;
import fr.openent.mediacentre.helper.IModelHelper;
import fr.openent.mediacentre.model.PinResource;
import fr.openent.mediacentre.service.PinsService;
import fr.wseduc.mongodb.MongoDb;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.mongodb.MongoDbResult;

import java.util.List;
import java.util.Optional;

public class DefaultPinsService implements PinsService {
    private final String collection;
    private final MongoDb mongo;
    private static final Logger log = LoggerFactory.getLogger(DefaultPinsService.class);


    public DefaultPinsService(String collection) {
        this.collection = collection;
        this.mongo = MongoDb.getInstance();
    }

    public Future<JsonObject> create(JsonObject resource, String idStructure, List<String> structures) {
        Promise<JsonObject> promise = Promise.promise();
        if (!resource.containsKey(Field.ID) || !resource.containsKey(Field.SOURCE)) {
            promise.fail("Missing required fields id or source");
            return promise.future();
        }
        resource.put(Field.STRUCTURE_OWNER, idStructure);
        resource.put(Field.STRUCTURES_CHILDREN, new JsonArray(structures));
        PinResource pinned = new PinResource(resource);
        String errorMessage = "[Mediacentre@DefaultPinnedService::create] Failed to create pinned resource : ";
        mongo.insert(collection, pinned.toJson(), MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise, errorMessage)));
        return promise.future();
    }

    public Future<List<PinResource>> list(String idStructure) {
        Promise<List<PinResource>> promise = Promise.promise();
        JsonObject query = new JsonObject()
            .put("$or", new JsonArray()
                .add(new JsonObject().put(Field.STRUCTURE_OWNER, idStructure))
                .add(new JsonObject().put(Field.STRUCTURES_CHILDREN, idStructure))
            );
        mongo.find(collection, query, MongoDbResult.validResultsHandler(result -> {
            if (result.isLeft()) {
                log.error("[Mediacentre@DefaultPinnedService::list] Can't find pinned resources : ", result.left().getValue());
                promise.fail(result.left().getValue());
                return;
            }
            promise.complete(IModelHelper.toList(result.right().getValue(), PinResource.class));
        }));
        return promise.future();
    }

    public Future<JsonObject> delete(String idPin) {
        Promise<JsonObject> promise = Promise.promise();
        JsonObject query = new JsonObject().put(Field._ID, idPin);
        mongo.delete(collection, query, MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise)));
        return promise.future();
    }

    public Future<Optional<PinResource>> put(String idStructure, String idPin, JsonObject resource) {
        Promise<Optional<PinResource>> promise = Promise.promise();
        JsonObject query = new JsonObject().put(Field._ID, idPin);
        JsonObject resourceUpdated = new JsonObject(); // update only title and description
        if (resource.containsKey(Field.TITLE) && !resource.getString(Field.TITLE).isEmpty())
            resourceUpdated.put(Field.TITLE, resource.getString(Field.TITLE));
        if (resource.containsKey(Field.DESCRIPTION) && !resource.getString(Field.DESCRIPTION).isEmpty())
            resourceUpdated.put(Field.DESCRIPTION, resource.getString(Field.DESCRIPTION));
        JsonObject update = new JsonObject().put(Field.MONGO_SET, resourceUpdated);
        mongo.update(collection, query, update, MongoDbResult.validResultHandler(IModelHelper.uniqueResultToIModel(promise, PinResource.class)));
        return promise.future();
    }

    public Future<Void> checkPinDontExist(JsonObject resource, String idStructure) {
        Promise<Void> promise = Promise.promise();
        JsonObject query = new JsonObject()
            .put(Field.ID, resource.getString(Field.ID))
            .put(Field.SOURCE, resource.getString(Field.SOURCE))
            .put(Field.STRUCTURE_OWNER, idStructure);
        mongo.findOne(collection, query, MongoDbResult.validResultHandler(event -> {
            if (event.isRight() && !event.right().getValue().isEmpty()) {
                promise.fail("Pinned resource already exists");
                return;
            } else if (event.isLeft()) {
                promise.fail(event.left().getValue());
                return;
            }
            promise.complete();
        }));
        return promise.future();
    }

    public Future<JsonObject> checkChildPin(List<String> structures, JsonObject resource) {
        Promise<JsonObject> promise = Promise.promise();

        JsonObject query = new JsonObject()
                .put(Field.ID, resource.getString(Field.ID))
                .put(Field.SOURCE, resource.getString(Field.SOURCE))
                .put(Field.STRUCTURE_OWNER, new JsonObject().put(Field.MONGO_IN, new JsonArray(structures)));

        mongo.delete(collection, query, MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    public Future<Void> checkParentPin(String idStructure, JsonObject resource) {
        Promise<Void> promise = Promise.promise();
        JsonObject query = new JsonObject()
            .put(Field.ID, resource.getString(Field.ID))
            .put(Field.SOURCE, resource.getString(Field.SOURCE))
            .put(Field.STRUCTURES_CHILDREN, new JsonObject().put("$in", new JsonArray().add(idStructure)));
        mongo.findOne(collection, query, MongoDbResult.validResultHandler(event -> {
            if (event.isRight() && !event.right().getValue().isEmpty()) {
                promise.fail("Parent have already pinned this resource");
                return;
            } else if (event.isLeft()) {
                promise.fail(event.left().getValue());
                return;
            }
            promise.complete();
        }));
        return promise.future();
    }

    public Future<JsonArray> getData(List<PinResource> resources) {
        Promise<JsonArray> promise = Promise.promise();
        JsonArray data = new JsonArray();
        for (PinResource resource: resources) {
            data.add(resource.toJson()); // transform pinned to real resource
        }
        promise.complete(data);
        return promise.future();
    }
}
