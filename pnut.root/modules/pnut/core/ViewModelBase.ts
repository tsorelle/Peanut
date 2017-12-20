/**
 * Created by Terry on 5/20/2017.
 */
///<reference path="Services.ts"/>
///<reference path="Peanut.d.ts"/>
///<reference path="../../typings/jquery/jquery.d.ts"/>
namespace Peanut {
    export abstract class ViewModelBase implements IViewModel, ITranslator{
        protected services: ServiceBroker;
        protected application: IPeanutClient;
        protected translations: string[] = [];

        abstract init(successFunction?: () => void);
        public start = (application : IPeanutClient, successFunction?: (viewModel: IViewModel) => void)  => {
            let me = this;
            me.language = me.getUserLanguage();
            me.addTranslations(Cookies.GetKvArray('peanutTranslations'));
            me.application = application;
            me.services = ServiceBroker.getInstance(application);
            me.application.registerComponents('@pnut/translate', () => {
                me.init(() => {
                    successFunction(me);
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
            let sectionName = this.getSectionName();
            jQuery("#" + sectionName).show();
        };

        /**
         *  Bind and display the default section
         */
        protected bindDefaultSection = () => {
            let sectionName = this.getSectionName();
            this.application.bindSection(sectionName,this);
        };

        protected attachComponent = (componentName: string, section?: string) => {
            this.application.registerComponentPrototype(componentName,() => {
                if (!section) {
                    section =  componentName.split('/').pop() + '-container';
                }
                this.application.bindSection(section,this)
            });
        };

        public showLoadWaiter =() => {
            let me = this;
            let message = me.translate('wait-action-loading')+ ', ' + me.translate('wait-please')+'...';
            me.application.showBannerWaiter(message)
        };

        // Assemble typical message like 'Updating mailbox, please wait...'
        protected getActionMessage = (action: string, entity: string) => {
            return this.translate('wait-action-'+action) + ' ' + this.translate(entity) + ', ' + this.translate('wait-please')+'...';
        };

        public showActionWaiter = (action: string, entity: string,waiter: string = 'spin-waiter') => {
            let message = this.getActionMessage(action,entity);
            Peanut.WaitMessage.show(message,waiter);
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
