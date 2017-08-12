/**
 * Created by Terry on 5/4/2017.
 */
var Peanut;
(function (Peanut) {
    var WaitMessage = (function () {
        function WaitMessage() {
        }
        // public static uiHelper : IUiHelper;
        WaitMessage.addTemplate = function (templateName, content) {
            templateName = templateName.split('/').pop(); // strip location alias and path.
            WaitMessage.templates[templateName] = content;
        };
        WaitMessage.setWaiterType = function (waiterType) {
            WaitMessage.waiterType = waiterType;
            WaitMessage.waitDialog = jQuery(WaitMessage.templates[waiterType]);
            return WaitMessage.waitDialog;
        };
        WaitMessage.setMessage = function (message) {
            if (WaitMessage.waitDialog) {
                var span = WaitMessage.waitDialog.find('#wait-message');
                span.text(message);
            }
        };
        WaitMessage.setProgress = function (count, showLabel) {
            if (showLabel === void 0) { showLabel = false; }
            if (WaitMessage.waiterType == 'progress-waiter') {
                var bar = WaitMessage.waitDialog.find('#wait-progress-bar');
                var percent = count + '%';
                bar.css('width', percent);
                if (showLabel) {
                    bar.text(percent);
                }
            }
        };
        WaitMessage.show = function (message, waiterType) {
            if (message === void 0) { message = 'Please wait ...'; }
            if (waiterType === void 0) { waiterType = 'spin-waiter'; }
            if (WaitMessage.visible) {
                WaitMessage.setMessage(message);
            }
            else {
                var div = WaitMessage.setWaiterType(waiterType);
                Peanut.ui.helper.showMessage(message, 'wait-message', div);
                WaitMessage.visible = true;
            }
        };
        WaitMessage.hide = function () {
            if (WaitMessage.visible && WaitMessage.waitDialog) {
                Peanut.ui.helper.hideMessage(WaitMessage.waitDialog);
                WaitMessage.visible = false;
            }
        };
        WaitMessage.waitDialog = null;
        WaitMessage.waiterType = 'spin-waiter';
        WaitMessage.templates = Array();
        WaitMessage.visible = false;
        return WaitMessage;
    }());
    Peanut.WaitMessage = WaitMessage;
})(Peanut || (Peanut = {})); // end namespace
