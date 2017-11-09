Peanut is the default ui extension, uses the Bootstrap Framework, FontAwesome icon fonts, JQuery and Bootstrap and JQueryUi
You must have JQuery and Bootstrap installed and loaded from the initial page. Typically you would use a CMS theme that supports Bootstrap.

The roles of these libraries are:
- JQuery: DOM manipulation and services
- Bootstrap provides column organization, modal dialogs and lots more
- Fontawesome is a collection of icon font that is more versatile than the Glypicons the come with Boot strap
- JqueryUI is used for its datepicker component. Other features are available.  Most of these duplicate the Bootstrap features.


Additionally, links to the FontAwesome and JqueryUI libraries must be provided in application/settings.ini

    [libraries]
    fontawesome='https://use.fontawesome.com/3914690617.js'
    jqueryui-css='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css'
    jqueryui-js='https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js'


If using a CMS, such as Concrete5, that already loads fontawesome fonts this entry may be ommitted.

If using the fontawesome CDN as in the above example, a customized url for your installation should be generated on
http://fontawesome.io/get-started/

Information on JQueryUi CDNs can be found on https://developers.google.com/speed/libraries/

If you prefer to use Bootstrap without FontAwesome, use the Bootstrap extension by adding this setting to application/settings.ini

    [peanut]
    uiExtension=Bootstrap




