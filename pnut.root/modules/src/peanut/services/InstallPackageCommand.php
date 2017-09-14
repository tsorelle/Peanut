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
        $installResult = $installer->installPackage($package);
        $result = new \stdClass();
        $result->success = $installResult->status !== false;

        if ($result->success) {
            $this->addInfoMessage("Installed package '$package' version " . $installResult->status->version);
        } else {
            $this->addErrorMessage("Installation of package '$package' failed.");
        }
        $result->log = $installResult->log;
        if (!empty($result->log)) {
            array_shift($result->log); // remove start message.
        }
        $result->list = $installer->getPackageList();
        $this->setReturnValue($result);
    }
}