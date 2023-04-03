import {ng, toasts, idiom as lang} from 'entcore';
import {Filter, Resource} from '../model';
import {addFilters} from '../utils';
import {FavoriteService} from "../services";
import {IIntervalService, IScope} from "angular";
import {Utils} from "../utils/Utils";

declare var mediacentreUpdateFrequency: number;

interface IViewModel extends ng.IController {
    loaders: any;
    resources: Resource[];
    favorites: Resource[];
    displayedResources: Resource[];
    displayFilter: boolean;
    filters: {
        initial: {  source: Filter[], document_types: Filter[], levels: Filter[] }
        filtered: {  source: Filter[], document_types: Filter[], levels: Filter[] }
    };
    filteredFields: string[];
    updateFrequency: number;

    updateFavoriteResources(): void;
    updateFavorites(): void;
    initFavoriteResources(): void;
    filter(): void;
    getFavorites(): void;
    showFilter() : void;
    filterResources(filteredResources: Resource[]): void;
}

interface IFavoriteScope extends ng.IScope {
    vm: IViewModel;
}

class Controller implements IViewModel {

    displayFilter: boolean;
    displayedResources: Resource[];
    favorites: Resource[];
    filteredFields: string[];
    filters: { initial: { source: Filter[]; document_types: Filter[]; levels: Filter[] }; filtered: { source: Filter[]; document_types: Filter[]; levels: Filter[] } };
    loaders: any;
    resources: Resource[];
    updateFrequency: number;

    constructor(private $scope: IFavoriteScope, 
                private route,
                private favoriteService: FavoriteService,
                private $interval: IIntervalService) {
        this.$scope.vm = this;
    }

    async $onInit() {
        this.favorites = [];
        this.filteredFields = ['document_types', 'levels'];
        this.displayFilter = screen.width >= this.$scope['mc'].screenWidthLimit;
        this.updateFrequency = mediacentreUpdateFrequency;

        this.initFavoriteResources();
        await this.updateFavorites();

        let that = this;
        this.$scope.$on('deleteFavorite', function (event, id) {
            that.displayedResources = that.favorites.filter(el => el.id !== id);
        });

        // this.$scope.$watch(() => this.filters.filtered.document_types.length, this.filter);
        // this.$scope.$watch(() => this.filters.filtered.levels.length, this.filter);

        this.$interval(async (): Promise<void> => {
            await this.updateFavorites();
            return;
        }, this.updateFrequency, 0, false);
    }

    filterResources(filteredResources: Resource[]) {
        console.log("coucou");
        this.test();
        this.filter();
    }

    private test() {
        console.log("test encore");
    }

    updateFavoriteResources(): void {
        //only keep resources that are also in favorite
        this.resources = this.resources.reduce((resources: Resource[], resource: Resource) => {
            if (this.favorites.find((r: Resource) => (r.id == resource.id))) {
                resources.push(resource);
            }
            return resources;
        }, []);
        //add new resources from favorite
        this.favorites.map((resource: Resource) => {
            resource.favorite = true;
            addFilters(this.filteredFields, this.filters.initial, resource)
            if (!(this.resources.find((r: Resource) => (r.id == resource.id)))) {
                this.resources.push(resource);
            }
        })
    }

    async updateFavorites() {
        await this.getFavorites();
        this.updateFavoriteResources();
        this.filter();
    }

    initFavoriteResources() {
        this.displayedResources = [];
        this.resources = [];
        this.favorites = [];
        this.filters = {
            initial: { source: [], document_types: [], levels: []},
            filtered: {source: [], document_types: [], levels: []}
        };
    };

    filter() {
        this.displayedResources = [];
        this.resources.forEach((resource: Resource) => {
            let match = true;
            this.filteredFields.forEach((field: string) => {
                let internalMatch = this.filters.filtered[field].length == 0;
                this.filters.filtered[field].forEach(({name}: Filter) => {
                    internalMatch = internalMatch || resource[field].includes(name);
                });
                match = match && internalMatch;
            });
            if (match) {
                this.displayedResources.push(resource);
            }
        });

        Utils.safeApply(this.$scope);
    };

    async getFavorites() {
        try {
            this.favorites = await this.favoriteService.get();
        } catch (e) {
            console.error("An error has occurred during fetching favorite ", e);
            toasts.warning(lang.translate("mediacentre.error.favorite.retrieval"));
            this.favorites = [];
        }
       Utils.safeApply(this.$scope);
    }

    showFilter(): void {
        this.displayFilter = !this.displayFilter;
    }

    $onDestroy(): void {
    }


}

export const favoriteController = ng.controller('FavoriteController', ['$scope', 'route', 'FavoriteService',
    '$interval', Controller]);
