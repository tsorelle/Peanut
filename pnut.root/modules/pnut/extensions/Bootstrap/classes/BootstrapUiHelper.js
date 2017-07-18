var Peanut;
(function (Peanut) {
    var BootstrapUiHelper = (function () {
        function BootstrapUiHelper() {
            var _this = this;
            this.showMessage = function (message, id, container) {
                var span = container.find('#' + id);
                span.text(message);
                _this.showModal(container);
            };
            this.hideMessage = function (container) {
                _this.hideModal(container);
            };
            this.showModal = function (container) {
                if (navigator.appName == 'Microsoft Internet Explorer') {
                    container.removeClass('fade');
                }
                container.modal();
            };
            this.hideModal = function (container) {
                container.modal('hide');
            };
        }
        return BootstrapUiHelper;
    }());
    Peanut.BootstrapUiHelper = BootstrapUiHelper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vdHN0cmFwVWlIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJCb290c3RyYXBVaUhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxJQUFVLE1BQU0sQ0F5QmY7QUF6QkQsV0FBVSxNQUFNO0lBSVo7UUFBQTtZQUFBLGlCQW9CQztZQW5CVSxnQkFBVyxHQUFHLFVBQUMsT0FBZSxFQUFFLEVBQVUsRUFBRyxTQUFlO2dCQUMvRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDbkIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7WUFDSyxnQkFBVyxHQUFHLFVBQUMsU0FBZTtnQkFDakMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7WUFFSyxjQUFTLEdBQUcsVUFBQyxTQUFlO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxJQUFJLDZCQUE2QixDQUFDLENBQUMsQ0FBQztvQkFDckQsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEMsQ0FBQztnQkFDRCxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDO1lBRUssY0FBUyxHQUFHLFVBQUMsU0FBYztnQkFDOUIsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUM7UUFDTixDQUFDO1FBQUQsd0JBQUM7SUFBRCxDQUFDLEFBcEJELElBb0JDO0lBcEJZLHdCQUFpQixvQkFvQjdCLENBQUE7QUFDTCxDQUFDLEVBekJTLE1BQU0sS0FBTixNQUFNLFFBeUJmIn0=