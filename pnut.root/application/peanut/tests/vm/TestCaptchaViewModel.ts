// required for all view models:
/// <reference path='../../../../modules/pnut/core/ViewModelBase.ts' />
/// <reference path='../../../../modules/typings/knockout/knockout.d.ts' />

// used for these test routines.
/// <reference path='../../../../modules/pnut/core/WaitMessage.ts'/>
/// <reference path='../components/messageConstructorComponent.ts'/>
/// <reference path='../../../../modules/typings/lodash/index.d.ts'/>
/// <reference path='../../../../application/assets/js//TestLib.ts'/>
namespace Peanut {

    export class TestCaptchaViewModel extends Peanut.ViewModelBase {
        // observables
        test =  ko.observable('I am bound');
        init(successFunction?: () => void) {
            let me = this;
            // let fa = 'https://use.fontawesome.com/3914690617.js';
            console.log('TestCaptcha Init');
            me.application.loadResources('@lib:fontawesome', () => { // required if font awesome icons are used.
                me.application.registerComponents(['@pkg/peanut-riddler/riddler-captcha'], () => {
                    me.bindDefaultSection();
                    successFunction();
                });
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