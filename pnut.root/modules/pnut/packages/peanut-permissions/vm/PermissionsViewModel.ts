/**
 * Created by Terry on 5/2/2017.
 */


    /// <reference path="../../../../pnut/core/ViewModelBase.ts" />
/// <reference path='../../../../typings/knockout/knockout.d.ts' />
/// <reference path='../../../../typings/lodash/difference/index.d.ts' />
/// <reference path='../../../../pnut/core/peanut.d.ts' />

namespace PeanutPermissions {

    import ILookupItem = Peanut.ILookupItem;

    interface IPermission {
        permissionName : string;
        description: string;
        roles: Peanut.ILookupItem[];
    }

    interface IGetPermissionsResponse {
        permissions: IPermission[];
        roles: Peanut.ILookupItem[];
    }

    export class PermissionsViewModel extends Peanut.ViewModelBase {
        roles = [];

        // observables
        permissionsList = ko.observableArray<IPermission>([]);
        permissionForm = {
            permissionName : ko.observable(''),
            assigned: ko.observableArray<Peanut.ILookupItem>([]),
            available: ko.observableArray<Peanut.ILookupItem>([]),
            changed: ko.observable(false)
        };

        init(successFunction?: () => void) {
            let me = this;
            console.log('VM Init');
            me.application.loadResources([
                'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js'
            ], () => {
                me.getPermissions(() => {
                    me.bindDefaultSection();
                    successFunction();
                });
            });
        }

        getPermissions = (finalFunction? : () => void) => {
            let me = this;
            let request = {};
            me.application.hideServiceMessages();
            me.application.showWaiter('Getting permissions...');
            me.services.executeService('peanut.peanut-permissions::GetPermissions', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = <IGetPermissionsResponse>serviceResponse.Value;
                        me.permissionsList(response.permissions);
                        me.roles = response.roles;
                    }
                    if (finalFunction) {
                        finalFunction();
                    }
                }
            ).fail(function () {
                me.application.hideWaiter();
                let trace = me.services.getErrorInformation();
            });
        };

        updatePermission = () => {
            let me = this;
            jQuery("#permission-modal").modal('hide');
            let request = {
                permissionName: me.permissionForm.permissionName(),
                roles: me.permissionForm.assigned()
            };
            me.application.hideServiceMessages();
            me.application.showWaiter('Updating permission...');
            me.services.executeService('peanut.peanut-permissions::UpdatePermission', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = <IPermission[]>serviceResponse.Value;
                        me.permissionsList(response);
                    }
                }
            ).fail(function () {
                let err = me.services.getErrorInformation();
                me.application.hideWaiter();
            });
        };

        showPermissionUpdateForm = (selected: IPermission) => {
            let me = this;
            me.permissionForm.permissionName(selected.permissionName);
            let available = _.differenceWith(me.roles, selected.roles, function(left: ILookupItem, right: ILookupItem) {
                return left.Key === right.Key;
            });
            me.permissionForm.assigned(selected.roles);
            me.permissionForm.available(available);
            me.permissionForm.changed(false);
            jQuery("#permission-modal").modal('show');
        };

        onAddRole = (selected: any) => {
            let me = this;
            me.permissionForm.assigned.push(selected);
            me.permissionForm.available.remove(selected);
            me.permissionForm.assigned.sort();
            me.permissionForm.changed(true);
         };

        onRemoveRole = (selected: any) => {
            let me = this;
            me.permissionForm.assigned.remove(selected);
            me.permissionForm.available.push(selected);
            me.permissionForm.available.sort();
            me.permissionForm.changed(true);
        };




    }
}
