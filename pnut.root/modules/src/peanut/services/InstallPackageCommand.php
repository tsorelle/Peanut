<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/17/2017
 * Time: 5:01 PM
 */

namespace Peanut\services;


use Peanut\sys\PeanutInstaller;
use Tops\services\TServiceCommand;

class InstallPackageCommand extends TServiceCommand
{

    protected function run()
    {
       $package = $this->getRequest();
       $installer = PeanutInstaller::GetInstaller();
       $installer->installPackage($package);
    }
}