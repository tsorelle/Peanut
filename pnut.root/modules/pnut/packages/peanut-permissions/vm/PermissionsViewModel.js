var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PeanutPermissions;
(function (PeanutPermissions) {
    var PermissionsViewModel = (function (_super) {
        __extends(PermissionsViewModel, _super);
        function PermissionsViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.roles = [];
            _this.permissionsList = ko.observableArray([]);
            _this.permissionForm = {
                permissionName: ko.observable(''),
                assigned: ko.observableArray([]),
                available: ko.observableArray([]),
                changed: ko.observable(false)
            };
            _this.waitLabelGetPermissions = 'Getting permissions';
            _this.waitLabelUpdatePermissions = 'Updating permissions';
            _this.getPermissions = function (finalFunction) {
                var me = _this;
                var request = {};
                me.application.hideServiceMessages();
                me.application.showWaiter(me.waitLabelGetPermissions + '...');
                me.services.executeService('peanut.peanut-permissions::GetPermissions', request, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        me.permissionsList(response.permissions);
                        me.roles = response.roles;
                        me.addTranslations(response.translations);
                        me.waitLabelGetPermissions = response.translations['permission-wait-get'];
                        me.waitLabelUpdatePermissions = response.translations['permission-wait-update'];
                    }
                    if (finalFunction) {
                        finalFunction();
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                }).always(function () {
                    me.application.hideWaiter();
                });
            };
            _this.updatePermission = function () {
                var me = _this;
                jQuery("#permission-modal").modal('hide');
                var request = {
                    permissionName: me.permissionForm.permissionName(),
                    roles: me.permissionForm.assigned()
                };
                me.application.hideServiceMessages();
                me.application.showWaiter(me.waitLabelUpdatePermissions);
                me.services.executeService('peanut.peanut-permissions::UpdatePermission', request, function (serviceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        me.permissionsList(response);
                    }
                }).fail(function () {
                    var err = me.services.getErrorInformation();
                    me.application.hideWaiter();
                });
            };
            _this.showPermissionUpdateForm = function (selected) {
                var me = _this;
                me.permissionForm.permissionName(selected.permissionName);
                var available = _.differenceBy(me.roles, selected.roles, 'Key');
                me.permissionForm.assigned(selected.roles);
                me.permissionForm.assigned.sort(function (left, right) {
                    return left.Key.localeCompare(right.Key);
                });
                me.permissionForm.available(available);
                me.permissionForm.available.sort(function (left, right) {
                    return left.Key.localeCompare(right.Key);
                });
                me.permissionForm.changed(false);
                jQuery("#permission-modal").modal('show');
            };
            _this.onAddRole = function (selected) {
                var me = _this;
                me.permissionForm.assigned.push(selected);
                me.permissionForm.available.remove(selected);
                me.permissionForm.assigned.sort(function (left, right) {
                    return left.Key.localeCompare(right.Key);
                });
                me.permissionForm.changed(true);
            };
            _this.onRemoveRole = function (selected) {
                var me = _this;
                me.permissionForm.assigned.remove(selected);
                me.permissionForm.available.push(selected);
                me.permissionForm.available.sort(function (left, right) {
                    return left.Key.localeCompare(right.Key);
                });
                me.permissionForm.changed(true);
            };
            return _this;
        }
        PermissionsViewModel.prototype.init = function (successFunction) {
            var me = this;
            Peanut.logger.write('VM Init');
            me.application.loadResources([
                '@lib:lodash'
            ], function () {
                me.getPermissions(function () {
                    me.bindDefaultSection();
                    successFunction();
                });
            });
        };
        return PermissionsViewModel;
    }(Peanut.ViewModelBase));
    PeanutPermissions.PermissionsViewModel = PermissionsViewModel;
})(PeanutPermissions || (PeanutPermissions = {}));
//# sourceMappingURL=PermissionsViewModel.js.map