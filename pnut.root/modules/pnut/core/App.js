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
                _this.koHelper = new Peanut.KnockoutHelper();
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
            this.getHtmlTemplate = function (name, successFunction) {
                _this.koHelper.getHtmlTemplate(name, successFunction);
            };
            this.loadWaitMessageTemplate = function (templateName, successFunction) {
                var ext = Peanut.Config.values.uiExtension;
                templateName = '@pnut/extensions/' + ext + '/' + templateName;
                _this.koHelper.getHtmlTemplate(templateName, function (htmlSource) {
                    Peanut.WaitMessage.addTemplate(templateName, htmlSource);
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
                        Application.LogMessage('Registered instance of component: ' + componentName);
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
                me.attachComponent('@pnut/service-messages', MessageManager.instance, function () {
                    me.loadWaitMessageTemplate('spin-waiter', function () {
                        me.loadWaitMessageTemplate('progress-waiter', function () {
                            if (successFunction) {
                                successFunction();
                            }
                        });
                    });
                });
            });
        };
        Application.prototype.showWaiter = function (message) {
            if (message === void 0) { message = "Please wait . . ."; }
            Peanut.WaitMessage.show(message);
        };
        Application.prototype.hideWaiter = function () {
            Peanut.WaitMessage.hide();
        };
        Application.prototype.showProgress = function (message) {
            if (message === void 0) { message = "Please wait . . ."; }
            Peanut.WaitMessage.show(message, 'progress-waiter');
        };
        Application.prototype.setProgress = function (count) {
            Peanut.WaitMessage.setProgress(count);
        };
        Application.prototype.showServiceMessages = function (messages) {
            MessageManager.instance.setServiceMessages(messages);
        };
        Application.prototype.hideServiceMessages = function () {
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
            if (Peanut.Config.values.loggingMode === 'verbose') {
                console.log(message);
            }
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
        return MessageManager;
    }());
    MessageManager.instance = new MessageManager();
    MessageManager.errorClass = "service-message-error";
    MessageManager.infoClass = "service-message-information";
    MessageManager.warningClass = "service-message-warning";
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLElBQVUsTUFBTSxDQTBkZjtBQTFkRCxXQUFVLE1BQU07SUFDWjtRQUFBO1FBT0EsQ0FBQztRQUFELGNBQUM7SUFBRCxDQUFDLEFBUEQsSUFPQztJQVBZLGNBQU8sVUFPbkIsQ0FBQTtJQUdEO1FBQUE7WUFBQSxpQkFvWEM7WUEzVlUsWUFBTyxHQUFHLFVBQUMsTUFBYyxFQUFFLEtBQXVDO2dCQUNyRSxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBQSxjQUFjLEVBQUUsQ0FBQztnQkFDckMsT0FBQSxZQUFZLENBQUMsU0FBUyxDQUFDLFVBQUMsYUFBYTtvQkFDakMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQUMsU0FBcUI7d0JBQ3RELFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFOzRCQUdkLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0NBQ1IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUNyQixDQUFDO3dCQUNMLENBQUMsQ0FDSixDQUFDO29CQUNOLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO1lBU0ssa0JBQWEsR0FBRyxVQUFDLFlBQWlCLEVBQUUsZUFBNEI7Z0JBQ25FLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQztnQkFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLFlBQVksR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO2dCQUNELElBQUksQ0FBQyxDQUFDO29CQUNGLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDO2dCQUNELElB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