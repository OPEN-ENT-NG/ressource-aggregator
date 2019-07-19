import {ng} from 'entcore';
import {hashCode} from '../utils';

import * as Clipboard from 'clipboard';
import {FavoriteService} from "../services";

declare const window: Window;

export const ResourceCard = ng.directive('resourceCard',
    ['$timeout', 'FavoriteService', function ($timeout, FavoriteService: FavoriteService) {
    return {
        scope: {
            ngModel: '=',
            type: '@?'
        },
        template: `
            <div ng-include="getTemplate()" class="flex [[type]]"></div>
        `,
        link: function ($scope, element) {
            $scope.type = $scope.type || 'resource';
            let clipboard;
            let random = Math.floor(Math.random() * 3) + 1;
            $scope.background = `/mediacentre/public/img/random-background-${random}.svg`;
            $scope.ngModel.displayTitle = $scope.ngModel.title;
            $scope.ngModel.hash = hashCode($scope.ngModel.id);
            $scope.tooltip = {
                show: false
            };

            $scope.$on("$includeContentLoaded", function () {
                if ("fr.openent.mediacentre.source.GAR" === $scope.ngModel.source) {
                    const flex = element.find('.flex');
                    const crop = element.find('.crop');
                    const image: HTMLImageElement = crop.children()[0];

                    const cropImage = () => {
                        //Get default image size
                        const i = new Image();
                        i.onload = () => {
                            const LABEL_WIDTH = 55;
                            const imageDefaultW = i.width;
                            const wRatio = i.width / i.height;
                            const imgW = image.width;

                            // Crop image
                            let labelPercent = ((100 / imageDefaultW) * LABEL_WIDTH) + 1;
                            let cropSize = ((imgW / 100) * labelPercent);
                            let newWidth = imgW - cropSize;

                            if (newWidth * wRatio > flex.height()) {
                                //If image is bigger than flex container, resize to max height to 75%
                                let newHeight = flex.height() * ($scope.type === 'textbook' ? 0.85 : 0.75);
                                newWidth = newHeight * wRatio;
                                cropSize = ((newWidth) / 100 * labelPercent);
                                newWidth = newWidth - cropSize;
                                image.style.width = `${newWidth + cropSize}px`;
                                image.style.height = `${newHeight}px`;
                            } else {
                                image.style.width = `${imgW}px`;
                            }
                            crop.css('width', newWidth);
                            crop.css('overflow', 'hidden');
                            image.style['max-width'] = 'unset';
                        };
                        i.src = image.src;
                    };

                    $timeout(() => {
                        if (image && !image.complete) {
                            $(image).on('load', cropImage);
                        } else {
                            cropImage();
                        }
                    });
                }

                // Clamp text after 2 rows if number of rows is greeter than 2
                const clampTitle = function () {
                    const title = element.find('.title');
                    const lineHeight = parseInt(title.css('line-height'));
                    let titleH = title.height();
                    let titleNumberLine = Math.ceil(titleH / lineHeight);
                    if (titleNumberLine > 2) {
                        while (title.outerHeight() > (2 * lineHeight)) {
                            // $scope.ngModel.displayTitle = `${text.substring(0, ((Math.floor(text.length / titleNumberLine) * 2) - 3))}...`;
                            title.text(function (index, text) {
                                return text.replace(/\W*\s(\S)*$/, '...');
                            });
                        }
                    }
                };

                $timeout(() => {
                    clampTitle();
                    const clipboardSelector = `.clipboard.resource-${$scope.ngModel.hash}`;
                    const clipboardElement = element.find(clipboardSelector);
                    new Clipboard(clipboardSelector)
                        .on('success', () => {
                            $scope.tooltip.show = true;
                            $scope.$apply();
                            clipboardElement.on('mouseleave', () => {
                                $scope.tooltip.show = false;
                                $scope.$apply();
                            });
                        })
                        .on('error', console.error);

                });
            });

            $scope.safeApply = () => {
                let phase = $scope.$root.$$phase;
                if (phase !== '$apply' && phase !== '$digest') {
                    $scope.$apply();
                }
            };

            $scope.$on('$destroy', function () {
                if (clipboard) {
                    clipboard.destroy();
                }
            });

            $scope.open = function () {
                window.open($scope.ngModel.link);
            };

            $scope.addFavorite = async function() {
                delete $scope.ngModel.favorite;
                let response = await FavoriteService.create($scope.ngModel);
                if (response.status === 200) {
                    $scope.ngModel.favorite = true;
                }
                $scope.safeApply();
            };

            $scope.removeFavorite = async function() {
                let response = await FavoriteService.delete($scope.ngModel.id, $scope.ngModel.source);
                if (response.status === 200) {
                    $scope.ngModel.favorite = false;
                }
                $scope.safeApply();
            };

            $scope.getTemplate = function () {
                return `/mediacentre/public/template/resources/${$scope.type}.html`;
            }
        }
    }
}]);