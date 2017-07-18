var Peanut;
(function (Peanut) {
    Peanut.allMessagesType = -1;
    Peanut.infoMessageType = 0;
    Peanut.errorMessageType = 1;
    Peanut.warningMessageType = 2;
    Peanut.serviceResultSuccess = 0;
    Peanut.serviceResultPending = 1;
    Peanut.serviceResultWarnings = 2;
    Peanut.serviceResultErrors = 3;
    Peanut.serviceResultServiceFailure = 4;
    Peanut.serviceResultServiceNotAvailable = 5;
    var ServiceBroker = (function () {
        function ServiceBroker(clientApp) {
            var _this = this;
            this.clientApp = clientApp;
            this.securityToken = '';
            this.errorInfo = '';
            this.setSecurityToken = function (token) {
                _this.securityToken = token;
            };
            this.hideServiceMessages = function () {
                _this.clientApp.hideServiceMessages();
            };
            this.showServiceMessages = function (serviceResponse) {
                _this.clientApp.showServiceMessages(serviceResponse.Messages);
            };
            this.handleServiceResponse = function (serviceResponse) {
                _this.showServiceMessages(serviceResponse);
                return true;
            };
            this.showExceptionMessage = function (errorResult) {
                var errorMessage = _this.parseErrorResult(errorResult);
                _this.clientApp.showError(errorMessage);
                return errorMessage;
            };
            this.executeRPC = function (requestMethod, serviceName, parameters, successFunction, errorFunction) {
                if (parameters === void 0) { parameters = ""; }
                if (!Peanut.Config.loaded) {
                    throw "Peanut.config must be initialized before ajax call.";
                }
                var url = Peanut.Config.values.serviceUrl;
                var me = _this;
                me.errorInfo = '';
                if (!parameters)
                    parameters = "";
                else {
                    parameters = JSON.stringify(parameters);
                }
                var serviceRequest = {
                    "serviceCode": serviceName,
                    "topsSecurityToken": me.securityToken,
                    "request": parameters
                };
                var result = jQuery.ajax({
                    type: requestMethod,
                    data: serviceRequest,
                    dataType: "json",
                    cache: false,
                    url: url
                })
                    .done(function (serviceResponse) {
                    me.showServiceMessages(serviceResponse);
                    if (successFunction) {
                        successFunction(serviceResponse);
                    }
                })
                    .fail(function (jqXHR, textStatus) {
                    var errorMessage = me.showExceptionMessage(jqXHR);
                    me.errorInfo = (jqXHR) ? jqXHR.responseText : '';
                    if (errorFunction) {
                        errorFunction(errorMessage);
                    }
                });
                return result;
            };
            this.executeService = function (serviceName, parameters, successFunction, errorFunction) {
                if (parameters === void 0) { parameters = ""; }
                return _this.executeRPC("POST", serviceName, parameters, successFunction, errorFunction);
            };
            this.getFromService = function (serviceName, parameters, successFunction, errorFunction) {
                if (parameters === void 0) { parameters = ""; }
                return _this.executeRPC("POST", serviceName, parameters, successFunction, errorFunction);
            };
            var me = this;
            me.securityToken = me.readSecurityToken();
        }
        ServiceBroker.getInstance = function (application) {
            if (ServiceBroker.instance == null) {
                ServiceBroker.instance = new ServiceBroker(application);
            }
            return ServiceBroker.instance;
        };
        ServiceBroker.prototype.readSecurityToken = function () {
            var cookie = document.cookie;
            if (cookie) {
                var match = cookie.match(new RegExp('peanutSecurity=([^;]+)'));
                if (match) {
                    return match[1];
                }
            }
            return '';
        };
        ServiceBroker.prototype.parseErrorResult = function (result) {
            var me = this;
            var errorDetailLevel = 4;
            var responseText = "An unexpected system error occurred.";
            try {
                if (result.status) {
                    if (result.status == '404') {
                        return responseText + " The web service was not found.";
                    }
                    else {
                        responseText = responseText + " Status: " + result.status;
                        if (result.statusText)
                            responseText = responseText + " " + result.statusText;
                    }
                }
            }
            catch (ex) {
                responseText = responseText + " Error handling failed: " + ex.toString;
            }
            return responseText;
        };
        ServiceBroker.prototype.getInfoMessages = function (messages) {
            var result = [];
            var j = 0;
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                if (message.MessageType == Peanut.infoMessageType)
                    result[j++] = message.Text;
            }
            return result;
        };
        ;
        ServiceBroker.prototype.getNonErrorMessages = function (messages) {
            var me = this;
            var result = [];
            var j = 0;
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                if (message.MessageType != Peanut.errorMessageType)
                    result[j++] = message.Text;
            }
            return result;
        };
        ServiceBroker.prototype.getErrorMessages = function (messages) {
            var result = [];
            var j = 0;
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                if (message.MessageType == Peanut.errorMessageType)
                    result[j++] = message.Text;
            }
            return result;
        };
        ServiceBroker.prototype.getMessagesText = function (messages) {
            var result = [];
            var j = 0;
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                result[j++] = message.Text;
            }
            return result;
        };
        ServiceBroker.prototype.getSecurityToken = function (successFunction) {
            var serviceRequest = { "serviceCode": 'getxsstoken' };
            if (!Peanut.Config.loaded) {
                throw "Peanut.config must be initialized before ajax call.";
            }
            var result = jQuery.ajax({
                type: "POST",
                data: serviceRequest,
                dataType: "json",
                cache: false,
                url: Peanut.Config.values.serviceUrl
            })
                .done(successFunction);
            return result;
        };
        ;
        return ServiceBroker;
    }());
    ServiceBroker.instance = null;
    Peanut.ServiceBroker = ServiceBroker;
    var fakeServiceResponse = (function () {
        function fakeServiceResponse(returnValue) {
            this.Messages = [];
            this.Result = 0;
            var me = this;
            me.Value = returnValue;
            me.Data = returnValue;
        }
        return fakeServiceResponse;
    }());
    Peanut.fakeServiceResponse = fakeServiceResponse;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQSxJQUFVLE1BQU0sQ0FzUGY7QUF0UEQsV0FBVSxNQUFNO0lBQ0Msc0JBQWUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNyQixzQkFBZSxHQUFHLENBQUMsQ0FBQztJQUNwQix1QkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDckIseUJBQWtCLEdBQUcsQ0FBQyxDQUFDO0lBRXZCLDJCQUFvQixHQUFHLENBQUMsQ0FBQztJQUN6QiwyQkFBb0IsR0FBRyxDQUFDLENBQUM7SUFDekIsNEJBQXFCLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLDBCQUFtQixHQUFHLENBQUMsQ0FBQztJQUN4QixrQ0FBMkIsR0FBRyxDQUFDLENBQUM7SUFDaEMsdUNBQWdDLEdBQUcsQ0FBQyxDQUFDO0lBR2xEO1FBUUksdUJBQW1CLFNBQXdCO1lBQTNDLGlCQUdDO1lBSGtCLGNBQVMsR0FBVCxTQUFTLENBQWU7WUFLM0Msa0JBQWEsR0FBVyxFQUFFLENBQUM7WUFFM0IsY0FBUyxHQUFHLEVBQUUsQ0FBQztZQXFDZixxQkFBZ0IsR0FBRyxVQUFDLEtBQWE7Z0JBQzdCLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQy9CLENBQUMsQ0FBQztZQXVERix3QkFBbUIsR0FBRztnQkFDbEIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ3pDLENBQUMsQ0FBQztZQUVGLHdCQUFtQixHQUFHLFVBQUMsZUFBaUM7Z0JBQ3BELEtBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQztZQUVGLDBCQUFxQixHQUFHLFVBQUMsZUFBaUM7Z0JBQ3RELEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQztZ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