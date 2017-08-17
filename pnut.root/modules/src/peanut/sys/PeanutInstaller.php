<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2017
 * Time: 4:41 AM
 */
namespace Peanut\sys;

use PHPUnit\Runner\Exception;
use Tops\sys\TObjectContainer;
use Tops\sys\TPath;

abstract class PeanutInstaller
{

    public static function GetInstaller()
    {
        if (TObjectContainer::HasDefinition('peanut.installer')) {
            return TObjectContainer::Get('peanut.installer');
        }
        return new DefaultPeanutInstaller();
    }

    abstract public function doCustomSetup();



}