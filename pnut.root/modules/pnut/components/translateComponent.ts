/// <reference path='../../typings/knockout/knockout.d.ts' />
namespace Peanut {
    export class translateComponent {
        text = ko.observable('');

        constructor(params: any) {
            let me = this;
            if (!params) {
                throw('Params not defined in translateComponent');
            }
            if(!params.textCode) {
                throw('Paramiter "textCode" is required')
            }
            if (!params.owner) {
                throw('owner parameter required:  "owner: getVmInstance"')
            }
            let defaultText =  params.defaultText ? params.defaultText : params.code;
            let text = (<ViewModelBase>params.owner()).translate(params.textCode,defaultText);
            me.text(text);
        }
    }
}