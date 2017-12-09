<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/21/2017
 * Time: 8:31 AM
 */

use Peanut\sys\ViewModelPageBuilder;
use PHPUnit\Framework\TestCase;

class ViewModelPageBuilderTest extends TestCase
{
    public function testBuildPageContent() {
        $expected = 'theme:bootstrap; view: view content here; vmname: tesViewModel';
        $template = 'theme:[[theme]]; view: [[view]]; vmname: [[vmname]]';
        $settings = new \Peanut\sys\ViewModelInfo();
        $settings->vmName='tesViewModel';
        $settings->view=__DIR__.'/files/testview1.html';
        $builder = new ViewModelPageBuilder();
        $actual = $builder->buildPageContent($settings,$template);
        $this->assertEquals($expected,$actual);
    }

    public function testBuildPage() {
        $expected = 'theme:bootstrap; view: view content here; vmname: testViewModel';
        $templatePath = realpath( __DIR__.'/../../pnut.root/application/assets/templates');
        $settings = new \Peanut\sys\ViewModelInfo();
        $settings->vmName='testViewModel';
        $settings->view=__DIR__.'/files/testview1.html';
        $builder = new ViewModelPageBuilder();
        $actual = $builder->buildView($settings ,$templatePath);
        $this->assertNotEmpty($actual);

    }
}
