/**
 * Created by Terry on 5/2/2017.
 */


    /// <reference path="../../../../pnut/core/ViewModelBase.ts" />
/// <reference path='../../../../typings/knockout/knockout.d.ts' />
/// <reference path='../../../../typings/lodash/difference/index.d.ts' />
/// <reference path='../../../../pnut/core/peanut.d.ts' />

namespace PeanutPermissions {

    interface IUserRole {
        Key : string;
        Name: string;
        Description: string;
    }

    interface IPermission {
        permissionName : string;
        description: string;
        roles: IUserRole[];
    }

    interface IGetPermissionsResponse {
        permissions: IPermission[];
        roles: IUserRole[];
        translations: string[];
    }

    export class PermissionsViewModel extends Peanut.ViewModelBase {
        roles = [];

        // observables
        permissionsList = ko.observableArray<IPermission>([]);
        permissionForm = {
            permissionName : ko.observable(''),
            assigned: ko.observableArray<IUserRole>([]),
            available: ko.observableArray<IUserRole>([]),
            changed: ko.observable(false)
        };

        waitLabelGetPermissions = 'Getting permissions';
        waitLabelUpdatePermissions = 'Updating permissions';

        init(successFunction?: () => void) {
            let me = this;
            Peanut.logger.write('VM Init');
            me.application.loadResources([
                '@lib:lodash'
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
            me.application.showWaiter(me.waitLabelGetPermissions+'...');
            me.services.executeService('peanut.peanut-permissions::GetPermissions', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    // me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = <IGetPermissionsResponse>serviceResponse.Value;
                        me.permissionsList(response.permissions);
                        me.roles = response.roles;
                        me.addTranslations(response.translations);
                        me.waitLabelGetPermissions=response.translations['permission-wait-get'];
                        me.waitLabelUpdatePermissions=response.translations['permission-wait-update'];
                    }
                    if (finalFunction) {
                        finalFunction();
                    }
                }
            ).fail(function () {
                let trace = me.services.getErrorInformation();
            }).always(() => {
                me.application.hideWaiter();
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
            me.application.showWaiter(me.waitLabelUpdatePermissions);
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
            let available = _.differenceBy(me.roles, selected.roles, 'Key');
            me.permissionForm.assigned(selected.roles);
            me.permissionForm.assigned.sort((left:IUserRole,right:IUserRole) => {
                return left.Key.localeCompare(right.Key);
            });

            me.permissionForm.available(available);
            me.permissionForm.available.sort((left:IUserRole,right:IUserRole) => {
                return left.Key.localeCompare(right.Key);
            });

            me.permissionForm.changed(false);
            jQuery("#permission-modal").modal('show');
        };

        onAddRole = (selected: any) => {
            let me = this;
            me.permissionForm.assigned.push(selected);
            me.permissionForm.available.remove(selected);
            me.permissionForm.assigned.sort((left:IUserRole,right:IUserRole) => {
                return left.Key.localeCompare(right.Key);
            });
            me.permissionForm.changed(true);
         };

        onRemoveRole = (selected: any) => {
            let me = this;
            me.permissionForm.assigned.remove(selected);
            me.permissionForm.available.push(selected);
            me.permissionForm.available.sort((left:IUserRole,right:IUserRole) => {
                return left.Key.localeCompare(right.Key);
            });
            me.permissionForm.changed(true);
        };




    }
}
