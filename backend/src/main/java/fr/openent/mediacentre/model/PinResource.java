package fr.openent.mediacentre.model;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.IModelHelper;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.List;

public class PinResource implements IModel<PinResource> {
    private String _id;
    private String id;
    private String source;
    private String structure_owner;
    private List<String> structures_children;
    private String title;
    private String description;

    public PinResource() {}

    public PinResource(JsonObject resource) {
        this._id = resource.getString(Field._ID, null);
        this.id = resource.getString(Field.ID, null);
        this.source = resource.getString(Field.SOURCE, null);
        this.structure_owner = resource.getString(Field.STRUCTURE_OWNER, null);
        this.structures_children = IModelHelper.toStringList(resource.getJsonArray(Field.STRUCTURES_CHILDREN, new JsonArray()));
        this.title = resource.getString(Field.TITLE, null);
        this.description = resource.getString(Field.DESCRIPTION, null);
    }

    public String get_id() {
        return _id;
    }

    public PinResource set_id(String _id) {
        this._id = _id;
        return this;
    }

    public String getId() {
        return id;
    }

    public PinResource setId(String id) {
        this.id = id;
        return this;
    }

    public String getSource() {
        return source;
    }

    public PinResource setSource(String source) {
        this.source = source;
        return this;
    }

    public String getStructureOwner() {
        return structure_owner;
    }

    public PinResource setStructureOwner(String structure_owner) {
        this.structure_owner = structure_owner;
        return this;
    }

    public List<String> getStructuresChildren() {
        return structures_children;
    }

    public PinResource setStructuresChildren(List<String> structures_children) {
        this.structures_children = structures_children;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public PinResource setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public PinResource setDescription(String description) {
        this.description = description;
        return this;
    }

    public JsonObject toJson() {
        return new JsonObject()
            .put(Field._ID, this._id)
            .put(Field.ID, this.id)
            .put(Field.SOURCE, this.source)
            .put(Field.STRUCTURE_OWNER, this.structure_owner)
            .put(Field.STRUCTURES_CHILDREN, new JsonArray(this.structures_children))
            .put(Field.TITLE, this.title)
            .put(Field.DESCRIPTION, this.description);
    }
}
