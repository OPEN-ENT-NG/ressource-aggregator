package fr.openent.mediacentre.service;

import fr.openent.mediacentre.model.PinResource;
import io.vertx.core.Future;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.List;
import java.util.Optional;

public interface PinsService {
    /**
     * create pinned resource
     * @param resource    Pinned resource to create
     * @param idStructure structure id
     * @param structures  list of structures
     */
    public Future<JsonObject> create(JsonObject resource, String idStructure, List<String> structures);

    /**
     * list all pinned resources
     * @return Future of all pinned resources
     * @param idStructure structure id
     */
    public Future<List<PinResource>> list(String idStructure);

    /**
     * delete a pinned resource
     * @param idPin     pinned resource id
     */
    public Future<JsonObject> delete(String idPin);

    /**
     * update a pinned resource
     * @param idStructure structure id
     * @param idPin       pinned resource id
     * @param resource   pinned resource to update
     */
    public Future<Optional<PinResource>> put(String idStructure, String idPin, JsonObject resource);
    public Future<Void> checkPinDontExist(JsonObject resource, String idStructure);
    public Future<JsonObject> checkChildPin(List<String> structures, JsonObject resource);
    public Future<Void> checkParentPin(String idStructure, JsonObject resource);
    public Future<JsonArray> getData(List<PinResource> resources);

}
