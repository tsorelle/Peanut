/**
 * Created by Terry on 5/4/2017.
 */
/// <reference path="PeanutLoader.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />

namespace Peanut {

    export class KnockoutHelper {

        private toCamelCase(name: string,seperator = '-', casingType = 'pascal') {
            let names = name.split(seperator);
            let result = (casingType == 'camel') ?  names.shift() : '';
            for(let part of names) {
                let initial = part.substr(0,1);
                initial = initial.toUpperCase();
                let remainder = part.substr(1);
                result = result + initial + remainder;
            }
            return result;
        }

        /**
         * Returns IFileParseResult  (see peanut.d.ts)
         * uses prefixes @pnut, @code, @app, replaced by values from Peanut.Config
        *
         * @param name
         * @param defaultPath
         * @returns {{root: string, name: string, namespace: string}}
         */
        public  parseFileName(name: string, defaultPath: string = null) {
            defaultPath = defaultPath || Peanut.Config.values.commonRootPath;


            let result = {root: '', name: '', namespace: 'Peanut'};
            let parts = name.split('/');
            let len = parts.length;
            if (len == 1) {
                result.root = defaultPath;
                result.name = name;
            }
            else {
                if (parts[0] == '') {
                    // assume hard coded path if name starts with '/'
                    result.name = parts.pop();
                    result.root = parts.join('/') + '/';
                }
                else {
                    let pathRoot = defaultPath;
                    switch (parts[0]) {
                        case '@pnut' :
                            pathRoot = Peanut.Config.values.peanutRootPath;
                            parts.shift();
                            break;
                        case '@core' :
                            pathRoot = Peanut.Config.values.corePath;
                            parts.shift();
                            break;
                        case '@app'  :
                            result.namespace = Peanut.Config.values.vmNamespace;
                            pathRoot = Peanut.Config.values.mvvmPath;
                            parts.shift();
                            break;
                        case  '@pkg' :
                            parts.shift();
                            let subDir = parts.shift();
                            result.namespace = this.toCamelCase(subDir);
                            pathRoot = Peanut.Config.values.packagePath + subDir + '/';
                            break;
                        default:
                            pathRoot = defaultPath;
                            break;
                    }


                    result.name = parts.pop();
                    result.root = parts.length == 0 ? pathRoot : pathRoot + parts.join('/') + '/';
                }
            }
            return result;
        }

        /**
         * Used by parseComponentName
         * @param componentName
         * @returns {string}
         */
        private  nameToFileName(componentName: string) {
            let parts = componentName.split('-');
            let fileName = parts[0];
            if (parts.length > 1) {
                fileName += parts[1].charAt(0).toUpperCase() + parts[1].substring(1);
            }
            return fileName;
        }


        /**
         * Returns essentioal information used by other component routines bases on component name and prefixes
         * such as @pnut/ (see parseFileName)
         * Returns IComponentParseResult (see peanut.d.ts)
         *
         * @param componentName
         * @returns {{root: string, className: string, templateFile: string, componentName: string, namespace: string}}
         */
        private parseComponentName(componentName: string) {
            let me = this;
            if (!Peanut.Config.loaded) {
                throw "Peanut Config was not loaded.";
            }

            if (componentName.substr(0,1) !== '@') {
                componentName = '@app/' + componentName;
            }

            let parsed = me.parseFileName(componentName, Peanut.Config.values.mvvmPath);
            let fileName = me.nameToFileName(parsed.name);
            return {
                root: parsed.root,
                className: fileName+'Component',
                templateFile: fileName+'.html',
                componentName: parsed.name,
                namespace: parsed.namespace
            };
        }


