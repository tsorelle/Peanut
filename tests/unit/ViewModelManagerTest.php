<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/5/2017
 * Time: 5:58 AM
 */

use Peanut\testing\FakeUser;
use PHPUnit\Framework\TestCase;
use Peanut\sys\ViewModelManager;

class ViewModelManagerTest extends TestCase
{
    function testGetViewModelSettings()
    {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'config');

        $actual = ViewModelManager::getViewModelSettings('testpage');
        $this->assertNotEmpty($actual);
        $expected = 'application/mvvm/view/TestPage.html';
        $this->assertEquals($expected,$actual->view);

        $actual = ViewModelManager::getViewModelSettings('qnut/test');
        $this->assertNotEmpty($actual);
        $expected = 'modules/pnut/packages/test-package/view/QnutTest.html';
        $this->assertEquals($expected,$actual->view);

    }

    function testGetSubdirViewModelSettings()
    {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'config');

        $actual = ViewModelManager::getViewModelSettings('subdir/testpage');
        $this->assertNotEmpty($actual);
        $expected = 'application/mvvm/subdir/view/TestPage.html';
        $this->assertEquals($expected,$actual->view);

    }

    function testGetPackageList() {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'config');

        $actual = ViewModelManager::getPackageList();
        $this->assertNotEmpty($actual);
        $expected = 2;
        $this->assertEquals($expected, sizeof($actual),'Wrong package count.');
    }

    function testRestricted() {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'config');

        $user = new FakeUser('dummy,fool');
        $settings = ViewModelManager::getViewModelSettings('managers-only');
        $actual = ViewModelManager::isAuthorized($user,$settings);
        $this->assertFalse($actual);

        $user = new FakeUser('manager');
        $actual = ViewModelManager::isAuthorized($user,$settings);
        $this->assertTrue($actual);

        $user = new FakeUser('admin');
        $actual = ViewModelManager::isAuthorized($user,$settings);
        $this->assertTrue($actual);

        $settings = ViewModelManager::getViewModelSettings('auth-only');
        $user = new FakeUser('',true);
        $actual = ViewModelManager::isAuthorized($user,$settings);
        $this->assertTrue($actual);

        $user = new FakeUser('',false);
        $actual = ViewModelManager::isAuthorized($user,$settings);
        $this->assertFalse($actual);


    }
}
