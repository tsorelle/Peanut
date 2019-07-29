namespace Peanut {
    export class selectListObservable {
        private selectHandler: (selected: INameValuePair) => void;
        private subscription: any;
        private defaultValue;
        options = ko.observableArray<INameValuePair>();
        selected = ko.observable<INameValuePair>();

        public constructor(selectHandler: (selected: INameValuePair) => void,
                           optionsList: INameValuePair[] = [],
                           defaultValue: any = null) {
            let me = this;
            me.options(optionsList);
            me.defaultValue = defaultValue;
            me.setValue(defaultValue);
            me.selectHandler = selectHandler;
            // me.subscription =  me.selected.subscribe(selectHandler);
        }

        public setOptions(optionsList: INameValuePair[] = [],
                          defaultValue: any = null) {
            let me = this;
            me.options(optionsList);
            me.setValue(defaultValue);
        }

        public hasOption(value: any) {
            let me = this;
            let options = me.options();
            let option = _.find(options, function (item: INameValuePair) {
                return item.Value == value;
            });
            return (!!option);
        }

        public setValue(value: any) {
            let me = this;
            let options = me.options();
            let option = _.find(options, function (item: INameValuePair) {
                return item.Value == value;
            });
            me.selected(option);
        }

        public getOptions() {
            let me = this;
            return me.options();
        }

        public setDefaultValue() {
            let me = this;
            me.setValue(me.defaultValue);
        }

        public getValue(defaultValue: any = '') {
            let me = this;
            let selection = me.selected();
            return selection ? selection.Value : defaultValue;
        }

        public getName(defaultName: string = '') {
            let me = this;
            let selection = me.selected();
            return selection ? selection.Name : defaultName;
        }

        public restoreDefault() {
            let me = this;
            me.setValue(me.defaultValue);
        }

        public unsubscribe() {
            let me = this;
            if (me.subscription) {
                me.subscription.dispose();
            }
        }

        public subscribe() {
            let me = this;
            me.subscription = me.selected.subscribe(me.selectHandler);
        }
    }
}

