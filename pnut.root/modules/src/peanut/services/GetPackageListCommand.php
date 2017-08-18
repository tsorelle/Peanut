<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/12/2017
 * Time: 11:35 AM
 */
namespace Peanut\services;

use Peanut\sys\PeanutInstallationLog;
use Peanut\sys\PeanutInstaller;
use Tops\services\TServiceCommand;

class GetPackageListCommand extends TServiceCommand
{
    /**
     * @var PeanutInstaller
     */
    private $installer;


    protected function run()
    {
        $installer = PeanutInstaller::GetInstaller();
        $result = $installer->getPackageList();
        $this->setReturnValue($result);
    }
}