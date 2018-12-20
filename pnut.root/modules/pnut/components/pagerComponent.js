var Peanut;
(function (Peanut) {
    var pagerComponent = (function () {
        function pagerComponent(params) {
            var _this = this;
            this.forwardLabel = ko.observable('Next');
            this.backwardLabel = ko.observable('Previous');
            this.pageLabel = ko.observable('Page');
            this.ofLabel = ko.observable('of');
            this.pagerFormat = 'Page %s of %s';
            this.nextPage = function () {
                _this.onClick(1);
            };
            this.prevPage = function () {
                _this.onClick(-1);
            };
            var me = this;
            if (!params) {
                console.error('pagerComponent: Params not defined in translateComponent');
                return;
            }
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
                var translator = params.owner();
                me.forwardLabel(translator.translate('label-next', 'Next'));
                me.backwardLabel(translator.translate('label-previous', 'Previous'));
                me.pageLabel(translator.translate('label-page', 'Page'));
                me.ofLabel(translator.translate('label-of', 'of'));
            }
        }
        return pagerComponent;
    }());
    Peanut.pagerComponent = pagerComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=pagerComponent.js.map