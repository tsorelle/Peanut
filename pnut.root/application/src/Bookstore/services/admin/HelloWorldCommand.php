<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/15/2017
 * Time: 5:02 PM
 */

namespace Bookstore\services\admin;


class HelloWorldCommand extends \Tops\services\TServiceCommand
{
    protected function run()
    {
        $this->addInfoMessage('Hello Earth');
        $responseValue = new \stdClass();
        $responseValue->message = "Greatings from mars.";
        $this->setReturnValue($responseValue);
    }
}