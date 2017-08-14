<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/14/2017
 * Time: 4:43 PM
 */

namespace Peanut\testing;


use Peanut\sys\PeanutInstaller;

class FakePeanutInstaller extends PeanutInstaller
{
    public function getNativeDbConfiguration()
    {
        return $this->makeDbParameters('database','username','password');
    }
}