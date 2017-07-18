<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/15/2017
 * Time: 5:02 PM
 */

namespace Qnut\services;


/**
 * A simple service command for smoke tests
 *
 * Class HelloMarsCommand
 * @package Qnut\services
 */
class HelloMarsCommand extends \Tops\services\TServiceCommand
{
    protected function run()
    {
        $this->addInfoMessage('Hello Mars');
        $responseValue = new \stdClass();
        $responseValue->message = "Greatings earthlings from the Big Giant Head.";
        $this->setReturnValue($responseValue);
    }
}