        /**
         * Used by loadResources
         * @param fileName
         * @param defaultPath
         * @returns {any}
         */
        private expandFileName(fileName: string, defaultPath = null ) {
            if (!fileName) {
                return '';
            }
            if (fileName.substr(0,1) === '/' || fileName.toLowerCase().substr(0,4) === 'http') {
                return fileName;
            }
            let me = this;
            let parsed = me.parseFileName(fileName,defaultPath);

            let fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));
            if (fileExtension) {
                switch (fileExtension.toLowerCase()) {
                    case 'css' :
                        return parsed.root + 'css/' + parsed.name;
                    case 'js' :
                        return parsed.root + 'components/' + parsed.name;
                }
            }
            return fileName;
        }

        /**
         * Load scripts and css files located under application or core direcories. Use @pnut/ to indicate core.
         * Usually called on init to pre-load component scripts for instance registered components.
         *
         * @param names
         * @param successFunction
         */
        public loadResources(resourceList: string[], successFunction?: () => void) {
            let me = this;
            PeanutLoader.checkConfig();
            PeanutLoader.getConfig((config: IPeanutConfig) => {
                let params = [];
                for (let i = 0; i < resourceList.length; i++) {
                    let path = me.expandFileName(resourceList[i],config.mvvmPath);
                    params.push(path);
                }
                PeanutLoader.load(params, successFunction);
            });
        }


        public loadViewModel = (vmName : string, final : (viewModel: IViewModel) => void) => {
            PeanutLoader.checkConfig();
            let me = this;
            let parts = vmName.split('/');
            let prefix = '@app';
            if (vmName.substr(0,1) === '@') {
                prefix = parts.shift();
            }
            vmName = parts.pop();
            let vmClassName = vmName + 'ViewModel';
            let vmFile = prefix + '/' + parts.join('/') + '/vm/' + vmClassName;
            let parseResult = <IFileParseResult>(this.parseFileName(vmFile, Peanut.Config.values.mvvmPath));
            let vmPath = parseResult.root + parseResult.name + '.js';
            let namespace = parseResult.namespace;
            PeanutLoader.loadScript(vmPath,() => {
                if (Peanut.Config.values.loggingMode == 'verbose') {
                    console.log("Loading " + namespace + '.' + vmClassName);
                }
                let vm = <IViewModel>(new window[namespace][vmClassName]);
                vm.setVmName(vmName);
                final(vm);
            });
        };

        /**
         * Used for html templates that are not necessarily associated with a component
         * For component templates, use loadComponentTemplate()
         *
         * @param name
         * @param successFunction
         */
        public  getHtmlTemplate(name: string, successFunction: (htmlSource: string) => void) {
            let me = this;
            PeanutLoader.checkConfig();
            let parsed = me.parseFileName(name, Peanut.Config.values.mvvmPath);
            let parts = parsed.name.split('-');
            let fileName = parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].substring(1);
            let htmlSource = parsed.root + 'templates/' + fileName + '.html';
            PeanutLoader.loadHtml(htmlSource, successFunction);
        }

        public getComponentPrototype = (componentPath: IComponentParseResult) => {
            if ((window[componentPath.namespace]) && (window[componentPath.namespace][componentPath.className])) {
                return window[componentPath.namespace][componentPath.className];
            }
            return null;
        };

        // load component template, register to component name and vm instance
        private  loadComponentTemplate = (componentPath : IComponentParseResult, finalFunction : (template: any) => void ) => {
            let me = this;
            PeanutLoader.getConfig((config: IPeanutConfig) => {
                let htmlPath = componentPath.root + 'templates/' + componentPath.templateFile;
                jQuery.get(htmlPath, function (template: string) {
                    if (finalFunction) {
                        finalFunction(template);
                    }
                });
            });
        };

        private loadComponentPrototype = (componentPath: IComponentParseResult, finalFunction : (vm: any)=> void) => {
            if (window[componentPath.namespace] && window[componentPath.namespace][componentPath.className]) {
                finalFunction(window[componentPath.namespace][componentPath.className]);
            }
            else {
                let me = this;
                let src = componentPath.root +'components/' + componentPath.className + '.js';
                PeanutLoader.load(src, function () {
                    let vm = window[componentPath.namespace][componentPath.className];
                    if (finalFunction) {
                        finalFunction(vm);
                    }
                });
            }
        };

        /**
         * Load and register component prototype
         *
         * @param componentName
         * @param finalFunction
         */
        public loadAndRegisterComponentPrototype = (componentName: string, finalFunction? : (componentPath: IComponentParseResult) => void) => {
            let componentPath = this.parseComponentName(componentName);
            this.loadComponentTemplate(componentPath, (template: any) => {
                this.loadComponentPrototype(componentPath,(vm: any) => {
                    ko.components.register(componentPath.componentName, {
                        viewModel : vm,
                        template: template
                    });
                    if (finalFunction) {
                        finalFunction(componentPath);
                    }
                })
            })
        };

        /**
         * Register component prototype
         * Assumes component previously loaded
         *
         * @param componentName
         * @param finalFunction
         */
        public registerComponentPrototype = (componentName: string, finalFunction? : (componentPath: IComponentParseResult) => void) => {
            let componentPath = this.parseComponentName(componentName);
            this.loadComponentTemplate(componentPath, (template: any) => {
                let vm = this.getComponentPrototype(componentPath);
                ko.components.register(componentPath.componentName, {
                    viewModel : vm,
                    template: template
                });
                if (finalFunction) {
                    finalFunction(componentPath);
                }
            })
        };

        /**
         * Called from registerComponentInstance
         * vmObject can be a view model instance, or a vm factory function.
         * If an instance, it is passed directly back to the callback function, returnFunction
         * otherwise the factory function creates the instance and passes it to the callback function.
         *
         * A callback funtion is used here because the factory function might need to do some asynchronous operation
         * such as load a script. In such cases it cannot return the instance directly.
         *
         * Example useage of vm factory:
         *
         * this.application.attachComponent(
         *     'test-form',  // component name
         *
         *     // vm factory function
         *     (returnFuncton: (vm: any) => void) => {
         *         this.application.loadResources('testFormComponent.js', () => {
         *             me.testForm = new Bookstore.testFormComponent();
         *             me.testForm.setMessage('Watch this space.');
         *             returnFuncton(me.testForm);
         *         });
         *     }
         * );
         *
         * @param componentPath
         * @param vmObject
         * @param returnFunction
         */
        private getViewModelInstance(componentPath: IComponentParseResult, vmObject : any, returnFunction : (vm: any) => void) {
            // if vm factory function, call it
            if (vmObject instanceof Function)  {
                vmObject(returnFunction);
            }
            // if instance, return it
            else {
                returnFunction(vmObject);
            }
        }


        public registerComponentInstance = (componentName: string, vmInstance: any,
                                            finalFunction? : (componentPath: IComponentParseResult,vm? : any) => void) => {
            let componentPath = this.parseComponentName(componentName);
            this.loadComponentTemplate(componentPath, (template: any) => {
                this.getViewModelInstance(componentPath, vmInstance, (vm: any) => {
                    ko.components.register(componentPath.componentName, {
                        viewModel : {instance: vm},
                        template: template
                    });

                    if (finalFunction) {
                        finalFunction(componentPath,vm);
                    }
                })
            })
        };

        /**
         * Used by application.attachComponent
         *
         * @param componentName
         * @param vmInstance
         * @param finalFunction
         */
        public registerAndBindComponentInstance = (componentName: string,  vmInstance: any, finalFunction? : () => void) => {
            this.registerComponentInstance(componentName, vmInstance, (componentPath: IComponentParseResult, vm: any) => {
                this.bindSection(componentPath.componentName + '-container',vm);
                if (finalFunction) {
                    finalFunction();
                }
            });
        };

        /**
         * Recursively load and register a list of component prototypes.
         * @param componentList
         * @param finalFunction
         */
        public registerComponents = (componentList : string[], finalFunction: ()=> void) => {
            let componentName = componentList.shift();
            if (componentName) {
                this.loadAndRegisterComponentPrototype(componentName, () => {
                    this.registerComponents(componentList,finalFunction);
                });
            }
            else {
                finalFunction();
            }
        };

        /**
         * Use this to retrieve component view models from the server, and instantiate later
         *
         * @param componentList
         * @param finalFunction
         */
        public loadComponentPrototypes = (componentList : string[], finalFunction: ()=> void) => {
            let me = this;
            let componentName = componentList.shift();
            if (componentName) {
                let componentPath = this.parseComponentName(componentName);
                let src = componentPath.root + 'components/' + componentPath.className + '.js';
                PeanutLoader.load(src, function () {
                    me.loadComponentPrototypes(componentList, finalFunction);
                });
            }
            else {
                finalFunction();
            }
        };




        /*  Old version, doesn't work for some reason. Fix if new version too inefficient
        public registerComponents = (componentList : string[], finalFunction: ()=> void) => {
            let me = this;
            let scriptsList = [];
            let pathList = [];
            for(let item of componentList) {
                let componentPath = me.parseComponentName(item);
                let src = componentPath.root +'components/' + componentPath.className + '.js';
                scriptsList.push(src);
                pathList.push(componentPath);
            }
            PeanutLoader.loadScripts(scriptsList,() => {
                me.registerComponentsInList(pathList,finalFunction);
            });
        };

        private registerComponentsInList = (pathList : IComponentParseResult[], finalFunction?: ()=> void) => {
            let path = pathList.shift();
            if (path) {
                if (window[path.namespace] && window[path.namespace][path.className]) {
                    this.loadComponentTemplate(path, (template: any) => {
                        let vm = window[path.namespace][path.className];
                        ko.components.register(path.componentName, {
                            viewModel : vm,
                            template: template
                        });
                        if (Peanut.Config.values.loggingMode === 'verbose') {
                            console.log('Component ' + path.componentName + ' registered.');
                        }
                    });
                }
                else {
                    console.error('Component ' + path.componentName + ' was not loded');
                }
                this.registerComponentsInList(pathList,finalFunction);
            }
            else {
                if (finalFunction) {
                    finalFunction();
                }
            }
        };
*/
        private getContainerNode(containerName: string) {
            let container = document.getElementById(containerName); // messages-component-container
            if (container == null) {
                if (containerName) {
                    console.warn("Error: Container element '" + containerName + "' for section binding not found.");
                }
                else {
                    console.warn("Error: no container name for section binding.");
                }
            }
            return container;
        }

        /**
         * Apply KnockoutJS bindings to a single node without affecting decendent nodes.
         *
         * @param containerName
         * @param context a viewModel
         */
        public bindNode = (containerName: string, context: any) => {
            let container = this.getContainerNode(containerName);
            if (container !== null) {
                ko.applyBindingsToNode(container, null, context);
            }
        };


        /**
         * Apply KnockoutJS bindings to a single node and all it's decendent nodes.
         *
         * @param containerName
         * @param context - a view model
         */
        public bindSection = (containerName: string, context: any) => {
            let container = this.getContainerNode(containerName);
            if (container === null) {
                return;
            }
            if (Peanut.Config.values.loggingMode == 'verbose') {
                console.log('bind section: ' + containerName);
            }
            ko.applyBindings(context, container);
            jQuery("#" + containerName).show();
        };
    }


} // end namespace