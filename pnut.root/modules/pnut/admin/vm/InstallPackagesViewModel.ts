/**
 * Created by Terry on 5/7/2017.
 */

// required for all view models:
/// <reference path='../../core/ViewModelBase.ts' />
/// <reference path='../../../typings/knockout/knockout.d.ts' />

// Module
namespace Peanut {
    interface pkgListItem {
        name: string;
        status: string;
    }
    interface installPkgResponse {
        success: boolean;
        list: pkgListItem[];
        log: string[];
    }

    export class InstallPackagesViewModel  extends Peanut.ViewModelBase {
        activePage = ko.observable('');
        packageList = ko.observableArray([]);
        installResultMessage = ko.observable('');
        installResultLog = ko.observableArray([]);
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
                        me.showPackageList(response);
                        me.bindDefaultSection();
                        // alert(response.message);
                    }
                }
            ).fail(function () {
                me.application.hideWaiter();
            });
        }

        showPackageList = (pkgList: pkgListItem[]) => {
            let me = this;
            me.packageList(pkgList);
            if (pkgList.length == 0) {
                me.activePage('noPackages');
            }
            else {
                me.activePage('packageList');
            }

        };

        installPkg = (pkgInfo: pkgListItem) => {
            let pkgName = pkgInfo.name;
            let me = this;
            // let request = {};
            let request = pkgName;
            me.installResultLog([]);
            me.installResultMessage('');
            me.application.hideServiceMessages();
            me.application.showWaiter('Installing ' + pkgName + '...');
            me.services.executeService('Peanut::InstallPackage', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    let response = <installPkgResponse>serviceResponse.Value;
                    let resultMessage = 'Installation of ' + pkgName + ' ' + (response.success ? 'succeeded'  : 'failed');
                    me.installResultMessage(resultMessage);
                    me.installResultLog(response.log);
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.showPackageList(response.list);
                    }
                    me.showInstallationResult();
                }
            ).fail(function () {
                let trace = me.services.getErrorInformation();
                me.application.hideWaiter();
            });
        };

        uninstallPkg = (pkgInfo: pkgListItem) => {
            let pkgName = pkgInfo.name;
            let me = this;
            // let request = {};
            let request = pkgName;
            me.installResultLog([]);
            me.installResultMessage('');
            me.application.hideServiceMessages();
            me.application.showWaiter('Installing ' + pkgName + '...');
            me.services.executeService('Peanut::UninstallPackage', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    let response = <installPkgResponse>serviceResponse.Value;
                    let resultMessage = 'Uninstall of ' + pkgName + ' ' + (response.success ? 'succeeded'  : 'failed');
                    me.installResultMessage(resultMessage);
                    me.installResultLog(response.log);
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.showPackageList(response.list);
                    }
                    me.showInstallationResult();
                }
            ).fail(function () {
                let trace = me.services.getErrorInformation();
                me.application.hideWaiter();
            });
        };

        showInstallationResult = () => {
            jQuery("#install-results-modal").modal('show');
        }
    }
}