/**
 * Created by Terry on 5/2/2017.
 */
/// <reference path="../../../../pnut/core/ViewModelBase.ts" />
/// <reference path='../../../../typings/knockout/knockout.d.ts' />

namespace Qnut {
    export class QnutTestViewModel extends Peanut.ViewModelBase {
        message = ko.observable("Hello world");
        messageButtonVisible = ko.observable(true);

        init(successFunction?: () => void) {
            let me = this;
            console.log('VM Init');

            // load components from the package, peanut core and the default application
            me.application.registerComponents('@pkg/qnut/qnut-message,@pnut/modal-confirm,test-message', () => {
                me.bindDefaultSection();
            });
            successFunction();
        }

        onSaveChanges() {
            jQuery("#confirm-save-modal").modal('show');
        }

        save = () => {
            jQuery("#confirm-save-modal").modal('hide');
            alert('you saved');
        };

        onService = () => {
            let me = this;
            let request = {"tester" : 'Terry SoRelle'};
            me.application.hideServiceMessages();
            me.application.showWaiter('Testing service...');
            me.services.executeService('qnut::HelloMars', request,
                function (serviceResponse: Peanut.IServiceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = serviceResponse.Value;
                        alert(response.message);

                    }
                }
            ).fail(function () {
                me.application.hideWaiter();
            });

        };


    }
}
