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
use Tops\db\TDbInstaller;
use Tops\sys\IPermissionsManager;
use Tops\sys\TDates;
use Tops\sys\TIniSettings;
use Tops\sys\TObjectContainer;
use Tops\sys\TPath;

abstract class PeanutInstaller
{
    /**
     * @var PeanutInstallationLog
     */
    private $log;

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

    /**
     * @param $package
     * @param bool $peanutInstalled
     * @return \stdClass
     *
     * Used by gePackageList
     */
    private function getPackageInfo($package,$peanutInstalled=true) {
        $pkgInfo = new \stdClass();
        $pkgInfo->name = $package;
        $status = $this->getInstallationStatus($package);
        if ($status === false) {
            $pkgInfo->status =  $peanutInstalled ? 'Ready to install' : 'Please install Peanut first';
        }
        else {
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
        $this->log = new PeanutInstallationLog();
         if ($this->log->startSession($package,$logLocation) === false) {
             return $this->getInstallationResult($package);
         }

         $installPath = $package == 'peanut' ? 'application/install' :
             PeanutSettings::GetPackagePath()."/$package/install";

        $config = TIniSettings::Create('install.ini',
           TPath::fromFileRoot($installPath));
        if ($config === false) {
            $config = array();
        }
        $testing = $config->getBoolean('test','settings');
        try {
            $tables = $config->getSection('tables');
            if (!empty($tables)) {
                $dbInstaller = new TDbInstaller();
                if ($testing) {
                    $this->addLogEntry('Test: create schema');
                }
                else {
                    $dbLog = $dbInstaller->installSchema($config,$installPath.'/sql');
                    foreach ($dbLog as $entry) {
                        $this->log->addLogEntry($entry);
                    }
                }
            }

            $roles =  $config->getSection('roles');
            $permissions = $config->getSection('permissions');
            $permissionRoles = $config->getSection('permission-roles');
            if (!(empty($roles) && empty($permissions) && empty($permissionRoles))) {
                /**
                 * @var $manager IPermissionsManager
                 */
                $manager = TObjectContainer::Get('tops.permissions');
                if (empty($manager)) {
                    throw new \Exception('Permission manager not registered in classes.ini');
                }

                if (!empty($roles)) {
                    foreach ($roles as $roleName => $description) {
                        $manager->addRole($roleName, $description);
                        $this->addLogEntry("Added role '$roleName'");
                    }
                }

                if (!empty($permissions)) {
                    foreach ($permissions as $permission => $description) {
                        $manager->addPermission($permission, $description);
                        $this->addLogEntry("Added permission '$permission'");
                    }
                }

                if (!empty($permissionRoles)) {
                    foreach ($permissionRoles as $permission => $value) {
                        $roleNames = explode(',',$value);
                        foreach ($roleNames as $roleName) {
                            $manager->assignPermission($roleName, $permission);
                            $this->addLogEntry("Granted permission '$permission' to '$roleName'");
                        }
                    }
                }
                if ($package == 'peanut') {
                    $this->doCustomSetup();
                }
                else {
                    if (file_exists(PeanutSettings::GetPackagePath()."/$package/src/install/PackageInstaller.php")) {
                        $classname = ucfirst($package).'\\install\\PackageInstaller';
                        /**
                         * @var $instance IPackageInstaller
                         */
                        $instance = new $classname();
                        $instance->run($this->log);
                    }

                }
            }

            $this->log->endSession();
        }
        catch (\Exception $ex) {
            $this->log->failSession("Exception: ".$ex->getMessage());
        }
        return $this->getInstallationResult($package);
    }

    public function getInstallationStatus($package,PeanutInstallationLog $log = null)
    {
        if ($log === null) {
            // when called to get package info for listing, retrieve the entire log
            $log = new PeanutInstallationLog();
            $logContent = $log->readLogFile();
        }
        else {
            // at end of install, the currnt log is provided
            $logContent = $log->getLog();
        }

        return $this->findInstallationStatus($package, $logContent);
    }

    function installPeanut() {
        $this->installPeanutSchema();
        $this->doCustomSetup();
    }

    protected function installPeanutSchema() {
        $dbInstaller = new TDbInstaller();
        $dbLog = $dbInstaller->installTopsSchema();
        foreach ($dbLog as $entry) {
            $this->log->addLogEntry($entry);
        }
    }

    protected function addLogEntry($message) {
        $this->log->addLogEntry($message);
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

    /**
     * @param $package
     * @return \stdClass
     */
    private function getInstallationResult($package): \stdClass
    {
        $result = new \stdClass();
        $result->status = $this->getInstallationStatus($package, $this->log);
        $result->log = $this->log->getLogMessages($package);
        return $result;
    }


}