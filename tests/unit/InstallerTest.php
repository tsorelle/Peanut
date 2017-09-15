<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/14/2017
 * Time: 9:02 AM
 */

use Peanut\sys\PeanutInstallationLog;
use Peanut\testing\FakePeanutInstaller;
use PHPUnit\Framework\TestCase;


class InstallerTest extends TestCase
{
    private function createTestLog(array $lines)
    {
        $time = new DateTime();
        $time->modify('-1 years');
        $logLines = array();
        foreach ($lines as $line) {
            $time->modify("+1 seconds");
            $logLines[] = $time->format("Y-m-d H:i:s") . "::$line";
        }
        return $logLines;
    }
    
    private function getVersions() {
        $result = new \stdClass();
        $peanutRoot = realpath(__DIR__.'/../../pnut.root/modules/pnut');
        $settings = parse_ini_file($peanutRoot.'/peanut.ini');
        $result->peanut = $settings['version'];
        $settings = parse_ini_file($peanutRoot.'/packages/qnut/package.ini');
        $result->qnut = $settings['version'];
        return $result;
    }

    private function createBasicTestLog() {
        $versions = $this->getVersions();
        $testLog = $this->createTestLog(array(
            'peanut::'.$versions->peanut.'::' . PeanutInstallationLog::InstallationStartedMessage,
            'peanut::'.$versions->peanut.'::operation 1 started',
            'peanut::'.$versions->peanut.'::operation 1 completed',
            'peanut::'.$versions->peanut.'::oops I crashed',
            'peanut::'.$versions->peanut.'::' . PeanutInstallationLog::InstallationFailedMessage,
            'peanut::'.$versions->peanut.'::' . PeanutInstallationLog::InstallationStartedMessage,
            'peanut::'.$versions->peanut.'::operation 1 started',
            'peanut::'.$versions->peanut.'::operation 1 completed',
            'peanut::'.$versions->peanut.'::' . PeanutInstallationLog::InstallationCompletedMessage,
            'peanut::'.$versions->qnut.'::' . PeanutInstallationLog::InstallationStartedMessage,
            'peanut::'.$versions->qnut.'::operation 1 started',
            'peanut::'.$versions->qnut.'::operation 1 completed',
            'peanut::'.$versions->qnut.'::'. PeanutInstallationLog::InstallationCompletedMessage,
        ));
        return $testLog;
    }


    public function testGetStatus() {
        $testLog = $this->createBasicTestLog();

        $installer = \Peanut\sys\PeanutInstaller::GetInstaller();
        $archive = PeanutInstallationLog::convertLogContent($testLog);
        $actual = $installer->findInstallationStatus('peanut',$archive);
        $this->assertTrue($actual !== false);
        $this->assertNotEmpty($actual->version);

        $end = sizeof($archive['peanut']);
        for ($i=0;$i<$end;$i++) {
            $entry = $archive['peanut'][$i];
            if ($entry->message === PeanutInstallationLog::InstallationCompletedMessage) {
                $entry->message = PeanutInstallationLog::InstallationFailedMessage;
                $archive['peanut'][$i] = $entry;
            }
        }

        $actual = $installer->findInstallationStatus('peanut',$archive);
        $this->assertTrue($actual === false);
    }


    public function testLogMessages()
    {
        $logger = new PeanutInstallationLog();

        $logger->setArchive(array());
        $logger->startSession('peanut');
        for ($i = 1; $i<5; $i++) {
            $logger->addLogEntry("Message $i");
        }
        $logger->endSession();

        $log = $logger->getLog();
        $this->assertTrue(sizeof($log) == 1);
        $this->assertTrue(array_key_exists('peanut',$log));
        $log = $log['peanut'];
        $this->assertEquals(PeanutInstallationLog::InstallationStartedMessage, $log[0]->message);
        for($i=1;$i<5;$i++) {
            $this->assertEquals("Message $i",$log[$i]->message);
        }
        $this->assertEquals(PeanutInstallationLog::InstallationCompletedMessage, $log[5]->message);
    }

