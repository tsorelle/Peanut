/**
 * Created by Terry on 5/4/2017.
 */
namespace Peanut {
    export class WaitMessage {
        private static waitDialog: any = null;
        private static waiterType: string = 'spin-waiter';
        private static templates = Array<string>();
        private static visible = false;
        // public static uiHelper : IUiHelper;


        public static addTemplate(templateName: string, content: string) {
            templateName = templateName.split('/').pop(); // strip location alias and path.
            WaitMessage.templates[templateName] = content;
        }


        public static setWaiterType(waiterType: string) {
            WaitMessage.waiterType = waiterType;
            WaitMessage.waitDialog = jQuery(WaitMessage.templates[waiterType]);
            return WaitMessage.waitDialog;
        }

        public static setMessage(message: string) {
            if (WaitMessage.waitDialog) {
                let span = WaitMessage.waitDialog.find('#wait-message');
                span.text(message);
            }
        }

        public static setProgress(count: number, showLabel: boolean = false) {
            if (WaitMessage.waiterType == 'progress-waiter') {
                let bar = WaitMessage.waitDialog.find('#wait-progress-bar');
                let percent = count + '%';
                bar.css('width', percent);
                if (showLabel) {
                    bar.text(percent);
                }
            }
        }

        public static show(message: string = 'Please wait ...', waiterType: string = 'spin-waiter') {
            if (WaitMessage.visible) {
                WaitMessage.setMessage(message);
            }
            else {
                let div = WaitMessage.setWaiterType(waiterType);
                Peanut.ui.helper.showMessage(message,'wait-message',div);
                WaitMessage.visible = true;
            }
        }

        public static hide() {
            if (WaitMessage.visible && WaitMessage.waitDialog) {
                Peanut.ui.helper.hideMessage(WaitMessage.waitDialog);
                WaitMessage.visible = false;
            }
        }
    }


} // end namespace