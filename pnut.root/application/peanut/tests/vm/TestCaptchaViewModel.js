var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Peanut;
(function (Peanut) {
    var TestCaptchaViewModel = (function (_super) {
        __extends(TestCaptchaViewModel, _super);
        function TestCaptchaViewModel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.test = ko.observable('I am bound');
            _this.onCaptchaConfirm = function () {
                alert('Confirm clicked.');
            };
            return _this;
        }
        TestCaptchaViewModel.prototype.init = function (successFunction) {
            var me = this;
            console.log('TestCaptcha Init');
            me.application.loadResources('@lib:fontawesome', function () {
                me.application.registerComponents(['@pkg/peanut-riddler/riddler-captcha'], function () {
                    me.bindDefaultSection();
                    successFunction();
                });
            });
        };
        TestCaptchaViewModel.prototype.onCaptchaCancel = function () {
            alert('Cancel clicked.');
        };
        return TestCaptchaViewModel;
    }(Peanut.ViewModelBase));
    Peanut.TestCaptchaViewModel = TestCaptchaViewModel;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=TestCaptchaViewModel.js.map