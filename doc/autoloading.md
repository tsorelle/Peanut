#Autoloading in implementations

Autoloading may be handled differently in different CMS environments.

Mapping requirements are:

1. Map 'Tops\' to the Tops library files location
2. Map peanut package namespaces.

If using composer put this sample code in your initialization routines

```php
$loader = include("$fileRoot/vendor/autoload.php");
$packages = TViewModelManager::getPackageList();
if (!empty($packages)) {
     $peanutPath = TConfiguration::getValue('peanutRootPath','peanut','pnut');
     // if package path not configured, default to packages sub-dir of the peanut directory
     $packagePath = TConfiguration::getValue('packagePath','peanut', $peanutPath . '/packages');
    foreach ($packages as $package) {
        $namespace = TStrings::toCamelCase($package);
        $srcRoot = $fileRoot.$packagePath."/$package/src";
        $loader->addPsr4($namespace.'\\', $srcRoot);
    }
}
```

Otherwise use the appropriate method to map \Tops and adapt the package loading routine accordingly.
See the Concrete5 and Drupal 8 implementations for example.
