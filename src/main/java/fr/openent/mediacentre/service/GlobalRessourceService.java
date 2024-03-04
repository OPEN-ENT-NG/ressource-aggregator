package fr.openent.mediacentre.service;

import org.entcore.common.user.UserInfos;

public interface GlobalRessourceService {
    /**
     * create global ressource
     * @param user         User session token
     * @param ressource    Ressource to create
     */
    public Future<GlobalRessource> createGlobalChannel(UserInfos user, GlobalRessource ressource);

    /**
     * list all globals channels
     * @return Future of all globals ressources
     */
    public Future<List<GlobalRessource>> list();

    /**
     * delete a global ressource
     * @param idChannel   global ressource id
     */
    public Future<GlobalRessource> deleteGlobalChannel(String idChannel);

    /**
     * update a global ressource
     * @param id   global ressource id
     */
    public Future<GlobalRessource> updateGlobalChannel(String userId, String id, GlobalRessource ressource);
}
