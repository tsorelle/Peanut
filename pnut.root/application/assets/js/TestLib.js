var Testing;
(function (Testing) {
    var Test = (function () {
        function Test() {
        }
        Test.sayHello = function () {
            console.log('Hello from test class');
        };
        return Test;
    }());
    Testing.Test = Test;
})(Testing || (Testing = {}));
//# sourceMappingURL=TestLib.js.map