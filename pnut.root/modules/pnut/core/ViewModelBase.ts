/**
 * Created by Terry on 5/20/2017.
 */
///<reference path="Services.ts"/>
///<reference path="Peanut.d.ts"/>
///<reference path="../../typings/jquery/jquery.d.ts"/>
namespace Peanut {
    export abstract class ViewModelBase implements IViewModel{
        protected services: ServiceBroker;
        protected application: IPeanutClient;

        abstract init(successFunction?: () => void);
        public start = (application : IPeanutClient, successFunction?: (viewModel: IViewModel) => void)  => {
            let me = this;
            me.application = application;
            me.services = ServiceBroker.getInstance(application);
            me.init(() => {
                successFunction(me);
            });
        };

        private vmName : string = null;
        public setVmName = (name: string) => {
            this.vmName = name;
        };

        protected getVmName = () => {
            return this.vmName;
        };

        /**
         * Get element id for the default containing DIV,  e.g.  TestPageViewModel => testpage-view-container
         * @returns {string}
         */
        protected getSectionName = () => {
            return this.getVmName().toLowerCase() + '-view-container';
        };

        /**
         *  Show the default section (see getSectionName())
         *  Use this when the view only contains components.
         */
        protected showDefaultSection = () => {
            let sectionName = this.getSectionName();
            jQuery("#" + sectionName).show();
        };

        /**
         *  Bind and display the default section
         */
        protected bindDefaultSection = () => {
            let sectionName = this.getSectionName();
            this.application.bindSection(sectionName,this);
        };

        protected attachComponent = (componentName: string, section?: string) => {
            this.application.registerComponentPrototype(componentName,() => {
                if (!section) {
                    section =  componentName.split('/').pop() + '-container';
                }
                this.application.bindSection(section,this)
            });
        };
    }
} // end namespace
