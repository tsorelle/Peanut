var Peanut;
(function (Peanut) {
    var messageConstructorComponent = (function () {
        function messageConstructorComponent(message) {
            this.message = ko.observable(message);
        }
        return messageConstructorComponent;
    }());
    Peanut.messageConstructorComponent = messageConstructorComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=messageConstructorComponent.js.map