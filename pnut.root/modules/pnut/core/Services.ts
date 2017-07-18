/**
 * Created by Terry on 5/21/2017.
 */
/// <reference path='../../typings/jquery/jquery.d.ts' />
/// <reference path='./peanut.d.ts' />
/// <reference path='./PeanutLoader.ts' />

namespace Peanut {
    export const allMessagesType = -1;
    export const infoMessageType = 0;
    export const errorMessageType = 1;
    export const warningMessageType = 2;

    export const serviceResultSuccess = 0;
    export const serviceResultPending = 1;
    export const serviceResultWarnings = 2;
    export const serviceResultErrors = 3;
    export const serviceResultServiceFailure = 4;
    export const serviceResultServiceNotAvailable = 5;


    export class ServiceBroker {
        private static instance: ServiceBroker = null;
        public static getInstance(application: IPeanutClient) {
            if (ServiceBroker.instance == null) {
                ServiceBroker.instance = new ServiceBroker(application);
            }
            return ServiceBroker.instance;
        }
        constructor(public clientApp: IPeanutClient) {
            let me = this;
            me.securityToken = me.readSecurityToken();
        }

        securityToken: string = '';

        errorInfo = '';

        readSecurityToken() {
            let cookie = document.cookie;
            if (cookie) {
                let match = cookie.match(new RegExp('peanutSecurity=([^;]+)'));
                if (match) {
                    return match[1];
                }
            }
            return '';
        }

        parseErrorResult(result: any): string {
            let me = this;
            let errorDetailLevel = 4; // verbosity control to be implemented later
            let responseText = "An unexpected system error occurred.";
            try {
                // WCF returns a big whopping HTML page.  Could add code later to parse it but for now, just status info.
                if (result.status) {
                    if (result.status == '404') {
                        return responseText + " The web service was not found.";
                    }
                    else {
                        responseText = responseText + " Status: " + result.status;
                        if (result.statusText)
                            responseText = responseText + " " + result.statusText
                    }
                }
            }
            catch (ex) {
                responseText = responseText + " Error handling failed: " + ex.toString;
            }
            return responseText;

        }

        setSecurityToken = (token: string) => {
            this.securityToken = token;
        };

        getInfoMessages(messages: IServiceMessage[]): string[] {
            let result : string[] = [];
            let j = 0;
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i];
                if (message.MessageType == infoMessageType)
                    result[j++] = message.Text;
            }

            return result;
        };


        getNonErrorMessages(messages: IServiceMessage[]): string[] {
            let me = this;
            let result : string[] = [];

            let j = 0;
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i];
                if (message.MessageType != errorMessageType)
                    result[j++] = message.Text;
            }

            return result;
        }


        getErrorMessages(messages: IServiceMessage[]): string[] {
            let result : string[] = [];

            let j = 0;
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i];
                if (message.MessageType == errorMessageType)
                    result[j++] = message.Text;
            }

            return result;
        }


        getMessagesText(messages: IServiceMessage[]): string[] {
            let result : string[] = [];
            let j = 0;
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i];
                result[j++] = message.Text;
            }
            return result;
        }


        hideServiceMessages = (): void => {
            this.clientApp.hideServiceMessages();
        };

        showServiceMessages = (serviceResponse: IServiceResponse): void => {
            this.clientApp.showServiceMessages(serviceResponse.Messages);
        };

        handleServiceResponse = (serviceResponse: IServiceResponse): boolean => {
            this.showServiceMessages(serviceResponse);
            return true;
        };

        showExceptionMessage = (errorResult: any): string => {
            let errorMessage = this.parseErrorResult(errorResult);
            this.clientApp.showError(errorMessage);
            return errorMessage;
        };


        getSecurityToken(successFunction?: (serviceResponse: IServiceResponse) => void) : JQueryPromise<any> {
            let serviceRequest = { "serviceCode" : 'getxsstoken'};
            if (!Peanut.Config.loaded) {
                throw "Peanut.config must be initialized before ajax call."
            }
            let result =
                jQuery.ajax({
                    type: "POST",
                    data: serviceRequest,
                    dataType: "json",
                    cache: false,
                    url: Peanut.Config.values.serviceUrl
                })
                    .done(
                        successFunction
                    );

            return result;
        };

        executeRPC = (requestMethod: string, serviceName: string, parameters: any = "",
                      successFunction?: (serviceResponse: IServiceResponse) => void,
                      errorFunction?: (errorMessage: string) => void) : JQueryPromise<any> => {

            if (!Peanut.Config.loaded) {
                throw "Peanut.config must be initialized before ajax call."
            }
            let url = Peanut.Config.values.serviceUrl;
            let me = this;

            me.errorInfo = '';

            // peanut controller requires parameter as a string.
            if (!parameters)
                parameters = "";
            else  {
                parameters = JSON.stringify(parameters);
            }

            let serviceRequest = {
                "serviceCode" : serviceName,
                "topsSecurityToken": me.securityToken,
                "request" : parameters};

            let result =
                jQuery.ajax({
                    type: requestMethod, // "POST",
                    data: serviceRequest,
                    dataType: "json",
                    cache: false,
                    url: url
                })
                    .done(
                        function(serviceResponse) {
                            me.showServiceMessages(serviceResponse);
                            if (successFunction) {
                                successFunction(serviceResponse);
                            }
                        }
                    )
                    .fail(
                        function(jqXHR, textStatus ) {
                            let errorMessage = me.showExceptionMessage(jqXHR);
                            me.errorInfo = (jqXHR) ? jqXHR.responseText : '';
                            if (errorFunction) {
                                errorFunction(errorMessage);
                            }
                        });
            return result;
        };


        // Execute a peanut service and handle Service Response.
        executeService = (serviceName: string, parameters: any = "",
                          successFunction?: (serviceResponse: IServiceResponse) => void,
                          errorFunction?: (errorMessage: string) => void) : JQueryPromise<any> => {
            return this.executeRPC("POST", serviceName, parameters, successFunction, errorFunction);
        };

        // GET is no longer supported. This method is for backward compatibility but is identical to execute service
        getFromService = (serviceName: string, parameters: any = "",
                          successFunction?: (serviceResponse: IServiceResponse) => void,
                          errorFunction?: (errorMessage: string) => void) : JQueryPromise<any> => {
            return this.executeRPC("POST", serviceName, parameters, successFunction, errorFunction);
        };
    }

    /**
     * Use for testing. Normally IServiceResponse is returned from a service
     */
    export class fakeServiceResponse implements IServiceResponse {
        constructor(returnValue: any) {
            let me=this;
            me.Value = returnValue;
            me.Data = returnValue;
        }

        Messages: IServiceMessage[] = [];
        Result: number = 0;
        Value: any;
        Data: any;
    }

} // end namespace
