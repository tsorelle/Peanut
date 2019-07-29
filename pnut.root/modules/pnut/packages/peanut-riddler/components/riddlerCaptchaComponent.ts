/// <reference path='../../../../typings/knockout/knockout.d.ts' />
/// <reference path='../../../../pnut/core/KnockoutHelper.ts' />
///<reference path="../../../../pnut/core/Services.ts"/>
///<reference path="../../../../pnut/core/peanut.d.ts"/>
namespace PeanutRiddler {
    import ITranslator = Peanut.ITranslator;

    interface IRiddlerQuestion {
        id: string;
        question: string;
    }

    interface IRiddletGetQuestionsResponse {
        questions: IRiddlerQuestion[];
        translations: string[];
    }
    interface IRiddlerCheckAnswerRequest {
        topic: string;
        questionId: string;
        answer: string;
    }

    export class riddlerCaptchaComponent implements Peanut.IServiceClient{
        //state observables
        public answered = ko.observable(false);
        public failed = ko.observable(false);
        public waitmessage = ko.observable('');
        public showSystemError = ko.observable(false);
        public showInputs = ko.observable(false);
        public showCancel = ko.observable(false);
        public showButton = ko.observable(false);
        public buttonClass = ko.observable('btn btn-primary');

        // translatable text
        riddlerHeader= ko.observable('Help us control spam by answering this question:');
        guessLimitMessage= ko.observable('Sorry, too many guesses.');
        sysError1= ko.observable('A system error occurred. Please try again later or contact the administrator.');
        sysError2= ko.observable('Check the javascript console for error details.');

        // other observables
        public questionText = ko.observable('');
        public answerInput = ko.observable('');
        public answerError = ko.observable('');
        public buttonicon = ko.observable('');
        public buttonLabel = ko.observable('Continue');
        public spinnericon = ko.observable('fa fa-spinner fa-pulse');

        // event handlers
        public confirmClick : ()=> void;
        public cancelClick : ()=> void;

        // other variables
        private questions : IRiddlerQuestion[] = [];
        private services: Peanut.ServiceBroker;
        private currentQuestionIndex : number = -1;
        private retries : number = 0;
        private canCancel = false;
        private topic = '';
        private answerErrorNoAnswer = '';
        private answerErrorIncorrect = '';
        private waitCheckingAnswer = '';

        constructor(params : any) {

            if (!params) {
                throw('Params not defined in ridlerCaptchaComponent');
            }
            if (!params.confirmClick) {
                throw('Confirm click handler must be specified.')
            }

            let me = this;

            me.services = Peanut.ServiceBroker.create(me);

            me.confirmClick = params.confirmClick;
            me.topic = 'presidents'; // 'quakers';
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
                me.cancelClick = () => {};
            }
            if (params.buttonLabel) {
                me.buttonLabel(params.buttonLabel);
            }
            if (params.icon) {
                me.buttonicon("fa fa-" + params.icon)
            }
            else if (params.glyphicon) {
                me.buttonicon("glyphicon glyphicon-"+params.glyphicon);
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

        private setWaitState = (message) => {
            let me = this;
            me.waitmessage(message);
            me.showInputs(false);
        };

        private setQuestionState = () => {
            let me = this;
            me.waitmessage('');
            me.showInputs(true);
            me.showButton(true);
            me.showCancel(me.canCancel);
        };

        private setAnsweredState = () => {
            let me = this;
            me.waitmessage('');
            me.answered(true);
            me.showInputs(false);
            me.showButton(true);
            me.showCancel(me.canCancel);
        };

        private setFailedState = () => {
            let me = this;
            me.waitmessage('');
            me.showInputs(false);
            me.showButton(false);
            me.showCancel(false);
        };

        private setErrorState = (response: any = null) => {
            let me = this;
            me.setFailedState();
            me.showSystemError(true);
            let debugMessage = null;
            if (response === null) {
                debugMessage = me.services.getErrorInformation();
            }
            else  if (typeof response.debugInfo !== 'undefined' && typeof response.debugInfo.message !== 'undefined') {
                debugMessage = response.debugInfo.message;
            }
            if (debugMessage) {
                console.error(debugMessage);
            }

        };

        onConfirmClick = () => {
            let me = this;
            if (me.waitmessage()) {
                // service call in progress
                return;
            }
            if (me.answered()) {
                me.confirmClick();
                return;
            }
            let answer = me.answerInput().trim();
            me.answerInput('');
            if (answer == '') {
                me.answerError(me.answerErrorNoAnswer);
                return;
            }

            me.checkAnswer(answer);
        };

        onCancelClick = () => {
            let me = this;
            if (me.waitmessage()) {
                // service in progress
                return;
            }
            me.cancelClick();
        };

        private selectNextQuestion = () => {
            let me = this;
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

        private selectFirstQuestion = () => {
            let me = this;
            // let i = Math.floor((Math.random() * me.questions.length));
            let i = 0; // no randomizing
            me.currentQuestionIndex = i;
            me.questionText(me.questions[i].question);
            me.retries = me.questions.length + 2;
            me.setQuestionState();
        };

        private getQuestions() {
            let me = this;
            me.setWaitState('Getting questions');
            me.services.executeService('peanut.PeanutRiddler::GetQuestions',me.topic,
                function(serviceResponse: Peanut.IServiceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let response = <IRiddletGetQuestionsResponse>serviceResponse.Value;
                        me.questions = response.questions;
                        if (me.questions.length == 0) {
                            // empty array with no errors indicate user is authenticated and no riddle needed
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
                }
            ).fail(function () {
                let trace = me.services.getErrorInformation();
                me.setErrorState();
            });
        }

        private checkAnswer = (answer: string) => {
            let me = this;
            let question = me.questions[me.currentQuestionIndex];
            let request = <IRiddlerCheckAnswerRequest> {
                topic: me.topic,
                questionId: question.id,
                answer: answer
            };
            me.setWaitState(me.waitCheckingAnswer);
            me.services.executeService('peanut.PeanutRiddler::CheckAnswer',request,
                function(serviceResponse: Peanut.IServiceResponse) {
                    if (serviceResponse.Result == Peanut.serviceResultSuccess) {
                        let correct = !!serviceResponse.Value;
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
                }
            ).fail(function () {
                let trace = me.services.getErrorInformation();
                me.setErrorState();
            });
        };

        showServiceMessages(messages: Peanut.IServiceMessage[]): void {
            if (!messages) {
                return;
            }
            let count = messages.length;
            for(let i=0; i<count; i++) {
                let message = messages[i];
                if (typeof message.Text !== 'string') {
                    console.log('SERVICE ERROR: Message unknown');
                    continue;
                }
                switch (message.MessageType) {
                    case Peanut.errorMessageType :
                        if (message.Text) {
                            console.log('SERVICE ERROR:'+ message.Text);
                        }
                        break;
                    default:
                        if (message.Text) {
                            console.log('Service message:' + message.Text);
                        }
                }
            }
        }

        hideServiceMessages(): void {
            // NOT needed
        }

        showError(errorMessage?: string): void {
            let trace = this.services.getErrorInformation();
            let message = 'Service error occurred. ' + (errorMessage ? ': ' + errorMessage : '');
            console.log(errorMessage);
        }

    }
}