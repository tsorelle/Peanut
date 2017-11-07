/**
 * Created by Terry on 7/9/2017.
 */
///<reference path="../../../../typings/jquery/jquery.d.ts"/>
var Peanut;
(function (Peanut) {
    /**
     *  Implementation class for Bootstrap dependencies
     */
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
        }
        return BootstrapUiHelper;
    }());
    Peanut.BootstrapUiHelper = BootstrapUiHelper;
})(Peanut || (Peanut = {}));
