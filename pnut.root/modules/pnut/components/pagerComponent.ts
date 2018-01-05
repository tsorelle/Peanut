/// <reference path='../../typings/knockout/knockout.d.ts' />
/// <reference path='../core/peanut.d.ts' />
namespace Peanut {
    export class pagerComponent {
        // observables
        currentPage : KnockoutObservable<number>;
        maxPages : KnockoutObservable<number>;
        showSpinner : KnockoutObservable<boolean>;

        forwardLabel = ko.observable('Next');
        backwardLabel = ko.observable('Previous');
        pageLabel = ko.observable('Page');
        ofLabel = ko.observable('of');
        pagerFormat = 'Page %s of %s';

        onClick : (move: number) => void;

        // variables.

        // include constructor if any params used
        constructor(params: any) {
            let me = this;

            if (!params) {
                console.error('pagerComponent: Params not defined in translateComponent');
                return;
            }
            // initialize observavles and variables from params
            if (!params.click) {
                console.error('pagerComponent: Parameter "click" is required');
                return;
            }
            me.onClick = params.click;

            if (!params.page) {
                console.error('pagerComponent: Parameter "page" is required');
                return;
            }
            me.currentPage = params.page;

            if (!params.max) {
                console.error('pagerComponent: Parameter "max" is required');
                return;
            }
            me.maxPages = params.max;

            if (params.waiter) {
                me.showSpinner = params.waiter;
            }
            else {
                me.showSpinner = ko.observable(false);
            }
            if (params.owner) {
                let translator = <ITranslator>params.owner();
                me.forwardLabel(
                    translator.translate('label-next','Next')
                );
                me.backwardLabel(
                     translator.translate('label-previous','Previous')
                );
                me.pageLabel(
                    translator.translate('label-page','Page')
                );
                me.ofLabel(
                    translator.translate('label-of','of')
                );
            }
        }

        nextPage = () => {
            this.onClick(1);
        };

        prevPage = () => {
            this.onClick(-1);
        };

    }
}