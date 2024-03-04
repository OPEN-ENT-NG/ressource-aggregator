package fr.openent.mediacentre.service.impl;

import fr.openent.mediacentre.service.GlobalRessourceService;
import fr.wseduc.mongodb.MongoDb;
import io.vertx.core.Promise;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import org.entcore.common.service.impl.MongoDbCrudService;

public class GlobalRessourceServiceMongoImpl extends MongoDbCrudService implements GlobalRessourceService {

    private final String collection;
    private final MongoDb mongo;
    private static final Logger log = LoggerFactory.getLogger(GlobalRessourceServiceMongoImpl.class);

    public GlobalRessourceServiceMongoImpl(final String collection) {
        super(collection);
        this.collection = collection;
        this.mongo = MongoDb.getInstance();
    }

    @Override
    public Future<Channel> createGlobalRessource(UserInfos user, GlobalRessource ressource) {
        Promise<GlobalRessource> promise = Promise.promise();
        mongo.insert(collection, ressource, MongoDbResult.validResultHandler(IModelHelper.uniqueResultToIModel(promise, GlobalRessource.class)));
        return promise.future();
    }
}
