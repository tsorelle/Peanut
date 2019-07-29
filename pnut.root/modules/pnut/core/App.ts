/**
 * Created by Terry on 2/19/2015.
 */
/// <reference path="../../pnut/core/KnockoutHelper.ts" />
/// <reference path='../../pnut/core/Peanut.d.ts' />
/// <reference path="../../pnut/core/WaitMessage.ts" />
/// <reference path="./Services.ts" />

namespace Peanut {
    export class mailBox {
        id: string;
        name: string;
        description: string;
        code: string;
        email: string;
        state: number;
    }

    // Class
    export class Application implements IPeanutClient {

        private koHelper : KnockoutHelper;

        /**********************
         * Initializations
         *********************/
        public initialize(successFunction?: () => void) {
            let me = this;
            PeanutLoader.checkConfig();
            me.koHelper = new KnockoutHelper();
            PeanutLoader.loadUiHelper(() => {
                MessageManager.instance.fontSet(Peanut.ui.helper.getFontSet());
                let resources = Peanut.ui.helper.getResourceList();
                me.loadResources(resources, () => {
                    me.attachComponent('@pnut/service-messages', MessageManager.instance, function () {
                        me.loadWaitMessageTemplate('spin-waiter', function () {
                            me.loadWaitMessageTemplate('progress-waiter', function () {
                                me.loadWaitMessageTemplate('banner-waiter', function () {
                                    if (successFunction) {
                                        successFunction();
                                    }
                                })
                            })
                        });
                    });
                });
            });
        }

        public startVM = (vmName: string, final?: (viewModel: IViewModel) => void) => {
            PeanutLoader.getConfig((IPeanutConfig) => {
                this.koHelper.loadViewModel(vmName, (viewModel: IViewModel) => {
                    viewModel.start(this, () => {
                            // let sectionName = vmName.toLowerCase() + '-view-container';
                            // this.bindSection(sectionName,viewModel);
                            if (final) {
                                final(viewModel);
                            }
                        }
                    );
                });
            });
        };


        /**
         * See KnockoutHelper.loadResources
         *
         * @param names
         * @param successFunction
         */
        public loadResources = (resourceList: any, successFunction?: () => void) => {
            let names = resourceList;
            if (!(resourceList instanceof Array)) {
                resourceList = resourceList.split(',');
            }
            else {
                names = resourceList.join(',');
            }
            let listLength = resourceList.length;

            this.koHelper.loadResources(resourceList, () => {
                if (successFunction) {
                    successFunction();
                }
            });
        };

        public loadStyleSheets(resourceList: any) {
            let names = resourceList;
            if (!(resourceList instanceof Array)) {
                resourceList = resourceList.split(',');
            }
            this.koHelper.loadStyleSheets(resourceList);
        }


        /**********************************
         * Wait messages
         **********************************/

        /**
         * Load HTML markup from templates directory
         *
         * @param name
         * @param successFunction
         */
        // todo: confirm this method not used.
/*
        public getHtmlTemplate = (name: string, successFunction: (htmlSource: string) => void) => {
            this.koHelper.getHtmlTemplate(name, successFunction);
        };
*/

        /**
         * Add an HTML template to wait message
         *
         * @param templateName
         * @param successFunction
         */
        public loadWaitMessageTemplate = (templateName: string, successFunction: () => void) => {
            let ext = Peanut.Config.values.uiExtension;
            templateName = '@pnut/extensions/' + ext + '/' + templateName;
            this.koHelper.getHtmlTemplate(templateName, function (htmlSource: string) {
                if (htmlSource !== null) {
                    WaitMessage.addTemplate(templateName, htmlSource);
                }
                successFunction();
            });
        };

        // public showServiceWaiter(message: string = "Please wait . . .", onShown: () => void, waiterType='spin-waiter') {
        //     WaitMessage.show(message,waiterType);
        //     WaitMessage.on('shown.bs.modal',onShown);
        // };

