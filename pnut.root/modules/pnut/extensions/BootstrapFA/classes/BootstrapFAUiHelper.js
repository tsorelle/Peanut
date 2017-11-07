var Peanut;
(function (Peanut) {
    var BootstrapFAUiHelper = (function () {
        function BootstrapFAUiHelper() {
            var _this = this;
            this.showMessage = function (message, id, container, modal) {
                if (modal === void 0) { modal = true; }
                var span = container.find('#' + id);
                span.text(message);
                _this.showModal(container);
            };
            this.hideMessage = function (container) {
                _this.hideModal(container);
            };
            this.showModal = function (container) {
                if (navigator.appName == 'Microsoft Internet Explorer') {
                    container.removeClass('fade');
                }
                container.modal();
            };
            this.hideModal = function (container) {
                container.modal('hide');
            };
            this.getResourceList = function () {
                return ['@lib:fontawesome'];
            };
        }
        return BootstrapFAUiHelper;
    }());
    Peanut.BootstrapFAUiHelper = BootstrapFAUiHelper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=BootstrapFAUiHelper.js.map