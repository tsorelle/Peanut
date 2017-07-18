<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 5/1/2017
 * Time: 10:33 AM
 */
require_once(__DIR__ . '/peanut-bootstrap.php');
$result = \Peanut\Bootstrap::getSettings();
print json_encode($result);