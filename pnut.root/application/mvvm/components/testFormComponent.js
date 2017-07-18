var Bookstore;
(function (Bookstore) {
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
    Bookstore.testFormComponent = testFormComponent;
})(Bookstore || (Bookstore = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdEZvcm1Db21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0Rm9ybUNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxJQUFVLFNBQVMsQ0FTbEI7QUFURCxXQUFVLFNBQVM7SUFDZjtRQUFBO1lBQUEsaUJBT0M7WUFORyxjQUFTLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5QixZQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVyQixlQUFVLEdBQUcsVUFBQyxDQUFTO2dCQUMxQixLQUFJLENBQUMsT0FBTyxDQUFDLHdCQUF3QixHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQztRQUNOLENBQUM7UUFBRCx3QkFBQztJQUFELENBQUMsQUFQRCxJQU9DO0lBUFksMkJBQWlCLG9CQU83QixDQUFBO0FBQ0wsQ0FBQyxFQVRTLFNBQVMsS0FBVCxTQUFTLFFBU2xCIn0=