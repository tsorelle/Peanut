/**
 * Created by Terry on 6/5/2017.
 */
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
