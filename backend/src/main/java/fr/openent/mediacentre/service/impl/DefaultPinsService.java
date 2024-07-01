package fr.openent.mediacentre.service.impl;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.*;
import fr.openent.mediacentre.model.GarResource;
import fr.openent.mediacentre.model.IModel;
import fr.openent.mediacentre.model.PinResource;
import fr.openent.mediacentre.model.SignetResource;
import fr.openent.mediacentre.service.PinsService;
import fr.openent.mediacentre.service.SignetService;
import fr.openent.mediacentre.source.Source;
import fr.wseduc.mongodb.MongoDb;
import fr.wseduc.webutils.Either;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.mongodb.MongoDbResult;
import org.entcore.common.user.UserInfos;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.entcore.common.http.response.DefaultResponseHandler.arrayResponseHandler;

public class DefaultPinsService implements PinsService {
    private final String collection;
    private final MongoDb mongo;
    private static final Logger log = LoggerFactory.getLogger(DefaultPinsService.class);
    private final SignetService signetService;

    private final TextBookHelper textBookHelper = new TextBookHelper();
    private final SearchHelper searchHelper = new SearchHelper();
    private final SignetHelper signetHelper = new SignetHelper();

    public DefaultPinsService(String collection) {
        this.collection = collection;
        this.signetService = new DefaultSignetService();
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

    public Future<JsonArray> getData(List<PinResource> resources, UserInfos user, List<Source> sources) {
        Promise<JsonArray> promise = Promise.promise();
        JsonArray data = new JsonArray();
        JsonArray searchSources = new JsonArray().add("fr.openent.mediacentre.source.Moodle");
        JsonObject searchQuery = new JsonObject().put("query", ".*");
        textBookHelper.getTextBooks(user.getUserId())
            .compose(resourcesGar -> {
                data.addAll(resourcesGar);  // get GAR
                return Future.succeededFuture();
            })
            .compose(resourcesGar -> searchHelper.search("PLAIN_TEXT", sources, searchSources, searchQuery, user))
            .compose(resourcesSearch -> {
                data.addAll(resourcesSearch); // get Moodle
                return Future.succeededFuture();
            })
            .compose(resourcesSearch -> signetHelper.signetRetrieve(user))
            .compose(resourcesSignet -> {
                data.addAll(resourcesSignet); // get Public signet
                return Future.succeededFuture();
            })
            .compose(resourcesSignet -> {
                final List<String> groupsAndUserIds = new ArrayList<>();
                groupsAndUserIds.add(user.getUserId());
                if (user.getGroupsIds() != null) {
                    groupsAndUserIds.addAll(user.getGroupsIds());
                }
                Promise<JsonArray> promiseResponse = Promise.promise();
                Handler<Either<String, JsonArray>> handler = event -> {
                    if (event.isLeft()) {
                        log.error("[Mediacentre@DefaultPinnedService::getData] Failed to retrieve signet resources : ", event.left().getValue());
                        promiseResponse.fail(event.left().getValue());
                        return;
                    }
                    data.addAll(event.right().getValue()); // get my signet
                    promiseResponse.complete(event.right().getValue());
                };
                signetService.list(groupsAndUserIds, user, handler);
                return promiseResponse.future();
            })
            .compose(resourcesMySignets -> {
                List<JsonObject> enrichedResources = resources.stream()
                    .map(resource -> {
                        JsonObject enrichedResource = IModelHelper.toJson(resource, false, true);

                        return data.stream()
                            .map(JsonObject.class::cast) // Convert Object to JsonObject
                            .filter(dataItem -> dataItem.getString("id").equals(enrichedResource.getString("id")) && dataItem.getString("source").equals(enrichedResource.getString("source")))
                            .findFirst()
                            .map(dataItem -> {
                                dataItem.fieldNames().forEach(fieldName -> {
                                    enrichedResource.put(fieldName, dataItem.getValue(fieldName));
                                });
                                return enrichedResource;
                            })
                            .orElse(null);
                    })
                    .filter(Objects::nonNull) // Remove null entries
                    .collect(Collectors.toList());

                return Future.succeededFuture(new JsonArray(enrichedResources));
            })
            .onSuccess(promise::complete)
            .onFailure(error -> {
                log.error("[Mediacentre@DefaultPinnedService::getData] Failed to retrieve signet resources : ", error.getMessage());
                promise.fail(error.getMessage());
            });
        return promise.future();
    }
}
