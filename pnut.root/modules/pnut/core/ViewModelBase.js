/**
 * Created by Terry on 5/20/2017.
 */
///<reference path="Services.ts"/>
///<reference path="Peanut.d.ts"/>
///<reference path="../../typings/jquery/jquery.d.ts"/>
var Peanut;
(function (Peanut) {
    var ViewModelBase = (function () {
        function ViewModelBase() {
            var _this = this;
            this.start = function (application, successFunction) {
                var me = _this;
                me.application = application;
                me.services = Peanut.ServiceBroker.getInstance(application);
                me.init(function () {
                    successFunction(me);
                });
            };
            this.vmName = null;
            this.setVmName = function (name) {
                _this.vmName = name;
            };
            this.getVmName = function () {
                return _this.vmName;
            };
            /**
             * Get element id for the default containing DIV,  e.g.  TestPageViewModel => testpage-view-container
             * @returns {string}
             */
            this.getSectionName = function () {
                return _this.getVmName().toLowerCase() + '-view-container';
            };
            /**
             *  Show the default section (see getSectionName())
             *  Use this when the view only contains components.
             */
            this.showDefaultSection = function () {
                var sectionName = _this.getSectionName();
                jQuery("#" + sectionName).show();
            };
            /**
             *  Bind and display the default section
             */
            this.bindDefaultSection = function () {
                var sectionName = _this.getSectionName();
                _this.application.bindSection(sectionName, _this);
            };
            this.attachComponent = function (componentName, section) {
                _this.application.registerComponentPrototype(componentName, function () {
                    if (!section) {
                        section = componentName.split('/').pop() + '-container';
                    }
                    _this.application.bindSection(section, _this);
                });
            };
        }
        return ViewModelBase;
    }());
    Peanut.ViewModelBase = ViewModelBase;
})(Peanut || (Peanut = {})); // end namespace
