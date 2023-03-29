import {ng, toasts, idiom as lang} from 'entcore';
import {Scope} from './main'
import {Filter, Frame, Resource} from '../model';
import {addFilters} from '../utils';
import {FavoriteService} from "../services";
import {IPromise} from "angular";

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
    // favoriteService: FavoriteService;


    showFilter() : void;
}

interface EventResponses {
    favorites_Result(frame: Frame): void;
}


export const favoriteController = ng.controller('FavoriteController', ['$scope', 'route', 'FavoriteService',
    function ($scope: Scope, route, FavoriteService: FavoriteService) {
    const vm: ViewModel = this;
    // vm.favoriteService = favoriteService;

    vm.favorites = [];
    vm.filteredFields = [ 'document_types', 'levels'];
    vm.displayFilter = screen.width >= $scope.mc.screenWidthLimit;

    $scope.$on('deleteFavorite', function(event, id) {
        vm.displayedResources = vm.favorites.filter(el => el.id !== id);
    });

    this.$onInit = () => {
        initFavorite();
        initFavoritePage();
        vm.resources = vm.favorites;
        filter();
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

    // initFavorite();

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

    $scope.ws.onmessage = (message) => {
        const {event, state, data, status} = JSON.parse(message.data);
        if ("ok" !== status) {
            throw data.error;
        }
        if (event in eventResponses) eventResponses[event](new Frame(event, state, [], data));
    };

    const eventResponses: EventResponses = {
        favorites_Result: function (frame) {
            vm.resources = [...vm.resources, ...frame.data];
            vm.favorites = frame.data;
            vm.favorites.map((favorite) => {
                favorite.favorite = true;
            });
            frame.data.forEach((resource)=> addFilters(vm.filteredFields, vm.filters.initial, resource));
            filter();
            $scope.safeApply();
        }
    };

    async function initFavoritePage() {
        FavoriteService.get()
            .then((favorites: Array<Resource>) => {
                vm.favorites = favorites;
                console.log(vm.favorites);
                $scope.safeApply();
                return;
            })
            .catch((e) => {
                let errorMessage : string = lang.translate("calendar.external.sync.error") + " " + ".";
                toasts.warning(errorMessage);
                return;
            });

        $scope.safeApply();
        $scope.ws.send(new Frame('favorites', 'get', [], {}));
    }

    // $scope.$interval(() : IPromise<void> => {
    //     initFavoritePage();
    //     return;
    // }, 15000, 0, false);

    // if ($scope.ws.connected) {
    //     initFavoritePage();
    // } else {
    //     $scope.ws.onopen = initFavoritePage;
    // }

    vm.showFilter = function () {
        vm.displayFilter = !vm.displayFilter;
    }
}]);
