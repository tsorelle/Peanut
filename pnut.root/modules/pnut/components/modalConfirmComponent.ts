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
        public bootstrapVersion : KnockoutObservable<number>;
        private translator : ITranslator = null;
        showOkButton : KnockoutObservable<boolean>;
        constructor(params : any) {
            let me = this;

            if (!params) {
                throw('Params not defined in modalConfirmComponent');
            }
            if (params.translator) {
                me.translator = params.translator();
            }
            me.modalId = ko.observable(params.id);
            me.confirmClick = params.confirmClick;
            me.headerText = (typeof params.headerText == 'string') ? ko.observable(me.translate(params.headerText)) : params.headerText;
            me.bodyText =  (typeof params.bodyText == 'string') ?  ko.observable(me.translate(params.bodyText)) : params.bodyText;
            let buttonSet = (params.buttonSet) ? params.buttonSet : 'okcancel';
            me.showOkButton = ko.observable(buttonSet != 'alert');
            switch(buttonSet) {
                case 'alert' :
                    me.okLabel = ko.observable('');
                    me.cancelLabel = ko.observable(me.translate('label-continue'));
                    break;
                case 'yesno' :
                    me.okLabel = ko.observable(me.translate('label-yes'));
                    me.cancelLabel = ko.observable(me.translate('label-no'));
                    break;
                case 'okcancel' :
                    me.okLabel = ko.observable(me.translate('label-ok'));
                    me.cancelLabel = ko.observable(me.translate('label-cancel'));
                    break;
                default:
                    let parts = buttonSet.split('||');
                    if (parts.length == 2) {
                        me.okLabel = ko.observable(me.translate(parts[0]));
                        me.cancelLabel = ko.observable(me.translate(parts[1]));
                    }
                    else {
                        me.okLabel = ko.observable(me.translate('label-ok'));
                        me.cancelLabel = ko.observable(me.translate('label-cancel'));
                    }
                    break;
            }
            me.bootstrapVersion = ko.observable(3);
            PeanutLoader.loadUiHelper(() => {
                me.bootstrapVersion(Peanut.ui.helper.getVersion());
            });
        }

        translate = (text: string) => {

            let translation = this.translator ? this.translator.translate(text,'') : '';
            if (translation !== '') {
                return translation;
            }

            switch(text) {
                case 'label-ok' :
                    return 'Ok';
                case 'label-yes' :
                     return 'Yes';
                case 'label-no' :
                    return 'No';
                case 'label-continue' :
                    return 'Continue';
                case 'label-cancel' :
                    return 'Cancel';
            }
            return text;
        }

    }

}
