var Peanut;
(function (Peanut) {
    var BootstrapUiHelper = (function () {
        function BootstrapUiHelper() {
            var _this = this;
            this.showMessage = function (message, id, container) {
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
                return [];
            };
            this.getFramework = function () {
                return 'Bootstrap';
            };
            this.getVersion = function () {
                return 3;
            };
            this.getFontSet = function () {
                return 'Glyphicons';
            };
        }
        return BootstrapUiHelper;
    }());
    Peanut.BootstrapUiHelper = BootstrapUiHelper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=BootstrapUiHelper.js.map