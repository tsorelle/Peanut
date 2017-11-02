var Peanut;
(function (Peanut) {
    var ViewModelBase = (function () {
        function ViewModelBase() {
            var _this = this;
            this.translations = [];
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
            this.getRequestVar = function (key, defaultValue) {
                if (defaultValue === void 0) { defaultValue = null; }
                return HttpRequestVars.Get(key, defaultValue);
            };
            this.translate = function (code, defaultText) {
                if (defaultText === void 0) { defaultText = null; }
                var me = _this;
                if (code in me.translations) {
                    return me.translations[code];
                }
                return defaultText === null ? code : defaultText;
            };
            this.addTranslation = function (code, text) {
                var me = _this;
                me.translations[code] = text;
            };
            this.addTranslations = function (translations) {
                var me = _this;
                if (translations) {
                    for (var code in translations) {
                        me.translations[code] = translations[code];
                    }
                }
            };
            this.getVmInstance = function () {
                return _this;
            };
        }
        return ViewModelBase;
    }());
    Peanut.ViewModelBase = ViewModelBase;
    var HttpRequestVars = (function () {
        function HttpRequestVars() {
            this.requestvars = [];
            var me = this;
            var queryString = window.location.search;
            var params = queryString.slice(queryString.indexOf('?') + 1).split('&');
            for (var i = 0; i < params.length; i++) {
                var parts = params[i].split('=');
                var key = parts[0];
                me.requestvars.push(key);
                me.requestvars[key] = parts[1];
            }
        }
        HttpRequestVars.prototype.getValue = function (key) {
            var me = this;
            var value = me.requestvars[key];
            if (value) {
                return value;
            }
            return null;
        };
        HttpRequestVars.Get = function (key, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (!HttpRequestVars.instance) {
                HttpRequestVars.instance = new HttpRequestVars();
            }
            var result = HttpRequestVars.instance.getValue(key);
            return (result === null) ? defaultValue : result;
        };
        return HttpRequestVars;
    }());
    Peanut.HttpRequestVars = HttpRequestVars;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=ViewModelBase.js.map