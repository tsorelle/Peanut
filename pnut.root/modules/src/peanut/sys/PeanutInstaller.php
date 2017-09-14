<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2017
 * Time: 4:41 AM
 */
namespace Peanut\sys;

use DateTime;
use PHPUnit\Runner\Exception;
use Tops\sys\TDates;
use Tops\sys\TObjectContainer;
use Tops\sys\TPath;

abstract class PeanutInstaller
{
    /**
     * @var PeanutInstallationLog
     */
    private $log;
    public function openLog($location=null) {
        if (!isset($this->log)) {
            $this->log = new PeanutInstallationLog();
            $this->log->openLogFile($location);
        }
        return $this->log;
    }

    /**
     * @return PeanutInstaller
     */
    public static function GetInstaller()
    {
        if (TObjectContainer::HasDefinition('peanut.installer')) {
            return TObjectContainer::Get('peanut.installer');
        }
        return new DefaultPeanutInstaller();
    }

    private function getPackageInfo($package,$peanutInstalled=true) {
        $pkgInfo = new \stdClass();
        $pkgInfo->name = $package;
        $status = $this->getInstallationStatus($package);
        if ($status === false) {
            $pkgInfo->status =  $peanutInstalled ? 'Ready to install' : 'Please install Peanut first';
        }
        else {
            // $dt = strtotime($status->time);
            // $date = date($dt, 'M j h:i A');
            $date = TDates::reformatDateTime($status->time,'M j h:i A');
            $pkgInfo->status = "Installed version $status->version on $date";
        }
        return $pkgInfo;
    }




    public function getPackageList() {
        $result = array();
        $peanutResult = $this->getPackageInfo('peanut');
        $peanutInstalled = $peanutResult->status !== 'Ready to install';
        $result[] = $peanutResult;
        $packageDir = TPath::getFileRoot().PeanutSettings::GetPackagePath();
        $packages = scandir($packageDir);
        foreach ($packages as $package) {
            if ($package != '..' && $package != '.') {
                $result[] = $this->getPackageInfo($package,$peanutInstalled);
            }
        }
        return $result;
    }

    public function installPackage($package,$logLocation=null) {
        $log = new PeanutInstallationLog();
        $log->startSession($package,$logLocation);
        try {
            if ($package=='peanut') {
                $this->installPeanut();
            }
            $log->endSession();
        }
        catch (\Exception $ex) {
            $log->failSession("Exception: ".$ex->getMessage());
        }
        $result = new \stdClass();
        // $result->status = ($this->getInstallationStatus($package,$log) !== false);
        $result->status = $this->getInstallationStatus($package,$log);
        $result->log = $log->getLogFlat();
        return $result;
    }

    public function getInstallationStatus($package,PeanutInstallationLog $log = null)
    {
        if ($log === null) {
            $log = new PeanutInstallationLog();
            $archive = $log->readLogFile();
        }
        else {
            // $archive = $log->getArchive();
            $archive = $log->getLog();
        }

        return $this->findInstallationStatus($package, $archive);
    }

    public function installPeanut() {
        $this->doCustomSetup();
        // throw new \Exception('Test installation failure.');
    }

    abstract public function doCustomSetup();

    /**
     * @param $package
     * @param $archive
     * @return \stdClass
     */
    public function findInstallationStatus($package, $archive)
    {
        $result = false;
        if (array_key_exists($package, $archive)) {
            $packageEntries = $archive[$package];
            foreach ($packageEntries as $entry) {
                if ($entry->message === PeanutInstallationLog::InstallationCompletedMessage) {
                    $result = new \stdClass();
                    $result->version = $entry->version;
                    $result->time = $entry->time;
                }
            }
        }
        return $result;
    }


}