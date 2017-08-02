/**
 * Created by Terry on 6/4/2017.
 */
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
