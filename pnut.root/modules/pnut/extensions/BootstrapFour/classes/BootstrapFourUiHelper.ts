/**
 * Created by Terry on 7/9/2017.
 */
///<reference path="../../../../typings/jquery/jquery.d.ts"/>
namespace Peanut {
    /**
     *  Implementation class for Bootstrap dependencies
     */
    export class BootstrapFourUiHelper {
        public showMessage = (message: string, id: string,  container : any, modal=true ) => {
            let span = container.find('#' + id);
            span.text(message);
            this.showModal(container);

        };
        public hideMessage = (container : any) => {
            this.hideModal(container);
        };

        public showModal = (container : any) => {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                container.removeClass('fade');
            }
            container.modal('show');
        };

        public hideModal = (container: any) => {
            container.modal('hide');
        };

        public getResourceList = () => {
            return ['@lib:fontawesome'];
        };

        public getFramework = () => {
            return 'Bootstrap'
        };

        public getVersion = () => {
            return 4;
        };

        public getFontSet = () => {
            return 'FA';
        }
    }
}