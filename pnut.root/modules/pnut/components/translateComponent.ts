/// <reference path='../../typings/knockout/knockout.d.ts' />
namespace Peanut {
    export class translateComponent {
        text = ko.observable('');

        constructor(params: any) {
            let me = this;
            if (!params) {
                me.text('(translator error!)');
                console.error('translateComponent: Params not defined in translateComponent');
                return;
            }
            if(!params.code) {
                me.text('(translator error!)');
                console.error('translateComponent: Parameter "textCode" is required');
                return;
            }
            if (!params.translator) {
                me.text(params.code);
                console.error('translateComponent: owner parameter required, "translator: self"');
                return;
            }
            let textcase = params.case ? params.case : '';
            let defaultText =  params.default ? params.default : params.code;
            let text = (<ViewModelBase>params.translator()).translate(params.code,defaultText);
            let textLength = text.length;
            if (textLength > 0) {
                switch (textcase) {
                    case 'ucfirst' :
                        text = text.substr(0, 1).toLocaleUpperCase() +
                            (textLength > 1 ? text.substr(1,textLength) : '');
                        break;
                    case 'upper' :
                        text = text.toLocaleUpperCase();
                        break;
                    case 'lower' :
                        text = text.toLocaleLowerCase();
                        break;
                }
            }
            me.text(text);
        }
    }
}