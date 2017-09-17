<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/17/2017
 * Time: 4:46 AM
 */

use Peanut\cms\CmsMailboxManager;
use PHPUnit\Framework\TestCase;

class CmsMailboxManagerTest extends TestCase
{
    public function testGetMailbox() {
        $manager = new CmsMailboxManager();
        $box = $manager->findByCode('support');
        $this->assertNotNull($box);
        $actual = $box->getEmail();
        $expected = 'support@friends.com';
    }
}
