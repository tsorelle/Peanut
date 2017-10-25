<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 10/25/2017
 * Time: 6:47 AM
 */

namespace Peanut\PeanutRiddler\services;


use Peanut\PeanutPermissions\services\GetPermissionsCommand;
use Tops\services\TServiceCommand;

/**
 * Class CheckAnswerCommand
 * @package Peanut\Riddler
 *
 * Request
 *     interface IRiddlerCheckAnswerRequest {
 *         topic: string;
 *         questionId: string;
 *         answer: string;
 *     }
 *
 * Response
 *      Boolean
 */
class CheckAnswerCommand extends TServiceCommand
{
    private function cleanAnswer($answer) {
        $answer = str_replace('.',' ',strtolower($answer));
        $words = explode(' ',$answer);
        $result = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $result .= "$word ";
            }
        }
        return trim($result);
    }

    protected function run()
    {
        $request = $this->getRequest();
        if (empty($request)) {
            $this->addErrorMessage('No request');
            return;
        }
        if (!is_object($request)) {
            $this->addErrorMessage('Invalid request');
            return;
        }
        if (empty($request->topic)) {
            $this->addErrorMessage('No topic in request');
            return;
        }
        if (empty($request->questionId)) {
            $this->addErrorMessage('No questionId in request');
            return;
        }
        if (empty($request->answer)) {
            $this->addErrorMessage('No answer in request');
            return;
        }
        $data = GetQuestionsCommand::loadDataFile($request->topic);
        if (!is_array($data)) {
            $this->addErrorMessage($data);
            return;
        }
        $answerKey = 'answers-'.$request->questionId;
        if (!isset($data[$answerKey])) {
            $this->addErrorMessage('No answers found for question #'.$request->questionId);
        }
        $answers = array_values($data[$answerKey]);
        $answer = $this->cleanAnswer($request->answer);
        $result = false;
        foreach ($answers as $correct) {
            if ($answer == $correct) {
                $result = true;
                break;
            }
        }

        $this->setReturnValue($result);
    }
}