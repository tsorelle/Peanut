var Peanut;
(function (Peanut) {
    var WaitMessage = (function () {
        function WaitMessage() {
        }
        WaitMessage.addTemplate = function (templateName, content) {
            templateName = templateName.split('/').pop();
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
        return WaitMessage;
    }());
    WaitMessage.waitDialog = null;
    WaitMessage.waiterType = 'spin-waiter';
    WaitMessage.templates = Array();
    WaitMessage.visible = false;
    Peanut.WaitMessage = WaitMessage;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2FpdE1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJXYWl0TWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxJQUFVLE1BQU0sQ0EyRGY7QUEzREQsV0FBVSxNQUFNO0lBQ1o7UUFBQTtRQXVEQSxDQUFDO1FBL0NpQix1QkFBVyxHQUF6QixVQUEwQixZQUFvQixFQUFFLE9BQWU7WUFDM0QsWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0MsV0FBVyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDbEQsQ0FBQztRQUdhLHlCQUFhLEdBQTNCLFVBQTRCLFVBQWtCO1lBQzFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQ3BDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztRQUNsQyxDQUFDO1FBRWEsc0JBQVUsR0FBeEIsVUFBeUIsT0FBZTtZQUNwQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUM7UUFFYSx1QkFBVyxHQUF6QixVQUEwQixLQUFhLEVBQUUsU0FBMEI7WUFBMUIsMEJBQUEsRUFBQSxpQkFBMEI7WUFDL0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQzVELElBQUksT0FBTyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7Z0JBQzFCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNaLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVhLGdCQUFJLEdBQWxCLFVBQW1CLE9BQW1DLEVBQUUsVUFBa0M7WUFBdkUsd0JBQUEsRUFBQSwyQkFBbUM7WUFBRSwyQkFBQSxFQUFBLDBCQUFrQztZQUN0RixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBQyxjQUFjLEVBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pELFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUM7UUFDTCxDQUFDO1FBRWEsZ0JBQUksR0FBbEI7WUFDSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNyRCxXQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNoQyxDQUFDO1FBQ0wsQ0FBQztRQUNMLGtCQUFDO0lBQUQsQ0FBQyxBQXZERDtJQUNtQixzQkFBVSxHQUFRLElBQUksQ0FBQztJQUN2QixzQkFBVSxHQUFXLGFBQWEsQ0FBQztJQUNuQyxxQkFBUyxHQUFHLEtBQUssRUFBVSxDQUFDO0lBQzVCLG1CQUFPLEdBQUcsS0FBSyxDQUFDO0lBSnRCLGtCQUFXLGNBdUR2QixDQUFBO0FBR0wsQ0FBQyxFQTNEUyxNQUFNLEtBQU4sTUFBTSxRQTJEZiJ9