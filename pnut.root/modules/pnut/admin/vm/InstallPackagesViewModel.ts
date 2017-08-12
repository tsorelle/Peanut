/**
 * Created by Terry on 5/7/2017.
 */

// required for all view models:
/// <reference path='../../core/ViewModelBase.ts' />
/// <reference path='../../../typings/knockout/knockout.d.ts' />

// Module
namespace Peanut {
    export class InstallPackagesViewModel  extends Peanut.ViewModelBase {
        activePage = ko.observable('');
        packageList = ko.observableArray([]);
        init(successFunction?: () => void) {
            let me = this;
            let request = {};
            me.application.hideServiceMessages();
            me.application.showWaiter('Looking for packages...');
            me.services.executeService('Peanut::GetPackageList', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = serviceResponse.Value;
                        me.packageList(response);
                        if (response.length == 0) {
                            me.activePage('noPackages');
                        }
                        else {
                            me.activePage('packageList');
                        }

                        me.bindDefaultSection();
                        // alert(response.message);
                    }
                }
            ).fail(function () {
                me.application.hideWaiter();
            });
        }
    }
}