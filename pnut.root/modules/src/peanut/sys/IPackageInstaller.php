<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/15/2017
 * Time: 7:24 AM
 */

namespace Peanut\sys;


interface IPackageInstaller
{
    public function run(PeanutInstallationLog $log);
}