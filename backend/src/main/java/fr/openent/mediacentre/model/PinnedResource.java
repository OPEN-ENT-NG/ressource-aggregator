package fr.openent.mediacentre.model;

import fr.openent.mediacentre.core.constants.Field;
import fr.openent.mediacentre.helper.IModelHelper;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.List;

public class PinnedResource implements IModel<PinnedResource> {
    private String id;
    private String source;
    private String structure_owner;
    private List<String> structures_children;
    private String title;
    private String description;

    public PinnedResource() {}

    public PinnedResource(JsonObject resource) {
        this.id = resource.getString(Field.ID, null);
        this.source = resource.getString(Field.SOURCE, null);
        this.structure_owner = resource.getString(Field.STRUCTURE_OWNER, null);
        this.structures_children = IModelHelper.toStringList(resource.getJsonArray(Field.STRUCTURES_CHILDREN, new JsonArray()));
        this.title = resource.getString(Field.TITLE, null);
        this.description = resource.getString(Field.DESCRIPTION, null);
    }

    public String getId() {
        return id;
    }

    public PinnedResource setId(String id) {
        this.id = id;
        return this;
    }

    public String getSource() {
        return source;
    }

    public PinnedResource setSource(String source) {
        this.source = source;
        return this;
    }

    public String getStructure_owner() {
        return structure_owner;
    }

    public PinnedResource setStructure_owner(String structure_owner) {
        this.structure_owner = structure_owner;
        return this;
    }

    public List<String> getStructures_children() {
        return structures_children;
    }

    public PinnedResource setStructures_children(List<String> structures_children) {
        this.structures_children = structures_children;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public PinnedResource setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public PinnedResource setDescription(String description) {
        this.description = description;
        return this;
    }

    public JsonObject toJson() {
        return new JsonObject()
            .put(Field.ID, this.id)
            .put(Field.SOURCE, this.source)
            .put(Field.STRUCTURE_OWNER, this.structure_owner)
            .put(Field.STRUCTURES_CHILDREN, new JsonArray(this.structures_children))
            .put(Field.TITLE, this.title)
            .put(Field.DESCRIPTION, this.description);
    }
}
