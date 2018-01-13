The BootstrapFA ui extension uses the Bootstrap Frameworks with the FontAwesome icon fonts.

You must have Bootstrap installed and loaded from the initial page. Typically you would use a CMS theme that supports Bootstrap.
Additionally, a link to the FontAwesome library must be provided in application/settings.ini

    [libraries]
    fontawesome='https://use.fontawesome.com/3914690617.js'

If using a CMS, such as Concrete5, that already loads fontawesome fonts this entry may be ommitted.

If using the fontawesome CDN as in the above example, a customized url for your installation should be generated on
http://fontawesome.io/get-started/

If you prefer to use Bootstrap without FontAwesome, use the Bootstrap extension by adding this setting to application/settings.ini

    [peanut]
    uiExtension=Bootstrap




