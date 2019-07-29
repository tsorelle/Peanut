var PeanutRiddler;
(function (PeanutRiddler) {
    var riddlerCaptchaComponent = (function () {
        function riddlerCaptchaComponent(params) {
            var _this = this;
            this.answered = ko.observable(false);
            this.failed = ko.observable(false);
            this.waitmessage = ko.observable('');
            this.showSystemError = ko.observable(false);
            this.showInputs = ko.observable(false);
            this.showCancel = ko.observable(false);
            this.showButton = ko.observable(false);
            this.buttonClass = ko.observable('btn btn-primary');
            this.riddlerHeader = ko.observable('Help us control spam by answering this question:');
            this.guessLimitMessage = ko.observable('Sorry, too many guesses.');
            this.sysError1 = ko.observable('A system error occurred. Please try again later or contact the administrator.');
            this.sysError2 = ko.observable('Check the javascript console for error details.');
            this.questionText = ko.observable('');
            this.answerInput = ko.observable('');
            this.answerError = ko.observable('');
            this.buttonicon = ko.observable('');
            this.buttonLabel = ko.observable('Continue');
            this.spinnericon = ko.observable('fa fa-spinner fa-pulse');
            this.questions = [];
            this.currentQuestionIndex = -1;
            this.retries = 0;
            this.canCancel = false;
            this.topic = '';
            this.answerErrorNoAnswer = '';
            this.answerErrorIncorrect = '';
            this.waitCheckingAnswer = '';
            this.setWaitState = function (message) {
                var me = _this;
                me.waitmessage(message);
                me.showInputs(false);
            };
            this.setQuestionState = function () {
                var me = _this;
                me.waitmessage('');
                me.showInputs(true);
                me.showButton(true);
                me.showCancel(me.canCancel);
            };
            this.setAnsweredState = function () {
                var me = _this;
                me.waitmessage('');
                me.answered(true);
                me.showInputs(false);
                me.showButton(true);
                me.showCancel(me.canCancel);
            };
            this.setFailedState = function () {
                var me = _this;
                me.waitmessage('');
                me.showInputs(false);
                me.showButton(false);
                me.showCancel(false);
            };
            this.setErrorState = function (response) {
                if (response === void 0) { response = null; }
                var me = _this;
                me.setFailedState();
                me.showSystemError(true);
                var debugMessage = null;
                if (response === null) {
                    debugMessage = me.services.getErrorInformation();
                }
                else if (typeof response.debugInfo !== 'undefined' && typeof response.debugInfo.message !== 'undefined') {
                    debugMessage = response.debugInfo.message;
                }
                if (debugMessage) {
                    console.error(debugMessage);
                }
            };
            this.onConfirmClick = function () {
                var me = _this;
                if (me.waitmessage()) {
                    return;
                }
                if (me.answered()) {
                    me.confirmClick();
                    return;
                }
                var answer = me.answerInput().trim();
                me.answerInput('');
                if (answer == '') {
                    me.answerError(me.answerErrorNoAnswer);
                    return;
                }
                me.checkAnswer(answer);
            };
            this.onCancelClick = function () {
                var me = _this;
                if (me.waitmessage()) {
                    return;
                }
                me.cancelClick();
            };
            this.selectNextQuestion = function () {
                var me = _this;
                me.retries--;
                if (me.retries < 1) {
                    me.failed(true);
                    me.setFailedState();
                    return;
                }
                me.answerError(me.answerErrorIncorrect);
                me.currentQuestionIndex++;
                if (me.currentQuestionIndex >= me.questions.length) {
                    me.currentQuestionIndex = 0;
                }
                me.questionText(me.questions[me.currentQuestionIndex].question);
                me.setQuestionState();
            };
            this.selectFirstQuestion = function () {
                var me = _this;
                var i = 0;
                me.currentQuestionIndex = i;
                me.questionText(me.questions[i].question);
                me.retries = me.questions.length + 2;
                me.setQuestionState();
            };
            this.checkAnswer = function (answer) {
                var me = _this;
                var question = me.questions[me.currentQuestionIndex];
                var request = {
                    topic: me.topic,
                    questionId: question.id,
                    answer: answer
                };
                me.setWaitState(me.waitCheckingAnswer);
                me.services.executeService('peanut.PeanutRiddler::CheckAnswer', request, function (serviceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        var correct = !!serviceResponse.Value;
                        if (correct) {
                            me.setAnsweredState();
                            me.confirmClick();
                        }
                        else {
                            me.selectNextQuestion();
                        }
                    }
                    else {
                        me.setErrorState();
                    }
                }).fail(function () {
                    var trace = me.services.getErrorInformation();
                    me.setErrorState();
                });
            };
            if (!params) {
                throw ('Params not defined in ridlerCaptchaComponent');
            }
            if (!params.confirmClick) {
                throw ('Confirm click handler must be specified.');
            }
            var me = this;
            me.services = Peanut.ServiceBroker.create(me);
            me.confirmClick = params.confirmClick;
            me.topic = 'presidents';
            if (params.topic) {
                me.topic = params.topic;
            }
            if (params.cancelClick) {
                me.canCancel = true;
                me.cancelClick = params.cancelClick;
                me.showCancel(true);
            }
            else {
                me.canCancel = false;
                me.cancelClick = function () { };
            }
            if (params.buttonLabel) {
                me.buttonLabel(params.buttonLabel);
            }
            if (params.icon) {
                me.buttonicon("fa fa-" + params.icon);
            }
            else if (params.glyphicon) {
                me.buttonicon("glyphicon glyphicon-" + params.glyphicon);
            }
            if (params.spinner) {
                if (params.spinner = 'none') {
                    me.spinnericon('');
                }
                else {
                    me.spinnericon(params.spinner);
                }
            }
            if (params.buttonClass) {
                me.buttonClass(params.buttonClass);
            }
            me.getQuestions();
        }
        riddlerCaptchaComponent.prototype.getQuestions = function () {
            var me = this;
            me.setWaitState('Getting questions');
            me.services.executeService('peanut.PeanutRiddler::GetQuestions', me.topic, function (serviceResponse) {
                if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                    var response = serviceResponse.Value;
                    me.questions = response.questions;
                    if (me.questions.length == 0) {
                        me.setAnsweredState();
                    }
                    else {
                        me.selectFirstQuestion();
                    }
                    me.riddlerHeader(response.translations['riddler-header']);
                    me.guessLimitMessage(response.translations['riddler-guess']);
                    me.sysError1(response.translations['riddler-sys-error1']);
                    me.sysError2(response.translations['riddler-sys-error2']);
                    me.answerErrorNoAnswer = response.translations['riddler-error-no-answer'];
                    me.answerErrorIncorrect = response.translations['riddler-error-bad-answer'];
                    me.waitCheckingAnswer = response.translations['riddler-wait-check-answer'];
                }
                else {
                    me.setErrorState(serviceResponse);
                }
            }).fail(function () {
                var trace = me.services.getErrorInformation();
                me.setErrorState();
            });
        };
        riddlerCaptchaComponent.prototype.showServiceMessages = function (messages) {
            if (!messages) {
                return;
            }
            var count = messages.length;
            for (var i = 0; i < count; i++) {
                var message = messages[i];
                if (typeof message.Text !== 'string') {
                    console.log('SERVICE ERROR: Message unknown');
                    continue;
                }
                switch (message.MessageType) {
                    case Peanut.errorMessageType:
                        if (message.Text) {
                            console.log('SERVICE ERROR:' + message.Text);
                        }
                        break;
                    default:
                        if (message.Text) {
                            console.log('Service message:' + message.Text);
                        }
                }
            }
        };
        riddlerCaptchaComponent.prototype.hideServiceMessages = function () {
        };
        riddlerCaptchaComponent.prototype.showError = function (errorMessage) {
            var trace = this.services.getErrorInformation();
            var message = 'Service error occurred. ' + (errorMessage ? ': ' + errorMessage : '');
            console.log(errorMessage);
        };
        return riddlerCaptchaComponent;
    }());
    PeanutRiddler.riddlerCaptchaComponent = riddlerCaptchaComponent;
})(PeanutRiddler || (PeanutRiddler = {}));
//# sourceMappingURL=riddlerCaptchaComponent.js.map