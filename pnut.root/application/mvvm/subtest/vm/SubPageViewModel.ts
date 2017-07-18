/**
 * Created by Terry on 5/7/2017.
 */

// required for all view models:
/// <reference path="../../../../pnut/core/ViewModelBase.ts" />
/// <reference path='../../../../typings/knockout/knockout.d.ts' />

// used for these test routines.
///<reference path="../../../../pnut/core/WaitMessage.ts"/>
///<reference path="../../components/testFormComponent.ts"/>
///<reference path="../../components/messageConstructorComponent.ts"/>
///<reference path="../../../../typings/lodash/index.d.ts"/>
///<reference path="../../../../assets/js/libraries/TestLib.ts"/>

// Module
namespace Bookstore {
    // view model
    export class SubPageViewModel  extends Peanut.ViewModelBase {
        messageText = ko.observable('');

        itemName = ko.observable('');
        itemId = ko.observable(1);
        messagePanel = ko.observable('button');
        messageFormVisible = ko.observable(false);
        messageButtonVisible = ko.observable(true);

        private testForm : testFormComponent;

        // call this funtions at end of page
        init(successFunction?: () => void) {
            let me = this;
            // setup messaging and other application initializations

            // for components inside the default secton (<div id='testpage-view-container>)
            // Call load component to load and register. Before calling showDefaultSection()
            // final block must bind any view models (main or component) and call the success function.

            // me.application.registerComponentPrototype('@pnut/modal-confirm', () => {
            me.application.registerComponents('subtest/sub-message,@pnut/modal-confirm', () => {
                me.bindDefaultSection();
                successFunction();
            });

        }

        onGetItem() {
            let me = this;
            me.application.showWaiter('Please wait...');
            me.services.getFromService('TestGetService', 3, function (serviceResponse: Peanut.IServiceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.itemName(serviceResponse.Value.name);
                        me.itemId(serviceResponse.Value.id);
                    }
                    else {
                        alert("Service failed");
                    }
                }
            ).always(function () {
                me.application.hideWaiter();
            });

        }

        onPostItem() {
            let me = this;
            let request = {
                testMessageText: me.itemName()
            };

            me.application.showWaiter('Please wait...');
            me.services.executeService('TestService', request)
                .always(function () {
                    me.application.hideWaiter();
                });

        }

        // person: KnockoutObservable<any> = ko.observable();
        // Declarations
        // Examples:
        //  templateList: KnockoutObservableArray = ko.observableArray([]);
        //  currentPage: KnockoutObservableString = ko.observable("");


        // Methods
        // test() { alert("hello"); }

        onAddMessageClick() {
            let me = this;
            let msg = me.messageText();
            me.application.showMessage(msg);
            me.messageText('');
        }

        onAddErrorMessageClick() {
            let me = this;
            let msg = me.messageText();
            me.application.showError(msg);
            me.messageText('');
        }

        onAddWarningMessageClick() {
            let me = this;
            let msg = me.messageText();
            me.application.showWarning(msg);
            me.messageText('');
        }

        onShowSpinWaiter() {
            let count = 0;
            Peanut.WaitMessage.show("Hello " + (new Date()).toISOString());
            let t = window.setInterval(function () {
                if (count > 100) {
                    clearInterval(t);
                    Peanut.WaitMessage.hide();
                }
                else {
                    Peanut.WaitMessage.setMessage('Counting ' + count);
                    // Peanut.WaitMessage.setProgress(count,true);
                }
                count += 1;
            }, 100);

        }

        onShowWaiter() {
            let me = this;
            me.application.showWaiter();
            let t = window.setInterval(function () {
                clearInterval(t);
                me.application.hideWaiter();
            }, 1000);

        }

        onShowProgressWaiter() {
            let count = 0;
            Peanut.WaitMessage.show("Hello " + (new Date()).toISOString(), 'progress-waiter');
            let t = window.setInterval(function () {
                if (count > 100) {
                    clearInterval(t);
                    Peanut.WaitMessage.hide();
                }
                else {
                    Peanut.WaitMessage.setMessage('Counting ' + count);
                    Peanut.WaitMessage.setProgress(count, true);
                }
                count += 1;
            }, 100);
        }

        onHideWaiter() {
            Peanut.WaitMessage.hide();
        }

        onShowModalForm() {
            jQuery("#test-modal").modal('show');
        }

        onSaveChanges() {
            jQuery("#test-modal").modal('hide');
            jQuery("#confirm-save-modal").modal('show');
        }

        save = () => {
            jQuery("#confirm-save-modal").modal('hide');
            alert('you saved');
        };
        onShowError = () => {
            this.application.showError("This is an error message.");
        };
        onService = () => {
            let me = this;
            let request = {"tester" : 'Terry SoRelle'};
            me.application.hideServiceMessages();
            me.application.showWaiter('Testing service...');
            // me.services.executeService('admin.HelloWorld', request,
            me.services.executeService('HelloWorld', request,
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

        /**
         * Demonstrates load component on demand and use of a vm factory function.
         * The factory function my be defined seperately or in-line as is doe here.
         */
        onShowForm = () => {
            let me  = this;
            this.application.attachComponent(
                // component name
                'test-form',

                // vm factory function
                (returnFuncton: (vm: any) => void) => {
                    this.application.loadResources('testFormComponent.js', () => {
                        me.testForm = new Bookstore.testFormComponent();
                        me.testForm.setMessage('Watch this space.');
                        me.messagePanel('form');
                        // return instance via the final function.
                        returnFuncton(me.testForm);
                    });
                }

                // finalFunction parameter not needed here

            );
        };

        onSendMessage = () => {
            this.testForm.setMessage(this.messageText());
        };

        onShowMessageComponent = () => {
            this.attachComponent('test-message');
            this.messageButtonVisible(false);
        };

    }


}
