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
    public function testUpdateConfigAddSection() {
        $installer = new FakePeanutInstaller();
        $configFile = \Tops\sys\TPath::getConfigPath().'database.ini';
        $tmpFile = __DIR__.'/tmp/database.ini';
        copy($configFile,$tmpFile);
        $id = 'unit-test';
        try {
            $installer->SetDatabaseConfiguration($id);
            $ini = parse_ini_file($configFile,true);
            $this->assertEquals($id,$ini['settings']['default']);
            $this->assertNotEmpty($ini[$id]);
            $this->assertEquals(3,sizeof($ini[$id]));
        }
        finally {
            copy($tmpFile,$configFile);
        }



    }

    public function testUpdateConfigAddSectionNotDefault() {
        $installer = new FakePeanutInstaller();
        $configFile = \Tops\sys\TPath::getConfigPath().'database.ini';
        $ini = parse_ini_file($configFile,true);
        $default = $ini['settings']['default'];
        $tmpFile = __DIR__.'/tmp/database.ini';
        copy($configFile,$tmpFile);
        $id = 'unit-test';
        try {
            $installer->SetDatabaseConfiguration($id,false);
            $ini = parse_ini_file($configFile,true);
            $this->assertEquals($default,$ini['settings']['default']);
            $this->assertNotEmpty($ini[$id]);
            $this->assertEquals(3,sizeof($ini[$id]));
        }
        finally {
            copy($tmpFile,$configFile);
        }

    }


    public function testUpdateConfigExistingSection() {
        $installer = new FakePeanutInstaller();
        $configFile = \Tops\sys\TPath::getConfigPath().'database.ini';
        $tmpFile = __DIR__.'/tmp/database.ini';
        copy($configFile,$tmpFile);
        $id = 'bookstore';
        try {
            $installer->SetDatabaseConfiguration($id);
            $ini = parse_ini_file($configFile,true);
            $this->assertEquals($id,$ini['settings']['default']);
            $this->assertNotEmpty($ini[$id]);
            $this->assertEquals(3,sizeof($ini[$id]));
            $actual = $ini[$id]['user'];
            $this->assertNotTrue($actual == '(user name here)');
            $actual = $ini[$id]['user'];
            $this->assertNotTrue($actual == '(password here)');
        }
        finally {
            copy($tmpFile,$configFile);
        }



    }
    public function testUpdateConfigFromScratch() {
        $installer = new FakePeanutInstaller();
        $configFile = \Tops\sys\TPath::getConfigPath().'database.ini';
        $tmpFile = __DIR__.'/tmp/database.ini';
        copy($configFile,$tmpFile);
        unlink($configFile);
        $id = 'unit-test';
        try {
            $installer->SetDatabaseConfiguration($id);
            $ini = parse_ini_file($configFile,true);
            $this->assertEquals($id,$ini['settings']['default']);
            $this->assertNotEmpty($ini[$id]);
            $this->assertEquals(3,sizeof($ini[$id]));
        }
        finally {
            copy($tmpFile,$configFile);
        }
    }
}


