<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/13/2017
 * Time: 4:41 AM
 */
namespace Peanut\sys;

use PHPUnit\Runner\Exception;
use Tops\sys\TObjectContainer;
use Tops\sys\TPath;

abstract class PeanutInstaller
{
    public static function GetInstaller()
    {
        if (TObjectContainer::HasDefinition('peanut.installer')) {
            return TObjectContainer::Get('peanut.installer');
        }
        return new DefaultPeanutInstaller();
    }

    public function makeDbParameters(
        $database,
        $user,
        $pwd,
        $server = 'localhost')
    {
        $result = array(
            'database' => $database,
            'user' => $user,
            'pdw' => $pwd
        );
        if ($server != 'localhost' && !empty($server)) {
            $result['server'] = $server;
        }
        return $result;
    }

    private function addDbConfigSection($section,$parameters,array &$output) {
        $output[] = "[$section]";
        foreach ($parameters as $name => $value) {
            $output[] = "$name='$value'";
        }
    }
    public function SetDatabaseConfiguration($databaseId=null,$setDefault=true, $parameters = null)
    {
        if (empty($databaseId)) {
            $databaseId = 'peanut';
        }
        if ($parameters == null) {
            $parameters = $this->getNativeDbConfiguration();
            if ($parameters == null) {
                throw new \Exception("Parmeter information not available from CMS. Please enter parameters.");
            }
        }

        $dbSectionFound = false;
        $output = array();
        $configFile = TPath::getConfigPath().'database.ini';
        if (file_exists($configFile)) {
            $currentSection = '';
            $lines = file($configFile);
            foreach ($lines as $line) {
                $line = trim($line);
                $starter = empty($line) ? ';' : substr($line,0,1);
                switch ($starter) {
                    case ';' :
                        break;
                    case '[' :
                        $currentSection = $line;
                        if ($line=="[$databaseId]") {
                            $this->addDbConfigSection($databaseId,$parameters,$output);
                            $output[] = '';
                            $dbSectionFound = true;
                        }
                        break;
                    default:
                        if ($setDefault && $currentSection=='[settings]' && strpos($line,'default') === 0) {
                            $line = "default=$databaseId";
                        }
                        break;
                }

                if ($currentSection != "[$databaseId]") {
                    $output[] = $line;
                }
            }
        }
        else {
            $output = array(
                '[settings]',
                "default=$databaseId",
                '; PDO error modes: ERRMODE_SILENT = 0; ERRMODE_WARNING = 1; ERRMODE_EXCEPTION = 2;',
                '; errormode=2');
        }
        if (!$dbSectionFound) {
            $output[] = '';
            $this->addDbConfigSection($databaseId,$parameters,$output);
        }

        $content = join("\n",$output);
        file_put_contents($configFile,join("\n",$output));
    }

    abstract protected function getNativeDbConfiguration();

}