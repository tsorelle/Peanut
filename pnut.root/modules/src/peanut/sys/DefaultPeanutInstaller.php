<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2017
 * Time: 5:09 AM
 */

namespace Peanut\sys;


class DefaultPeanutInstaller extends PeanutInstaller
{

    public function doCustomSetup($testing=false)
    {
        // Implement doCustomSetup() method in cms specific versions.
    }

    public function doTeardown($testing=false) {
        // Implement doCustomSetup() method in cms specific versions.
    }
}