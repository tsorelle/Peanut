var Peanut;
(function (Peanut) {
    var translateComponent = (function () {
        function translateComponent(params) {
            this.text = ko.observable('');
            var me = this;
            if (!params) {
                throw ('Params not defined in translateComponent');
            }
            if (!params.code) {
                throw ('Paramiter "textCode" is required');
            }
            if (!params.translator) {
                throw ('owner parameter required:  "translator: self"');
            }
            var defaultText = params["default"] ? params["default"] : params.code;
            var text = params.translator().translate(params.code, defaultText);
            me.text(text);
        }
        return translateComponent;
    }());
    Peanut.translateComponent = translateComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=translateComponent.js.map