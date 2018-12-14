/**
 * Created by Terry on 5/20/2017.
 */
///<reference path="Services.ts"/>
///<reference path="Peanut.d.ts"/>
///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/knockout/knockout.d.ts"/>
///<reference path="WaitMessage.ts"/>
namespace Peanut {
    export class Environment {
        public static getDeviceSize() {
            let width = window.screen.width;
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
        }

    }
    export abstract class ViewModelBase implements IViewModel, ITranslator{
        protected services: ServiceBroker;
        protected application: IPeanutClient;
        protected translations: string[] = [];
        public bootstrapVersion = ko.observable(3);
        public fontSet = ko.observable('');

        public deviceSize = ko.observable(4);

        abstract init(successFunction?: () => void);
        public start = (application : IPeanutClient, successFunction?: (viewModel: IViewModel) => void)  => {
            let me = this;

            me.language = me.getUserLanguage();
            me.deviceSize(Environment.getDeviceSize());
            me.addTranslations(Cookies.GetKvArray('peanutTranslations'));
            me.application = application;
            me.services = ServiceBroker.getInstance(application);
            PeanutLoader.loadUiHelper(() => {
                if (Peanut.ui.helper.getFramework() === 'Bootstrap') {
                    me.bootstrapVersion(Peanut.ui.helper.getVersion());
                    me.fontSet(Peanut.ui.helper.getFontSet());
                }
                me.fontSet(Peanut.ui.helper.getFontSet());
                me.application.registerComponents('@pnut/translate', () => {
                    me.init(() => {
                        successFunction(me);
                    });
                });
            });
        };

        private vmName : string = null;
        private language : string = 'en-us';
        public setVmName = (name: string) => {
            this.vmName = name;
        };


        protected getVmName = () => {
            return this.vmName;
        };

        /**
         * Get element id for the default containing DIV,  e.g.  TestPageViewModel => testpage-view-container
         * @returns {string}
         */
        protected getSectionName = () => {
            return this.getVmName().toLowerCase() + '-view-container';
        };

        /**
         *  Show the default section (see getSectionName())
         *  Use this when the view only contains components.
         */
        protected showDefaultSection = () => {
            let me = this;
            let sectionName = me.getSectionName();
            jQuery("#" + sectionName).show();
            me.hideLoadMessage();
        };


        public hideLoadMessage = () => {
            let loadMessage = '#' + this.getVmName().toLowerCase() + '-load-message';
            jQuery(loadMessage).hide();
        };

        /**
         *  Bind and display the default section
         */
        protected bindDefaultSection = () => {
            let me = this;
            let sectionName = me.getSectionName();
            me.hideLoadMessage();
            this.application.bindSection(sectionName,this);
        };

        protected attach = (componentName: string, finalFunction? : () => void) => {
            this.attachComponent(componentName,null,finalFunction);
        };

        protected attachComponent = (componentName: string, section?: string, finalFunction? : () => void) => {
            this.application.registerComponentPrototype(componentName,() => {
                if (!section) {
                    section =  componentName.split('/').pop() + '-container';
                }
                this.application.bindSection(section,this);
                if (finalFunction) {
                    finalFunction();
                }
            });
        };

        public changeCase(text: string, textCase) {
            switch (textCase) {
                case 'ucfirst' :
                    let textLength = text.length;
                    text = text.substr(0, 1).toLocaleUpperCase() +
                        (textLength > 1 ? text.substr(1,textLength) : '');
                    break;
                case 'upper' :
                    text = text.toLocaleUpperCase();
                    break;
                case 'lower' :
                    text = text.toLocaleLowerCase();
                    break;
            }
            return text;
        }

        public setPageHeading = (text: string, textCase: string = 'none') => {
            if (text) {
            text = this.translate(text);
                text = this.changeCase(text, textCase);
            jQuery('h1:first').html(text);
            jQuery('h1:first').show();
                if (this.pageTitle === null) {
                    this.setPageTitle(text);
                }
            }
        };

        private pageTitle = null;
        public setPageTitle = (text: string, textCase: string = 'none') => {
            text = this.translate(text);
            text = this.changeCase(text,textCase);
            this.pageTitle = text;
            document.title = text;
        };

        public showLoadWaiter =(message = 'wait-action-loading') => {
            let me = this;
            message = me.translate('wait-action-loading')+ ', ' + me.translate('wait-please')+'...';
            me.application.showBannerWaiter(message)
        };

        // Assemble typical message like 'Updating mailbox, please wait...'
        protected getActionMessage = (action: string, entity: string) => {
            return this.translate('wait-action-'+action) + ' ' + this.translate(entity) + ', ' + this.translate('wait-please')+'...';
        };

        public showActionWaiter = (action: string, entity: string,waiter: string = 'banner-waiter') => {
            let message = this.getActionMessage(action,entity);
            if (waiter == 'banner-waiter') {
                this.application.showBannerWaiter(message);
            }
            else {
                Peanut.WaitMessage.show(message,waiter);
            }
        };

        public showActionWaiterBanner = (action: string, entity: string) => {
            this.showActionWaiter(action,entity,'banner-waiter');
        };

        public getRequestVar = (key : string, defaultValue : any = null) => {
            return HttpRequestVars.Get(key,defaultValue);
        };

