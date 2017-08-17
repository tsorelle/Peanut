<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/12/2017
 * Time: 11:35 AM
 */
namespace Peanut\services;

use Tops\services\TServiceCommand;

class GetPackageListCommand extends TServiceCommand
{

    private function makeDto($name, $installed)
    {
        $result = new \stdClass();
        $result->name = $name;
        $result->status = $installed ? 'Installed' : 'Ready to install';
    }


    protected function run()
    {
        $result = array();
        $packageDir = realpath(__DIR__.'/../../../pnut/packages');
        $packages = scandir($packageDir);
        foreach ($packages as $package) {
            if ($package != '..' && $package != '.') {
                $flag = "$packageDir/$package/intalled.txt";
                $peanutInsallationLog = "$packageDir/$package/intalled.txt";
                $pkgInfo = new \stdClass();
                $pkgInfo->name = $package;
                $pkgInfo->status = file_exists($flag) ? 'Installed' : 'Ready to install';
                $result[] = $pkgInfo;
            }
        }

        $test = new \stdClass();
        $test->name = 'testpack';
        $test->status = 'Installed';
        $result[] = $test;
        $this->setReturnValue($result);
    }
}