        public showWaiter(message: string = "Please wait . . .",waiterType='banner-waiter') {
            if (waiterType === 'banner-waiter') {
                MessageManager.instance.showBannerMessage(message);
            }
            else {
                WaitMessage.show(message,waiterType);
            }
        }

        public hideWaitMessage() {
            if (WaitMessage) {
                WaitMessage.hide();
            }
        }

        public hideWaiter() {
            if (MessageManager.instance.waiterVisible) {
                MessageManager.instance.hideWaitMessage();
            }
        }

        public showBannerWaiter(message: string = "Please wait . . .") {
            MessageManager.instance.showBannerMessage(message);
        }

        public showProgress(message: string = "Please wait . . .") {
            WaitMessage.show(message, 'progress-waiter');
        }

        public setProgress(count: number) {
            WaitMessage.setProgress(count);
        }


        /********************************************
         * Service messages
         *********************************************/

        messageTimer : any;
        showServiceMessages(messages: IServiceMessage[]): void {
            let me = this;
            if (me.messageTimer) {
                clearInterval(me.messageTimer);
            }
            MessageManager.instance.setServiceMessages(messages);
            let intervalValue = 2500;
            for(let i= 0;i<messages.length;i++) {
                if (messages[0].MessageType != Peanut.infoMessageType) {
                    intervalValue = 15000;
                    break;
                }
            }

            me.messageTimer = window.setInterval(function () {
                MessageManager.instance.clearMessages();
                clearInterval(me.messageTimer);
            }, intervalValue);
        }

        hideServiceMessages(): void {
            let me = this;
            if (me.messageTimer) {
                clearInterval(me.messageTimer);
                me.messageTimer = null;
            }
            MessageManager.instance.clearMessages();
        }

        showError(errorMessage: string): void {
            // peanut uses this to display exceptions
            if (errorMessage) {
                MessageManager.instance.addMessage(errorMessage, errorMessageType);
            }
            else {
                MessageManager.instance.clearMessages(errorMessageType);
            }
        }

        showMessage(messageText: string): void {
            if (messageText) {
                MessageManager.instance.addMessage(messageText, infoMessageType);
            }
            else {
                MessageManager.instance.clearMessages(infoMessageType);
            }
        }

        showWarning(messageText: string): void {
            if (messageText) {
                MessageManager.instance.addMessage(messageText, warningMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.warningMessageType);
            }
        }

        // Application level message display functions
        setErrorMessage(messageText: string): void {
            if (messageText) {
                MessageManager.instance.setMessage(messageText, errorMessageType);
            }
            else {
                MessageManager.instance.clearMessages(Peanut.errorMessageType);
            }
        }

        setInfoMessage(messageText: string): void {
            if (messageText) {
                MessageManager.instance.setMessage(messageText, infoMessageType);
            }
            else {
                MessageManager.instance.clearMessages(infoMessageType);
            }
        }

        setWarningMessage(messageText: string): void {
            if (messageText) {
                MessageManager.instance.setMessage(messageText, warningMessageType);
            }
            else {
                MessageManager.instance.clearMessages(infoMessageType);
            }
        }


        /*********************************
         * Logging
         **********************************/
        public static LogMessage(message: string) {
            Peanut.logger.write(message);
        }

        /***************************************************
         * Binding for View Model and component sections
         ***************************************************/

        /**
         * KnockoutJS databinding against single element
         * Typically used for a DIV the should be bound to the main view model, but contains
         * component tags for later binding.
         *
         * @param containerName
         * @param context a viewModel
         */
        public bindNode = (containerName: string, context: any) => {
            this.koHelper.bindNode(containerName,context);
        };


        /**
         * KnockoutJS databind against a DIV or other element, including descendants.
         *
         * @param containerName
         * @param context - a view model
         */
        public bindSection = (containerName: string, context: any) => {
            this.koHelper.bindSection(containerName, context);
        };

        /**
         * Note: to apply bindings to the entire page, use
         * ko.applyBindings();
         */

