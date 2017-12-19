/// <reference path='../../typings/knockout/knockout.d.ts' />
namespace Peanut {
    export class translateComponent {
        text = ko.observable('');

        constructor(params: any) {
            let me = this;
            if (!params) {
                throw('Params not defined in translateComponent');
            }
            if(!params.code) {
                throw('Paramiter "textCode" is required')
            }
            if (!params.translator) {
                throw('owner parameter required:  "translator: self"')
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