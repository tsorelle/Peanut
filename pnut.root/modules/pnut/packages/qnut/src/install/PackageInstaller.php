<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/15/2017
 * Time: 6:41 AM
 */

namespace Qnut\install;

use Peanut\sys\IPackageInstaller;
use Peanut\sys\PeanutInstallationLog;

class PackageInstaller implements IPackageInstaller
{
    public function run(PeanutInstallationLog $log) {
        $log->addLogEntry('Ran extra tasks');
    }
}