package fr.openent.mediacentre.helper;

import fr.openent.mediacentre.source.Source;
import fr.wseduc.webutils.http.Renders;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;

import java.util.List;

public class APIHelper implements ResponseHandlerHelper{
    private Logger log = LoggerFactory.getLogger(APIHelper.class);
    private HttpServerRequest request;
    private JsonArray finalRender;
    public APIHelper() {}
    public APIHelper(HttpServerRequest request) {
        this();
        this.finalRender = new JsonArray();
        setRequest(request);
    }

    public HttpServerRequest getRequest() {
        return request;
    }

    public void setRequest(HttpServerRequest request) {
        this.request = request;
    }

    @Override
    public void answerSuccess(String answer) {
        if (checkRequestSet (request))
            Renders.renderJson(request, new JsonObject(answer));
        else
            log.error("[APIHelper] Request null");

    }

    @Override
    public void storeMultiple(JsonObject answer, List<Source> sources) {
        finalRender.add(answer);
        if (finalRender.size() == sources.size()) {
            answerMultiple();
        }
    }

    @Override
    public void answerMultiple() {
        answerSuccess(this.finalRender.encode());
    }


    private boolean checkRequestSet(HttpServerRequest request) {
        return request != null;
    }

    @Override
    public void answerFailure(String answer) {
        if (checkRequestSet (request))
            Renders.renderError(request, new JsonObject(answer));
        else
            log.error("[APIHelper] Request null");
    }


}
