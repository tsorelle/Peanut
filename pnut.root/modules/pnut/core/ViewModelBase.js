var Peanut;
(function (Peanut) {
    var ViewModelBase = (function () {
        function ViewModelBase() {
            var _this = this;
            this.start = function (application, successFunction) {
                var me = _this;
                me.application = application;
                me.services = Peanut.ServiceBroker.getInstance(application);
                me.init(function () {
                    successFunction(me);
                });
            };
            this.vmName = null;
            this.setVmName = function (name) {
                _this.vmName = name;
            };
            this.getVmName = function () {
                return _this.vmName;
            };
            this.getSectionName = function () {
                return _this.getVmName().toLowerCase() + '-view-container';
            };
            this.showDefaultSection = function () {
                var sectionName = _this.getSectionName();
                jQuery("#" + sectionName).show();
            };
            this.bindDefaultSection = function () {
                var sectionName = _this.getSectionName();
                _this.application.bindSection(sectionName, _this);
            };
            this.attachComponent = function (componentName, section) {
                _this.application.registerComponentPrototype(componentName, function () {
                    if (!section) {
                        section = componentName.split('/').pop() + '-container';
                    }
                    _this.application.bindSection(section, _this);
                });
            };
        }
        return ViewModelBase;
    }());
    Peanut.ViewModelBase = ViewModelBase;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlld01vZGVsQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlZpZXdNb2RlbEJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsSUFBVSxNQUFNLENBMERmO0FBMURELFdBQVUsTUFBTTtJQUNaO1FBQUE7WUFBQSxpQkF3REM7WUFuRFUsVUFBSyxHQUFHLFVBQUMsV0FBMkIsRUFBRSxlQUFpRDtnQkFDMUYsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO2dCQUM3QixFQUFFLENBQUMsUUFBUSxHQUFHLE9BQUEsYUFBYSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDckQsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDSixlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO1lBRU0sV0FBTSxHQUFZLElBQUksQ0FBQztZQUN4QixjQUFTLEdBQUcsVUFBQyxJQUFZO2dCQUM1QixLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUN2QixDQUFDLENBQUM7WUFFUSxjQUFTLEdBQUc7Z0JBQ2xCLE1BQU0sQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQztZQU1RLG1CQUFjLEdBQUc7Z0JBQ3ZCLE1BQU0sQ0FBQyxLQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7WUFDOUQsQ0FBQyxDQUFDO1lBTVEsdUJBQWtCLEdBQUc7Z0JBQzNCLElBQUksV0FBVyxHQUFHLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQyxDQUFDLENBQUM7WUFLUSx1QkFBa0IsR0FBRztnQkFDM0IsSUFBSSxXQUFXLEdBQUcsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN4QyxLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUMsS0FBSSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDO1lBRVEsb0JBQWUsR0FBRyxVQUFDLGFBQXFCLEVBQUUsT0FBZ0I7Z0JBQ2hFLEtBQUksQ0FBQyxXQUFXLENBQUMsMEJBQTBCLENBQUMsYUFBYSxFQUFDO29CQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQ1gsT0FBTyxHQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsWUFBWSxDQUFDO29CQUM3RCxDQUFDO29CQUNELEtBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBQyxLQUFJLENBQUMsQ0FBQTtnQkFDOUMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUM7UUFDTixDQUFDO1FBQUQsb0JBQUM7SUFBRCxDQUFDLEFBeERELElBd0RDO0lBeERxQixvQkFBYSxnQkF3RGxDLENBQUE7QUFDTCxDQUFDLEVBMURTLE1BQU0sS0FBTixNQUFNLFFBMERmIn0=