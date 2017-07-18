declare namespace Peanut {
    export interface IPeanutClient {
        startVM(vmName: string, final?: (viewModel: IViewModel) => void);
        showServiceMessages(messages:IServiceMessage[]): void;
        initialize(successFunction?:() => void);
        hideServiceMessages(): void;
        showError(errorMessage?:string): void;
        showMessage(messageText?:string): void;
        showWarning(messageText?:string): void;
        showWaiter(message?:string) : void;
        hideWaiter() : void;
        showProgress(message?: string) : void;
        setProgress(count: number) : void;
        loadResources(resourceList: any, successFunction?: () => void);
        loadComponents(componentList: any, finalFunction?: () => void);
        registerComponents(componentList: any,finalFunction: ()=> void);
        registerComponentPrototype(componentName: string, finalFunction?: () => void);
        registerComponent(componentName: string, vmInstance: any, finalFunction?: () => void);
        attachComponent(componentName: string, vm: any, finalFunction?: () => void);
        bindSection(containerName: string, context: any);
        bindNode(containerName: string, context: any);
    }
    /*******
     * Previously used IPeanutClient members:
     * -----------------------------------------
     * loadComponent(componentName: string, successFunction?: () => void);
     *    use registerComponents, registerComponentPrototype or registerComponent(name,null,finalFunction)
     * loadComponentInstance(name: string, getVmInstance : () => any, finalFunction?: () => void);
     *     use registerComponent
     * bindComponent(name: string, vm: any, finalFunction?: () => void);
     *      use attachComponent attachComponentPrototype
     * bindComponentInstance(name: string, vm: any, successFunction?: () => void);
     *      use attachComponent
     */

    export interface IFileParseResult {
        root: string;
        name: string;
        namespace?: string;
    }

    export interface IComponentParseResult {
        root: string;
        templateFile: string;
        className: string;
        componentName: string;
        namespace?: string;
    }

    export interface IComponentPackage {
        path: IComponentParseResult;
        vm? : any;
    }

    export interface IComponentRegisterResult
    {
        vmInstance: any;
        componentName: string;
    }

    export interface  IUiHelper {
        showMessage(message: string, id: string,  container : any);
        hideMessage(container : any);
        showModal(container : any);
        hideModal(container: any);
    }

    export interface IPeanutConfig {
        applicationVersionNumber: string;
        commonRootPath :          string;
        peanutRootPath :          string;
        packagePath :          string;
        mvvmPath :             string;
        corePath :                string;
        modulePath:             string;
        serviceUrl:               string;
        dependencies:             string;
        vmNamespace:        string;
        loggingMode:    string;
        uiExtension : string;
    }

    export interface IServiceMessage {
        MessageType: number;
        Text: string;
    }

    export interface IServiceResponse {
        Messages: IServiceMessage[];
        Result: number;
        Value: any;
        Data: any;
    }

    export interface INameValuePair {
        Name: string;
        Value: any;
    }

    export interface IKeyValuePair {
        Key: any;
        Value: any;
    }

    export interface ILookupItem {
        Key: any;
        Text: string;
        Description: string;
    }

    export interface IListItem {
        Text: string;
        Value: any;
        Description: string;
    }

    export interface IIndexedItem extends IListItem {
        Key: any;
    }

    export interface IInputItem extends IListItem {
        Value: any;
        ErrorMessage: string;
    }

    export interface IIndexedInput extends IInputItem {
        Key: any;
    }

    export interface IEventSubscriber {
        handleEvent : (eventName: string, data?: any) => void;
    }

    export interface ParameterlessConstructor<T> {
        new(): T;
    }

    export interface IViewModel {

        init(successFunction?: () => void);
        setVmName(name: string);
        start(application : IPeanutClient, successFunction?: (viewModel: any) => void);
    }

}