var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Peanut;
(function (Peanut) {
    var TestPageViewModel = (function (_super) {
        __extends(TestPageViewModel, _super);
        function TestPageViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.messageText = ko.observable('');
            _this.itemName = ko.observable('');
            _this.itemId = ko.observable(1);
            _this.messagePanel = ko.observable('button');
            _this.messageFormVisible = ko.observable(false);
            _this.messageButtonVisible = ko.observable(true);
            _this.save = function () {
                jQuery("#confirm-save-modal").modal('hide');
                alert('you saved');
            };
            _this.onShowError = function () {
                _this.application.showError("This is an error message.");
            };
            _this.onService = function () {
                var me = _this;
                var request = { "tester": 'Terry SoRelle' };
                me.application.hideServiceMessages();
                me.application.showWaiter('Testing service...');
                me.services.executeService('PeanutTest::HelloWorld', request, function (serviceResponse) {
                    me.application.hideWaiter();
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var response = serviceResponse.Value;
                        alert(response.message);
                    }
                }).fail(function () {
                    me.application.hideWaiter();
                });
            };
            _this.onShowForm = function () {
                console.log('Show form component');
                var me = _this;
                _this.application.attachComponent('tests/test-form', function (returnFuncton) {
                    console.log('accachComponent - returnFunction');
                    _this.application.loadResources('tests/testFormComponent.js', function () {
                        console.log('instatiate testForm component');
                        me.testForm = new Peanut.testFormComponent();
                        me.testForm.setMessage('Watch this space.');
                        me.messagePanel('form');
                        returnFuncton(me.testForm);
                    });
                });
            };
            _this.onSendMessage = function () {
                _this.testForm.setMessage(_this.messageText());
            };
            _this.onShowMessageComponent = function () {
                _this.attachComponent('tests/test-message');
                _this.messageButtonVisible(false);
            };
            return _this;
        }
        TestPageViewModel.prototype.init = function (successFunction) {
            var me = this;
            me.application.registerComponents('tests/intro-message,@pnut/modal-confirm', function () {
                me.application.loadComponents('tests/message-constructor', function () {
                    me.application.loadResources([
                        'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
                        '/application/assets/js/libraries/TestLib.js'
                    ], function () {
                        var test = _.head(['one', 'two', 'three']);
                        if (test === 'one') {
                            console.log('Lodash installed');
                        }
                        Testing.Test.sayHello();
                        var cvm = new Peanut.messageConstructorComponent('Smoke Test Buttons:');
                        me.application.registerComponent('tests/message-constructor', cvm, function () {
                            me.bindDefaultSection();
                            successFunction();
                        });
                    });
                });
            });
        };
        TestPageViewModel.prototype.onGetItem = function () {
            var me = this;
            me.application.showWaiter('Please wait...');
            me.services.getFromService('TestGetService', 3, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    me.itemName(serviceResponse.Value.name);
                    me.itemId(serviceResponse.Value.id);
                }
                else {
                    alert("Service failed");
                }
            }).always(function () {
                me.application.hideWaiter();
            });
        };
        TestPageViewModel.prototype.onPostItem = function () {
            var me = this;
            var request = {
                testMessageText: me.itemName()
            };
            me.application.showWaiter('Please wait...');
            me.services.executeService('TestService', request)
                .always(function () {
                me.application.hideWaiter();
            });
        };
        TestPageViewModel.prototype.onAddMessageClick = function () {
            var me = this;
            var msg = me.messageText();
            me.application.showMessage(msg);
            me.messageText('');
        };
        TestPageViewModel.prototype.onAddErrorMessageClick = function () {
            var me = this;
            var msg = me.messageText();
            me.application.showError(msg);
            me.messageText('');
        };
        TestPageViewModel.prototype.onAddWarningMessageClick = function () {
            var me = this;
            var msg = me.messageText();
            me.application.showWarning(msg);
            me.messageText('');
        };
        TestPageViewModel.prototype.onShowSpinWaiter = function () {
            var count = 0;
            Peanut.WaitMessage.show("Hello " + (new Date()).toISOString());
            var t = window.setInterval(function () {
                if (count > 100) {
                    clearInterval(t);
                    Peanut.WaitMessage.hide();
                }
                else {
                    Peanut.WaitMessage.setMessage('Counting ' + count);
                }
                count += 1;
            }, 100);
        };
        TestPageViewModel.prototype.onShowWaiter = function () {
            var me = this;
            me.application.showWaiter();
            var t = window.setInterval(function () {
                clearInterval(t);
                me.application.hideWaiter();
            }, 1000);
        };
        TestPageViewModel.prototype.onShowProgressWaiter = function () {
            var count = 0;
            Peanut.WaitMessage.show("Hello " + (new Date()).toISOString(), 'progress-waiter');
            var t = window.setInterval(function () {
                if (count > 100) {
                    clearInterval(t);
                    Peanut.WaitMessage.hide();
                }
                else {
                    Peanut.WaitMessage.setMessage('Counting ' + count);
                    Peanut.WaitMessage.setProgress(count, true);
                }
                count += 1;
            }, 100);
        };
        TestPageViewModel.prototype.onHideWaiter = function () {
            Peanut.WaitMessage.hide();
        };
        TestPageViewModel.prototype.onShowModalForm = function () {
            jQuery("#test-modal").modal('show');
        };
        TestPageViewModel.prototype.onSaveChanges = function () {
            jQuery("#test-modal").modal('hide');
            jQuery("#confirm-save-modal").modal('show');
        };
        return TestPageViewModel;
    }(Peanut.ViewModelBase));
    Peanut.TestPageViewModel = TestPageViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=TestPageViewModel.js.map