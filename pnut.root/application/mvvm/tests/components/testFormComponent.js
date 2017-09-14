var Peanut;
(function (Peanut) {
    var testFormComponent = (function () {
        function testFormComponent() {
            var _this = this;
            this.userInput = ko.observable('');
            this.message = ko.observable('');
            this.setMessage = function (s) {
                _this.message("Message from main vm: " + s);
            };
        }
        return testFormComponent;
    }());
    Peanut.testFormComponent = testFormComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=testFormComponent.js.map