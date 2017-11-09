/// <reference path='../../typings/knockout/knockout.d.ts' />
/// <reference path='../core/KnockoutHelper.ts' />
namespace Peanut {
    export interface ISearchListObservable {
        searchValue : KnockoutObservable<string>;
        selectionCount : KnockoutObservable<number>;
        hasMore : KnockoutObservable<boolean>;
        hasPrevious : KnockoutObservable<boolean>;
        selectionList : any[];
        columnCount : number;
        maxInColumn : number;
        itemsPerPage: number;
        currentPage : number;
        lastPage : number;
        itemList: INameValuePair[];
        foundCount : KnockoutObservable<number>;
        reset : () => void;
        setList : (list : INameValuePair[]) => void;
        nextPage : ()=> void;
        previousPage : ()=> void;
    }

    // * Base class for observable container that handles search results.
    export class searchListObservable implements ISearchListObservable {
        searchValue = ko.observable('');
        selectionCount = ko.observable(0);
        hasMore = ko.observable(false);
        hasPrevious = ko.observable(false);
        selectionList = [];
        columnCount : number;
        maxInColumn : number;
        itemsPerPage: number;
        currentPage : number = 1;
        lastPage : number;
        itemList: INameValuePair[];
        foundCount = ko.observable(0);

        public constructor(columnCount : number, maxInColumn: number ) {
            let me = this;
            me.columnCount = columnCount;
            me.maxInColumn = maxInColumn;
            me.itemsPerPage = columnCount * maxInColumn;
            for (let i=1;i<=columnCount;i++) {
                me.selectionList[i] = ko.observableArray<INameValuePair>([]);
            }
        }


        /**
         * reset search observables
         */
        public reset() {
            let me = this;
            me.searchValue('');
            me.selectionCount(0);
            me.foundCount(0);
        }

        /**
         *  Assign result list
         */
        public setList(list : INameValuePair[]) {
            let me = this;
            me.itemList = list;
            let itemCount = list.length;
            if (itemCount == 1 && list[0].Value === null) {
                me.foundCount(itemCount - 1);
            }
            else {
                me.foundCount(itemCount);
            }
            me.selectionCount(itemCount);
            me.currentPage = 1;
            me.lastPage = Math.ceil(itemCount / me.itemsPerPage);
            me.hasMore(me.lastPage > 1);
            me.hasPrevious(false);
            me.parseColumns();
        }

        /**
         * handle next-page click
         */
        public nextPage = ()=> {
            let me = this;
            if (me.currentPage < me.lastPage) {
                me.currentPage = me.currentPage + 1;
            }

            me.hasMore(me.lastPage > me.currentPage);
            me.hasPrevious(me.currentPage > 1);
            me.parseColumns();
        };

        /**
         * handle previous-page click
         */
        public previousPage = ()=> {
            let me = this;
            if (me.currentPage > 1) {
                me.currentPage = me.currentPage - 1;
            }
            me.hasMore(me.lastPage > me.currentPage);
            me.hasPrevious(me.currentPage > 1);
            me.parseColumns();
        };

        /**
         * arrange list in observable columns
         */
        private parseColumns() {
            let me = this;
            let columns = [];
            let currentColumn = 0;
            let startIndex = me.itemsPerPage * (me.currentPage - 1);
            let lastIndex = startIndex + me.itemsPerPage;
            if (lastIndex >= me.itemList.length) {
                lastIndex = me.itemList.length - 1;
            }
            columns[0] = [];
            let j = 0;
            for(let i = startIndex; i <= lastIndex; i++) {
                columns[currentColumn][j] = me.itemList[i];
                if ((i+1) % me.maxInColumn == 0) {
                    ++currentColumn;
                    columns[currentColumn] = [];
                    j=0;
                }
                else {
                    j=j+1;
                }
            }
            for (let i=0; i< me.columnCount; i++) {
                me.selectionList[i+1](columns[i]);
            }
        }
    }
}