        /**************************************************
         * Component handling
         *
         * Terms as used here:
         *    Component Protype: A view model type. Implemented as a TypeScript class or Javascript constructor function.
         *          TypeScript class is preferred.
         *    Component instance:  An instance of a view model.  Typically used if the instance is shared between components
         *          or if the main view model needs direct access to the component view model for initialization or communication.
         *    Template: HTML markup for the component.
         *    Load: retrieve a component prototype or template from the server.
         *    Register: load the component template then use ko.component.register to register the component.
         *    Attach:  Attach functions are typically used for standalone components that are loaded on demand.
         *      Refers to a single standalone component in a component container tag. e.g.
         *          <div my-component-container><my-component></div>
         *          To attach is to
         *            1. Load (if component prototype is used)
         *            2. Register
         *            3. Bind
         *    Component location:  A folder on the server where component view models and templates are stored.
         *          These must have at least two subdirectories: components and templates.
         *    Component name:  The identifying name of a component corresponding to files in a component location.
         *          These names are lower case with parts seperated by dashes. This is converted to camel case for the actual file names:
         *          e.g.
         *              Component name: test-form
         *              View model file:  (location)/components/testFormComponent.js
         *              Template file:  (location)/templates/testForm.html
         *          A component name contain a file prefix as described below
         *          e.g.
         *              @pnut/test-form
         *
         *    Component and file prefixes.  Prefixes beginning with an @ sign and ending with / my be prepended to a file or component name
         *          These reference the Config object for root locations.
         *          @pnut/ refers to the peanut core file location  e.g.  /pnut
         *          @app/ referes to the application file location. e.g.  /application/mvvm
         *
         *          These two are assumed to be component locations.  Other locations may be indicated:
         *          @core/  peanut core file.  Eg. /pnut/core
         *          If './' or 'http' preceeds the file name a literal path is used.
         *          Otherwise, @app/ is assumed as the defaule.
         *
         *     VM factory.  A function responsible for creating a component instance on the fly.  It must take the signature:
         *          (vmInstance : any, finalFunction: (vm: any) => void)
         *          The function must pass a newly instantiated view model to the finalFunction.
         **************************************************/

        /**
         * Register a list of component prototypes for later binding
         *
         * @param componentList  string[] or comma delimited string of component names.
         * @param finalFunction
         */
        public registerComponents = (componentList: any,finalFunction: ()=> void) => {
            let componentNames = componentList;
            if (!(componentList instanceof Array)) {
                componentList = componentList.split(',');
            }
            else {
                componentNames = componentList.join(',');
            }
            let listLength = componentList.length;
            this.koHelper.registerComponents(componentList,() => {
                Application.LogMessage('Registered ' + listLength + ' components: ' + componentNames);
                finalFunction();
            });
        };

        /**
         * load template and prototype and register.
         * Binding occurs later
         *
         * For
         *
         * Legacy: previously used LoadComponent or registerComponent where vm == null
         *
         * @param componentName
         * @param finalFunction
         */
        public registerComponentPrototype = (componentName: string, finalFunction?: () => void) => {
            this.koHelper.loadAndRegisterComponentPrototype(componentName, () => {
                Application.LogMessage('Registered component prototype: ' + componentName);
                if (finalFunction) {
                    finalFunction();
                }
            });
        };

        /**
         * Use this to load comonent view models for later instantiation/registration
         * @param componentList
         * @param finalFunction
         */
        public loadComponents = (componentList: any, finalFunction?: () => void) => {
            let componentNames = componentList;
            if (componentList instanceof Array) {
                componentNames = componentList.join(', ');
            }
            else {
                componentList = componentList.split(',');
            }

            this.koHelper.loadComponentPrototypes(componentList, () => {
                Application.LogMessage('Registered component prototypes: ' + componentNames);
                if (finalFunction) {
                    finalFunction();
                }
            });

        };

