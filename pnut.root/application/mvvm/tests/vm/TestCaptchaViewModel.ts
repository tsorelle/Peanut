// required for all view models:
/// <reference path='../../../../modules/pnut/core/ViewModelBase.ts' />
/// <reference path='../../../../modules/typings/knockout/knockout.d.ts' />

// used for these test routines.
/// <reference path='../../../../modules/pnut/core/WaitMessage.ts'/>
/// <reference path='../components/testFormComponent.ts'/>
/// <reference path='../components/messageConstructorComponent.ts'/>
/// <reference path='../../../../modules/typings/lodash/index.d.ts'/>
/// <reference path='../../../../application/assets/js/libraries/TestLib.ts'/>
namespace Peanut {

    export class TestCaptchaViewModel extends Peanut.ViewModelBase {
        // observables
        test =  ko.observable('I am bound');
        init(successFunction?: () => void) {
            let me = this;
            console.log('TestCaptcha Init');
            // me.application.registerComponents('@pnut/riddler-captcha', () => {
            me.application.registerComponents('@pkg/peanut-riddler/riddler-captcha', () => {
                    me.bindDefaultSection();
                    successFunction();
                });
        }

        onCaptchaConfirm = () => {
            alert('Confirm clicked.');
        };

        onCaptchaCancel () {
            alert('Cancel clicked.');

        }
    }
}