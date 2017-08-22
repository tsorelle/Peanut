<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/4/2017
 * Time: 10:37 AM
 */

namespace Peanut\sys;


use Tops\sys\IUser;
use Tops\sys\TConfiguration;
use Tops\sys\TPath;
use Tops\sys\TUser;

class ViewModelManager
{
    /**
     * @var ViewModelInfo
     */
    private static $info;
    private static $vmSettings;
    private static $instance;
    private static $packagePath;

    private static $packageList;
    public static function getPackageList() {
        if (!isset(self::$packageList)) {
            self::$packageList = array();
            $fileRoot = TPath::getFileRoot();
            $packagePath = self::getPackagePath();
            $files = scandir($fileRoot.$packagePath);
            foreach ($files as $file) {
                // package must be a directory containing a package.ini file.
                if ($file != '.' && $file != '..' && file_exists($fileRoot."$packagePath/$file/package.ini")) {
                    self::$packageList[] = $file;
                }
            }
        }
        return self::$packageList;
    }

    public static function getPackagePath() {
        if (!isset(self::$packagePath)) {
            self::$packagePath = TConfiguration::getValue('packagePath','peanut');
            if (empty(self::$packagePath)) {
                $modulePath = TConfiguration::getValue('modulePath','peanut','modules');
                $peanutRootPath = TConfiguration::getValue('peanutRootPath','peanut',
                    "$modulePath/pnut");
                self::$packagePath = "$peanutRootPath/packages";
            }
        }
        return self::$packagePath;
    }

    /**
     * @param $pathAlias
     * @return bool|ViewModelInfo
     */
    public static function getViewModelSettings($pathAlias)
    {
        if (!isset(self::$vmSettings)) {
            $path = TPath::getConfigPath();
            $packagePath = self::getPackagePath();
            self::$vmSettings = parse_ini_file($path . 'viewmodels.ini', true);
            $packages = self::getPackageList();
            if (!empty($packages)) {
                $fileRoot = TPath::getFileRoot();
                $packagePath = $fileRoot . $packagePath;

                foreach ($packages as $package) {
                    $pkgini = @parse_ini_file($packagePath . "/$package/config/viewmodels.ini", true);
                    if (!empty($pkgini)) {
                        $keys = array_keys($pkgini);
                        foreach ($keys as $key) {
                            $pkgini[$key]['package'] = $package;
                        }
                        self::$vmSettings = array_merge(self::$vmSettings, $pkgini);
                    }
                }
            }
        }

        $key = strtolower($pathAlias);
        if (array_key_exists($key, self::$vmSettings)) {
            $item = self::$vmSettings[$key];

            $vmName = empty($item['vm']) ? array_pop(explode('/', $pathAlias)) : $item['vm'];

            $view = empty($item['view']) ? $vmName . '.html' : $item['view'];
            if (empty($item['package'])) {
                $root = TConfiguration::getValue('mvvmPath', 'peanut', 'application/mvvm');
            }
            else {
                $root =  ViewModelManager::getPackagePath()."/".$item['package'];
                $vmName = "@pkg/" . $item['package']."/$vmName";
            }

            $result = new ViewModelInfo();
            $result->pathAlias = $pathAlias;
            $result->vmName = $vmName;
            if ($view == 'content') {
                $result->view = $view;
            } else {
                $location = empty($item['location']) ? '': '/'.$item['location'];
                $parts = explode('/',$view);
                if (sizeof($parts) > 1) {
                    $view = array_pop($parts);
                    $subdir = join($parts);
                    $location .= '/'.join($parts);
                }

                $result->view = $root."$location/view/$view";
            }
            $result->template = empty($item['template']) ? false : $item['template'];
            $result->theme = empty($item['theme']) ? false : $item['theme'];
            $result->roles = array();
            if (!empty($item['roles'])) {
                $roles = explode(',',$item['roles']);
                foreach ($roles as $role) {
                    $result->roles[] = trim($role);
                }
            }

            self::$info = $result;
            return $result;
        }
        return false;
    }

    /**
     * @return bool|ViewModelInfo
     */
    public static function getViewModelInfo()
    {
        return isset(self::$info) ? self::$info : false;
    }

    public static function RenderMessageElements() {
        if (!empty(self::$info)) {
            print "\n<div id='service-messages-container'><service-messages></service-messages></div>\n";
        }
    }

    public static function RenderStartScript()
    {
        if (!empty(self::$info)) {
            print self::GetStartScript();
        }

    }
    public static function GetStartScript()
    {
        if (empty(self::$info)) {
            return '';
        }
        $vmName = self::$info->vmName;
        // print "\n<!-- start script for '$vmName' goes here -->\n";

        return
        "\n<script>\n" .
            "   Peanut.PeanutLoader.startApplication('$vmName'); \n"
            . "</script>\n";

    }

    /**
     * See if this request is related to a ViewModel.
     * Check self::$info which is set by Initialize()
     *
     * @return bool
     */
    public static function hasVm()
    {
        return !empty(self::$info);
    }

    private static $peanutVersion;
    public static function GetPeanutVersion() {
        if (isset(self::$peanutVersion)) {
            return self::$peanutVersion;
        }
        $fileRoot = TPath::getFileRoot();
        $peanutPath = TConfiguration::getValue('peanutRootPath','peanut');
        $pnutIniPath = "$fileRoot$peanutPath/dist/peanut.ini";
        if (file_exists($pnutIniPath)) {
            $pnutIni = parse_ini_file($pnutIniPath,true);
            if (empty($pnutIni['peanut']['version'])) {
                return 'error-invalid-peanut-ini';
            }
            else {
                self::$peanutVersion = $pnutIni['peanut']['version'];
                return self::$peanutVersion;
            }
        }
        return 'error-no-peanut-ini';


    }

    public static function isAuthorized(IUser $user, ViewModelInfo $viewModelInfo) {
        if (empty($viewModelInfo->roles) || $user->isAdmin()) {
            return true;
        }
        foreach ($viewModelInfo->roles as $role) {
            switch($role) {
                case 'authenticated' :
                    return $user->isAuthenticated();
                case 'admin' :
                    return false;
                default :
                    if ($user->isMemberOf($role)) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    }

    public static function authorize(ViewModelInfo $settings) {
        $user = TUser::getCurrent();
        $authorized = ViewModelManager::isAuthorized($user,$settings);
        if (!$authorized) {
            header('HTTP/1.0 403 Forbidden');
            $message = $user->isAuthenticated() == 'authenticated' ? 'not-authenticated' : 'not-authorized';
            $messagePage = ViewModelPageBuilder::BuildMessagePage($message);
            print $messagePage;
            exit;
        }

    }

}