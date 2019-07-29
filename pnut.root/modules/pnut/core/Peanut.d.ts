declare namespace Peanut {
    export interface IServiceClient {
        showServiceMessages(messages:IServiceMessage[]): void;
        hideServiceMessages(): void;
        showError(errorMessage?:string): void;
    }

    export interface IPeanutClient extends IServiceClient{
        startVM(vmName: string, final?: (viewModel: IViewModel) => void);
        initialize(successFunction?:() => void);
        showMessage(messageText?:string): void;
        showWarning(messageText?:string): void;
        showWaiter(message?:string,waiterType?:string) : void;
        hideWaiter() : void;
        showBannerWaiter(message?:string) : void;
        showProgress(message?: string) : void;
        setProgress(count: number) : void;
        loadResources(resourceList: any, successFunction?: () => void);
        loadComponents(componentList: any, finalFunction?: () => void);
        loadStyleSheets(resourceList: any) : void;
        registerComponents(componentList: any,finalFunction: ()=> void);
        registerComponentPrototype(componentName: string, finalFunction?: () => void);
        registerComponent(componentName: string, vmInstance: any, finalFunction?: () => void);
        attachComponent(componentName: string, vm: any, finalFunction?: () => void);
        bindSection(containerName: string, context: any);
        bindNode(containerName: string, context: any);
    }

    export interface errorInformation {
        message: string;
        details : string;
    }

    export interface IUserDetails {
        fullname: string;
        username: string;
        email: string;
        accountId: any;
        isAuthenticated: boolean;
        isAdmin: boolean;
    }

    /*******
     * Previously used IPeanutClient members:
     * -----------------------------------------
     * loadComponent(componentName: string, successFunction?: () => void);
     *    use registerComponents, registerComponentPrototype or registerComponent(name,null,finalFunction)
     * loadComponentInstance(name: string, self : () => any, finalFunction?: () => void);
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
        getResourceList() : string[];
        getFramework(): string;
        getVersion(): number;
        getFontSet(): string;
    }

    export interface IPeanutConfig {
        applicationVersionNumber: string;
        commonRootPath :          string;
        peanutRootPath :          string;
        packagePath :          string;
        mvvmPath :             string;
        corePath :                string;
        modulePath:             string;
        applicationPath:    string;
        libraryPath:    string;
        stylesPath:    string;
        serviceUrl:               string;
        dependencies:             string;
        vmNamespace:        string;
        loggingMode:    any;
        uiExtension : string;
        libraries : string[];
        cssOverrides : string[];
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

    export interface ISelectListItem extends INameValuePair {
        Description: string;
    }

    export interface IKeyValuePair {
        Key: any;
        Value: any;
    }

    export interface ILookupItem {
        id : any;
        code: string;
        name: string;
        description : string;

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

    export interface ITranslator {
        translate(code:string, defaultText?:string);
        setLanguage(code: string);
        getLanguage();
        getUserLanguage()
    }
    export interface IViewModel {
        init(successFunction?: () => void);
        setVmName(name: string, context?: any);
        start(application : IPeanutClient, successFunction?: (viewModel: any) => void);
    }

    export interface IEditPanel {
        viewState: KnockoutObservable<string>;
        hasErrors : KnockoutObservable<boolean>;
        isAssigned : KnockoutObservable<boolean>;
        relationId : KnockoutObservable<any>;

        edit(relationId?: any);
        close();
        search();
        empty();
        view();
        setViewState(state);
        clear() : any;
        validate(): boolean;
        clearValidations();
        search()
    }

    export interface IEntityObject {
        id   :any;
        active: any;
    }

    export interface ITimeStamp {
        createdby : string;
        createdon : string;
        changedby : string;
        changedon : string;
    }

    export interface INamedEntity extends IEntityObject {
        name        : string;
        code        : string;
        description : string;
    }

    export interface IPropertyDefinition {
        key: string;
        defaultValue: any;
        lookup : string;
        label: string;
        required: boolean;
    }

    export interface IPropertyControl {
        key: string;
        selected: KnockoutObservable<any>;
        lookup: KnockoutObservableArray<ILookupItem>;
        caption: string;
        label: string;
        displayText: string;
    }

}