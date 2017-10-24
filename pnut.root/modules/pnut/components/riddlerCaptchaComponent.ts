/// <reference path='../../typings/knockout/knockout.d.ts' />
/// <reference path='../core/KnockoutHelper.ts' />
namespace Peanut {
    export interface IRiddlerQuestiion {
        question: string;
        answers: string[];
    }

    export class riddlerCaptchaComponent {
        public confirmClick : ()=> void;
        public cancelClick : ()=> void;
        public questionText = ko.observable('');
        public answerInput = ko.observable('');
        public answerError = ko.observable('');
        public glyphicon = ko.observable('');
        public answered = ko.observable(false);
        public failed = ko.observable(false);
        public buttonLabel = ko.observable('Continue');
        private questions : IRiddlerQuestiion[] = [];
        private currentQuestionIndex : number = -1;
        private retries : number;
        public showCancel = ko.observable(false);
        public showInputs = ko.observable(true);
        public showButton = ko.observable(true);


        constructor(params : any) {
            if (!params) {
                throw('Params not defined in ridlerCaptchaComponent');
            }
            if (!params.confirmClick) {
                throw('Confirm click handler must be specifies.')
            }
            let me = this;

            if (params.onStart) {
                let enabled = params.onStart();
                me.answered(enabled);
                me.showInputs(enabled);
            }

            me.confirmClick = params.confirmClick;
            let topic = 'quakers';
            if (params.topic) {
                topic = params.topic;
            }
            if (params.cancelClick) {
                me.cancelClick = params.cancelClick;
                me.showCancel(true);
            }
            else {
                me.cancelClick = () => {};
            }
            if (params.buttonLabel) {
                me.buttonLabel(params.buttonLabel);
            }
            if (params.glyphicon) {
                me.glyphicon("glyphicon glyphicon-"+params.glyphicon);
            }
            me.getQuestions(topic);
            me.selectFirstQuestion();
        }

        onConfirmClick = () => {
            let me = this;
            if (me.answered()) {
                me.confirmClick();
                return;
            }

            let q = me.questions[me.currentQuestionIndex];
            let answer = me.answerInput().trim();
            me.answerInput('');
            if (answer == '') {
                me.answerError('Please type in your answer.');
                return;
            }

            // strip periods and extra spaces
            answer = answer.replace(/[.]/g,'').toLowerCase().trim();
            let parts = answer.split(' ');
            answer = '';
            for(let i=0; i<parts.length; i++) {
                if (parts[i]) {
                    answer += (parts[i].toString()+ ' ');
                }
            }
            answer = answer.trim();

            // check the answer
            let correct = false;
            for (let i=0; i < q.answers.length; i++) {
                if (answer === q.answers[i]) {
                    correct = true;
                    break;
                }
            }

            if (correct) {
                me.answered(true);
                me.showInputs(false);
                me.confirmClick();
            }
            else {
                me.retries--;
                if (me.retries < 1) {
                    me.showInputs(false);
                    me.showButton(false);
                    me.failed(true);
                    return;
                }
                me.answerError('Sorry, incorrect answer. Try another question.');
                me.currentQuestionIndex++;
                if (me.currentQuestionIndex >= me.questions.length) {
                    me.currentQuestionIndex = 0;
                }
                me.questionText(me.questions[me.currentQuestionIndex].question);
            }
        };

        private selectFirstQuestion = () => {
            let me = this;
            let i = Math.floor((Math.random() * me.questions.length));
            me.currentQuestionIndex = i;
            me.questionText(me.questions[i].question);
            me.answerInput('');
        };

        public getQuestions(topic: string = 'quakers') {
            let me = this;
            switch (topic) {
                case 'presidents' :
                    me.questions = [
                        <IRiddlerQuestiion> {
                            question: 'Who is buried in Grants tomb?',
                            answers: [
                                'grant',
                                'ulysses grant',
                                'u s grant',
                                'ulysses s grant',
                                'president grant'
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: 'Who was the first U.S. president?',
                            answers: [
                                'washington',
                                'george washington'
                            ]
                        }
                    ];
                    break;
                case 'quakers' :
                    me.questions = [
                        <IRiddlerQuestiion> {
                            question: 'Who is the founder of Quakerism?',
                            answers: [
                                'fox',
                                'george fox',
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: 'What American colony was founded by Quakers?',
                            answers: [
                                'pennsylvania',
                                'pennsylvania colony',
                                'state of pennsylvania',
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: 'Who founded Pennsylvania?',
                            answers: [
                                'penn',
                                'william penn'
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: "Name a famous Quaker suffrigist and abolitionist (first name Lucretia).",
                            answers: [
                                'mott',
                                'lucretia mott'
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: "Name a famous Quaker suffrigist and abolitionist (first name Susan).",
                            answers: [
                                'anthony',
                                'susan anthony',
                                'susan b anthony',
                                'susan brownwell anthony'
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: "John Woolman believed in a principle which is ...",
                            answers: [
                                'pure',
                                'proceeds from god'
                            ]
                        },
                        <IRiddlerQuestiion> {
                            question: 'What early Quaker woman asked "What canst thou say?"',
                            answers: [
                                'fell',
                                'margaret fell'
                            ]
                        }

                    ];
                    break;

            }
            me.retries = me.questions.length + 5;
        }


    }
}