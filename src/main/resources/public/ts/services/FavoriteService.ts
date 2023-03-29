import {ng, toasts} from 'entcore'
import http, {AxiosError, AxiosResponse} from 'axios';
import {Resource} from "../model";

export interface FavoriteService {
    create(bodyResource: Resource, id:number): Promise<AxiosResponse>;
    delete(id: string, source: string): Promise<AxiosResponse>;
    get(): Promise<Array<Resource>>;
}

export const FavoriteService = ng.service('FavoriteService', (): FavoriteService => ({
    create: async (bodyResource: Resource, id:number): Promise<AxiosResponse> => {
        return await http.post(`/mediacentre/favorites?id=${id}`, bodyResource);
    },

    delete: async (id: string, source: string): Promise<AxiosResponse> => {
        return await http.delete(`/mediacentre/favorites?id=${id}&source=${source}`);
    },

    get: async (): Promise<Array<Resource>> => {
        return await http.get(`/mediacentre/favorites`)
            // .then((response: AxiosResponse) => response.data.data.map((resource: Resource) => new ResourceModel().build(resource)))
            .then((response: AxiosResponse) => response.data.data)
            .catch((error: AxiosError) => {
                console.error(error);
                toasts.warning(error);
                return;
            });
    }
}));