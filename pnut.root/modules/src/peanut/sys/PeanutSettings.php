<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/17/2017
 * Time: 4:33 PM
 */

namespace Peanut\sys;

use Tops\sys\TIniSettings;

class PeanutSettings
{
    /**
     * @var TIniSettings
     */
    private static $ini;
    private static function getIni() {
        if (!isset(self::$ini)) {
            self::$ini = TIniSettings::Create();
        }
        return self::$ini;
    }

    public static function GetModulePath (){
        $modulePath = self::getIni()->getValue('modulePath','peanut','modules');
        return $modulePath;
    }
    public static function GetPeanutRoot (){
        $modulePath = self::GetModulePath();
        $peanutRoot = self::getIni()->getValue('peanutRootPath','peanut',"$modulePath/pnut");
        return $peanutRoot;
    }
    public static function GetMvvmPath   (){
        $mvvmPath = self::getIni()->getValue('mvvmPath','peanut','application/mvvm');
        return $mvvmPath;
    }
    public static function GetCorePath   (){
        $settings = self::getIni();
        $peanutRoot = self::GetPeanutRoot();
        $corePath   =   (empty($settings['corePath']) ? $peanutRoot . '/core' : $settings['corePath']);
        return $corePath;
    }
    public static function GetPackagePath(){
        $peanutRoot = self::GetPeanutRoot();
        $packagePath = self::getIni()->getValue('packagePath','peanut',$peanutRoot . "/packages");
        return $packagePath;
    }

    public static function GetPeanutLoaderScript() {
        $peanutRoot = self::GetPeanutRoot();
        $optimize = self::getIni()->getBoolean('optimize','peanut');
        $script = $optimize ? 'dist/loader.min.js' : 'core/PeanutLoader.js';
        return "$peanutRoot/$script";
    }

    public static function GetThemeName() {
        return self::getIni()->getValue('theme','peanut','cerulean');
    }

}