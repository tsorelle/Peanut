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
use Tops\sys\TL;
use Tops\sys\TLanguage;

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
            $this->addErrorMessage('no-request','No request');
            return;
        }
        if (!is_object($request)) {
            $this->addErrorMessage('invalid-request','Invalid request');
            return;
        }
        if (empty($request->topic)) {
            $this->addErrorMessage('no-request-topic','No topic in request');
            return;
        }
        if (empty($request->questionId)) {
            $this->addErrorMessage('no-question-id','No questionId in request');
            return;
        }
        if (empty($request->answer)) {
            $this->addErrorMessage('no-request-answer','No answer in request');
            return;
        }
        $data = GetQuestionsCommand::loadDataFile($request->topic);
        if (!is_array($data)) {
            $this->addErrorMessage($data);
            return;
        }
        
        $answerKey = 'answers-'.$request->questionId;
        if (!isset($data[$answerKey])) {
            $noAnswers = TLanguage::text('no-answers-found','No answers found for question');
            $this->addErrorMessage("$noAnswers #".$request->questionId,true);
        }
        $result = false;
        if (empty($data[$answerKey])) {
            $this->addErrorMessage('No answer section found.');
        }
        else {
            $answer = $this->cleanAnswer($request->answer);
            $answers = $data[$answerKey];
            foreach ($answers as $correct) {
                if ($answer == $correct) {
                    $result = true;
                    break;
                }
            }
        }

        $this->setReturnValue($result);
    }
}