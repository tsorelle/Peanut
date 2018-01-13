var Peanut;
(function (Peanut) {
    var BootstrapFourUiHelper = (function () {
        function BootstrapFourUiHelper() {
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
                container.modal('show');
            };
            this.hideModal = function (container) {
                container.modal('hide');
            };
            this.getResourceList = function () {
                return ['@lib:fontawesome'];
            };
            this.getFramework = function () {
                return 'Bootstrap';
            };
            this.getVersion = function () {
                return 4;
            };
            this.getFontSet = function () {
                return 'FA';
            };
        }
        return BootstrapFourUiHelper;
    }());
    Peanut.BootstrapFourUiHelper = BootstrapFourUiHelper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=BootstrapFourUiHelper.js.map