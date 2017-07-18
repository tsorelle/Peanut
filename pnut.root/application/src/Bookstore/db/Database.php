<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 5/5/2017
 * Time: 3:46 PM
 */

namespace Bookstore\db;

const dbConfigFile = 'application\config\database.ini';
use \PDO;
class Database
{

    private static $connectionParams;
    private static function getConnectionParams()
    {
        if (empty(self::$connectionParams)) {
            // print __DIR__.'/../../../'.dbConfigFile;
            $settings = parse_ini_file(__DIR__.'/database.ini');
            $server = empty($settings['server']) ? 'localhost' : $settings['server'];
            $dbname = $settings['database'];
            self::$connectionParams = new \stdClass();
            self::$connectionParams->user = $settings['user'];
            self::$connectionParams->pwd = $settings["pwd"];
            self::$connectionParams->dns = "mysql:host=$server;dbname=$dbname";
        }
        return self::$connectionParams;
    }

    public static function getConnection( $errmode = PDO::ERRMODE_EXCEPTION )
    {
        $settings = self::getConnectionParams();
        $dbh = new PDO($settings->dns,$settings->user,$settings->pwd);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, $errmode);
        return $dbh;
    }

}