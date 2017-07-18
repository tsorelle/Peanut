# Adaptation steps for Concrete 5.8 site

1. copy settings.ini and settings.php  from application/config to (c5)/application/config
1. Update ini [peanut]vmNamespace='Bookstore' e.g. 'Aftm'
1. Update ini [peanut]peanutRootPath=packages\knockout_view\pnut
1. Update ini [peanut]corePath=packages\knockout_view\pnut\core
1. Update  ini [peanut]serviceUrl = /tops/service/execute
1. Update  ini [autoload]srcPath * (not used in c5?)
1. Update  ini [autoload]topsPath * (not used in c5?)
1. Update ini [classes]tops.userfactory = /Tops/sys/concrete5/TConcrete5UserFactory
1. Update ini [classes]services.inputhandler = /Tops/concrete5/ServiceRequestInputHandler
1. Update ini [service]applicationNamespace e.g /Application/Aftm
1. Update [permissions] section
1. Change namespace (module) in View Models e.g. 'namespace Aftm {'
1. Update /application/bootstrap/app.php per example in implementations
1. Replace /application/src/tops with souce from tops project
1. Copy implementations/concrete5 to /application/src/tops/concrete5
1. Update /application/src/tops/settings.ini:
1. Update setting: root-level=3
1. Update setting: app-config-location=application/config
1. Update or create /application/mvvm directoty: components,etc.
1. packages/knockout_view/controller.php (* set up github for this)

## Install or update  Knockout view
1. packages/knockout_view/controller.php 
- on_start() - change 'topspeanut' registration to point to core/Loader
- view() 
    - remove $this->requireAsset('javascript','topsapp');
    - change addFooterItem 
    - copy typings dir to packages/knockout_view 
