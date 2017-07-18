var Bookstore;
(function (Bookstore) {
    var testMessageComponent = (function () {
        function testMessageComponent() {
            this.message = ko.observable('I am a late bound component');
        }
        return testMessageComponent;
    }());
    Bookstore.testMessageComponent = testMessageComponent;
})(Bookstore || (Bookstore = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdE1lc3NhZ2VDb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0TWVzc2FnZUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxJQUFVLFNBQVMsQ0FJbEI7QUFKRCxXQUFVLFNBQVM7SUFDZjtRQUFBO1lBQ0ksWUFBTyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQUQsMkJBQUM7SUFBRCxDQUFDLEFBRkQsSUFFQztJQUZZLDhCQUFvQix1QkFFaEMsQ0FBQTtBQUNMLENBQUMsRUFKUyxTQUFTLEtBQVQsU0FBUyxRQUlsQiJ9