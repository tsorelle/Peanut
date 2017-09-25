var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Qnut;
(function (Qnut) {
    var QnutTestViewModel = (function (_super) {
        __extends(QnutTestViewModel, _super);
        function QnutTestViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.message = ko.observable("Hello world");
            _this.messageButtonVisible = ko.observable(true);
            _this.save = function () {
                jQuery("#confirm-save-modal").modal('hide');
                alert('you saved');
            };
            _this.onService = function () {
                var me = _this;
                var request = { "tester": 'Terry SoRelle' };
                me.application.hideServiceMessages();
                me.application.showWaiter('Testing service...');
                me.services.executeService('peanut.Qnut::HelloMars', request, function (serviceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        alert(response.message);
                    }
                }).fail(function () {
                    me.application.hideWaiter();
                });
            };
            return _this;
        }
        QnutTestViewModel.prototype.init = function (successFunction) {
            var me = this;
            console.log('VM Init');
            me.application.registerComponents('@pkg/qnut/qnut-message,@pnut/modal-confirm', function () {
                me.bindDefaultSection();
            });
            successFunction();
        };
        QnutTestViewModel.prototype.onSaveChanges = function () {
            jQuery("#confirm-save-modal").modal('show');
        };
        return QnutTestViewModel;
    }(Peanut.ViewModelBase));
    Qnut.QnutTestViewModel = QnutTestViewModel;
})(Qnut || (Qnut = {}));
//# sourceMappingURL=QnutTestViewModel.js.map