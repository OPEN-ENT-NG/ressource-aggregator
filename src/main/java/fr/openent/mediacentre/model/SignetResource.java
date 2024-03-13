package fr.openent.mediacentre.model;

import fr.openent.mediacentre.helper.IModelHelper;
import io.vertx.core.json.JsonObject;

public class SignetResource extends Resource implements IModel<SignetResource> {
    private String description;

    public SignetResource(JsonObject resource) {
        super(resource);
        this.description = resource.getString("description");
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public JsonObject toJson() {
        return super.toJson().mergeIn(IModelHelper.toJson(this, false, false));
    }
}
