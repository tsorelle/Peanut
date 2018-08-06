/// <reference path='../../typings/knockout/knockout.d.ts' />
namespace Peanut {
    export class entityPropertiesController {
        public controls: IPropertyControl[] = [];
        private defaults = [];

        constructor(properties: IPropertyDefinition[],lookups : any[], selectText : string = 'Select') {
            let me=this;

            for (let i = 0; i< properties.length; i++) {
                let property = properties[i];
                let lookup = lookups[property.lookup];

                me.controls[property.key] = <IPropertyControl>{
                    lookup: lookup,
                    // selected : ko.observable(me.getLookupValue(property.value,lookup)),
                    selected : ko.observable(property.defaultValue),
                    label : property.label,
                    // caption: (property.value && property.required) || (!property.required) ? null : selectText
                    caption: (property.required && property.defaultValue) ? null : selectText
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
            me.controls[key].selected(item);
        }

        setValues(values : any[]) {
            let me = this;
            for(let key in values) {
                me.setValue(key,values[key]);
            }
        }
        clearValues = () => {
            this.setValues(this.defaults);
        };

        getValues() {
            let me = this;
            let result = [];
            for(let key in me.controls) {
                let item = me.controls[key];
                let value = item.selected();
                result[key] =  value ? value.id : null;
            }
            return result;
        }
    }

    export class entityPropertiesComponent {
        // observables
        propertyRows =  ko.observableArray([]);
        // propertyControls =  ko.observableArray([]);

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
                    cssColumn: columnClass
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