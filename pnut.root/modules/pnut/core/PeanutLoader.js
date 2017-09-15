var Peanut;
(function (Peanut) {
    var peanutVersionNumber = '0.2';
    var configPath = '/peanut/settings';
    var Config = (function () {
        function Config() {
        }
        Config.loaded = false;
        Config.values = {};
        return Config;
    }());
    Peanut.Config = Config;
    var ui = (function () {
        function ui() {
        }
        return ui;
    }());
    Peanut.ui = ui;
    var PeanutLoader = (function () {
        function PeanutLoader() {
        }
        PeanutLoader.startApplication = function (name, final) {
            PeanutLoader.getConfig(function (config) {
                PeanutLoader.load(config.dependencies, function () {
                    if (PeanutLoader.application == null) {
                        PeanutLoader.application = new window['Peanut']['Application'];
                        PeanutLoader.application.initialize(function () {
                            PeanutLoader.application.startVM(name, final);
                        });
                    }
                    else {
                        PeanutLoader.application.startVM(name, final);
                    }
                });
            });
        };
        PeanutLoader.loadUiHelper = function (final) {
            var uiExtension = Peanut.Config.values.uiExtension;
            var uiClass = uiExtension + 'UiHelper';
            PeanutLoader.loadExtensionClass(uiExtension, uiClass, function (helperInstance) {
                Peanut.ui.helper = helperInstance;
                final();
            });
        };
        PeanutLoader.load = function (scripts, final) {
            if (!scripts) {
                final();
                return;
            }
            if (!(scripts instanceof Array)) {
                scripts = scripts.split(',');
            }
            switch (scripts.length) {
                case 0:
                    final();
                    return;
                case 1:
                    PeanutLoader.getConfig(function () {
                        PeanutLoader.loadScript(scripts[0], final);
                    });
                    return;
                default:
                    PeanutLoader.getConfig(function () {
                        PeanutLoader.loadScripts(scripts, final);
                    });
                    return;
            }
        };
        ;
        PeanutLoader.checkConfig = function () {
            if (!Peanut.Config.loaded) {
                throw "Config was not loaded. Call PeanutLoader.getConfig in startup.";
            }
        };
        PeanutLoader.getConfig = function (final) {
            if (Peanut.Config.loaded) {
                final(Peanut.Config.values);
            }
            else {
                jQuery.getJSON(configPath, function (data) {
                    if (data.loggingMode == 'verbose') {
                        console.log("retrieved config");
                    }
                    Peanut.Config.loaded = true;
                    Peanut.Config.values.applicationVersionNumber = peanutVersionNumber + '.' + data.applicationVersionNumber;
                    Peanut.Config.values.commonRootPath = data.commonRootPath;
                    Peanut.Config.values.peanutRootPath = data.peanutRootPath;
                    Peanut.Config.values.packagePath = data.packagePath;
                    Peanut.Config.values.mvvmPath = data.mvvmPath;
                    Peanut.Config.values.corePath = data.corePath;
                    Peanut.Config.values.serviceUrl = data.serviceUrl;
                    Peanut.Config.values.dependencies = data.dependencies;
                    Peanut.Config.values.vmNamespace = data.vmNamespace;
                    Peanut.Config.values.loggingMode = data.loggingMode;
                    Peanut.Config.values.uiExtension = data.uiExtension;
                    if (data.loggingMode == 'verbose') {
                        console.log('Namespace ' + Peanut.Config.values.vmNamespace);
                    }
                    final(Peanut.Config.values);
                });
            }
        };
        PeanutLoader.loadScript = function (script, final) {
            if (!Peanut.Config.loaded) {
                throw "Peanut Config was not loaded.";
            }
            var filetype = script.split('.').pop().toLowerCase();
            if (PeanutLoader.loaded.indexOf(script) == -1) {
                head.load(script + '?v=' + Peanut.Config.values.applicationVersionNumber, function () {
                    if (Peanut.Config.values.loggingMode == 'verbose') {
                        console.log("Loaded " + script);
                    }
                    PeanutLoader.loaded.push(script);
                    final();
                });
            }
            else {
                if (Peanut.Config.values.loggingMode == 'verbose') {
                    console.log("Skipped " + script);
                }
                final();
            }
        };
        PeanutLoader.loadScripts = function (scripts, final) {
            if (!Peanut.Config.loaded) {
                throw "Peanut Config was not loaded.";
            }
            var len = scripts.length;
            var items = [];
            for (var i = 0; i < len; i++) {
                var script = scripts[i];
                if (PeanutLoader.loaded.indexOf(script) == -1) {
                    if (script.split('.').pop().toLowerCase() == 'js') {
                        PeanutLoader.loaded.push(script);
                        if (Peanut.Config.values.loggingMode == 'verbose') {
                            console.log("Loaded " + script);
                        }
                        script += '?v=' + Peanut.Config.values.applicationVersionNumber;
                    }
                    items.unshift(script);
                }
            }
            head.load(items, final);
        };
        ;
        PeanutLoader.loadExtensionClass = function (extension, className, final) {
            var scriptName = Config.values.peanutRootPath + 'extensions/' + extension + '/classes/' + className + '.js';
            PeanutLoader.loadScript(scriptName, function () {
                var p = window['Peanut'];
                var i = p['BootstrapUIHelper'];
                var inst = window['Peanut'][className];
                var extInstance = new window['Peanut'][className];
                final(extInstance);
            });
        };
        PeanutLoader.loadHtml = function (htmlSource, successFunction) {
            PeanutLoader.checkConfig();
            jQuery.get(htmlSource + "?v=" + Peanut.Config.values.applicationVersionNumber, successFunction);
        };
        PeanutLoader.loaded = [];
        return PeanutLoader;
    }());
    Peanut.PeanutLoader = PeanutLoader;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=PeanutLoader.js.map