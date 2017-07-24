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
var Bookstore;
(function (Bookstore) {
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
                me.services.executeService('HelloWorld', request, function (serviceResponse) {
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
                var me = _this;
                _this.application.attachComponent('test-form', function (returnFuncton) {
                    _this.application.loadResources('testFormComponent.js', function () {
                        me.testForm = new Bookstore.testFormComponent();
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
                _this.attachComponent('test-message');
                _this.messageButtonVisible(false);
            };
            return _this;
        }
        TestPageViewModel.prototype.init = function (successFunction) {
            var me = this;
            me.application.registerComponents('intro-message,@pnut/modal-confirm', function () {
                me.application.loadComponents('message-constructor', function () {
                    me.application.loadResources([
                        'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
                        '/application/assets/js/libraries/TestLib.js'
                    ], function () {
                        var test = _.head(['one', 'two', 'three']);
                        if (test === 'one') {
                            console.log('Lodash installed');
                        }
                        else {
                            console.log('Lodash error');
                        }
                        Testing.Test.sayHello();
                        var cvm = new Bookstore.messageConstructorComponent('Smoke Test Buttons:');
                        me.application.registerComponent('message-constructor', cvm, function () {
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
    Bookstore.TestPageViewModel = TestPageViewModel;
})(Bookstore || (Bookstore = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFBhZ2VWaWV3TW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUZXN0UGFnZVZpZXdNb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBZ0JBLElBQVUsU0FBUyxDQTRPbEI7QUE1T0QsV0FBVSxTQUFTO0lBRWY7UUFBd0MscUNBQW9CO1FBQTVEO1lBQUEscUVBdU9DO1lBdE9HLGlCQUFXLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVoQyxjQUFRLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QixZQUFNLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixrQkFBWSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsd0JBQWtCLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQywwQkFBb0IsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBaUszQyxVQUFJLEdBQUc7Z0JBQ0gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1QyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdkIsQ0FBQyxDQUFDO1lBQ0YsaUJBQVcsR0FBRztnQkFDVixLQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQztZQUNGLGVBQVMsR0FBRztnQkFDUixJQUFJLEVBQUUsR0FBRyxLQUFJLENBQUM7Z0JBQ2QsSUFBSSxPQUFPLEdBQUcsRUFBQyxRQUFRLEVBQUcsZUFBZSxFQUFDLENBQUM7Z0JBQzNDLEVBQUUsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztnQkFDckMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMs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