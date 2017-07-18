var Peanut;
(function (Peanut) {
    var KnockoutHelper = (function () {
        function KnockoutHelper() {
            var _this = this;
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
                var componentPath = _this.parseComponentName(componentName);
                _this.loadComponentTemplate(componentPath, function (template) {
                    _this.loadComponentPrototype(componentPath, function (vm) {
                        ko.components.register(componentPath.componentName, {
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
                var componentPath = _this.parseComponentName(componentName);
                _this.loadComponentTemplate(componentPath, function (template) {
                    var vm = _this.getComponentPrototype(componentPath);
                    ko.components.register(componentPath.componentName, {
                        viewModel: vm,
                        template: template
                    });
                    if (finalFunction) {
                        finalFunction(componentPath);
                    }
                });
            };
            this.registerComponentInstance = function (componentName, vmInstance, finalFunction) {
                var componentPath = _this.parseComponentName(componentName);
                _this.loadComponentTemplate(componentPath, function (template) {
                    _this.getViewModelInstance(componentPath, vmInstance, function (vm) {
                        ko.components.register(componentPath.componentName, {
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
                _this.registerComponentInstance(componentName, vmInstance, function (componentPath, vm) {
                    _this.bindSection(componentPath.componentName + '-container', vm);
                    if (finalFunction) {
                        finalFunction();
                    }
                });
            };
            this.registerComponents = function (componentList, finalFunction) {
                var componentName = componentList.shift();
                if (componentName) {
                    _this.loadAndRegisterComponentPrototype(componentName, function () {
                        _this.registerComponents(componentList, finalFunction);
                    });
                }
                else {
                    finalFunction();
                }
            };
            this.loadComponentPrototypes = function (componentList, finalFunction) {
                var me = _this;
                var componentName = componentList.shift();
                if (componentName) {
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
                var container = _this.getContainerNode(containerName);
                if (container !== null) {
                    ko.applyBindingsToNode(container, null, context);
                }
            };
            this.bindSection = function (containerName, context) {
                var container = _this.getContainerNode(containerName);
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
            var parsed = me.parseFileName(fileName, defaultPath);
            var fileExtension = fileName.substr((fileName.lastIndexOf('.') + 1));
            if (fileExtension) {
                switch (fileExtension.toLowerCase()) {
                    case 'css':
                        return parsed.root + 'css/' + parsed.name;
                    case 'js':
                        return parsed.root + 'components/' + parsed.name;
                }
            }
            return fileName;
        };
        KnockoutHelper.prototype.loadResources = function (resourceList, successFunction) {
            var me = this;
            Peanut.PeanutLoader.checkConfig();
            Peanut.PeanutLoader.getConfig(function (config) {
                var params = [];
                for (var i = 0; i < resourceList.length; i++) {
                    var path = me.expandFileName(resourceList[i], config.mvvmPath);
                    params.push(path);
                }
                Peanut.PeanutLoader.load(params, successFunction);
            });
        };
        KnockoutHelper.prototype.getHtmlTemplate = function (name, successFunction) {
            var me = this;
            Peanut.PeanutLoader.checkConfig();
            var parsed = me.parseFileName(name, Peanut.Config.values.mvvmPath);
            var parts = parsed.name.split('-');
            var fileName = parts[0] + parts[1].charAt(0).toUpperCase() + parts[1].substring(1);
            var htmlSource = parsed.root + 'templates/' + fileName + '.html';
            Peanut.PeanutLoader.loadHtml(htmlSource, successFunction);
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
        return KnockoutHelper;
    }());
    Peanut.KnockoutHelper = KnockoutHelper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS25vY2tvdXRIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJLbm9ja291dEhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFNQSxJQUFVLE1BQU0sQ0E2ZWY7QUE3ZUQsV0FBVSxNQUFNO0lBRVo7UUFBQTtZQUFBLGlCQXdlQztZQWhVVSxrQkFBYSxHQUFHLFVBQUMsTUFBZSxFQUFFLEtBQXVDO2dCQUM1RSxPQUFBLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxFQUFFLEdBQUcsS0FBSSxDQUFDO2dCQUNkLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzlCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQztnQkFDcEIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQztnQkFDRCxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNyQixJQUFJLFdBQVcsR0FBRyxNQUFNLEdBQUcsV0FBVyxDQUFDO2dCQUN2QyxJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxHQUFHLFdBQVcsQ0FBQztnQkFDbkUsSUFBSSxXQUFXLEdBQXFCLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDaEcsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztnQkFDekQsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNB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