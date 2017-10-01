<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2017
 * Time: 5:09 AM
 */

namespace Peanut\sys;


class TestPeanutInstaller extends PeanutInstaller
{
    protected function installPeanutSchema()
    {
        // skip db installation for test.
        $this->addLogEntry('Schema installation skipped in testing.');
    }


    public function doTeardown($testing = false)
    {
        // TODO: Implement doTeardown() method.
    }

    public function doCustomSetup($testing = false)
    {
        // TODO: Implement doCustomSetup() method.
    }
}