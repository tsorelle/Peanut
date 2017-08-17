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
    private $archive = array();

    const InstallationCompletedMessage = 'installation completed';
    const InstallationFailedMessage = 'installation failed';
    const InstallationStartedMessage = 'installation started';
    const LogFileName = 'peanut-installation.log';

    public function openLogFile($location = null)
    {
        if ($location==null) {
            $location = TPath::getFileRoot() . '/install';
        }

        $this->filePath = $location.'/'.self::LogFileName;

        if (file_exists($this->filePath)) {
            $lines = file($this->filePath);
            $this->createLogs($lines);
        }
    }

    public function createLogs($lines=array())
    {
        $this->log = array();
        foreach ($lines as $line) {
            if (!empty($line)) {
                // time:package:message
                $parts = explode('::', $line);
                if (sizeof($parts) == 3) {
                    $time = $parts[0];
                    $package = $parts[1];
                    $message = $parts[2];
                    $this->archive[$package][] = $this->createEntry($message,$time);
                }
            }
        }
    }

    public function installationCompleted($package)
    {
        $result = false;
        $packageEntries = $this->archive[$package];
        foreach ($packageEntries as $entry) {
            if ($entry->message === self::InstallationStartedMessage || $entry->message === self::InstallationFailedMessage) {
                $result = false;
            } else if ($entry->message === self::InstallationCompletedMessage) {
                $result = $entry->time;
            }
        }
        return $result;
    }

    public function addLogEntry($package, $message) {
        $time = date("Y-m-d H:i:s");
        $this->log[$package][] = $this->createEntry($message,$time);


    }

    public function createEntry($message, $time = null)
    {
        $entry = new \stdClass();
        $entry->time = $time;
        $entry->message = $message;
        return $entry;
    }

    public function flattenLog()
    {
        $content = array();

        foreach ($this->log as $package => $entries) {
            foreach ($entries as $entry) {
                $content[] = "$entry->time::$package::$entry->message";
            }
        }
        return $content;
    }

    public function save()
    {
        $content = $this->flattenLog();
        file_put_contents($this->filePath, join("\n",$content), FILE_APPEND);
    }

    //for testing
    public function getArchive()
    {
        return $this->archive;
    }

    public function getLog()
    {
        return $this->log;
    }

    public function getLogs()
    {
        return array_merge($this->archive,$this->log);
    }

}