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

class UninstallPackageCommand extends TServiceCommand
{

    /**
     *  Service Interfaces (TypeScript)
     *    interface pkgListItem {
     *        name: string;
     *        status: string;
     *    }
     *    interface installPkgResponse {
     *        success: boolean;
     *        list: pkgListItem[];
     *        log: string[];
     *    }
     * Request:
     *      string - name of package
     * Response:
     *      installPackageResponse
     *
     */
    protected function run()
    {
        $package = $this->getRequest();
        $installer = PeanutInstaller::GetInstaller();
        $installResult = ($package == 'peanut') ?
            $installer->uninstallAll() :
            $installer->uninstallPackage($package);
        $result = new \stdClass();
        $result->success = $installResult;

        if ($result->success) {
            $this->addInfoMessage("Unistalled $package");
        } else {
            $this->addErrorMessage("Uninstall of package '$package' failed.");
        }
        $result->log = $installResult->log;
        $result->list = $installer->getPackageList();
        $this->setReturnValue($result);
    }
}