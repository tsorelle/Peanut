<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/16/2017
 * Time: 2:19 PM
 */

use Peanut\cms\CmsUser;
use PHPUnit\Framework\TestCase;

class CmsUserTest extends TestCase
{
    public function testGetCurrent() {
        $user = new CmsUser();
        $user->loadByUserName('mrpeanut');
        $actual = $user->getUserName();
        $expected = 'mrpeanut';
        $this->assertEquals($expected,$actual);
        $actual = $user->getLastName();
        $expected = 'Peanut';
        $this->assertEquals($expected,$actual);
        $actual = $user->isAuthorized('manage-permissions');
        $this->assertTrue($actual,'mrpeanut should have permission');
    }
}
