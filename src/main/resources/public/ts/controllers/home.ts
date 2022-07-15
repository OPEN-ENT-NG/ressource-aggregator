import {model, ng} from 'entcore';
import {Scope} from './main'
import {Frame, Resource} from '../model';
import {ILocationService} from "angular";
import {Signets} from "../model/Signet";

interface ViewModel {
    signetLimit: number;
    signets: Signets;
    mobile: boolean;
    resourceLimit: number;
    loaders: any;
    resources: Resource[];
    displayedResources: Resource[];
    textbooks: Resource[];
    publicSignets: Resource[];
    sharedSignets: Resource[];
    orientationSignets: Resource[];

    refreshTextBooks(): void;
    seeMyExternalResource(): void;
    goSignet(): void;
    filterArchivedSignets(signet: any): boolean;
}

interface EventResponses {
    textbooks_Result(frame: Frame): void;
    search_Result(frame: Frame): void;
    favorites_Result(frame: Frame): void;
    signets_Result(frame: Frame): void;
}


export const homeController = ng.controller('HomeController', ['$scope', 'route', '$location',
    function ($scope: Scope, route, $location: ILocationService) {
        const vm: ViewModel = this;
        $scope.safeApply();
        vm.textbooks = [];
        vm.publicSignets = [];
        vm.sharedSignets = [];
        vm.signets = new Signets();
        vm.displayedResources = [];
        vm.mobile = screen.width < $scope.mc.screenWidthLimit;
        vm.resourceLimit = vm.mobile ? 6 : 12;
        vm.signetLimit = vm.mobile ? 4 : 8;

        $scope.$on('deleteFavorite', function (event, id) {
            $scope.mc.favorites = $scope.mc.favorites.filter(el => el.id !== id);
            if(vm.textbooks.findIndex(el => el.id == id) != -1) {
                vm.textbooks[vm.textbooks.findIndex(el => el.id == id)].favorite = false;
            } else if(vm.publicSignets.findIndex(el => el.id == id) != -1) {
                vm.publicSignets[vm.publicSignets.findIndex(el => el.id == id)].favorite = false;
            } else if(vm.orientationSignets.findIndex(el => el.id == id) != -1) {
                vm.orientationSignets[vm.orientationSignets.findIndex(el => el.id == id)].favorite = false;
            }
        });

        $scope.$on('addFavorite', function (event, resource) {
            $scope.mc.favorites.push(resource);
        });


        $scope.ws.onmessage = (message) => {
            const {event, state, data, status} = JSON.parse(message.data);
            if ("ok" !== status) {
                throw data.error;
            }
            if (event in eventResponses) eventResponses[event](new Frame(event, state, [], data));
        };

        const eventResponses: EventResponses = {
            textbooks_Result: function (frame) {
                vm.textbooks = frame.data.textbooks;
                $scope.safeApply();
            },
            signets_Result: async function (frame) {
                vm.signets.all = vm.publicSignets = vm.orientationSignets = vm.sharedSignets = [];
                await vm.signets.sync();
                vm.signets.all = vm.signets.all.filter(signet => !signet.archived && signet.collab && signet.owner_id != model.me.userId);
                vm.signets.formatSharedSignets(vm.sharedSignets);
                vm.publicSignets = frame.data.signets.resources.filter(el => el.document_types[0] === "Signet");
                vm.publicSignets = vm.publicSignets.concat(vm.sharedSignets.filter(el => el.document_types[0] === "Signet"));
                vm.orientationSignets = frame.data.signets.resources.filter(el => el.document_types[0] === "Orientation");
                vm.orientationSignets = vm.orientationSignets.concat(vm.sharedSignets.filter(el => el.document_types[0] === "Orientation"));
                $scope.safeApply();
            },
            search_Result: function (frame) {
                vm.displayedResources = frame.data.resources;
                $scope.safeApply();
            },
            favorites_Result: function (frame) {
                if (Object.keys(frame.data).length === 0) {
                    $scope.mc.favorites = []
                } else {
                    $scope.mc.favorites = frame.data;
                    $scope.mc.favorites.map((favorite) => {
                        favorite.favorite = true;
                    });

                    let result : Resource[] = [];
                    for(let i = 0; i < $scope.mc.favorites.length ; i++) {
                        if($scope.mc.favorites[i].document_types[0] == 'livre numérique') {
                            for(let h = 0; h < vm.displayedResources.length; h++) {
                                if($scope.mc.favorites[i].hash == vm.displayedResources[h].hash) {
                                    result.push($scope.mc.favorites[i]);
                                }
                            }
                            for(let j = 0; j < vm.textbooks.length; j++) {
                                if(vm.textbooks[j].favorite) {
                                    result.push($scope.mc.favorites[i]);
                                }
                            }
                        }
                        if($scope.mc.favorites[i].document_types[0] === "Orientation") {
                            for(let k = 0; k < vm.orientationSignets.length; k++) {
                                if($scope.mc.favorites[i].hash == vm.orientationSignets[k].hash && vm.orientationSignets[k].favorite) {
                                    result.push($scope.mc.favorites[i]);
                                }
                            }
                        }
                        if($scope.mc.favorites[i].document_types[0] === "Signet") {
                            for(let k = 0; k < vm.signets.length; k++) {
                                if($scope.mc.favorites[i].hash == vm.signets[k].hash && vm.signets[k].favorite) {
                                    result.push($scope.mc.favorites[i]);
                                }
                            }
                            for(let k = 0; k < vm.publicSignets.length; k++) {
                                if($scope.mc.favorites[i].hash == vm.publicSignets[k].hash && vm.publicSignets[k].favorite) {
                                    result.push($scope.mc.favorites[i]);
                                }
                            }
                            for(let k = 0; k < vm.sharedSignets.length; k++) {
                                if($scope.mc.favorites[i].hash == vm.sharedSignets[k].hash && vm.sharedSignets[k].favorite) {
                                    result.push($scope.mc.favorites[i]);
                                }
                            }
                        }
                    }
                    $scope.mc.favorites = [];
                    $scope.mc.favorites = result;
                }
                $scope.safeApply();
            },
        };

        vm.refreshTextBooks = (): void => {
            vm.textbooks = [];
            $scope.safeApply();
            $scope.ws.send(new Frame('textbooks', 'refresh', [], {}));
        };

        vm.seeMyExternalResource = (): void => {
            $scope.ws.send(new Frame('search', 'PLAIN_TEXT', ['fr.openent.mediacentre.source.GAR'], {"query": ".*"}));
            $location.path(`/search/plain_text`);
        };

        vm.goSignet = (): void => {
            $location.path(`/signet/`);
        };

        vm.filterArchivedSignets = (signet): boolean => {
            return !signet.archived;
        };

        function initHomePage() {
            $scope.ws.send(new Frame('textbooks', 'get', [], {}));
            setTimeout(() => {
                $scope.ws.send(new Frame('search', 'PLAIN_TEXT', ['fr.openent.mediacentre.source.GAR'], {"query": ".*"}));
            }, 250);
            setTimeout(() => {
                $scope.ws.send(new Frame('signets', 'get', ['fr.openent.mediacentre.source.Signet'], {}));
            }, 500);
            setTimeout(() => {
                $scope.ws.send(new Frame('favorites', 'get', [], {}));
            }, 750);
            $scope.safeApply();
        }


        if ($scope.ws.connected) {
            initHomePage();
        } else {
            $scope.ws.onopen = initHomePage;
        }
    }]);
