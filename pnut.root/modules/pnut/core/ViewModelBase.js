var Peanut;
(function (Peanut) {
    var ViewModelBase = (function () {
        function ViewModelBase() {
            var _this = this;
            this.translations = [];
            this.start = function (application, successFunction) {
                var me = _this;
                me.language = me.getUserLanguage();
                me.addTranslations(Cookies.GetKvArray('peanutTranslations'));
                me.application = application;
                me.services = Peanut.ServiceBroker.getInstance(application);
                me.application.registerComponents('@pnut/translate', function () {
                    me.init(function () {
                        successFunction(me);
                    });
                });
            };
            this.vmName = null;
            this.language = 'en-us';
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
            this.showLoadWaiter = function () {
                var me = _this;
                var message = me.translate('wait-action-loading') + ', ' + me.translate('wait-please') + '...';
                me.application.showBannerWaiter(message);
            };
            this.getActionMessage = function (action, entity) {
                return _this.translate('wait-action-' + action) + ' ' + _this.translate(entity) + ', ' + _this.translate('wait-please') + '...';
            };
            this.showActionWaiter = function (action, entity, waiter) {
                if (waiter === void 0) { waiter = 'spin-waiter'; }
                var message = _this.getActionMessage(action, entity);
                Peanut.WaitMessage.show(message, waiter);
            };
            this.showActionWaiterBanner = function (action, entity) {
                _this.showActionWaiter(action, entity, 'banner-waiter');
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
            this.setLanguage = function (code) {
                var me = _this;
                me.language = code;
            };
            this.getLanguage = function () {
                var me = _this;
                return me.language;
            };
            this.getVmInstance = function () {
                return _this;
            };
        }
        ViewModelBase.prototype.getUserLanguage = function () {
            var userLang = navigator.language || navigator.userLanguage;
            if (userLang) {
                return userLang.toLowerCase();
            }
            return 'en-us';
        };
        ViewModelBase.prototype.getDefaultLoadMessage = function () {
            var me = this;
            return me.translate('wait-loading', '...');
        };
        return ViewModelBase;
    }());
    Peanut.ViewModelBase = ViewModelBase;
    var Cookies = (function () {
        function Cookies() {
        }
        Cookies.cleanCookieString = function (encodedString) {
            var output = encodedString;
            var binVal, thisString;
            var myregexp = /(%[^%]{2})/;
            var match = [];
            while ((match = myregexp.exec(output)) != null
                && match.length > 1
                && match[1] != '') {
                binVal = parseInt(match[1].substr(1), 16);
                thisString = String.fromCharCode(binVal);
                output = output.replace(match[1], thisString);
            }
            return output;
        };
        Cookies.kvObjectsToArray = function (kvArray) {
            var result = [];
            for (var i = 0; i < kvArray.length; i++) {
                var obj = kvArray[i];
                var value = obj.Value.split('+').join(' ');
                result[obj.Key] = value.replace('[plus]', '+');
            }
            return result;
        };
        Cookies.kvCookieToArray = function (cookieString) {
            var a = Cookies.cleanCookieString(cookieString);
            var j = JSON.parse(a);
            return Cookies.kvObjectsToArray(j);
        };
        Cookies.Get = function (cookieName, index) {
            if (index === void 0) { index = 1; }
            var cookie = document.cookie;
            if (cookie) {
                var match = cookie.match(new RegExp(cookieName + '=([^;]+)'));
                if (match && match.length > index) {
                    return match[index];
                }
            }
            return '';
        };
        Cookies.GetKvArray = function (cookieName, index) {
            if (index === void 0) { index = 1; }
            var cookieString = Cookies.Get(cookieName, index);
            if (cookieString) {
                return Cookies.kvCookieToArray(cookieString);
            }
            return [];
        };
        return Cookies;
    }());
    Peanut.Cookies = Cookies;
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