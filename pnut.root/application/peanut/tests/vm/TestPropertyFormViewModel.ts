/// <reference path='../../../../modules/pnut/core/ViewModelBase.ts' />
/// <reference path='../../../../modules/typings/knockout/knockout.d.ts' />
/// <reference path='../../../../modules/pnut/core/peanut.d.ts' />
/// <reference path='../../../../modules/pnut/components/entityPropertiesComponent.ts' />

namespace Peanut {

    export class TestPropertyFormViewModel extends Peanut.ViewModelBase {
        // observables
        propertiesController : entityPropertiesController;
        valuesView = ko.observableArray();

        init(successFunction?: () => void) {
            let me = this;
            console.log('TestPropertyForm Init');

            let lookups = [];
            lookups['one'] = [
                <ILookupItem>{
                    code : 'first',
                    description: 'first one',
                    id : 1,
                    name : 'First of one'
                },
                <ILookupItem>{
                    code : 'second',
                    description: 'second one',
                    id : 2,
                    name : 'Second of one'
                },
            ];

            lookups['two'] = [
                <ILookupItem>{
                    code : 'first',
                    description: 'one of two',
                    id : 1,
                    name : 'First of two'
                },
                <ILookupItem>{
                    code : 'second',
                    description: 'two of two',
                    id : 2,
                    name : 'Second of two'
                },
            ];


            let defs : IPropertyDefinition[] = [
                {
                    lookup: 'one',
                    // defaultValue: 2,
                    defaultValue: null,
                    key: 'item1',
                    label:  'Test one:',
                    required: false
                },
                {
                    lookup: 'two',
                    // defaultValue: 2,
                    defaultValue: null,
                    key: 'item2',
                    label:  'Test two:',
                    required: false
                },
                {
                    lookup: 'one',
                    // defaultValue: 2,
                    defaultValue: null,
                    key: 'item3',
                    label:  'Test three:',
                    required: false
                },
                {
                    lookup: 'two',
                    // defaultValue: 2,
                    defaultValue: null,
                    key: 'item4',
                    label:  'Test four:',
                    required: false
                },
                {
                    lookup: 'two',
                    // defaultValue: 2,
                    defaultValue: null,
                    key: 'item5',
                    label:  'Test five:',
                    required: false
                },
            ];

            me.application.registerComponents('@pnut/entity-properties', () => {
                this.propertiesController = new entityPropertiesController(defs,lookups,'(any)');
                me.bindDefaultSection();
                successFunction();
            });
        }

        getValues = () => {
            let values = this.propertiesController.getValues();
            this.valuesView([]);
            for(let key in values) {
                this.valuesView.push({key: key, value: values[key]});
            }
        };

        setValues = () => {
            let values = [];
            values['item1'] = 1;
            values['item2'] = 2;
            values['item3'] = null;
            values['item4'] = 1;
            values['item5'] = 2;
            this.propertiesController.setValues(values);
        };

        clearValues = () => {
            this.propertiesController.clearValues();
        };
    }
}
