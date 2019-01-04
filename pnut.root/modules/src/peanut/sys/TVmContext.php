<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 1/3/2019
 * Time: 7:55 AM
 */

namespace Peanut\sys;


use Tops\sys\TObjectContainer;

abstract class TVmContext
{
    /**
     * @var TVmContext
     */
    private static $instance;


    public static function GetContext($contextId) {
        if (!isset(self::$instance)) {
            self::$instance = TObjectContainer::Get('peanut.vmcontext');
        }
        if (self::$instance) {
            return self::$instance->get($contextId);
        }
        return self::getNullContext();
    }

    protected abstract function get($contextId);

    protected static function getNullContext() {
        $result = new \stdClass();
        $result->viewmodel = false;
        $result->value = false;
        return $result;
    }


}