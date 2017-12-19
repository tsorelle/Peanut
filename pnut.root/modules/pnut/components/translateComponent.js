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
            var textcase = params["case"] ? params["case"] : '';
            var defaultText = params["default"] ? params["default"] : params.code;
            var text = params.translator().translate(params.code, defaultText);
            var textLength = text.length;
            if (textLength > 0) {
                switch (textcase) {
                    case 'ucfirst':
                        text = text.substr(0, 1).toLocaleUpperCase() +
                            (textLength > 1 ? text.substr(1, textLength) : '');
                        break;
                    case 'upper':
                        text = text.toLocaleUpperCase();
                        break;
                    case 'lower':
                        text = text.toLocaleLowerCase();
                        break;
                }
            }
            me.text(text);
        }
        return translateComponent;
    }());
    Peanut.translateComponent = translateComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=translateComponent.js.map