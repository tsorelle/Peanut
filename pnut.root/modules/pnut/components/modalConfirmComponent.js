var Peanut;
(function (Peanut) {
    var modalConfirmComponent = (function () {
        function modalConfirmComponent(params) {
            var me = this;
            if (!params) {
                throw ('Params not defined in modalConfirmComponent');
            }
            me.modalId = ko.observable(params.id);
            me.confirmClick = params.confirmClick;
            me.headerText = (typeof params.headerText == 'string') ? ko.observable(params.headerText) : params.headerText;
            me.bodyText = (typeof params.bodyText == 'string') ? ko.observable(params.bodyText) : params.bodyText;
            var buttonSet = (params.buttonSet) ? params.buttonSet : 'okcancel';
            me.showOkButton = ko.observable(buttonSet != 'alert');
            switch (buttonSet) {
                case 'alert':
                    me.okLabel = ko.observable('');
                    me.cancelLabel = ko.observable('Continue');
                    break;
                case 'yesno':
                    me.okLabel = ko.observable('Yes');
                    me.cancelLabel = ko.observable('No');
                    break;
                case 'okcancel':
                    me.okLabel = ko.observable('Ok');
                    me.cancelLabel = ko.observable('Cancel');
                    break;
                default:
                    var parts = buttonSet.split('||');
                    if (parts.length == 2) {
                        me.okLabel = ko.observable(parts[0]);
                        me.cancelLabel = ko.observable(parts[1]);
                    }
                    else {
                        me.okLabel = ko.observable('Ok');
                        me.cancelLabel = ko.observable('Cancel');
                    }
                    break;
            }
        }
        return modalConfirmComponent;
    }());
    Peanut.modalConfirmComponent = modalConfirmComponent;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWxDb25maXJtQ29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kYWxDb25maXJtQ29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLElBQVUsTUFBTSxDQWdEZjtBQWhERCxXQUFVLE1BQU07SUFDWjtRQVFJLCtCQUFZLE1BQVk7WUFDcEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRWQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNWLE1BQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1lBQ3pELENBQUM7WUFDRCxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUN0QyxFQUFFLENBQUMsVUFBVSxHQUFHLENBQUMsT0FBTyxNQUFNLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxHQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDL0csRUFBRSxDQUFDLFFBQVEsR0FBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3hHLElBQUksU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQ25FLEVBQUUsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLENBQUM7WUFDdEQsTUFBTSxDQUFBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFLLE9BQU87b0JBQ1IsRUFBRSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUMvQixFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQzNDLEtBQUssQ0FBQztnQkFDVixLQUFLLE9BQU87b0JBQ1IsRUFBRSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNsQyxFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JDLEtBQUssQ0FBQztnQkFDVixLQUFLLFVBQVU7b0JBQ1gsRUFBRSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqQyxFQUFFLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3pDLEtBQUssQ0FBQztnQkFDVjtvQkFDSSxJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLEVBQUUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckMsRUFBRSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxDQUFDO29CQUNELElBQUksQ0FBQyxDQUFDO3dCQUNGLEVBQUUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDakMsRUFBRSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM3QyxDQUFDO29CQUNELEtBQUssQ0FBQztZQUNkLENBQUM7UUFDTCxDQUFDO1FBQ0wsNEJBQUM7SUFBRCxDQUFDLEFBOUNELElBOENDO0lBOUNZLDRCQUFxQix3QkE4Q2pDLENBQUE7QUFDTCxDQUFDLEVBaERTLE1BQU0sS0FBTixNQUFNLFFBZ0RmIn0=