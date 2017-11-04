<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 11/4/2017
 * Time: 12:11 PM
 */

use Peanut\sys\PeanutTranslator;
use PHPUnit\Framework\TestCase;

class PeanutTranslatorTest extends TestCase
{
    public function testGetPeanutTranslations() {
        $actual = PeanutTranslator::GetPeanutTranslations();
        $this->assertNotEmpty($actual);
    }
}
