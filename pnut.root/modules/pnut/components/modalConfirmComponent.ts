/**
 * Created by Terry on 10/30/2015.
 * See documentation in modalConfirmComponent-doc.txt
 */
/// <reference path='../../typings/knockout/knockout.d.ts' />
/// <reference path='../core/KnockoutHelper.ts' />
namespace Peanut {
    export class modalConfirmComponent {
        public confirmClick : ()=> void;
        public headerText : KnockoutObservable<string>;
        public bodyText : KnockoutObservable<string>;
        public modalId : KnockoutObservable<string>;
        public okLabel : KnockoutObservable<string>;
        public cancelLabel : KnockoutObservable<string>;
        showOkButton : KnockoutObservable<boolean>;
        constructor(params : any) {
            let me = this;

            if (!params) {
                throw('Params not defined in modalConfirmComponent');
            }
            me.modalId = ko.observable(params.id);
            me.confirmClick = params.confirmClick;
            me.headerText = (typeof params.headerText == 'string') ?  ko.observable(params.headerText) : params.headerText;
            me.bodyText =  (typeof params.bodyText == 'string') ?  ko.observable(params.bodyText) : params.bodyText;
            let buttonSet = (params.buttonSet) ? params.buttonSet : 'okcancel';
            me.showOkButton = ko.observable(buttonSet != 'alert');
            switch(buttonSet) {
                case 'alert' :
                    me.okLabel = ko.observable('');
                    me.cancelLabel = ko.observable('Continue');
                    break;
                case 'yesno' :
                    me.okLabel = ko.observable('Yes');
                    me.cancelLabel = ko.observable('No');
                    break;
                case 'okcancel' :
                    me.okLabel = ko.observable('Ok');
                    me.cancelLabel = ko.observable('Cancel');
                    break;
                default:
                    let parts = buttonSet.split('||');
                    if (parts.length == 2) {
                        me.okLabel = ko.observable(parts[0]);
                        me.cancelLabel = ko.observable(parts[1]);
                    }
                    else {
                        me.okLabel = ko.observable('Ok');
                        me.cancelLabel = ko.observable('Cancel');
                    }
                    break;
            }
        }
    }
}