        /**
         * Register instance or load and register prototype.
         *
         * Loading of prototype where vm==null is support for backward compatibility
         * prefer registerComponentPrototype or registerComponents.
         *
         * @param componentName
         * @param vmInstance      null (for prototype) | object instance | vm factory
         * @param finalFunction
         */
        public registerComponent = (componentName: string, vmInstance: any, finalFunction?: () => void) => {
            if (vmInstance) {
                this.koHelper.registerComponentInstance(componentName,vmInstance, () => {
                    if (vmInstance !== null) {
                        Application.LogMessage('Registered instance of component: ' + componentName);
                    }
                    finalFunction();
                });
            }
            else {
                this.registerComponentPrototype(componentName,finalFunction);
            }
        };

        /**
         * Attach an instance or load and attach a prototype (see above for 'attach' definition)
         * @param componentName
         * @param vm  object instance | vm factory
         * @param finalFunction
         */
        public attachComponent = (componentName: string, vm: any, finalFunction?: () => void) => {
            if (vm) {
                this.koHelper.registerAndBindComponentInstance(componentName, vm, () => {
                    Application.LogMessage('Attached component: ' + componentName);
                    if (finalFunction) {
                        finalFunction();
                    }
                });
            }
            else {
                console.error('attachComponent: No component instance. Use ViewModelBase.attachComponent for component prototypes.')
            }
        };
    }

    export class MessageManager  {
        static instance: MessageManager = new MessageManager();
        static errorClass: string = "service-message-error";
        static infoClass: string = "service-message-information";
        static warningClass: string = "service-message-warning";

        public errorMessages = ko.observableArray([]);
        public infoMessages = ko.observableArray([]);
        public warningMessages = ko.observableArray([]);

        public fontSet = ko.observable('');

        public waiterVisible = false;


        public addMessage = (message: string, messageType: number): void => {
            switch (messageType) {
                case errorMessageType :
                    this.errorMessages.push({type: MessageManager.errorClass, text: message});
                    break;
                case warningMessageType:
                    this.warningMessages.push({type: MessageManager.warningClass, text: message});
                    break;
                default :
                    this.infoMessages.push({type: MessageManager.infoClass, text: message});
                    break;
            }
        };

        public setMessage = (message: string, messageType: number): void => {

            switch (messageType) {
                case errorMessageType :
                    this.errorMessages([{type: MessageManager.errorClass, text: message}]);
                    break;
                case warningMessageType:
                    this.warningMessages([{type: MessageManager.warningClass, text: message}]);
                    break;
                default :
                    this.infoMessages([{type: MessageManager.infoClass, text: message}]);
                    break;
            }
        };

        public clearMessages = (messageType: number = allMessagesType): void => {
            if (messageType == errorMessageType || messageType == allMessagesType) {
                this.errorMessages([]);
            }
            if (messageType == warningMessageType || messageType == allMessagesType) {
                this.warningMessages([]);
            }
            if (messageType == infoMessageType || messageType == allMessagesType) {
                this.infoMessages([]);
            }
        };

        public clearInfoMessages = (): void => {
            this.infoMessages([]);
        };

        public clearErrorMessages = (): void => {
            this.errorMessages([]);
        };
        public clearWarningMessages = (): void => {
            this.warningMessages([]);
        };

        public setServiceMessages = (messages: IServiceMessage[]): void => {
            let count = messages.length;
            let errorArray = [];
            let warningArray = [];
            let infoArray = [];
            for (let i = 0; i < count; i++) {
                let message = messages[i];
                switch (message.MessageType) {
                    case errorMessageType :
                        errorArray.push({type: MessageManager.errorClass, text: message.Text});
                        break;
                    case warningMessageType:
                        warningArray.push({type: MessageManager.warningClass, text: message.Text});
                        break;
                    default :
                        infoArray.push({type: MessageManager.infoClass, text: message.Text});
                        break;
                }
            }
            this.errorMessages(errorArray);
            this.warningMessages(warningArray);
            this.infoMessages(infoArray);
        };

        public showBannerMessage(message? : string) {
            let me = this;
            let container = jQuery('#waiter-message');
            let span = container.find('#peanut-toast-message');
            span.text(message || '');
            container.show();
            me.waiterVisible = true;
        }

        public hideWaitMessage() {
            let me = this;
            jQuery('#waiter-message').hide();
            me.waiterVisible = false;
        }
    }


} // end namespace
