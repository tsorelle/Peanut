var Peanut;
(function (Peanut) {
    var peanutVersionNumber = '0.2';
    var configPath = '/peanut/settings';
    var Config = (function () {
        function Config() {
        }
        return Config;
    }());
    Config.loaded = false;
    Config.values = {};
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
        return PeanutLoader;
    }());
    PeanutLoader.loaded = [];
    Peanut.PeanutLoader = PeanutLoader;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGVhbnV0TG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGVhbnV0TG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBLElBQVUsTUFBTSxDQTJLZjtBQTNLRCxXQUFVLE1BQU07SUFFWixJQUFNLG1CQUFtQixHQUFHLEtBQUssQ0FBQztJQUNsQyxJQUFNLFVBQVUsR0FBSSxrQkFBa0IsQ0FBQztJQUV2QztRQUFBO1FBR0EsQ0FBQztRQUFELGFBQUM7SUFBRCxDQUFDLEFBSEQ7SUFDVyxhQUFNLEdBQVksS0FBSyxDQUFDO0lBQ3hCLGFBQU0sR0FBaUMsRUFBRSxDQUFDO0lBRnhDLGFBQU0sU0FHbEIsQ0FBQTtJQUdEO1FBQUE7UUFFQSxDQUFDO1FBQUQsU0FBQztJQUFELENBQUMsQUFGRCxJQUVDO0lBRlksU0FBRSxLQUVkLENBQUE7SUFHRDtRQUFBO1FBd0pBLENBQUM7UUFwSmlCLDZCQUFnQixHQUE5QixVQUErQixJQUFZLEVBQUUsS0FBNEI7WUFDckUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQXFCO2dCQUN6QyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUM7b0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkMsWUFBWSxDQUFDLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDL0QsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUM7NEJBQ2hDLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDbEQsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDRixZQUFZLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ2xE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