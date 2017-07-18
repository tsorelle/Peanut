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
var Peanut;
(function (Peanut) {
    var HelloWorldViewModel = (function (_super) {
        __extends(HelloWorldViewModel, _super);
        function HelloWorldViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.planetList = [];
            _this.nextPlanet = 1;
            _this.planetName = ko.observable('');
            _this.planetDescription = ko.observable('');
            return _this;
        }
        HelloWorldViewModel.prototype.getPlanet = function () {
            var me = this;
            var planet = me.planetList[me.nextPlanet - 1];
            if (me.nextPlanet == me.planetList.length) {
                me.nextPlanet = 1;
            }
            else {
                me.nextPlanet++;
            }
            me.planetName(planet.name);
            me.planetDescription(planet.description);
        };
        HelloWorldViewModel.prototype.getPlanetList = function (successFunction) {
            var me = this;
            var request = { 'includePluto': 1 };
            me.application.hideServiceMessages();
            me.application.showWaiter('Getting the solar system...');
            me.services.executeService('test\\GetPlanets', request, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    me.planetList = serviceResponse.Value;
                    successFunction();
                }
            }).always(function () {
                me.application.hideWaiter();
            }).fail(function () {
                alert('Process failed!!');
            });
        };
        HelloWorldViewModel.prototype.init = function (successFunction) {
            var me = this;
            me.getPlanetList(successFunction);
        };
        return HelloWorldViewModel;
    }(Peanut.ViewModelBase));
    Peanut.HelloWorldViewModel = HelloWorldViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVsbG9Xb3JsZFZpZXdNb2RlbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhlbGxvV29ybGRWaWV3TW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQU1BLElBQVUsTUFBTSxDQTJEZjtBQTNERCxXQUFVLE1BQU07SUFDWjtRQUEwQyx1Q0FBb0I7UUFBOUQ7WUFBQSxxRUF5REM7WUF4RFcsZ0JBQVUsR0FBRyxFQUFFLENBQUM7WUFDaEIsZ0JBQVUsR0FBRyxDQUFDLENBQUM7WUFHdkIsZ0JBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLHVCQUFpQixHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7O1FBbUQxQyxDQUFDO1FBaERHLHVDQUFTLEdBQVQ7WUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDZCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDRixFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDcEIsQ0FBQztZQUNELEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDNUMsQ0FBQztRQUVELDJDQUFhLEdBQWIsVUFBYyxlQUEwQjtZQUNwQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDZCxJQUFJLE9BQU8sR0FBRyxFQUFDLGNBQWMsRUFBRyxDQUFDLEVBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsV0FBVyxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDckMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUN6RCxFQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsRUFBQyxPQUFPLEVBQ2pELFVBQVMsZUFBaUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztvQkFDeEQsRUFBRSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO29CQUN0QyxlQUFlLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztZQUNMLENBQUMsQ0FDSixDQUFDLE1BQU0sQ0FBQztnQkFDTCxFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDSDtnQkFDSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtZQUM3QixDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7UUFZRCxrQ0FBSSxHQUFKLFVBQUssZUFBNEI7WUFDN0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ2QsRUFBRSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUNyQyxDQUFDO1FBQ0wsMEJBQUM7SUFBRCxDQUFDLEFBekRELENBQTBDLE1BQU0sQ0FBQyxhQUFhLEdBeUQ3RDtJQXpEWSwwQkFBbUIsc0JBeUQvQixDQUFBO0FBQ0wsQ0FBQyxFQTNEUyxNQUFNLEtBQU4sTUFBTSxRQTJEZiJ9