    function getSessionRecords($testLog)
    {
        $result = array();
        foreach ($testLog as $line) {
            $parts = explode('::', $line);
            switch ($parts[3]) {
                case PeanutInstallationLog::InstallationStartedMessage :
                    $result = array($line);
                    break;
                case PeanutInstallationLog::InstallationFailedMessage :
                    $result = array();
                    break;
                case PeanutInstallationLog::InstallationCompletedMessage :
                    $result[] = $line;
                    return ($result);
                default :
                    $result[] = $line;
                    break;
            }
        }
        return array();
    }



    function filterTestLog($testLog,$package='peanut')
    {
        $result = array();
        foreach ($testLog as $line) {
            $parts = explode('::', $line);
            if ($parts[1] == $package) {
                $result[] = $line;
            }
        }
        return $result;
    }


    private function addEntriesFromTestLog(PeanutInstallationLog $logger,$testLog)
    {
        foreach ($testLog as $line) {
            $parts = explode('::', $line);
            if ($parts[3] != PeanutInstallationLog::InstallationStartedMessage &&
                $parts[3] != PeanutInstallationLog::InstallationCompletedMessage
            ) {
                $logger->addLogEntry($parts[3]);
            }
        }
    }

    public function testFlattenLog() {
        $testLog = $this->createBasicTestLog();
        $testLog = $this->filterTestLog($testLog);
        $sessionLog = $this->getSessionRecords($testLog);

        $logger = new PeanutInstallationLog();
        $logger->setArchive(array());
        $logger->startSession('peanut');
        $this->addEntriesFromTestLog($logger, $sessionLog);
        $logger->endSession();
        $content = $logger->flattenLog();
        $this->compareLogFiles($sessionLog, $content);
    }

    public function testWriteLog() {
        $logger = new PeanutInstallationLog();
        $logDir = __DIR__.'/files';
        $logFile = $logDir.'/'.PeanutInstallationLog::LogFileName;
        if (file_exists($logFile)) {
            unlink($logFile);
        }
        $logger->setArchive(array());
        $logger->startSession('peanut',$logDir);
        for ($i = 1; $i<5; $i++) {
            $logger->addLogEntry("Message $i");
        }
        $logger->endSession();

        $log = $logger->getLogFlat();
        $savedLog = file($logFile);
        $expected = sizeof($log);
        $this->assertEquals($expected,sizeof($savedLog));
        for ($i=0;$i<$expected;$i++) {
            $this->assertEquals($log[$i], trim($savedLog[$i]));
        }
        unlink($logFile);
    }

    public function testReadLog() {
        $logger = new PeanutInstallationLog();
        $testLog = $this->createBasicTestLog();
        $logDir = __DIR__.'/files';
        $logFile = $logDir.'/'.PeanutInstallationLog::LogFileName;
        if (file_exists($logFile)) {
            unlink($logFile);
        }
        file_put_contents($logFile, join("\n",$testLog));

        $logger->startSession('peanut',$logDir);
        $archive = $logger->getArchiveFlat();
        $expected = sizeof($testLog);
        $this->assertEquals($expected,sizeof($archive));
        for ($i=0;$i<$expected;$i++) {
            $this->assertEquals(trim($testLog[$i]), trim($archive[$i]));
        }
        unlink($logFile);
    }


    
    /**
     * @param $testLog
     * @param $content
     * @param $logger
     */
    public function compareLogFiles($testLog, $content)
    {
        $expected = sizeof($testLog);
        $lineCount = sizeof($content);
        $this->assertEquals($expected, $lineCount);
        for ($i = 0; $i < $lineCount; $i++) {
            $expectedLine = $testLog[$i];
            $actualLine = trim($content[$i]);
            $expectedParts = explode('::', $expectedLine);
            $actualParts = explode('::', $actualLine);
            for ($j = 1; $j < 3; $j++) {
                $expected = $expectedParts[$j];
                $actual = $actualParts[$j];
                $this->assertEquals($expected,$actual );
            }
        }
    }

}