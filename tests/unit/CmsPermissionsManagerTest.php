<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/16/2017
 * Time: 2:06 PM
 */

use Peanut\cms\CmsPermissionsManager;
use PHPUnit\Framework\TestCase;

class CmsPermissionsManagerTest extends TestCase
{
    public function testGetPermission() {
        $manager = new CmsPermissionsManager();
        $permission =$manager->getPermission('manage-permissions');
        $this->assertNotNull($permission);
        $actual = $permission->check('peanutAdmin');
        $this->assertTrue($actual,'peanutAdmin should have permission');
        $actual = $permission->check('mailAdmin');
        $this->assertFalse($actual,'mailAdmin should not have this permission');
    }
}
