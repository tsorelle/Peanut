var Qnut;
(function (Qnut) {
    var qnutMessageComponent = (function () {
        function qnutMessageComponent() {
            this.message = ko.observable('Welcome to the Qnut test');
        }
        return qnutMessageComponent;
    }());
    Qnut.qnutMessageComponent = qnutMessageComponent;
})(Qnut || (Qnut = {}));
//# sourceMappingURL=qnutMessageComponent.js.map