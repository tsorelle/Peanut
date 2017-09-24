<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/17/2017
 * Time: 5:30 AM
 */

namespace Peanut\sys;

use Tops\sys\TPath;

class PeanutInstallationLog
{
    /**
     * @var PeanutInstallationLog
     */
    private $filePath;
    private $log = array();
    private $archive;
    private $session;

    const InstallationCompletedMessage = 'installation completed';
    const UninstallCompletedMessage = 'uninstalled';
    const InstallationFailedMessage = 'installation failed';
    const InstallationStartedMessage = 'installation started';
    const UninstallStartedMessage = 'uninstall started';
    const LogFileName = 'peanut-installation.log';

    public function getSession() {
        if (!isset($this->session)) {
            throw new \Exception('Installation session was not initialized with startSession()');
        }
        return $this->session;
    }

    public function readLogFile($filePath = null)
    {
        $result = array();
        if ($filePath==null) {
            $filePath = $this->getFilePath();
        }

        if (file_exists($filePath)) {
            $lines = file($filePath);
            $result = self::convertLogContent($lines);
        }
        return $result;
    }

    public static function convertLogContent($lines) {
        $result = array();
        $lineNo = 0;
        foreach ($lines as $line) {
            $lineNo++;
            $line = trim($line);
            if (empty($line)) {
                continue;
            }
            // Format -  time::package::version::message
            $parts = explode('::', $line);
            if (sizeof($parts) != 4) {
                throw new \Exception("Invalid log file. Error on line $lineNo");
            }
            $time = $parts[0];
            $package = $parts[1];
            $version = $parts[2];
            $message = $parts[3];
            $result[$package][] = self::createEntry($package, $version, $message, $time);
        }
        return $result;
    }

    private function getFilePath() {
        if (!isset($this->filePath)) {
            $this->filePath = TPath::fromFileRoot('application/install/'.self::LogFileName);
        }
        return $this->filePath;
    }


    public function startUninstallSession($package,$logLocation=null) {
        $this->initSession($package,$logLocation,self::UninstallStartedMessage);
    }
    public function startSession($package,$logLocation=null)
    {
        $this->initSession($package,$logLocation,self::InstallationStartedMessage);
    }

    public function initSession($package,$logLocation,$message) {
        $this->session = new \stdClass();
        $this->session->package = $package;
        $this->log = array();
        if ($logLocation!=null) {
            $this->filePath = $logLocation.'/'.self::LogFileName;
        }

        if ($package == 'peanut') {
            $iniPath = PeanutSettings::GetPeanutRoot().'/peanut.ini';
        }
        else {
            $iniPath = PeanutSettings::GetPeanutRoot()."/packages/$package/package.ini";
        }
        $settings = @parse_ini_file(TPath::getFileRoot().$iniPath);
        if ($settings === false) {
            $this->failSession('Package ini file not found');
            return false;
        }
        $this->session->version = $settings['version'];
        if (!isset($this->archive)) {
            $this->archive = $this->readLogFile();
        }
        $this->addLogEntry("$package: $message");
        return true;
    }

    public function endSession($message=self::InstallationCompletedMessage) {
        $this->addLogEntry($message);
        $this->save();
        unset($this->session);
    }

    public function failSession($failMessage) {
        $this->addLogEntry($failMessage);
        $this->addLogEntry(self::InstallationFailedMessage);
        $this->save();
        unset($this->session);
    }


    public function addLogEntry($message) {
        $time = date("Y-m-d H:i:s");
        $this->log[$this->session->package][] = self::createEntry($this->session->package,$this->session->version, $message,$time);
    }

    public static function createEntry($package, $version, $message, $time)
    {
        $entry = new \stdClass();
        $entry->time = $time;
        $entry->message = trim($message);
        $entry->package = $package;
        $entry->version = $version;
        return $entry;
    }

    public function flattenLog($log=null)
    {
        $content = array();
        if ($log == null) {
            $log = $this->log;
        }
        foreach ($log as $package => $entries) {
            foreach ($entries as $entry) {
                $content[] = "$entry->time::$package::$entry->version::$entry->message";
            }
        }
        return $content;
    }

    public function save()
    {
        // unit test will not write file.
        if (!empty($this->filePath)) {
            $content = $this->flattenLog();
            file_put_contents($this->filePath, join("\n", $content)."\n", FILE_APPEND);
        }
    }

    //for testing
    public function getArchive($flat=true)
    {
           return $this->archive;
    }

    public function getArchiveFlat($flat=true)
    {
        return $this->flattenLog($this->archive);
    }

    public function setArchive($log) {
        if (is_array($log)) {
            $this ->archive = self::convertLogContent($log);
        }
        else {
            $this->archive = $log;
        }
        return $this->archive;

    }

    public function getLog()
    {
        return $this->log;
    }
    public function getLogFlat()
    {
        return $this->flattenLog();
    }

    public function getLogMessages($package) {
        $result = array();
        if (array_key_exists($package,$this->log)) {
            return $this->log[$package];
            /*
            foreach ($this->log[$package] as $entry) {
                $result[] = $entry->message;
            }
            */
        }
        return $result;

    }


}