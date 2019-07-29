/**
 * Created by Terry on 7/4/2017.
 */
/****
 * Created by Terry on 5/3/2017.
 */
/// <reference path="../../typings/custom/head.load.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path='Peanut.d.ts' />
namespace Peanut {
// todo: test changes made for C5
    const peanutVersionNumber = '0.2';
    const configPath =  '/peanut/settings';

    export class Config {
        static loaded: boolean = false;
        static values: IPeanutConfig = <IPeanutConfig>{};

    }

    export class logger {
        static getLoggingLevel(mode: any) {
            switch (mode) {
                case 'verbose' :
                    return 1;
                case 'info' :
                    return 2;
                case 'warnings' :
                    return 3;
                case 'errors' :
                    return 4;
                case 'fatal' :
                    return 5;
                default :
                    let n = Number(mode);
                    if (n>0 && n < 6) {
                        return n;
                    }
                    console.error('Invalid logging mode: ' + mode);
                    return 1;
            }
        }

        static write(message: string, mode: any = 5) {
            if ( mode===true || Peanut.Config.values.loggingMode === 1 ||  Peanut.Config.values.loggingMode >= Peanut.logger.getLoggingLevel(mode)) {
                console.log(message);
            }
        }
    }


    export class ui {
        static helper: IUiHelper;
    }


    export class PeanutLoader {
        private static loaded = [];
        private static application : IPeanutClient;

        public static startApplication(name: string, final: (result: any) => void = null) {
            if (PeanutLoader.application) {
                PeanutLoader.application.startVM(name, final);
            }
            else {
                PeanutLoader.getConfig((config: IPeanutConfig) => {
                    PeanutLoader.load(config.dependencies, () => {
                        if (PeanutLoader.application == null) {
                            PeanutLoader.application = new window['Peanut']['Application'];
                            PeanutLoader.application.initialize(() => {
                                PeanutLoader.application.startVM(name, final);
                            });
                        }
                        else {
                            PeanutLoader.application.startVM(name, final);
                        }
                    });
                });
            }
        }

        public static loadViewModel(name: string, final: (result: any) => void = null) {
            if (PeanutLoader.application) {
                PeanutLoader.application.startVM(name, final);
            }
            else {
                console.error('Application was not initialized');
            }
        }


        public static loadUiHelper(final: () => void) {
            if (Peanut.ui.helper) {
                final();
                return;
            }
            let uiExtension = Peanut.Config.values.uiExtension;
            let uiClass = uiExtension + 'UiHelper';
            PeanutLoader.loadExtensionClass(uiExtension, uiClass, (helperInstance : any) => {
                Peanut.ui.helper = <IUiHelper>helperInstance;
                final();
            });
        }

        public static load (scripts: any, final: () => void)  {
            if (!scripts) {
                final();
                return;
            }
            if (!(scripts instanceof Array)) {
                scripts = (<string>scripts).split(',');
            }
            switch (scripts.length) {
                case 0 :
                    final();
                    return;
                case 1 :
                    PeanutLoader.getConfig(() => {
                        PeanutLoader.loadScript(scripts[0], final);
                    });
                    return;
                default:
                    PeanutLoader.getConfig(() => {
                        PeanutLoader.loadScripts(scripts, final);
                    });
                    return;
            }
        };

        public static checkConfig() {
            if (!Peanut.Config.loaded) {
                throw "Config was not loaded. Call PeanutLoader.getConfig in startup.";
            }
        }

        public static getConfig(final: (config?: IPeanutConfig) => void) {
            if (Peanut.Config.loaded) {
                final(Peanut.Config.values);
            }
            else {
                jQuery.getJSON(configPath, function (data: IPeanutConfig) {
                    Peanut.Config.values.loggingMode =  Peanut.logger.getLoggingLevel(data.loggingMode);
                    Peanut.logger.write("retrieved config");
                    Peanut.Config.loaded = true;
                    Peanut.Config.values.applicationVersionNumber = peanutVersionNumber +'.' + data.applicationVersionNumber;
                    Peanut.Config.values.commonRootPath = data.commonRootPath;
                    Peanut.Config.values.peanutRootPath = data.peanutRootPath;
                    Peanut.Config.values.packagePath = data.packagePath;
                    Peanut.Config.values.mvvmPath = data.mvvmPath;
                    Peanut.Config.values.corePath = data.corePath;
                    Peanut.Config.values.serviceUrl = data.serviceUrl;
                    Peanut.Config.values.dependencies = data.dependencies;
                    Peanut.Config.values.vmNamespace = data.vmNamespace;
                    Peanut.Config.values.uiExtension = data.uiExtension;
                    Peanut.Config.values.libraries = data.libraries;
                    Peanut.Config.values.applicationPath = data.applicationPath;
                    Peanut.Config.values.libraryPath = data.libraryPath;
                    Peanut.Config.values.stylesPath = data.stylesPath;
                    Peanut.Config.values.cssOverrides = data.cssOverrides;
                    Peanut.logger.write('Namespace ' + Peanut.Config.values.vmNamespace);
                    final(Peanut.Config.values);
                });
            }
        }

        public static loadScript(script: string, final: () => void) {
            if (!Peanut.Config.loaded) {
                throw "Peanut Config was not loaded.";
            }
            let filetype = script.split('.').pop().toLowerCase();
            if (PeanutLoader.loaded.indexOf(script) == -1) {
                head.load(script + '?v=' + Peanut.Config.values.applicationVersionNumber,() => {
                    Peanut.logger.write("Loaded " + script);
                    PeanutLoader.loaded.push(script);
                    final();

                });
            }
            else {
                Peanut.logger.write("Skipped " + script);
                final();
            }
        }

        public static loadScripts(scripts: string[], final: () => void) {
            if (!Peanut.Config.loaded) {
                throw "Peanut Config was not loaded.";
            }
            let len = scripts.length;
            let items = [];

            for(let i=0; i< len; i++ ) {
                let script = scripts[i];
                if (PeanutLoader.loaded.indexOf(script) == -1) {
                    if (script.split('.').pop().toLowerCase() == 'js') {
                        PeanutLoader.loaded.push(script);
                        Peanut.logger.write("Loaded " + script);
                        script +=  '?v=' + Peanut.Config.values.applicationVersionNumber;
                    }
                    items.unshift(script);
                }
            }
            head.load(items,final);
        };

        public static loadExtensionClass(extension, className, final: (extInstance : any) => void) {
            let scriptName = Config.values.peanutRootPath + 'extensions/' + extension + '/classes/' + className + '.js';
            PeanutLoader.loadScript(scriptName, () => {
                let p = window['Peanut'];
                // let i = p['BootstrapUIHelper'];
                let i = p[className];
                let inst = window['Peanut'][className];
                let extInstance = new window['Peanut'][className];
                final(extInstance);
            } )
        }

        public  static loadHtml(htmlSource: string, successFunction : (htmlSource: string) => void) {
            PeanutLoader.checkConfig();
            jQuery.get(htmlSource + "?v="+ Peanut.Config.values.applicationVersionNumber, successFunction);
        }

    }


} // end namespace