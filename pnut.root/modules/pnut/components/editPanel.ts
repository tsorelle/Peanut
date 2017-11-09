/// <reference path='../../typings/knockout/knockout.d.ts' />
/// <reference path='../core/KnockoutHelper.ts' />
namespace Peanut {
    export class editPanel {
        public viewState = ko.observable('');
        public hasErrors = ko.observable(false);
        public isAssigned = false;
        public relationId : any = null;

        /**
         * set view state 'edit'
         */
        public edit(relationId: any = null){
            let me = this;
            me.viewState('edit');
            me.relationId = relationId;
        }
        /**
         * set view state 'closed'
         */
        public close() {
            let me = this;
            me.viewState('closed');
        }
        /**
         * set view state 'search'
         */
        public search() {
            let me = this;
            me.viewState('search');
        }
        /**
         * set view state 'empty'
         */
        public empty() {
            let me = this;
            me.viewState('empty');
        }
        /**
         * set view state 'view'
         */
        public view() {
            let me = this;
            if (me.isAssigned) {
                me.viewState('view');
            }
            else {
                me.viewState('empty');
            }
        }

        /**
         * Set view state, iqnore any constraints
         * @param state
         */
        public setViewState(state = 'view') {
            let me = this;
            me.viewState(state);
        }
    }
    
}