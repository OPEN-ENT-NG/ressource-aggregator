import {ng, toasts, idiom as lang} from 'entcore';
import {Scope} from './main'
import {Filter, Frame, Resource} from '../model';
import {addFilters} from '../utils';
import {FavoriteService} from "../services";
import {IIntervalService, IPromise, ITimeoutService} from "angular";

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


    showFilter() : void;
}

export const favoriteController = ng.controller('FavoriteController', ['$scope', 'route', 'FavoriteService', '$interval',
    function ($scope: Scope, route, FavoriteService: FavoriteService, $interval: IIntervalService) {
    const vm: ViewModel = this;

    vm.favorites = [];
    vm.filteredFields = [ 'document_types', 'levels'];
    vm.displayFilter = screen.width >= $scope.mc.screenWidthLimit;

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
            vm.resources = [...vm.resources, ...vm.favorites.reduce((resources: Resource[], resource: Resource) => {
                if (!(vm.favorites.find((r: Resource) => (r.id == resource._id)))) {
                    resources.push(resource);
                }
                return resources;
            }, [])];
            vm.favorites.map((favorite) => {
                favorite.favorite = true;
            });
            vm.favorites.forEach((resource) => addFilters(vm.filteredFields, vm.filters.initial, resource));
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
        await FavoriteService.get()
            .then((favorites: Array<Resource>) => {
                vm.favorites = favorites;
                $scope.safeApply();
                return;
            })
            .catch((e) => {
                let errorMessage : string = lang.translate("calendar.external.sync.error") + " " + ".";
                toasts.warning(errorMessage);
                return;
            });

        $scope.safeApply();
    }

    $interval(async (): Promise<void> => {
        await updateFavorites();
        return;
    }, 15000, 0, false);


    vm.showFilter = function () {
        vm.displayFilter = !vm.displayFilter;
    }
}]);
