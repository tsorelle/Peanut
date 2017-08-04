/**
 * Created by Terry on 5/21/2017.
 */
/// <reference path='../../typings/jquery/jquery.d.ts' />
/// <reference path='./peanut.d.ts' />
/// <reference path='./PeanutLoader.ts' />
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
                // peanut controller requires parameter as a string.
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
            // Execute a peanut service and handle Service Response.
            this.executeService = function (serviceName, parameters, successFunction, errorFunction) {
                if (parameters === void 0) { parameters = ""; }
                return _this.executeRPC("POST", serviceName, parameters, successFunction, errorFunction);
            };
            // GET is no longer supported. This method is for backward compatibility but is identical to execute service
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
            var errorDetailLevel = 4; // verbosity control to be implemented later
            var responseText = "An unexpected system error occurred.";
            try {
                // WCF returns a big whopping HTML page.  Could add code later to parse it but for now, just status info.
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
    /**
     * Use for testing. Normally IServiceResponse is returned from a service
     */
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
})(Peanut || (Peanut = {})); // end namespace
