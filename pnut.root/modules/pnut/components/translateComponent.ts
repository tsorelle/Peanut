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
            let defaultText =  params.default ? params.default : params.code;
            let text = (<ViewModelBase>params.translator()).translate(params.code,defaultText);
            me.text(text);
        }
    }
}