var Peanut;
(function (Peanut) {
    var testMessageComponent = (function () {
        function testMessageComponent() {
            this.message = ko.observable('I am a late bound component');
        }
        return testMessageComponent;
    }());
    Peanut.testMessageComponent = testMessageComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=testMessageComponent.js.map