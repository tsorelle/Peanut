#Peanut Theme Adaptation
For an actual Peanut CMS implementation such as in ```Wordpress, Drupal``` or ```Concrete5``` 
a custom theme must be provided that supports the following requirements and adaptations. 
It is usually most convenient to start from an existing theme that is build around JQuery and Bootstrap.

If the CMS features "child thems" (Wordpress) or "sub-themes" (Drupal) it is recommended to derive a new theme containing
 the needed Peanut modifications. This enhances clarity and preserves your ability to update the base theme from the original vendor as needed.

##Javascript Requirements
As appropiate to the CMS, the initialization code must ensure that the following javascript files be included in the rendered page.
It is preferred to handle these script inclusions on the package level 
(i.e. package in Concrete5, module in Drupal, plugin in Wordpress). Themes can then be swapped 
 without applying these modifications.

1. JQuery (usually included with the CMS or parent theme)
2. Bootstrap js files including modal. (usually included with the CMS or parent theme) - depends on JQuery
3. ```head.load.js``` - usually placed in js/libraries theme subdirectory
4.  ```pnut/core/loader.js``` - depends on ```head.load.js``` and JQuery.

All other scripts are loaded dynamically by the Peanut loader using ```head.load.js```.

##Template and Function Changes for Peanut
Your theme must provide templates and supporting code for:

Insertion of the <service-messages> component container, just preceding the content section.

```html
<div class="col-md-12" id='service-messages-container'><service-messages></service-messages></div>
```

Insertion of the view model start up script at the end of the page, immediately following the ```<\body>``` tag.

```html
<script>
   Peanut.Loader.startApplication('[insert view model name here]');     
</script>
```

By convention, supporting code is contained in a custom class e.g. ```Tops\(cms-name)\TViewModel```.

