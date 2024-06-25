package fr.openent.mediacentre.service;

import fr.openent.mediacentre.model.PinnedResource;
import io.vertx.core.Future;
import io.vertx.core.json.JsonObject;

import java.util.List;
import java.util.Optional;

public interface PinnedService {
    /**
     * create pinned resource
     * @param resource    Pinned resource to create
     */
    public Future<JsonObject> create(JsonObject resource);

    /**
     * list all pinned resources
     * @return Future of all pinned resources
     */
    public Future<List<PinnedResource>> list();

    /**
     * delete a pinned resource
     * @param idPinned   pinned resource id
     * @param source     pinned resource source
     */
    public Future<JsonObject> delete(String idPinned, String source);

    /**
     * update a pinned resource
     * @param id   pinned resource id
     * @param source  pinned resource source
     * @param resource   pinned resource to update
     */
    public Future<Optional<PinnedResource>> put(String id, String source, JsonObject resource);
}
