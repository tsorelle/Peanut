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
            me.application.hideServiceMessages();
            me.application.showWaiter('Installing' + pkgName + '...');
            me.services.executeService('Peanut::InstallPackage', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    let response = <installPkgResponse>serviceResponse.Value;
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.showPackageList(response.list);
                    }
                    else {
                        me.showPgkLog(pkgName,response.log);
                    }
                }
            ).fail(function () {
                me.application.hideWaiter();
            });
        };

        showPgkLog = (pkgName: string, log: string[]) => {
            let me = this;
            let msgCount = log.length;
            alert('Package log for '+ pkgName + ' ' + msgCount + ' entries');
        };
    }
}