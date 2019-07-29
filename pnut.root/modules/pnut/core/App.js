var Peanut;
(function (Peanut) {
    var mailBox = (function () {
        function mailBox() {
        }
        return mailBox;
    }());
    Peanut.mailBox = mailBox;
    var Application = (function () {
        function Application() {
            var _this = this;
            this.startVM = function (vmName, final) {
                Peanut.PeanutLoader.getConfig(function (IPeanutConfig) {
                    _this.koHelper.loadViewModel(vmName, function (viewModel) {
                        viewModel.start(_this, function () {
                            if (final) {
                                final(viewModel);
                            }
                        });
                    });
                });
            };
            this.loadResources = function (resourceList, successFunction) {
                var names = resourceList;
                if (!(resourceList instanceof Array)) {
                    resourceList = resourceList.split(',');
                }
                else {
                    names = resourceList.join(',');
                }
                var listLength = resourceList.length;
                _this.koHelper.loadResources(resourceList, function () {
                    if (successFunction) {
                        successFunction();
                    }
                });
            };
            this.loadWaitMessageTemplate = function (templateName, successFunction) {
                var ext = Peanut.Config.values.uiExtension;
                templateName = '@pnut/extensions/' + ext + '/' + templateName;
                _this.koHelper.getHtmlTemplate(templateName, function (htmlSource) {
                    if (htmlSource !== null) {
                        Peanut.WaitMessage.addTemplate(templateName, htmlSource);
                    }
                    successFunction();
                });
            };
            this.bindNode = function (containerName, context) {
                _this.koHelper.bindNode(containerName, context);
            };
            this.bindSection = function (containerName, context) {
                _this.koHelper.bindSection(containerName, context);
            };
            this.registerComponents = function (componentList, finalFunction) {
                var componentNames = componentList;
                if (!(componentList instanceof Array)) {
                    componentList = componentList.split(',');
                }
                else {
                    componentNames = componentList.join(',');
                }
                var listLength = componentList.length;
                _this.koHelper.registerComponents(componentList, function () {
                    Application.LogMessage('Registered ' + listLength + ' components: ' + componentNames);
                    finalFunction();
                });
            };
            this.registerComponentPrototype = function (componentName, finalFunction) {
                _this.koHelper.loadAndRegisterComponentPrototype(componentName, function () {
                    Application.LogMessage('Registered component prototype: ' + componentName);
                    if (finalFunction) {
                        finalFunction();
                    }
                });
            };
            this.loadComponents = function (componentList, finalFunction) {
                var componentNames = componentList;
                if (componentList instanceof Array) {
                    componentNames = componentList.join(', ');
                }
                else {
                    componentList = componentList.split(',');
                }
                _this.koHelper.loadComponentPrototypes(componentList, function () {
                    Application.LogMessage('Registered component prototypes: ' + componentNames);
                    if (finalFunction) {
                        finalFunction();
                    }
                });
            };
            this.registerComponent = function (componentName, vmInstance, finalFunction) {
                if (vmInstance) {
                    _this.koHelper.registerComponentInstance(componentName, vmInstance, function () {
                        if (vmInstance !== null) {
                            Application.LogMessage('Registered instance of component: ' + componentName);
                        }
                        finalFunction();
                    });
                }
                else {
                    _this.registerComponentPrototype(componentName, finalFunction);
                }
            };
            this.attachComponent = function (componentName, vm, finalFunction) {
                if (vm) {
                    _this.koHelper.registerAndBindComponentInstance(componentName, vm, function () {
                        Application.LogMessage('Attached component: ' + componentName);
                        if (finalFunction) {
                            finalFunction();
                        }
                    });
                }
                else {
                    console.error('attachComponent: No component instance. Use ViewModelBase.attachComponent for component prototypes.');
                }
            };
        }
        Application.prototype.initialize = function (successFunction) {
            var me = this;
            Peanut.PeanutLoader.checkConfig();
            me.koHelper = new Peanut.KnockoutHelper();
            Peanut.PeanutLoader.loadUiHelper(function () {
                MessageManager.instance.fontSet(Peanut.ui.helper.getFontSet());
                var resources = Peanut.ui.helper.getResourceList();
                me.loadResources(resources, function () {
                    me.attachComponent('@pnut/service-messages', MessageManager.instance, function () {
                        me.loadWaitMessageTemplate('spin-waiter', function () {
                            me.loadWaitMessageTemplate('progress-waiter', function () {
                                me.loadWaitMessageTemplate('banner-waiter', function () {
                                    if (successFunction) {
                                        successFunction();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        };
        Application.prototype.loadStyleSheets = function (resourceList) {
            var names = resourceList;
            if (!(resourceList instanceof Array)) {
                resourceList = resourceList.split(',');
            }
            this.koHelper.loadStyleSheets(resourceList);
        };
        Application.prototype.showWaiter = function (message, waiterType) {
            if (message === void 0) { message = "Please wait . . ."; }
            if (waiterType === void 0) { waiterType = 'banner-waiter'; }
            if (waiterType === 'banner-waiter') {
                MessageManager.instance.showBannerMessage(message);
            }
            else {
                Peanut.WaitMessage.show(message, waiterType);
            }
        };
        Application.prototype.hideWaitMessage = function () {
            if (Peanut.WaitMessage) {
                Peanut.WaitMessage.hide();
            }
        };
        Application.prototype.hideWaiter = function () {
            if (MessageManager.instance.waiterVisible) {
                MessageManager.instance.hideWaitMessage();
            }
        };
        Application.prototype.showBannerWaiter = function (message) {
            if (message === void 0) { message = "Please wait . . ."; }
            MessageManager.instance.showBannerMessage(message);
        };
        Application.prototype.showProgress = function (message) {
            if (message === void 0) { message = "Please wait . . ."; }
            Peanut.WaitMessage.show(message, 'progress-waiter');
        };
        Application.prototype.setProgress = function (count) {
            Peanut.WaitMessage.setProgress(count);
        };
        Application.prototype.showServiceMessages = function (messages) {
            var me = this;
            if (me.messageTimer) {
                clearInterval(me.messageTimer);
            }
            MessageManager.instance.setServiceMessages(messages);
            var intervalValue = 2500;
            for (var i = 0; i < messages.length; i++) {
                if (messages[0].MessageType != Peanut.infoMessageType) {
                    intervalValue = 15000;
                    break;
                }
            }
            me.messageTimer = window.setInterval(function () {
                MessageManager.instance.clearMessages();
                clearInterval(me.messageTimer);
            }, intervalValue);
        };
        Application.prototype.hideServiceMessages = function () {
            var me = this;
            if (me.messageTimer) {
                clearInterval(me.messageTimer);
                me.messageTimer = null;
            }
            MessageManager.instance.clearMessages();
        };
        Application.prototype.showError = function (errorMessage) {
            if (errorMessage) {
                MessageManager.instance.addMessage(errorMessage, Peanut.errorMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.errorMessageType);
            }
        };
        Application.prototype.showMessage = function (messageText) {
            if (messageText) {
                MessageManager.instance.addMessage(messageText, Peanut.infoMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.infoMessageType);
            }
        };
        Application.prototype.showWarning = function (messageText) {
            if (messageText) {
                MessageManager.instance.addMessage(messageText, Peanut.warningMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.warningMessageType);
            }
        };
        Application.prototype.setErrorMessage = function (messageText) {
            if (messageText) {
                MessageManager.instance.setMessage(messageText, Peanut.errorMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.errorMessageType);
            }
        };
        Application.prototype.setInfoMessage = function (messageText) {
            if (messageText) {
                MessageManager.instance.setMessage(messageText, Peanut.infoMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.infoMessageType);
            }
        };
        Application.prototype.setWarningMessage = function (messageText) {
            if (messageText) {
                MessageManager.instance.setMessage(messageText, Peanut.warningMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.infoMessageType);
            }
        };
        Application.LogMessage = function (message) {
            Peanut.logger.write(message);
        };
        return Application;
    }());
    Peanut.Application = Application;
    var MessageManager = (function () {
        function MessageManager() {
            var _this = this;
            this.errorMessages = ko.observableArray([]);
            this.infoMessages = ko.observableArray([]);
            this.warningMessages = ko.observableArray([]);
            this.fontSet = ko.observable('');
            this.waiterVisible = false;
            this.addMessage = function (message, messageType) {
                switch (messageType) {
                    case Peanut.errorMessageType:
                        _this.errorMessages.push({ type: MessageManager.errorClass, text: message });
                        break;
                    case Peanut.warningMessageType:
                        _this.warningMessages.push({ type: MessageManager.warningClass, text: message });
                        break;
                    default:
                        _this.infoMessages.push({ type: MessageManager.infoClass, text: message });
                        break;
                }
            };
            this.setMessage = function (message, messageType) {
                switch (messageType) {
                    case Peanut.errorMessageType:
                        _this.errorMessages([{ type: MessageManager.errorClass, text: message }]);
                        break;
                    case Peanut.warningMessageType:
                        _this.warningMessages([{ type: MessageManager.warningClass, text: message }]);
                        break;
                    default:
                        _this.infoMessages([{ type: MessageManager.infoClass, text: message }]);
                        break;
                }
            };
            this.clearMessages = function (messageType) {
                if (messageType === void 0) { messageType = Peanut.allMessagesType; }
                if (messageType == Peanut.errorMessageType || messageType == Peanut.allMessagesType) {
                    _this.errorMessages([]);
                }
                if (messageType == Peanut.warningMessageType || messageType == Peanut.allMessagesType) {
                    _this.warningMessages([]);
                }
                if (messageType == Peanut.infoMessageType || messageType == Peanut.allMessagesType) {
                    _this.infoMessages([]);
                }
            };
            this.clearInfoMessages = function () {
                _this.infoMessages([]);
            };
            this.clearErrorMessages = function () {
                _this.errorMessages([]);
            };
            this.clearWarningMessages = function () {
                _this.warningMessages([]);
            };
            this.setServiceMessages = function (messages) {
                var count = messages.length;
                var errorArray = [];
                var warningArray = [];
                var infoArray = [];
                for (var i = 0; i < count; i++) {
                    var message = messages[i];
                    switch (message.MessageType) {
                        case Peanut.errorMessageType:
                            errorArray.push({ type: MessageManager.errorClass, text: message.Text });
                            break;
                        case Peanut.warningMessageType:
                            warningArray.push({ type: MessageManager.warningClass, text: message.Text });
                            break;
                        default:
                            infoArray.push({ type: MessageManager.infoClass, text: message.Text });
                            break;
                    }
                }
                _this.errorMessages(errorArray);
                _this.warningMessages(warningArray);
                _this.infoMessages(infoArray);
            };
        }
        MessageManager.prototype.showBannerMessage = function (message) {
            var me = this;
            var container = jQuery('#waiter-message');
            var span = container.find('#peanut-toast-message');
            span.text(message || '');
            container.show();
            me.waiterVisible = true;
        };
        MessageManager.prototype.hideWaitMessage = function () {
            var me = this;
            jQuery('#waiter-message').hide();
            me.waiterVisible = false;
        };
        MessageManager.instance = new MessageManager();
        MessageManager.errorClass = "service-message-error";
        MessageManager.infoClass = "service-message-information";
        MessageManager.warningClass = "service-message-warning";
        return MessageManager;
    }());
    Peanut.MessageManager = MessageManager;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=App.js.map