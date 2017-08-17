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
    public function testGetDefaultInstaller()
    {
        $actual = \Peanut\sys\PeanutInstaller::GetInstaller();
        $this->assertInstanceOf('Peanut\sys\DefaultPeanutInstaller', $actual);
    }

    private function createTestLog(array $lines)
    {
        $time = new DateTime();
        $time->modify('-1 years');
        $logLines = array();
        foreach ($lines as $line) {
            $time->modify("+1 seconds");
            $logLines[] = $time->format("Y-m-d H:i:s") . "::$line";
        }
        // file_put_contents(__DIR__.'/files/peanut-installation.log',join("\n",$$logLines));
        return $logLines;
    }

    private function createBasicTestLog() {
        $testLog = $this->createTestLog(array(
            'peanut::' . PeanutInstallationLog::InstallationStartedMessage,
            'peanut::operation 1 started',
            'peanut::operation 1 completed',
            'peanut::oops I crashed',
            'peanut::' . PeanutInstallationLog::InstallationFailedMessage,
            'peanut::' . PeanutInstallationLog::InstallationStartedMessage,
            'peanut::operation 1 started',
            'peanut::operation 1 completed',
            'peanut::' . PeanutInstallationLog::InstallationCompletedMessage,
            'qnut::' . PeanutInstallationLog::InstallationStartedMessage,
            'qnut::operation 1 started',
            'qnut::operation 1 completed',
            'qnut::' . PeanutInstallationLog::InstallationCompletedMessage,
        ));
        return $testLog;
    }

    private function compareLogs($actualLog,$testLog,$testName) {
        $this->assertNotEmpty($actualLog);
        $testMessage = " Failed in $testName";
        $expected = 2;
        $actual = sizeof($actualLog);
        $this->assertEquals($expected,$actual,'Size of log does not match input. '.$testMessage);

        $expected = 9;
        $actual = sizeof($actualLog['peanut']);
        $this->assertEquals($expected,$actual,'Size of peanut log does not match input.'.$testMessage);

        $expected = 4;
        $actual = sizeof($actualLog['qnut']);
        $this->assertEquals($expected,$actual,'Size of qnut log does not match input.'.$testMessage);

        $actual = $actualLog['peanut'][0]->message;
        $expected = PeanutInstallationLog::InstallationStartedMessage;
        $this->assertEquals($expected,$actual,$testMessage);

        $actual = $actualLog['peanut'][4]->message;
        $expected = PeanutInstallationLog::InstallationFailedMessage;
        $this->assertEquals($expected,$actual,$testMessage);

        $actual = $actualLog['peanut'][5]->message;
        $expected = PeanutInstallationLog::InstallationStartedMessage;
        $this->assertEquals($expected,$actual,$testMessage);

        $actual = $actualLog['peanut'][8]->message;
        $expected = PeanutInstallationLog::InstallationCompletedMessage;
        $this->assertEquals($expected,$actual,$testMessage);

        $actual = $actualLog['qnut'][0]->message;
        $expected = PeanutInstallationLog::InstallationStartedMessage;
        $this->assertEquals($expected,$actual,$testMessage);

        $actual = $actualLog['qnut'][3]->message;
        $expected = PeanutInstallationLog::InstallationCompletedMessage;
        $this->assertEquals($expected,$actual,$testMessage);
    }
    
    public function testCreateLogs()
    {
        $testLog = $this->createBasicTestLog();
        $logger = new PeanutInstallationLog();
        $logger->createLogs($testLog);
        $archive = $logger->getArchive();
        $this->compareLogs($archive,$testLog,'testCreateLogs');
    }

    public function testCompletion() {
        $testLog = $this->createBasicTestLog();
        $lastIndx = sizeof($testLog) - 1;
        $lastLine = $testLog[$lastIndx];
        $parts = explode('::',$lastLine);
        $parts[2] = PeanutInstallationLog::InstallationFailedMessage;
        $testLog[$lastIndx] = join('::',$parts);
        $logger = new PeanutInstallationLog();
        $logger->createLogs($testLog);
        $actual = $logger->installationCompleted('peanut');
        $this->assertTrue($actual !== false,"Peanut installation completed at $actual");
        $actual = $logger->installationCompleted('qnut');
        $this->assertFalse($actual,"Qnut installation completed at $actual");

    }

    public function testLogMessages()
    {
        $testLog = $this->createBasicTestLog();
        $logger = new PeanutInstallationLog();
        $logger->createLogs();
        foreach ($testLog as $line) {
            $parts = explode('::',$line);
            $logger->addLogEntry($parts[1],$parts[2]);
        }
        $log = $logger->getLog();
        $this->assertNotEmpty($log);
        $this->compareLogs($log,$testLog,'testLogMessages');
    }

    public function testFlattenLog() {
        $testLog = $this->createBasicTestLog();
        $logger = new PeanutInstallationLog();
        $logger->createLogs();
        foreach ($testLog as $line) {
            $parts = explode('::', $line);
            $logger->addLogEntry($parts[1], $parts[2]);
        }
        $content = $logger->flattenLog();
        $this->compareLogFiles($testLog, $content, $logger);
    }

    /**
     * @param $logger PeanutInstallationLog
     * @param $testLog
     * @param $logDir
     * @param $logFile
     * @return array|bool
     */
    private function writeTestLog($logger, $testLog, $logDir) {
        $logFile=$logDir.'/'.PeanutInstallationLog::LogFileName;
        if (file_exists($logFile)) {
            unlink($logFile);
        }
        $logger->openLogFile($logDir);
        foreach ($testLog as $line) {
            $parts = explode('::',$line);
            $logger->addLogEntry($parts[1],$parts[2]);
        }
        $logger->save();
        return $logFile;
    }

    public function testWriteLog() {
        $logger = new PeanutInstallationLog();
        $testLog = $this->createBasicTestLog();
        $logDir = __DIR__.'/files';
        $logFile = $this->writeTestLog($logger,$testLog,$logDir);
        $savedLog = file($logFile);
        $this->compareLogFiles($testLog,$savedLog,$logger);
        unlink($logFile);
    }

    public function testReadLog() {
        $logger = new PeanutInstallationLog();
        $testLog = $this->createBasicTestLog();
        $logDir = __DIR__.'/files';
        $logFile = $this->writeTestLog($logger,$testLog, $logDir);
        $log = $logger->getLog();

        $logger->openLogFile($logDir);
        $archive = $logger->getArchive();

        $this->compareLogs($archive,$log,'testReadlog');
        unlink($logFile);
    }

    /**
     * @param $testLog
     * @param $content
     * @param $logger
     */
    protected function compareLogFiles($testLog, $content, $logger)
    {
        $expected = sizeof($testLog);
        $lineCount = sizeof($content);
        $this->assertEquals($expected, $lineCount);
        for ($i = 0; $i < $lineCount; $i++) {
            $expectedLine = $testLog[$i];
            $actualLine = $content[$i];
            $expectedParts = explode('::', $expectedLine);
            $actualParts = explode('::', $expectedLine);
            for ($j = 0; $j < 3; $j++) {
                $this->assertEquals($expectedParts[$j], $actualParts[$j]);
            }

            $expected = $logger->createEntry($expectedParts[2], 'datetime');
            $actual = $logger->createEntry($actualParts[2], 'datetime');
            $this->assertEquals($expected->message, $actual->message);
            $this->assertEquals($expected->time, 'datetime');
            $this->assertEquals($actual->time, 'datetime');
        }
    }

}