<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 4/27/2017
 * Time: 5:12 PM
 */

namespace Peanut\cms;

//include __DIR__."/Autoloader.php";
// require_once str_replace('\\','/',realpath(__DIR__.'../../../')). '/vendor/autoload.php';

use Peanut\Bootstrap;
use Tops\sys\Autoloader;
use Tops\sys\TStrings;
use Tops\ui\TViewModelManager;
use Tops\sys\TConfiguration;
use Tops\sys\TPath;

class CmsController
{
    /**
     * @var CmsController
     */
    private static $instance;

    private $mvvmRoot;
    private $corePath;
    private $vmName;
    private $contentFile;
    private $scriptDebug = true;

    const settingsLocation = 'application/config';

    public static function Start($indexDir) {
        self::$instance = new CmsController();
        self::$instance->initialize($indexDir);
        return self::$instance;
    }

    public function  getContentFile() {
        return $this->contentFile;
    }

    public function initialize($indexDir)
    {
        global $_SERVER;
        $uri = $_SERVER['REQUEST_URI'];;
        if (strlen($uri) > 1 && substr($uri,-1) == '/') {
            // trailing slashes screw up relative paths later on
            $uri = substr($uri,0,strlen($uri) - 1);
            header("Location: $uri");
            exit;
        }

        $fileRoot = str_replace('\\', '/', $indexDir) . '/';
        require_once($fileRoot.'application/config/peanut-bootstrap.php');

        $settings = \Peanut\Bootstrap::initialize();
        session_start();
        \Tops\sys\TSession::Initialize();

        $siteRoot = str_ireplace('index.php', '', $_SERVER['PHP_SELF']);

        if (strstr($uri,'/index.php') == false ) {
            $routePath = substr($uri,strlen($siteRoot));
        }
        else {
            $routePath = isset($_GET['v']) ? $_GET['v'] : false;
        }
        if (substr($routePath,-1) == '/') {
            $routePath = substr($routePath,0,strlen($routePath) - 1);
        }

        if (empty($routePath)) {
            $routePath = 'home';
        }

        $this->route($fileRoot, $routePath);
    }

    private function route($fileRoot, $routePath) {
        switch ($routePath) {
            case 'peanut/settings' :
                header('Content-type: application/json');
                include($fileRoot."/application/config/settings.php");
                exit;
            case 'peanut/service/execute' :
                header('Content-type: application/json');
                $response = \Tops\services\ServiceFactory::Execute();
                print json_encode($response);
                exit;
            default:
                $vmInfo = TViewModelManager::getViewModelSettings($routePath);
                $this->vmName = '';
                if (empty($vmInfo)) {
                    $this->contentFile = $fileRoot."/content/$routePath.php";
                    if (!file_exists($this->contentFile)) {
                        header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
                        exit;
                    }
                }
                else {
                    $this->vmName = $vmInfo->vmName;
                    $this->contentFile = $fileRoot.$vmInfo->view;
                }
        }
    }


    public function getViewPath()
    {
        $result = $this->mvvmRoot."/view/".$this->vmName.'.html';
        if (file_exists($result)) {
            return $result;
        }
        exit ("View File: $result not found.");

    }

    public function getCoreScript($scriptName) {
        $src = $this->corePath.$scriptName.'.js';
        return "<script src='$src'></script>\n";
    }

    public function getScriptInit() {
        return TViewModelManager::GetStartScript();
    }

    public function getViewContainerId() {
        return strtolower($this->vmName)."-view-container";
    }

    public function getScriptDebug() {
        return $this->scriptDebug;
    }
}