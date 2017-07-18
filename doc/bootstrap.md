##Bootstrap Dependencies
A couple of components of Peanut use the Bootstrap javascript components, especially for modal dialogs.

See: http://getbootstrap.com/javascript/#modals

However, one can plug in a different framework using Peanut extensions.

To use a different method of displaying the wait messages, 
Create an extension class in extensions sub-directory and add the name to application/config/settings.ini as
uiExtension=MyCustomExtension.  See pnut/extensions/Bootstrap for a model example.

The ModalConfirm component is designed for Bootstrap. The Peanut core, however, is not dependent on this component. 
It is available to your view models as demonstrated in  application\mvvm\vm\TestPageViewModel.ts.
An alternative component could be written based on ModalConfirm and 
installed in the application or packages directory.  

