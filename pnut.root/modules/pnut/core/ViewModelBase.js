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
//# sourceMappingURL=ViewModelBase.js.map