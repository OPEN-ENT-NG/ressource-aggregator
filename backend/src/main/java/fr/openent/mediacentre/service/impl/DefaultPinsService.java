package fr.openent.mediacentre.service.impl;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.core.constants.MongoConstant;
import fr.openent.mediacentre.core.constants.SourceConstant;
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
import fr.wseduc.webutils.security.SecuredAction;
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

import java.util.*;
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

    public DefaultPinsService(String collection, Map<String, SecuredAction> securedActions) {
        this.collection = collection;
        this.signetService = new DefaultSignetService(securedActions);
        this.mongo = MongoDb.getInstance();
    }

    public Future<JsonObject> create(JsonObject resource, String idStructure, List<String> structures) {
        Promise<JsonObject> promise = Promise.promise();
        if (!resource.containsKey(Field.ID) || !resource.containsKey(Field.SOURCE)) {
            promise.fail("Missing required fields id or source");
            return promise.future();
        }
        if (!resource.containsKey(Field.PINNED_TITLE) || !resource.containsKey(Field.PINNED_DESCRIPTION)) {
            promise.fail("Missing required fields pinned_title or pinned_description");
            return promise.future();
        }
        resource.put(Field.STRUCTURE_OWNER, idStructure);
        resource.put(Field.STRUCTURES_CHILDREN, new JsonArray(structures));
        PinResource pinned = new PinResource(resource);
        String errorMessage = "[Mediacentre@DefaultPinsService::create] Failed to create pinned resource : ";
        mongo.insert(collection, pinned.toJson(), MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise, errorMessage)));
        return promise.future();
    }

    public Future<List<PinResource>> list(String idStructure) {
        Promise<List<PinResource>> promise = Promise.promise();
        JsonObject query = new JsonObject()
            .put(MongoConstant.MONGO_OR, new JsonArray()
                .add(new JsonObject().put(Field.STRUCTURE_OWNER, idStructure))
                .add(new JsonObject().put(Field.STRUCTURES_CHILDREN, idStructure))
            );
        mongo.find(collection, query, MongoDbResult.validResultsHandler(result -> {
            if (result.isLeft()) {
                log.error("[Mediacentre@DefaultPinsService::list] Can't find pinned resources : ", result.left().getValue());
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
        if (resource.containsKey(Field.PINNED_TITLE) && !resource.getString(Field.PINNED_TITLE).isEmpty())
            resourceUpdated.put(Field.PINNED_TITLE, resource.getString(Field.PINNED_TITLE));
        if (resource.containsKey(Field.PINNED_DESCRIPTION))
            resourceUpdated.put(Field.PINNED_DESCRIPTION, resource.getString(Field.PINNED_DESCRIPTION));
        JsonObject update = new JsonObject().put(MongoConstant.MONGO_SET, resourceUpdated);
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
                .put(Field.STRUCTURE_OWNER, new JsonObject().put(MongoConstant.MONGO_IN, new JsonArray(structures)));

        mongo.delete(collection, query, MongoDbResult.validResultHandler(FutureHelper.handlerJsonObject(promise)));

        return promise.future();
    }

    public Future<Void> checkParentPin(String idStructure, JsonObject resource) {
        Promise<Void> promise = Promise.promise();
        JsonObject query = new JsonObject()
            .put(Field.ID, resource.getString(Field.ID))
            .put(Field.SOURCE, resource.getString(Field.SOURCE))
            .put(Field.STRUCTURES_CHILDREN, new JsonObject().put(MongoConstant.MONGO_IN, new JsonArray().add(idStructure)));
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
        JsonArray searchSources = new JsonArray().add(SourceConstant.MOODLE).add(SourceConstant.GAR);
        JsonObject searchQuery = new JsonObject().put(Field.QUERY, ".*");
        textBookHelper.getTextBooks(user.getUserId())
            .recover(error -> {
                log.error("Error while retrieving GAR resources: " + error.getMessage());
                return Future.succeededFuture(new JsonArray());
            })
            .compose(resourcesGar -> {
                if (resourcesGar != null && !resourcesGar.isEmpty()) {
                    data.addAll(resourcesGar);  // get GAR
                }
                return searchHelper.search("PLAIN_TEXT", sources, searchSources, searchQuery, user, new ArrayList<>());
            })
            .recover(error -> {
                log.error("Error while retrieving search resources: " + error.getMessage());
                return Future.succeededFuture(new JsonArray());
            })
            .compose(resourcesSearch -> {
                if (resourcesSearch != null && !resourcesSearch.isEmpty()) {
                    data.addAll(resourcesSearch); // get Moodle
                }
                return signetHelper.signetRetrieve(user);
            })
            .recover(error -> {
                log.error("Error while retrieving public signet resources: " + error.getMessage());
                return Future.succeededFuture(new JsonArray());
            })
            .compose(resourcesSignet -> {
                if (resourcesSignet != null && !resourcesSignet.isEmpty()) {
                    data.addAll(resourcesSignet); // get Public signet
                }
                return retrieveMySignets(user);
            })
            .recover(error -> {
                log.error("Error while retrieving my signets resources: " + error.getMessage());
                return Future.succeededFuture(new JsonArray());
            })
            .compose(resourcesMySignets -> {
                if (resourcesMySignets != null && !resourcesMySignets.isEmpty()) {
                    data.addAll(resourcesMySignets); // get my signet
                }
                return enrichResources(resources, data);
            })
            .onSuccess(promise::complete)
            .onFailure(error -> promise.fail(error.getMessage()));
        return promise.future();
    }

    private Future<JsonArray> retrieveMySignets(UserInfos user) {
        Promise<JsonArray> promiseResponse = Promise.promise();
        final List<String> groupsAndUserIds = new ArrayList<>();
        groupsAndUserIds.add(user.getUserId());
        if (user.getGroupsIds() != null) {
            groupsAndUserIds.addAll(user.getGroupsIds());
        }
        signetService.list(groupsAndUserIds, user)
            .onSuccess(promiseResponse::complete)
            .onFailure(error -> promiseResponse.fail(error.getMessage()));
        return promiseResponse.future();
    }

    private Future<JsonArray> enrichResources(List<PinResource> resources, JsonArray data) {
        Promise<JsonArray> promise = Promise.promise();
        List<JsonObject> enrichedResources = resources.stream()
                .map(resource -> {
                    JsonObject enrichedResource = IModelHelper.toJson(resource, false, true);

                    return data.stream()
                            .map(JsonObject.class::cast)
                            .filter(dataItem -> Objects.equals(dataItem.getValue(Field.ID), enrichedResource.getValue(Field.ID)) && Objects.equals(dataItem.getValue(Field.SOURCE), enrichedResource.getValue(Field.SOURCE)))
                            .findFirst()
                            .map(dataItem -> {
                                dataItem.fieldNames().forEach(fieldName -> enrichedResource.put(fieldName, dataItem.getValue(fieldName)));
                                return enrichedResource;
                            })
                            .orElse(null);
                })
                .filter(Objects::nonNull) // Remove null entries
                .collect(Collectors.toList());

        promise.complete(new JsonArray(enrichedResources));
        return promise.future();
    }
}
