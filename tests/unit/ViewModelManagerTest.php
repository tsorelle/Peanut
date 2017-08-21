<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/5/2017
 * Time: 5:58 AM
 */

use PHPUnit\Framework\TestCase;
use Peanut\sys\ViewModelManager;

class ViewModelManagerTest extends TestCase
{
    function testGeViewModelSettings()
    {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'config');

        $actual = ViewModelManager::geViewModelSettings('testpage');
        $this->assertNotEmpty($actual);
        $expected = 'application/mvvm/view/TestPage.html';
        $this->assertEquals($expected,$actual->view);

        $actual = ViewModelManager::geViewModelSettings('qnut/test');
        $this->assertNotEmpty($actual);
        $expected = 'modules/pnut/packages/test-package/view/QnutTest.html';
        $this->assertEquals($expected,$actual->view);

    }

    function testGetSubdirViewModelSettings()
    {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'tests/config');

        $actual = ViewModelManager::geViewModelSettings('subdir/testpage');
        $this->assertNotEmpty($actual);
        $expected = 'application/mvvm/subdir/view/TestPage.html';
        $this->assertEquals($expected,$actual->view);

    }

    function testGetPackageList() {
        // reinitialize test path, maybe changed by previous test
        $projectFileRoot =   str_replace('\\','/', realpath(__DIR__.'/..')).'/';
        \Tops\sys\TPath::Initialize($projectFileRoot,'tests/config');

        $actual = ViewModelManager::getPackageList();
        $this->assertNotEmpty($actual);
        $expected = 2;
        $this->assertEquals($expected, sizeof($actual),'Wrong package count.');

    }
}
