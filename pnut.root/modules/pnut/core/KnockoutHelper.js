var Peanut;
(function (Peanut) {
    var KnockoutHelper = (function () {
        function KnockoutHelper() {
            var _this = this;
            this.loadList = {
                css: [],
                templates: [],
                components: [],
                scripts: [],
                bindings: []
            };
            this.loadCss = function (path, media) {
                if (media === void 0) { media = null; }
                if (path) {
                    var fileref = document.createElement("link");
                    fileref.setAttribute("rel", "stylesheet");
                    fileref.setAttribute("type", "text/css");
                    fileref.setAttribute("href", path);
                    if (media) {
                        fileref.setAttribute('media', media);
                    }
                    if (typeof fileref === "undefined") {
                        console.error('Failed to load stylesheet ' + path);
                    }
                    document.getElementsByTagName("head")[0].appendChild(fileref);
                    console.log('Loaded stylesheet: ' + path);
                }
            };
            this.loadViewModel = function (vmName, final) {
                Peanut.PeanutLoader.checkConfig();
                var me = _this;
                var parts = vmName.split('/');
                var prefix = '@app';
                if (vmName.substr(0, 1) === '@') {
                    prefix = parts.shift();
                }
                vmName = parts.pop();
                var vmClassName = vmName + 'ViewModel';
                var vmFile = prefix + '/' + parts.join('/') + '/vm/' + vmClassName;
                var parseResult = (_this.parseFileName(vmFile, Peanut.Config.values.mvvmPath));
                var vmPath = parseResult.root + parseResult.name + '.js';
                var namespace = parseResult.namespace;
                Peanut.PeanutLoader.loadScript(vmPath, function () {
                    if (Peanut.Config.values.loggingMode == 'verbose') {
                        console.log("Loading " + namespace + '.' + vmClassName);
                    }
                    var vm = (new window[namespace][vmClassName]);
                    vm.setVmName(vmName);
                    final(vm);
                });
            };
            this.getComponentPrototype = function (componentPath) {
                if ((window[componentPath.namespace]) && (window[componentPath.namespace][componentPath.className])) {
                    return window[componentPath.namespace][componentPath.className];
                }
                return null;
            };
            this.loadComponentTemplate = function (componentPath, finalFunction) {
                var me = _this;
                Peanut.PeanutLoader.getConfig(function (config) {
                    var htmlPath = componentPath.root + 'templates/' + componentPath.templateFile;
                    jQuery.get(htmlPath, function (template) {
                        if (template.toLowerCase().indexOf('<!doctype') === 0) {
                            console.error('Template not found at ' + htmlPath);
                            template = '';
                        }
                        if (finalFunction) {
                            finalFunction(template);
                        }
                    });
                });
            };
            this.loadComponentPrototype = function (componentPath, finalFunction) {
                if (window[componentPath.namespace] && window[componentPath.namespace][componentPath.className]) {
                    finalFunction(window[componentPath.namespace][componentPath.className]);
                }
                else {
                    var me = _this;
                    var src = componentPath.root + 'components/' + componentPath.className + '.js';
                    Peanut.PeanutLoader.load(src, function () {
                        var vm = window[componentPath.namespace][componentPath.className];
                        if (finalFunction) {
                            finalFunction(vm);
                        }
                    });
                }
            };
            this.loadAndRegisterComponentPrototype = function (componentName, finalFunction) {
                var me = _this;
                var componentPath = _this.parseComponentName(componentName);
                if (me.alreadyLoaded(componentName, 'component')) {
                    finalFunction(componentPath);
                }
                _this.loadComponentTemplate(componentPath, function (template) {
                    _this.loadComponentPrototype(componentPath, function (vm) {
                        me.registerKoComponent(componentName, componentPath.componentName, {
                            viewModel: vm,
                            template: template
                        });
                        if (finalFunction) {
                            finalFunction(componentPath);
                        }
                    });
                });
            };
            this.registerComponentPrototype = function (componentName, finalFunction) {
                var me = _this;
                var componentPath = _this.parseComponentName(componentName);
                _this.loadComponentTemplate(componentPath, function (template) {
                    var vm = _this.getComponentPrototype(componentPath);
                    me.registerKoComponent(componentName, componentPath.componentName, {
                        viewModel: vm,
                        template: template
                    });
                    if (finalFunction) {
                        finalFunction(componentPath);
                    }
                });
            };
            this.registerKoComponent = function (componentAlias, componentName, parameters) {
                ko.components.register(componentName, parameters);
                _this.loadList.components.push(componentAlias);
            };
            this.registerComponentInstance = function (componentName, vmInstance, finalFunction) {
                var me = _this;
                if (me.alreadyLoaded(componentName, 'component')) {
                    finalFunction(null, null);
                    return;
                }
                var componentPath = _this.parseComponentName(componentName);
                _this.loadComponentTemplate(componentPath, function (template) {
                    _this.getViewModelInstance(componentPath, vmInstance, function (vm) {
                        me.registerKoComponent(componentName, componentPath.componentName, {
                            viewModel: { instance: vm },
                            template: template
                        });
                        if (finalFunction) {
                            finalFunction(componentPath, vm);
                        }
                    });
                });
            };
            this.registerAndBindComponentInstance = function (componentName, vmInstance, finalFunction) {
                if (_this.alreadyLoaded(componentName, 'component')) {
                    finalFunction();
                }
                else {
                    _this.registerComponentInstance(componentName, vmInstance, function (componentPath, vm) {
                        if (componentPath !== null) {
                            _this.bindSection(componentPath.componentName + '-container', vm);
                        }
                        if (finalFunction) {
                            finalFunction();
                        }
                    });
                }
            };
            this.registerComponents = function (componentList, finalFunction) {
                var componentName = componentList.shift();
                var me = _this;
                if (componentName && !me.alreadyLoaded(componentName, 'component')) {
                    me.loadAndRegisterComponentPrototype(componentName, function () {
                        me.registerComponents(componentList, function () {
                            finalFunction();
                        });
                    });
                }
                else {
                    finalFunction();
                }
            };
            this.loadComponentPrototypes = function (componentList, finalFunction) {
                var me = _this;
                var componentName = componentList.shift();
                if (componentName && !me.alreadyLoaded(componentName, 'scripts')) {
                    var componentPath = _this.parseComponentName(componentName);
                    var src = componentPath.root + 'components/' + componentPath.className + '.js';
                    Peanut.PeanutLoader.load(src, function () {
                        me.loadComponentPrototypes(componentList, finalFunction);
                    });
                }
                else {
                    finalFunction();
                }
            };
            this.bindNode = function (containerName, context) {
                if (!_this.alreadyLoaded(containerName, 'binding')) {
                    var container = _this.getContainerNode(containerName);
                    if (container !== null) {
                        ko.applyBindingsToNode(container, null, context);
                    }
                    _this.loadList.bindings.push(containerName);
                }
            };
            this.bindSection = function (containerName, context) {
                if (!_this.alreadyLoaded(containerName, 'binding')) {
                    var container = _this.getContainerNode(containerName);
                    if (container === null) {
                        return;
                    }
                    if (Peanut.Config.values.loggingMode == 'verbose') {
                        console.log('bind section: ' + containerName);
                    }
                    ko.applyBindings(context, container);
                    _this.loadList.bindings.push(containerName);
                }
                jQuery("#" + containerName).show();
            };
        }
        KnockoutHelper.prototype.alreadyLoaded = function (name, type) {
            if (type === void 0) { type = 'component'; }
            var list = null;
            var me = this;
            var loaded = false;
            switch (type) {
                case 'css':
                    loaded = me.loadList.css.indexOf(name) > -1;
                    break;
                case 'template':
                    loaded = me.loadList.templates.indexOf(name) > -1;
                    break;
                case 'component':
                    loaded = me.loadList.components.indexOf(name) > -1;
                    break;
                case 'script':
                    loaded = me.loadList.scripts.indexOf(name) > -1;
                    break;
                case 'binding':
                    loaded = me.loadList.bindings.indexOf(name) > -1;
                    break;
                default:
                    console.log('Warning invalid resource type ' + name);
                    return false;
            }
            if (loaded && Peanut.Config.values.loggingMode == 'verbose') {
                console.log("Skipped, already loaded " + name);
            }
            return loaded;
        };
        KnockoutHelper.prototype.toCamelCase = function (name, seperator, casingType) {
            if (seperator === void 0) { seperator = '-'; }
            if (casingType === void 0) { casingType = 'pascal'; }
            var names = name.split(seperator);
            var result = (casingType == 'camel') ? names.shift() : '';
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var part = names_1[_i];
                var initial = part.substr(0, 1);
                initial = initial.toUpperCase();
                var remainder = part.substr(1);
                result = result + initial + remainder;
            }
            return result;
        };
        KnockoutHelper.prototype.parseFileName = function (name, defaultPath) {
            if (defaultPath === void 0) { defaultPath = null; }
            defaultPath = defaultPath || Peanut.Config.values.commonRootPath;
            var result = { root: '', name: '', namespace: 'Peanut' };
            var parts = name.split('/');
            var len = parts.length;
            if (len == 1) {
                result.root = defaultPath;
                result.name = name;
            }
            else {
                if (parts[0] == '') {
                    result.name = parts.pop();
                    result.root = parts.join('/') + '/';
                }
                else {
                    var pathRoot = defaultPath;
                    switch (parts[0]) {
                        case '@pnut':
                            pathRoot = Peanut.Config.values.peanutRootPath;
                            parts.shift();
                            break;
                        case '@core':
                            pathRoot = Peanut.Config.values.corePath;
                            parts.shift();
                            break;
                        case '@app':
                            result.namespace = Peanut.Config.values.vmNamespace;
                            pathRoot = Peanut.Config.values.mvvmPath;
                            parts.shift();
                            break;
                        case '@pkg':
                            parts.shift();
                            var subDir = parts.shift();
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
        };
        KnockoutHelper.prototype.nameToFileName = function (componentName) {
            var parts = componentName.split('-');
            var fileName = parts[0];
            if (parts.length > 1) {
                fileName += parts[1].charAt(0).toUpperCase() + parts[1].substring(1);
            }
            return fileName;
        };
        KnockoutHelper.prototype.parseComponentName = function (componentName) {
            var me = this;
            if (!Peanut.Config.loaded) {
                throw "Peanut Config was not loaded.";
            }
            if (componentName.substr(0, 1) !== '@') {
                componentName = '@app/' + componentName;
            }
            var parsed = me.parseFileName(componentName, Peanut.Config.values.mvvmPath);
            var fileName = me.nameToFileName(parsed.name);
            return {
                root: parsed.root,
                className: fileName + 'Component',
                templateFile: fileName + '.html',
                componentName: parsed.name,
                namespace: parsed.namespace
            };
        };
        KnockoutHelper.prototype.expandFileName = function (fileName, defaultPath) {
            if (defaultPath === void 0) { defaultPath = null; }
            if (!fileName) {
                return '';
            }
            if (fileName.substr(0, 1) === '/' || fileName.toLowerCase().substr(0, 4) === 'http') {
                return fileName;
            }
            var me = this;
            var fileExtension = 'js';
            var p = fileName.lastIndexOf('.');
            if (p == -1) {
                fileName = fileName + '.js';
            }
            else {
                fileExtension = fileName.substr(p + 1).toLowerCase();
            }
            var parsed = me.parseFileName(fileName, defaultPath);
            return parsed.root + fileExtension + '/' + parsed.name;
        };
        KnockoutHelper.prototype.loadResources = function (resourceList, successFunction) {
            var me = this;
            Peanut.PeanutLoader.checkConfig();
            Peanut.PeanutLoader.getConfig(function (config) {
                var params = [];
                for (var i = 0; i < resourceList.length; i++) {
                    var name_1 = resourceList[i];
                    if (name_1 && (!me.alreadyLoaded(name_1, 'script'))) {
                        var path = (name_1.substr(0, 5) == '@lib:') ?
                            me.getLibrary(name_1, config) :
                            me.expandFileName(name_1, config.applicationPath);
                        if (path !== false) {
                            me.loadList.scripts.push(name_1);
                            params.push(path);
                        }
                    }
                }
                Peanut.PeanutLoader.load(params, successFunction);
            });
        };
        KnockoutHelper.prototype.loadStyleSheets = function (resourceList) {
            var me = this;
            Peanut.PeanutLoader.checkConfig();
            Peanut.PeanutLoader.getConfig(function (config) {
                for (var i = 0; i < resourceList.length; i++) {
                    var resourceName = resourceList[i];
                    if (me.alreadyLoaded(resourceName, 'css')) {
                        continue;
                    }
                    me.loadList.css.push(resourceName);
                    var parts = resourceName.split(' media=');
                    var path = parts.shift().trim();
                    var media = parts.shift();
                    media = media ? media.trim() : null;
                    if (path.substring(0, 1) === '/' || path.substring(0, 5) === 'http:' || path.substring(0, 6) === 'https:') {
                        me.loadCss(path, media);
                        return;
                    }
                    else if (path.substr(0, 5) == '@lib:') {
                        path = me.getLibrary(path, config);
                    }
                    else if (path.substr(0, 5) == '@pkg:') {
                        var pathParts = path.substring(5).split('/');
                        var pkgName = pathParts.shift();
                        var fileName = '/css/styles.css';
                        if (parts.length > 0) {
                            fileName = parts.pop();
                            var subdir = parts.length ? '/' + parts.join('/') + '/' : '/css/';
                            fileName = subdir + fileName;
                        }
                        path = Peanut.Config.values.packagePath + pkgName + fileName;
                    }
                    else if (path.substr(0, 1) == '@') {
                        path = me.expandFileName(path, config.applicationPath);
                    }
                    else {
                        path = config.stylesPath + path;
                    }
                    if (path) {
                        me.loadCss(path, media);
                    }
                }
            });
        };
        KnockoutHelper.prototype.getLibrary = function (name, config) {
            var key = name.substr(5);
            if (key.substr(0, 6) == 'local/') {
                return config.libraryPath + key.substr(6);
            }
            if (key in config.libraries) {
                var path = config.libraries[key];
                if (path === 'installed') {
                    return false;
                }
                if (path.substr(0, 1) == '/' || path.substr(0, 5) == 'http:' || path.substr(0, 6) == 'https:') {
                    return path;
                }
                return config.libraryPath + path;
            }
            console.log('Library "' + key + '" not in settings.ini.');
            return false;
        };
        KnockoutHelper.prototype.getHtmlTemplate = function (name, successFunction) {
            var me = this;
            if (me.alreadyLoaded(name, 'template')) {
                successFunction(null);
            }
            else {
                Peanut.PeanutLoader.checkConfig();
                var parsed = me.parseFileName(name, Peanut.Config.values.mvvmPath);
                var parts = parsed.name.split('-');
                var fileName = parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].substring(1);
                var htmlSource = parsed.root + 'templates/' + fileName + '.html';
                Peanut.PeanutLoader.loadHtml(htmlSource, successFunction);
                me.loadList.templates.push(name);
            }
        };
        KnockoutHelper.prototype.getViewModelInstance = function (componentPath, vmObject, returnFunction) {
            if (vmObject instanceof Function) {
                vmObject(returnFunction);
            }
            else {
                returnFunction(vmObject);
            }
        };
        KnockoutHelper.prototype.getContainerNode = function (containerName) {
            var container = document.getElementById(containerName);
            if (container == null) {
                if (containerName) {
                    console.warn("Error: Container element '" + containerName + "' for section binding not found.");
                }
                else {
                    console.warn("Error: no container name for section binding.");
                }
            }
            return container;
        };
        KnockoutHelper.GetInputValue = function (oValue) {
            if (oValue !== null) {
                var value = oValue();
                if (value !== null) {
                    return value.trim();
                }
            }
            return '';
        };
        return KnockoutHelper;
    }());
    Peanut.KnockoutHelper = KnockoutHelper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=KnockoutHelper.js.map