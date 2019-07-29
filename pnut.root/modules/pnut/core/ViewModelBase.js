var Peanut;
(function (Peanut) {
    var Environment = (function () {
        function Environment() {
        }
        Environment.getDeviceSize = function () {
            var width = window.screen.width;
            if (width >= 1200) {
                return 4;
            }
            if (width >= 992) {
                return 3;
            }
            if (width >= 768) {
                return 2;
            }
            return 1;
        };
        return Environment;
    }());
    Peanut.Environment = Environment;
    var ViewModelBase = (function () {
        function ViewModelBase() {
            var _this = this;
            this.translations = [];
            this.bootstrapVersion = ko.observable(3);
            this.fontSet = ko.observable('');
            this.deviceSize = ko.observable(4);
            this.start = function (application, successFunction) {
                var me = _this;
                me.language = me.getUserLanguage();
                me.deviceSize(Environment.getDeviceSize());
                me.addTranslations(Cookies.GetKvArray('peanutTranslations'));
                me.application = application;
                me.services = Peanut.ServiceBroker.getInstance(application);
                Peanut.PeanutLoader.loadUiHelper(function () {
                    if (Peanut.ui.helper.getFramework() === 'Bootstrap') {
                        me.bootstrapVersion(Peanut.ui.helper.getVersion());
                        me.fontSet(Peanut.ui.helper.getFontSet());
                    }
                    me.fontSet(Peanut.ui.helper.getFontSet());
                    me.application.registerComponents('@pnut/translate', function () {
                        me.init(function () {
                            Peanut.logger.write('Loaded view model: ' + me.vmName);
                            successFunction(me);
                        });
                    });
                });
            };
            this.vmName = null;
            this.vmContext = null;
            this.vmContextId = null;
            this.language = 'en-us';
            this.setVmName = function (name, context) {
                if (context === void 0) { context = null; }
                _this.vmName = name;
                _this.vmContextId = context;
                var sharedContext = jQuery('#peanut-vm-context').val();
                _this.vmContext = (sharedContext) ? context + '&' + sharedContext : context;
            };
            this.getVmContextId = function () {
                return _this.vmContextId;
            };
            this.getVmContext = function () {
                return _this.vmContext;
            };
            this.getVmName = function () {
                return _this.vmName;
            };
            this.getSectionName = function () {
                return _this.getVmName().toLowerCase() + '-view-container';
            };
            this.showDefaultSection = function () {
                var me = _this;
                var sectionName = me.getSectionName();
                jQuery("#" + sectionName).show();
                me.hideLoadMessage();
            };
            this.hideLoadMessage = function () {
                var loadMessage = '#' + _this.getVmName().toLowerCase() + '-load-message';
                jQuery(loadMessage).hide();
            };
            this.bindDefaultSection = function () {
                var me = _this;
                var sectionName = me.getSectionName();
                me.hideLoadMessage();
                _this.application.bindSection(sectionName, _this);
            };
            this.attach = function (componentName, finalFunction) {
                _this.attachComponent(componentName, null, finalFunction);
            };
            this.attachComponent = function (componentName, section, finalFunction) {
                _this.application.registerComponentPrototype(componentName, function () {
                    if (!section) {
                        section = componentName.split('/').pop() + '-container';
                    }
                    _this.application.bindSection(section, _this);
                    if (finalFunction) {
                        finalFunction();
                    }
                });
            };
            this.setPageHeading = function (text, textCase) {
                if (textCase === void 0) { textCase = 'none'; }
                if (text) {
                    text = _this.translate(text);
                    text = _this.changeCase(text, textCase);
                    jQuery('h1:first').html(text);
                    jQuery('h1:first').show();
                    if (_this.pageTitle === null) {
                        _this.setPageTitle(text);
                    }
                }
            };
            this.pageTitle = null;
            this.setPageTitle = function (text, textCase) {
                if (textCase === void 0) { textCase = 'none'; }
                text = _this.translate(text);
                text = _this.changeCase(text, textCase);
                _this.pageTitle = text;
                document.title = text;
            };
            this.showWaitMessage = function (message, waiter) {
                if (message === void 0) { message = 'wait-action-loading'; }
                if (waiter === void 0) { waiter = 'banner-waiter'; }
                var me = _this;
                message = me.translate(message) + '...';
                if (waiter == 'banner-waiter') {
                    _this.application.showBannerWaiter(message);
                }
                else {
                    Peanut.WaitMessage.show(message, waiter);
                }
            };
            this.showLoadWaiter = function (message) {
                if (message === void 0) { message = 'wait-action-loading'; }
                var me = _this;
                message = me.translate('wait-action-loading') + ', ' + me.translate('wait-please') + '...';
                me.application.showBannerWaiter(message);
            };
            this.getActionMessage = function (action, entity) {
                return _this.translate('wait-action-' + action) + ' ' + _this.translate(entity) + ', ' + _this.translate('wait-please') + '...';
            };
            this.showActionWaiter = function (action, entity, waiter) {
                if (waiter === void 0) { waiter = 'banner-waiter'; }
                var message = _this.getActionMessage(action, entity);
                if (waiter == 'banner-waiter') {
                    _this.application.showBannerWaiter(message);
                }
                else {
                    Peanut.WaitMessage.show(message, waiter);
                }
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
            this.getTodayString = function (language) {
                if (language === void 0) { language = null; }
                if (!language) {
                    language = _this.getLanguage();
                }
                var format = language.split('-').pop();
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                return format === 'us' ? mm + '/' + dd + '/' + yyyy : yyyy + '-' + mm + '-' + dd;
            };
            this.isoToShortDate = function (dateString, language) {
                if (language === void 0) { language = null; }
                if (!dateString) {
                    return '';
                }
                if (!language) {
                    language = _this.getLanguage();
                }
                dateString = dateString.split(' ').shift().trim();
                var format = language.split('-').pop();
                if (!dateString) {
                    return '';
                }
                if (format !== 'us') {
                    Peanut.logger.write('Warning: Simple date formatting for ' + format + 'is not supported. Using ISO.');
                    return dateString;
                }
                var parts = dateString.split('-');
                if (parts.length !== 3) {
                    console.error('Invalid ISO date string: ' + dateString);
                    return 'error';
                }
                return parts[1] + '/' + parts[2] + '/' + parts[0];
            };
            this.self = function () {
                return _this;
            };
            this.getApplication = function () {
                return _this.application;
            };
            this.getServices = function () {
                return _this.services;
            };
            this.hideServiceMessages = function () {
                _this.application.hideServiceMessages();
            };
            this.getUserDetails = function (finalFunction) {
                var me = _this;
                if (me.userDetails) {
                    finalFunction(me.userDetails);
                    return;
                }
                me.services.executeService('Peanut::GetUserDetails', null, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        me.application.hideWaiter();
                        me.userDetails = serviceResponse.Value;
                        finalFunction(me.userDetails);
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                    me.application.hideWaiter();
                });
            };
        }
        ViewModelBase.prototype.changeCase = function (text, textCase) {
            switch (textCase) {
                case 'ucfirst':
                    var textLength = text.length;
                    text = text.substr(0, 1).toLocaleUpperCase() +
                        (textLength > 1 ? text.substr(1, textLength) : '');
                    break;
                case 'upper':
                    text = text.toLocaleUpperCase();
                    break;
                case 'lower':
                    text = text.toLocaleLowerCase();
                    break;
            }
            return text;
        };
        ViewModelBase.prototype.getUserLanguage = function () {
            var userLang = navigator.language || navigator.userLanguage;
            if (userLang) {
                return userLang.toLowerCase();
            }
            return 'en-us';
        };
        ViewModelBase.prototype.setFocus = function (id, formId) {
            if (formId === void 0) { formId = ''; }
            if (formId) {
                document.location.hash = '#' + formId;
            }
            document.getElementById(id).focus();
        };
        ViewModelBase.prototype.shortDateToIso = function (dateString) {
            if (!dateString) {
                return '';
            }
            var parts = dateString.split('/');
            if (parts.length !== 3) {
                return dateString;
            }
            var m = parts[0];
            var d = parts[1];
            var y = parts[2];
            return y + '-' +
                (m.length < 2 ? '0' + m.toString() : m) + '-' +
                (d.length < 2 ? '0' + d.toString() : d);
        };
        ViewModelBase.prototype.getDefaultLoadMessage = function () {
            var me = this;
            return me.translate('wait-loading', '...');
        };
        ViewModelBase.prototype.handleEvent = function (eventName, data) {
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