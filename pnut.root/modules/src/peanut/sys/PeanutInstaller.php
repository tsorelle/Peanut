<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2017
 * Time: 4:41 AM
 */
namespace Peanut\sys;

use Tops\db\TDbInstaller;
use Tops\sys\TPermissionsManager;
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
        $pkgInfo->installed = 0;

        $status = $this->getInstallationStatus($package);
        if ($status === false) {
            if ($package != 'peanut' && (!$peanutInstalled)) {
                $pkgInfo->installed = -1;
            }
            $pkgInfo->status =  $peanutInstalled ? 'Ready to install' : 'Please install Peanut first';
        }
        else {
            $date = TDates::reformatDateTime($status->time,'M j h:i A');
            $pkgInfo->status = "Installed version $status->version on $date";
            $pkgInfo->installed = 1;
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

         $settings = $this->getSettings();
         $installPath = $package == 'peanut' ? 'application/install' :
             PeanutSettings::GetPackagePath()."/$package/install";

        $config = TIniSettings::Create('install.ini',
           TPath::fromFileRoot($installPath));
        if ($config === false) {
            $config = array();
        }
        $testing = $settings->testing;
        try {
            $tables = $config->getSection('tables');
            if (!empty($tables)) {
                $dbInstaller = new TDbInstaller();
                $dbLog = $testing ?
                    $dbInstaller->testInstallSchema($config,$installPath.'/sql'):
                    $dbInstaller->installSchema($config,$installPath.'/sql');
                foreach ($dbLog as $entry) {
                    $this->log->addLogEntry($entry);
                }
            }

            $roles =  $config->getSection('roles');
            $permissions = $config->getSection('permissions');
            $permissionRoles = $config->getSection('permission-roles');
            if (!(empty($roles) && empty($permissions) && empty($permissionRoles))) {
                /**
                 * @var $manager TPermissionsManager
                 */
                $manager = TPermissionsManager::getPermissionManager();
                if (empty($manager)) {
                    throw new \Exception('Permission manager not registered in classes.ini');
                }

                if (!empty($roles)) {
                    foreach ($roles as $roleName => $description) {
                        if ($testing) {
                            $this->addLogEntry("TEST: Added role '$roleName'");
                        }
                        else {
                            $manager->addRole($roleName, $description);
                            $this->addLogEntry("Added role '$roleName'");
                        }
                    }
                }

                if (!empty($permissions)) {
                    foreach ($permissions as $permission => $description) {
                        if ($testing) {
                            $this->addLogEntry("TEST: Added permission '$permission'");
                        }
                        else {
                            $manager->addPermission($permission, $description);
                            $this->addLogEntry("Added permission '$permission'");
                        }
                    }
                }

                if (!empty($permissionRoles)) {
                    foreach ($permissionRoles as $permission => $value) {
                        $roleNames = explode(',',$value);
                        foreach ($roleNames as $roleName) {
                            if ($testing) {
                                $this->addLogEntry("TEST: Granted permission '$permission' to '$roleName'");
                            }
                            else {
                                $manager->assignPermission($roleName, $permission);
                                $this->addLogEntry("Granted permission '$permission' to '$roleName'");
                            }
                        }
                    }
                }

                if ($package == 'peanut') {
                    $this->doCustomSetup($testing);
                }
                else {
                    if (file_exists(PeanutSettings::GetPackagePath()."/$package/src/install/PackageInstaller.php")) {
                        $classname = ucfirst($package).'\\install\\PackageInstaller';
                        /**
                         * @var $instance IPackageInstaller
                         */
                        $instance = new $classname();
                        $instance->install($this->log,$testing);
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
    
    private $settings;
    private function getSettings() {
        if (!isset($this->settings)) {
            $this->settings = new \stdClass();
            $config = TIniSettings::Create('install.ini',TPath::fromFileRoot('application/install'));
            $this->settings->testing = $config->getBoolean('test','settings');
            $this->settings->dropSchema = $config->getValue('dropSchemaOnUninstall','settings',null);
        }
        return $this->settings;
    }
    
    public function uninstallAll($logLocation=null) {
        $result = new \stdClass();
        $result->log = array();
        $result->status = 'All packages were uninstalled.';

        $packages = array_reverse( $this->getPackageList() );
        foreach ($packages as $package) {
            if ($package->installed === 1) {
                $installResult = $this->uninstallPackage($package->name,$logLocation);
                $result->log = array_merge($result->log,$installResult->log);
                if ($installResult->status === false) {
                    $result->status = false;
                    break;
                }
            }
        }
        return $result;
    }

    public function uninstallPackage($package,$logLocation=null) {
        $result = new \stdClass();
        $result->status = false;
        $result->log = [];
        $settings = $this->getSettings();
        $this->log = new PeanutInstallationLog();
        if ($this->log->startUninstallSession($package,$logLocation) === false) {
            return $this->getInstallationResult($package);
        }
        $installPath = $package == 'peanut' ? 'application/install' :
            PeanutSettings::GetPackagePath()."/$package/install";

        $config = TIniSettings::Create('install.ini',
            TPath::fromFileRoot($installPath));
        if ($config === false) {
            $config = array();
        }


        try {
            $roles =  $config->getSection('roles');
            $permissions = $config->getSection('permissions');
            $permissionRoles = $config->getSection('permission-roles');
            if (!(empty($roles) && empty($permissions) && empty($permissionRoles))) {
                /**
                 * @var $manager TPermissionsManager
                 */
                $manager = TPermissionsManager::getPermissionManager();
                if (empty($manager)) {
                    throw new \Exception('Permission manager not registered in classes.ini');
                }

                if (!empty($permissionRoles)) {
                    foreach ($permissionRoles as $permission => $value) {
                        $roleNames = explode(',',$value);
                        foreach ($roleNames as $roleName) {
                            if ($settings->testing) {
                                $this->addLogEntry("TEST: Revoke permission '$permission' to '$roleName'");
                            }
                            else {
                                $manager->revokePermission($roleName, $permission);
                                $this->addLogEntry("Revoked permission '$permission' to '$roleName'");
                            }
                        }
                    }
                }

                if (!empty($roles)) {
                    foreach ($roles as $roleName => $description) {
                        if ($settings->testing) {
                            $this->addLogEntry("TEST: Remove role '$roleName'");

                        }
                        else {
                            $manager->removeRole($roleName);
                            $this->addLogEntry("Removed role '$roleName'");
                        }
                    }
                }

                if (!empty($permissions)) {
                    foreach ($permissions as $permission => $description) {
                        if($settings->testing) {
                            $this->addLogEntry("TEST: Remove permission '$permission'");
                        }
                        else {
                            $manager->removePermission($permission);
                            $this->addLogEntry("Removed permission '$permission'");
                        }
                    }
                }
            }

            $dropSchema = ($settings->dropSchema === null) ? $config->getBoolean('dropSchemaOnUninstall','settings') : $settings->dropSchema;
            if ($dropSchema) {
                $tables = $config->getSection('tables');
                if (!empty($tables)) {
                    $dbInstaller = new TDbInstaller();
                    $dbLog = $dbInstaller->dropSchema($config,$settings->testing);
                    foreach ($dbLog as $entry) {
                        $this->log->addLogEntry($entry);
                    }
                }
            }
            else {
                $this->addLogEntry('Keeping Database schema');
            }

            if ($package == 'peanut') {
                $this->doTeardown();
            }
            else {
                if (file_exists(PeanutSettings::GetPackagePath()."/$package/src/install/PackageInstaller.php")) {
                    $classname = ucfirst($package).'\\install\\PackageInstaller';
                    /**
                     * @var $instance IPackageInstaller
                     */
                    $instance = new $classname();
                    $instance->uninstall($this->log);
                }
            }
            $this->log->endSession(PeanutInstallationLog::UninstallCompletedMessage);
            $result->status = true;
        }
        catch (\Exception $ex) {
            $this->log->failSession("Exception: ".$ex->getMessage());
        }
        $result->log = $this->log->getLogMessages($package);
        return $result;

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

    protected function addLogEntry($message) {
        $this->log->addLogEntry($message);
    }

    abstract public function doCustomSetup($testing=false);
    abstract public function doTeardown($testing=false);

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
                } else if ($entry->message === PeanutInstallationLog::UninstallCompletedMessage) {
                    $result = false;
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