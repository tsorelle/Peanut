/**
 * Created by Terry on 5/9/2017.
 */
/// <reference path="../../../modules/pnut/core/ViewModelBase.ts" />
/// <reference path='../../../modules/typings/knockout/knockout.d.ts' />

namespace Peanut {
    export class HelloWorldViewModel  extends Peanut.ViewModelBase {
        private planetList = [];
        private nextPlanet = 1;

        // observable declarations here
        planetName = ko.observable('');
        planetDescription = ko.observable('');


        getPlanet() {
            let me = this;
            let planet = me.planetList[me.nextPlanet - 1];
            if (me.nextPlanet == me.planetList.length) {
                me.nextPlanet = 1;
            }
            else {
                me.nextPlanet++;
            }
            me.planetName(planet.name);
            me.planetDescription(planet.description)
        }

        getPlanetList(successFunction: ()=> void) {
            let me = this;
            let request = {'includePluto' : 1};
            me.application.hideServiceMessages();
            me.application.showWaiter('Getting the solar system...');
            me.services.executeService('test\\GetPlanets',request,
                function(serviceResponse: IServiceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.planetList = serviceResponse.Value;
                        successFunction();
                    }
                }
            ).always(function() {
                me.application.hideWaiter();
            }).fail(
                function () {
                    alert('Process failed!!')
                }
            );
        }

        /**
         * @param successFunction - page inittializations such as ko.applyBindings() go here.
         *
         * Call this function in a script at the end of the page following the closing "body" tag.
         * e.g.
         *      ViewModel.init(function() {
         *          ko.applyBindings(ViewModel);
         *      });
         *
         */
        init(successFunction?: () => void) {
            let me = this;
            me.getPlanetList(successFunction)
        }
    }
}