        public translate = (code:string, defaultText:string = null) => {
            let me = this;
            if (code in me.translations) {
                return me.translations[code];
            }
            return defaultText === null ? code : defaultText;
        };

        protected addTranslation = (code: string, text: string)  => {
            let me = this;
            me.translations[code] = text;
        };
        public addTranslations = (translations : string[]) => {
            let me = this;
            if (translations) {
                for (let code in translations) {
                    me.translations[code] = translations[code];
                }
            }
        };

        public setLanguage = (code) => {
            let me = this;
            me.language = code;
        };

        public getLanguage = () =>  {
            let me = this;
            return me.language;
        };

        public getUserLanguage(){
            let userLang = navigator.language || (<any>navigator).userLanguage;
            if (userLang) {
                return userLang.toLowerCase();
            }
            return 'en-us';
        }

        public getTodayString = (language :string = null) => {
            if (!language) {
                language = this.getLanguage();
            }
            let format = language.split('-').pop();
            let today = new Date();
            let dd : any = today.getDate();
            let mm : any = today.getMonth()+1; //January is 0!

            let yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            }
            if(mm<10){
                mm='0'+mm;
            }
            return format === 'us' ?  mm+'/'+dd+'/'+yyyy : yyyy+ '-' + mm +'-' + dd;
        };

        public isoToShortDate = (dateString: string, language : string = null) => {
            if (!dateString) {
                return '';
            }
            if (!language) {
                language = this.getLanguage();
            }
            dateString = dateString.split(' ').shift().trim();
            let format = language.split('-').pop();
            if (!dateString) {
                return '';
            }
            if (format !== 'us') {
                console.log('Warning: Simple date formatting for ' + format + 'is not supported. Using ISO.');
                return dateString;
            }
            let parts = dateString.split('-');
            if (parts.length !== 3) {
                console.error('Invalid ISO date string: ' + dateString);
                return 'error';
            }
            return parts[1] + '/' + parts[2] + '/' + parts[0];
        };

        public shortDateToIso(dateString) {
            if (!dateString) {
                return '';
            }
            let parts = dateString.split('/');
            if (parts.length !== 3) {
                return dateString; // not US short format, return input
            }
            let m = parts[0];
            let d = parts[1];
            let y = parts[2];
            return y + '-' +
                (m.length < 2 ? '0' + m.toString() : m) + '-' +
                (d.length < 2 ? '0' + d.toString() : d);
        }

        // for use by components that must reference main view model.
        public self = () => {
            return this;
        };

        protected getDefaultLoadMessage() {
            let me = this;
            return me.translate('wait-loading','...');
        }

        public  getApplication = () => {
            return this.application;
        };
        public  getServices = () => {
            return this.services;
        };

        public handleEvent(eventName: string, data?: any) {
            // override in sub-class
        }

        public hideServiceMessages = () => {
            this.application.hideServiceMessages();
        }

    }

    export class Cookies {
        public static cleanCookieString(encodedString) {
            let output = encodedString;
            let binVal, thisString;
            let myregexp = /(%[^%]{2})/;
            let match = [];
            while ((match = myregexp.exec(output)) != null
            && match.length > 1
            && match[1] != '') {
                binVal = parseInt(match[1].substr(1),16);
                thisString = String.fromCharCode(binVal);
                output = output.replace(match[1], thisString);
            }
            return output;
        }

        public static kvObjectsToArray(kvArray: IKeyValuePair[]) {
            let result = [];
            for (let i=0;i<kvArray.length;i++) {
                let obj = kvArray[i];
                let value = obj.Value.split('+').join(' ');
                result[obj.Key] = value.replace('[plus]','+');
            }
            return result;
        }

        public static kvCookieToArray(cookieString: string) {
            let a = Cookies.cleanCookieString(cookieString);
            let j = JSON.parse(a);
            return Cookies.kvObjectsToArray(j);
        }

        public static Get(cookieName: string,index = 1) {
            let cookie = document.cookie;
            if (cookie) {
                let match = cookie.match(new RegExp(cookieName + '=([^;]+)'));
                if (match && match.length > index) {
                    return match[index];
                }
            }
            return '';
        }

        public static GetKvArray(cookieName: string, index = 1) {
            let cookieString = Cookies.Get(cookieName,index);
            if (cookieString) {
                return Cookies.kvCookieToArray(cookieString);
            }
            return [];
        }
    }

    export class HttpRequestVars {
        private static instance : HttpRequestVars;
        private requestvars = [];

        constructor() {
            let me = this;
            // let href = window.location.href;
            let queryString = window.location.search;
            let params = queryString.slice(queryString.indexOf('?') + 1).split('&');
            for (let i = 0; i < params.length;i++) {
                let parts = params[i].split('=');
                let key = parts[0];
                me.requestvars.push(key);
                me.requestvars[key] = parts[1];
            }
        }

        public getValue(key: string) {
            let me = this;
            let value = me.requestvars[key];
            if (value) {
                return value;
            }
            return null;
        }

        public static Get(key : string, defaultValue : any = null) {
            if (!HttpRequestVars.instance) {
                HttpRequestVars.instance = new HttpRequestVars();
            }
            let result = HttpRequestVars.instance.getValue(key);
            return (result === null) ? defaultValue : result;
        }

    }

} // end namespace
