<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/13/2017
 * Time: 6:57 AM
 */



$fileRoot = realpath(__DIR__.'../../../');
$fileRoot =  str_replace('\\','/',$fileRoot).'/';
// require_once $fileRoot. 'vendor/autoload.php';
\Tops\sys\TPath::Initialize($fileRoot);
