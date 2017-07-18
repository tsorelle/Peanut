# Component Loading functions in Application class (App.ts)

## Comments from App.ts
        /**************************************************
         * Component handling
         *
         * Terms as used here:
         *    Component Protype: A view model type. Implemented as a TypeScript class or Javascript constructor function.
         *          TypeScript class is preferred.
         *    Component instance:  An instance of a view model.  Typically used if the instance is shared between components
         *          or if the main view model needs direct access to the component view model for initialization or communication.
         *    Template: HTML markup for the component.
         *    Load: retrieve a component prototype or template from the server.
         *    Register: load the component template then use ko.component.register to register the component.
         *    Attach:  Attach functions are typically used for standalone components that are loaded on demand.
         *      Refers to a single standalone component in a component container tag. e.g.
         *          <div my-component-container><my-component></div>
         *          To attach is to
         *            1. Load (if component prototype is used)
         *            2. Register
         *            3. Bind
         *    Component location:  A folder on the server where component view models and templates are stored.
         *          These must have at least two subdirectories: components and templates.
         *    Component name:  The identifying name of a component corresponding to files in a component location.
         *          These names are lower case with parts seperated by dashes. This is converted to camel case for the actual file names:
         *          e.g.
         *              Component name: test-form
         *              View model file:  (location)/components/testFormComponent.js
         *              Template file:  (location)/templates/testForm.html
         *          A component name contain a file prefix as described below
         *          e.g.
         *              @pnut/test-form
         *
         *    Component and file prefixes.  Prefixes beginning with an @ sign and ending with / my be prepended to a file or component name
         *          These reference the Config object for root locations.
         *          @pnut/ refers to the peanut core file location  e.g.  /pnut
         *          @app/ referes to the application file location. e.g.  /application/mvvm
         *
         *          These two are assumed to be component locations.  Other locations may be indicated:
         *          @core/  peanut core file.  Eg. /pnut/core
         *          If './' or 'http' preceeds the file name a literal path is used.
         *          Otherwise, @app/ is assumed as the defaule.
         *
         *     VM factory.  A function responsible for creating a component instance on the fly.  It must take the signature:
         *          (vmInstance : any, finalFunction: (vm: any) => void)
         *          The function must pass a newly instantiated view model to the finalFunction.
         **************************************************/

## Binding Routines
    bindNode - Apply KnockoutJS bindings to a single HTML node (not descendents)
        uses ko.applyBindingsToNode()

    bindSection - Apply KnockoutJS bindings to a DIV or other element and it's decendents.
        uses ko.applyBindings()
        see: http://knockoutjs.com/documentation/observables.html
    
## Scenarios

### Component tag in Main Section
Component name: test-form
View model name: TestPage
Markup
```html
<div id="testpage-view-container" style="display: none">
    <test-form></test-form>
</div>
```

In ViewModel

```php
    init(successFunction?: () => void) {
        let me = this;
        
        // load and register the component prototype
        me.application.registerComponentPrototype('test-form', () => {
        
            // Bind and display all components in 'testpage-view-container'
            me.bindDefaultSection();
            successFunction();
        });
    }

```

### Multiple Component tags in Main Section
Component name: test-form
View model name: TestPage
Markup
```html
<div id="testpage-view-container" style="display: none">
    <test-one></test-one>
    <test-two></test-two>
    <test-three></test-three>
</div>
```

In ViewModel

```php
    init(successFunction?: () => void) {
        let me = this;
        
        // load and register the component prototype
        me.application.registerComponents('test-one,test-two,test-three', () => {
        
            // Bind and display all components in 'testpage-view-container'
            me.bindDefaultSection();
            successFunction();
        });
    }

```

### Load component on demand
Component name: test-form
View model name: TestPage
Markup
```html
<div id="testpage-view-container" style="display: none">
    <test-one></test-one>
    <test-two></test-two>
    <test-three></test-three>
</div>
<div id="test-form-container"><test-form></test-form></div>
```

In ViewModel

```
    init(successFunction?: () => void) {
        let me = this;
        
        // load and register the component prototype
        me.application.registerComponents('test-one,test-two,test-three', () => {
        
            // Bind and display all components in 'testpage-view-container'
            me.bindDefaultSection();
            successFunction();
        });
    }
    
    showForm() {
        this.application.loadResources('testFormComponent.js', () => {
            me.testForm = new Bookstore.testFormComponent();
        }
    }

```
