<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/13/2017
 * Time: 6:57 AM
 */
$fileRoot = realpath(__DIR__.'../../../pnut.root');
$fileRoot =  str_replace('\\','/',$fileRoot).'/';
\Tops\sys\TPath::Initialize($fileRoot);
