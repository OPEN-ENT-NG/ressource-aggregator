import {idiom, ng, notify} from 'entcore';
import http, {AxiosResponse} from 'axios';
import {Signet} from "../model/Signet";
import {ISignetBody} from "../model/signetBody.model";
import {IPublicSignetResponse} from "../model/publicSignetResponse.model";

export interface SignetService {
    list() : Promise<AxiosResponse>;
    get(signetId: number) : Promise<AxiosResponse>;
    save(signet: Signet) : Promise<AxiosResponse>;
    create(signet: Signet) : Promise<AxiosResponse>;
    update(signet: ISignetBody) : Promise<AxiosResponse>;
    archive(signet: Signet) : Promise<AxiosResponse>;
    restore(signet: Signet) : Promise<AxiosResponse>;
    delete(signetId: number) : Promise<AxiosResponse>;
    searchMySignet(query: string) : Promise<AxiosResponse>;
    advancedSearchMySignet(query: Object): Promise<AxiosResponse>;
    unshare(signetId: number) : Promise<AxiosResponse>;
    getMySignetRights(signetId: number) : Promise<AxiosResponse>;
    getAllMySignetRights() : Promise<AxiosResponse>;
    getInfoImage(signet: Signet) : Promise<AxiosResponse>;
    publish(signet: ISignetBody) : Promise<AxiosResponse>;
    getAllMySignetPublished() : Promise<AxiosResponse>
    deleteSignetPublished(signetId: number) : Promise<AxiosResponse>;
    searchMySignetPublished(query: string) : Promise<AxiosResponse>;
    getPublishedSignets() : Promise<IPublicSignetResponse[]>;
}

export const signetService: SignetService = {
    async list() : Promise<AxiosResponse> {
        try {
            return http.get('/mediacentre/mysignets');
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.list'));
            throw err;
        }
    },

    async get(signetId: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/mediacentre/signets/${signetId}`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.get'));
            throw err;
        }
    },

    async save(signet: Signet) : Promise<AxiosResponse> {
        return signet.id ? await this.update(signet) : await this.create(signet);
    },

    async create(signet: Signet) : Promise<AxiosResponse> {
        try {
            return http.post('/mediacentre/signets', signet);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.create'));
            throw err;
        }
    },

    async update(signet: ISignetBody) : Promise<AxiosResponse> {
        try {
            return http.put(`/mediacentre/signets/${signet.id}`, signet);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.update'));
            throw err;
        }
    },

    async delete(signetId: number) : Promise<AxiosResponse> {
        try {
            return await http.delete(`/mediacentre/signets/${signetId}`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.delete'));
            throw err;
        }
    },

    async searchMySignet(query: string) : Promise<AxiosResponse> {
        try {
            return http.get(`/mediacentre/signets/search?query=${query}`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.published'));
            throw err;
        }
    },

    async advancedSearchMySignet(query: object) : Promise<AxiosResponse> {
        try {
            return http.post(`/mediacentre/signets/advanced`, query);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.published'));
            throw err;
        }
    },

    async archive(signet: Signet) : Promise<AxiosResponse> {
        try {
            signet.archived = true;
            return await this.update(signet.toJson());
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.archive'));
            throw err;
        }
    },

    async restore(signet: Signet) : Promise<AxiosResponse> {
        try {
            signet.archived = false;
            return await this.update(signet.toJson());
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.restore'));
            throw err;
        }
    },

    async unshare(signetId: number) : Promise<AxiosResponse> {
        try {
            let emptyBody = {"users":{},"groups":{},"bookmarks":{}};
            return await http.put(`/mediacentre/share/resource/${signetId}`, emptyBody);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.unshare'));
            throw err;
        }
    },

    async getMySignetRights(signetId: number) : Promise<AxiosResponse> {
        try {
            return http.get(`/mediacentre/signets/${signetId}/rights`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.get'));
            throw err;
        }
    },

    async getAllMySignetRights() : Promise<AxiosResponse> {
        try {
            return http.get(`/mediacentre/signets/rights/all`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.get'));
            throw err;
        }
    },

    async getInfoImage(signet: Signet) : Promise<AxiosResponse> {
        try {
            return await http.get(`/mediacentre/info/image/${signet.image ? signet.image.split("/").slice(-1)[0] : null}`);
        } catch (e) {
            notify.error(idiom.translate('mediacentre.error.signetService.image'));
            throw e;
        }
    },

    async publish(signet: ISignetBody) : Promise<AxiosResponse> {
        try {
            return await http.post(`/mediacentre/signet/publish/${signet.id}`, signet);
        } catch (err) {
            notify.error('mediacentre.signetService.publish.err');
            throw err;
        }
    },

    async getAllMySignetPublished() : Promise<AxiosResponse> {
        try {
            return http.get(`/mediacentre/signets/public/`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.published'));
            throw err;
        }
    },

    async deleteSignetPublished(signetId: number) : Promise<AxiosResponse> {
        try {
            return http.delete(`/mediacentre/signets/public/${signetId}`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.published'));
            throw err;
        }
    },

    async searchMySignetPublished(query: string) : Promise<AxiosResponse> {
        try {
            return http.get(`/mediacentre/signets/search/public?query=${query}`);
        } catch (err) {
            notify.error(idiom.translate('mediacentre.error.signetService.published'));
            throw err;
        }
    },

    async getPublishedSignets() : Promise<IPublicSignetResponse[]> {
        return http.get(`/mediacentre/signets`)
            .then((response: AxiosResponse) => (response.data && response.data.data && response.data.data.signets && response.data.data.signets.resources
            && response.data.data.signets.resources.length > 0 ? response.data.data.signets.resources : []));
    }

};

export const SignetService = ng.service('SignetService', (): SignetService => signetService);