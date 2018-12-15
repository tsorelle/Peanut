/// <reference path='../../typings/knockout/knockout.d.ts' />
namespace Peanut {

    import IKeyValuePair = Peanut.IKeyValuePair;

    export class entityPropertiesController {
        public controls: IPropertyControl[] = [];
        private defaults = [];

        constructor(properties: IPropertyDefinition[],lookups : any[], selectText : string = 'Select', clearValues: boolean = false) {
            let me=this;

            for (let i = 0; i< properties.length; i++) {
                let property = properties[i];
                let lookup = lookups[property.lookup];
                let defaultItem = me.getLookupValue(property.defaultValue,lookup);
                me.controls[property.key] = <IPropertyControl>{
                    lookup: lookup,
                    selected : ko.observable(defaultItem),
                    label : property.label,
                    caption: ((property.required && property.defaultValue) && !clearValues) ? null : selectText,
                    displayText: defaultItem ?  defaultItem.name : ''
                };
                me.defaults[property.key] = property.defaultValue;
            }
        }

        getLookupValue(value: any, lookupList: ILookupItem[]) {
            for (let i = 0; i< lookupList.length; i++) {
                let lookupItem = lookupList[i];
                if (lookupItem.id == value) {
                    return lookupItem;
                }
            }
            return null;
        }

        setValue(key: string, value: any) {
            let me = this;
            let control = me.controls[key];
            let item = me.getLookupValue(value, control.lookup);
            me.controls[key].displayText = item ? item.name : '';
            me.controls[key].selected(item);
        }

        setAssociatedValues(values : any[]) {
            let me = this;
            for(let key in values) {
                me.setValue(key,values[key]);
            }
        }

        setValues(values : IKeyValuePair[]) {
            let me = this;
            for(let i=0;i<values.length;i++) {
                me.setValue(values[i].Key, values[i].Value);
            }
        }

        clearValues = () => {
            this.setAssociatedValues(this.defaults);
        };

        getValue = (key: string) => {
            let item = this.controls[key];
            let value = item.selected();
            return value || null;
        };

        getValues() {
            let me = this;
            let result = [];
            for(let key in me.controls) {
                let item = me.controls[key];
                let value = item.selected();
                if (value) {
                    result.push(<IKeyValuePair>{
                        Key: key,
                        Value: value.id
                    });
                }
            }
            return result;
        }
    }

    export class entityPropertiesComponent {
        // observables
        propertyRows =  ko.observableArray([]);
        // propertyControls =  ko.observableArray([]);

        readOnly = ko.observable(false);

        constructor(params: any) {
            let me = this;

            if (!params) {
                console.error('entityPropertiesComponent: Params not defined in entityPropertiesComponent');
                return;
            }

            if (!params.controller) {
                console.error('entityPropertiesComponent: Parameter "controller" is required');
                return;
            }


            me.readOnly(params.readOnly == 1);
            let test = me.readOnly();

            let clearValues = params.clearValues;

            let columnCount = 3;
            let columnWidth = 'md';
            if (params.columns) {
                columnCount = params.columns;
            }

            if (params.colwidth) {
                columnWidth = params.colwidth;
            }
            let columnClass = 'col-'+columnWidth+'-'+(Math.floor(12/columnCount));
            let rows = [];
            let controls = [];

            let i = 0;
            for (let key in params.controller.controls) {
                let control = params.controller.controls[key];
                let lookup =  ko.observableArray(control.lookup);
                // let value = control.selected();
                controls.push({
                    label : control.label,
                    lookup: lookup,
                    selected: control.selected,
                    caption: control.caption,
                    cssColumn: columnClass,
                    displayText: control.displayText
                });
                if (++i === columnCount) {
                    rows.push(ko.observableArray(controls));
                    controls = [];
                }
            }
            if (controls.length > 0) {
                rows.push(ko.observableArray(controls));
            }
            me.propertyRows(rows);

        }
    }
}