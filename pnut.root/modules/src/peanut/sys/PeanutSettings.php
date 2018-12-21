<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/17/2017
 * Time: 4:33 PM
 */

namespace Peanut\sys;

use Tops\sys\TConfiguration;
use Tops\sys\TIniSettings;
use Tops\sys\TPath;

class PeanutSettings
{
    /**
     * @var TIniSettings
     */

    public static function GetModulePath (){
        $modulePath = TConfiguration::getValue('modulePath','peanut','modules');
        return $modulePath;
    }

    public static function FromSrcPath($srcFile) {
        $modulePath = self::GetModulePath();
        $modulePath = TPath::fromFileRoot($modulePath);
        $srcPath = TPath::combine($modulePath,'src');
        return TPath::combine($srcPath,$srcFile);
        // return realpath($file);
    }

    public static function FromPeanutRoot($path) {
        $root = TPath::fromFileRoot(self::GetPeanutRoot());
        return TPath::combine($root,$path);
    }

    public static function GetPeanutRoot (){
        $modulePath = self::GetModulePath();
        $peanutRoot = TConfiguration::getValue('peanutRootPath','peanut',"$modulePath/pnut");
        return $peanutRoot;
    }
    public static function GetMvvmPath   (){
        $mvvmPath = TConfiguration::getValue('mvvmPath','peanut','application/peanut');
        return $mvvmPath;
    }
    public static function GetCorePath   (){
        $peanutRoot = self::GetPeanutRoot();
        // $corePath   =   (empty($settings['corePath']) ? $peanutRoot . '/core' : $settings['corePath']);
        $corePath   =   TConfiguration::getValue('corePath',$peanutRoot . '/core');
        return $corePath;
    }
    public static function GetPackagePath(){
        $peanutRoot = self::GetPeanutRoot();
        $packagePath = TConfiguration::getValue('packagePath','peanut',$peanutRoot . "/packages");
        return $packagePath;
    }

    public static function GetPeanutLoaderScript() {
        $peanutRoot = self::GetPeanutRoot();
        $optimize = TConfiguration::getBoolean('optimize','peanut');
        $script = $optimize ? 'dist/loader.min.js' : 'core/PeanutLoader.js';
        return "$peanutRoot/$script";
    }

    public static function GetThemeName() {
        return TConfiguration::getValue('theme','pages','bootstrap');
    }

    public static function GetLoginPage() {
        return TConfiguration::getValue('login-page','pages','login');
    }

    public static function GetPeanutUrl() {
        return TConfiguration::getValue('peanutUrl','pages','');
    }

    public static function getNavBar() {
        return TConfiguration::getValue('navbar','pages','default');
    }
}