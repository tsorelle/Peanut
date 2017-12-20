var Peanut;
(function (Peanut) {
    var translateComponent = (function () {
        function translateComponent(params) {
            this.text = ko.observable('');
            var me = this;
            if (!params) {
                me.text('(translator error!)');
                console.error('translateComponent: Params not defined in translateComponent');
                return;
            }
            if (!params.code) {
                me.text('(translator error!)');
                console.error('translateComponent: Parameter "textCode" is required');
                return;
            }
            if (!params.translator) {
                me.text(params.code);
                console.error('translateComponent: owner parameter required, "translator: self"');
                return;
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