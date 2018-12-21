var Peanut;
(function (Peanut) {
    var introMessageComponent = (function () {
        function introMessageComponent() {
            this.message = ko.observable('Welcome to the Peanut test');
        }
        return introMessageComponent;
    }());
    Peanut.introMessageComponent = introMessageComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=introMessageComponent.js.map