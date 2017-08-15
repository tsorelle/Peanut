<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/14/2017
 * Time: 9:02 AM
 */

use Peanut\testing\FakePeanutInstaller;
use PHPUnit\Framework\TestCase;


class InstallerTest extends TestCase
{
    public function testGetDefaultInstaller() {
        $actual = \Peanut\sys\PeanutInstaller::GetInstaller();
        $this->assertInstanceOf('Peanut\sys\DefaultPeanutInstaller',$actual);
    }
}