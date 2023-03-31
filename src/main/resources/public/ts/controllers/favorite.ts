import {ng, toasts, idiom as lang} from 'entcore';
import {Scope} from './main'
import {Filter, Frame, Resource} from '../model';
import {addFilters} from '../utils';
import {FavoriteService} from "../services";
import {IIntervalService, IPromise, ITimeoutService} from "angular";

declare var mediacentreUpdateFrequency: number;
interface ViewModel {
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


    showFilter() : void;
}

export const favoriteController = ng.controller('FavoriteController', ['$scope', 'route', 'FavoriteService', '$interval',
    function ($scope: Scope, route, favoriteService: FavoriteService, $interval: IIntervalService) {
    const vm: ViewModel = this;

    vm.favorites = [];
    vm.filteredFields = [ 'document_types', 'levels'];
    vm.displayFilter = screen.width >= $scope.mc.screenWidthLimit;
    vm.updateFrequency = mediacentreUpdateFrequency;

    console.log(vm.updateFrequency);

    $scope.$on('deleteFavorite', function(event, id) {
        vm.displayedResources = vm.favorites.filter(el => el.id !== id);
    });

    function updateFavoriteResources() {
        //only keep resources that are also in favorite
        vm.resources = vm.resources.reduce((resources: Resource[], resource: Resource) => {
            if (vm.favorites.find((r: Resource) => (r.id == resource._id))) {
                resources.push(resource);
            }
            return resources;
        }, []);
        //add new resources from favorite
        vm.favorites.map((resource: Resource) => {
            resource.favorite = true;
            addFilters(vm.filteredFields, vm.filters.initial, resource)
            if (!(vm.resources.find((r: Resource) => (r.id == resource._id)))) {
                vm.resources.push(resource);
            }
        })
        // vm.resources = [...vm.resources, ...vm.favorites.reduce((resources: Resource[], resource: Resource) => {
        //     if (!(vm.favorites.find((r: Resource) => (r.id == resource._id)))) {
        //         resources.push(resource);
        //     }
        //     return resources;
        // }, [])];
        // vm.favorites.map((favorite) => {
        //     favorite.favorite = true;
        // });
        // vm.favorites.forEach((resource) => addFilters(vm.filteredFields, vm.filters.initial, resource));
    }

    async function updateFavorites() {
        await initFavoritePage();
        updateFavoriteResources();
        filter();
    }

    this.$onInit = async () => {
        initFavorite();
        await updateFavorites();
    };

    const initFavorite = function () {
        vm.displayedResources = [];
        vm.resources = [];
        vm.favorites = [];
        vm.filters = {
            initial: { source: [], document_types: [], levels: []},
            filtered: {source: [], document_types: [], levels: []}
        };
    };

    const filter = function () {
        vm.displayedResources = [];
        vm.resources.forEach(function (resource: Resource) {
            let match = true;
            vm.filteredFields.forEach(function (field: string) {
                let internalMatch = vm.filters.filtered[field].length == 0;
                vm.filters.filtered[field].forEach(function ({name}: Filter) {
                    internalMatch = internalMatch || resource[field].includes(name);
                });
                match = match && internalMatch;
            });
            if (match) {
                vm.displayedResources.push(resource);
            }
        });

        $scope.safeApply();
    };

    $scope.$watch(() => vm.filters.filtered.document_types.length, filter);
    $scope.$watch(() => vm.filters.filtered.levels.length, filter);

    async function initFavoritePage() {
        try {
            vm.favorites = await favoriteService.get();
        } catch (e) {
            console.error("An error has occurred during fetching favorite ", e);
            toasts.warning(lang.translate("mediacentre.error.favorite.retrieval"));
            vm.favorites = [];
        }
        $scope.safeApply();
    }

    $interval(async (): Promise<void> => {
        await updateFavorites();
        console.log("interval", vm.updateFrequency);
        return;
    }, vm.updateFrequency, 0, false);


    vm.showFilter = function () {
        vm.displayFilter = !vm.displayFilter;
    }
}]);
