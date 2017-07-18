##Directory Structure:

* mvvm:  root of application view models, components and dependencies
   * components: Knockout component view models
   * templates: HTML Templates for components etc.
   * examples: documentation
   * images
   * templates: Knockout component templates
   * views: html fragments for Knockout views
   * vm: view models

* pnut:  Peanut application and framework
   * components: Knockout component view models
   * templates: HTML Templates for components etc.
   * examples: documentation
   * images
   * templates: Knockout component templates
   * views: html fragments for Knockout views
   * src: PHP source code
   * service.php: entry point for services

* js:   third party js.* and ts.*

* typings:  Typscript d.ts files used by in common by ts files in pnut and mvvm

* tops: PHP implementation of Peanut services.

* cms: a very simple content managment system supporting view models. Provides examples
you can use to adapt to systems such as Drupal, Concrete5, Wordpress.

* root files:
    * service.php:  entry point for Peanut service commands. May be adapted to the target
    cms system.
    * index.php: startup file
    
    
##Usage

`index.php?vm=[view model name]`
