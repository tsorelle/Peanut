var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Qnut;
(function (Qnut) {
    var QnutTestViewModel = (function (_super) {
        __extends(QnutTestViewModel, _super);
        function QnutTestViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.message = ko.observable("Hello world");
            _this.messageButtonVisible = ko.observable(true);
            _this.save = function () {
                jQuery("#confirm-save-modal").modal('hide');
                alert('you saved');
            };
            _this.onService = function () {
                var me = _this;
                var request = { "tester": 'Terry SoRelle' };
                me.application.hideServiceMessages();
                me.application.showWaiter('Testing service...');
                me.services.executeService('qnut::HelloMars', request, function (serviceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        alert(response.message);
                    }
                }).fail(function () {
                    me.application.hideWaiter();
                });
            };
            return _this;
        }
        QnutTestViewModel.prototype.init = function (successFunction) {
            var me = this;
            console.log('VM Init');
            me.application.registerComponents('@pkg/qnut/qnut-message,@pnut/modal-confirm,test-message', function () {
                me.bindDefaultSection();
            });
            successFunction();
        };
        QnutTestViewModel.prototype.onSaveChanges = function () {
            jQuery("#confirm-save-modal").modal('show');
        };
        return QnutTestViewModel;
    }(Peanut.ViewModelBase));
    Qnut.QnutTestViewModel = QnutTestViewModel;
})(Qnut || (Qnut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUW51dFRlc3RWaWV3TW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJRbnV0VGVzdFZpZXdNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBTUEsSUFBVSxJQUFJLENBK0NiO0FBL0NELFdBQVUsSUFBSTtJQUNWO1FBQXVDLHFDQUFvQjtRQUEzRDtZQUFBLHFFQTZDQztZQTVDRyxhQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN2QywwQkFBb0IsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBaUIzQyxVQUFJLEdBQUc7Z0JBQ0gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDO1lBRUYsZUFBUyxHQUFHO2dCQUNSLElBQUksRUFBRSxHQUFHLEtBQUksQ0FBQztnQkFDZCxJQUFJLE9BQU8sR0FBRyxFQUFDLFFBQVEsRUFBRyxlQUFlLEVBQUMsQ0FBQztnQkFDM0MsRUFBRSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUNyQyxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUNoRCxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQ2pELFVBQVUsZUFBd0M7b0JBQzlDLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQzVCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQzt3QkFDeEQsSUFBSSxRQUFRLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQzt3QkFDckMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFNUIsQ0FBQztnQkFDTCxDQUFDLENBQ0osQ0FBQyxJQUFJLENBQUM7b0JBQ0gsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDaEMsQ0FBQyxDQUFDLENBQUM7WUFFUCxDQUFDLENBQUM7O1FBR04sQ0FBQztRQXpDRyxnQ0FBSSxHQUFKLFVBQUssZUFBNEI7WUFDN0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUd2QixFQUFFLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLHlEQUF5RCxFQUFFO2dCQUN6RixFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUM1QixDQUFDLENBQUMsQ0FBQztZQUNILGVBQWUsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFRCx5Q0FBYSxHQUFiO1lBQ0ksTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUE0Qkwsd0JBQUM7SUFBRCxDQUFDLEFBN0NELENBQXVDLE1BQU0sQ0FBQyxhQUFhLEdBNkMxRDtJQTdDWSxzQkFBaUIsb0JBNkM3QixDQUFBO0FBQ0wsQ0FBQyxFQS9DUyxJQUFJLEtBQUosSUFBSSxRQStDYiJ9