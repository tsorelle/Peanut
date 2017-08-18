<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/17/2017
 * Time: 4:33 PM
 */

namespace Peanut\sys;

use \Tops\sys\TPath;

class PeanutSettings
{
    private static $ini;
    private static function getIni() {
        if (!isset(self::$ini)) {
            $file = TPath::getConfigPath().'settings.ini';
            self::$ini = parse_ini_file($file,true);
        }
        return self::$ini;
    }

    public static function GetModulePath (){
        $settings = self::getIni();
        $modulePath = (empty($settings['modulePath']) ? 'modules' : $settings['modulePath']);
        return $modulePath;
    }
    public static function GetPeanutRoot (){
        $settings = self::getIni();
        $modulePath = self::GetModulePath();
        $peanutRoot = (empty($settings['peanutRootPath']) ? "$modulePath/pnut" : $settings['peanutRootPath']);
        return $peanutRoot;
    }
    public static function GetMvvmPath   (){
        $settings = self::getIni();
        $mvvmPath   = (empty($settings['mvvmPath']) ? 'application/mvvm' : $settings['mvvmPath']);
        return $mvvmPath;
    }
    public static function GetCorePath   (){
        $settings = self::getIni();
        $peanutRoot = self::GetPeanutRoot();
        $corePath   =   (empty($settings['corePath']) ? $peanutRoot . '/core' : $settings['corePath']);
        return $corePath;
    }
    public static function GetPackagePath(){
        $settings = self::getIni();
        $peanutRoot = self::GetPeanutRoot();
        $packagePath = (empty($settings['packagePath']) ? $peanutRoot . "/packages" : $settings['packagePath']);
        return $packagePath;
    }

}