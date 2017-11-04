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

        protected getRequestVar = (key : string, defaultValue : any = null) => {
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
        protected addTranslations = (translations : string[]) => {
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
        public getVmInstance = () => {
            return this;
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
