/**
 * Created by Terry on 7/9/2017.
 */
///<reference path="../../../../typings/jquery/jquery.d.ts"/>
namespace Peanut {
    /**
     *  Implementation class for Bootstrap dependencies
     */
    export class BootstrapUiHelper {
        public showMessage = (message: string, id: string,  container : any ) => {
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
            container.modal();
        };

        public hideModal = (container: any) => {
            container.modal('hide');
        };

        public getResourceList = () => {
            return [];
        };

        public getFramework = () => {
            return 'Bootstrap'
        };

        public getVersion = () => {
            return 3;
        };

        public getFontSet = () => {
            return 'Glyphicons';
        }
    }
}