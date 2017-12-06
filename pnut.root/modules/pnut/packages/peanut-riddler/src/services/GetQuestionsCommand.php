<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 10/25/2017
 * Time: 6:23 AM
 */

namespace Peanut\PeanutRiddler\services;
//        Peanut\PeanutRiddler\services


use Tops\services\TServiceCommand;
use Tops\sys\TLanguage;
use Tops\sys\TPath;

/**
 * Class GetQuestionsCommand
 * @package Peanut\Riddler
 *
 * Request
 *   topid; string
 *
 * Response
 *     Array of
 *        export interface IRiddlerQuestion {
 *           id: string;
 *           question: string;
 *        }
 */
class GetQuestionsCommand extends TServiceCommand
{

    public static function loadDataFile($topic)
    {
        global $_SESSION;
        $_SESSION["riddler-$topic"] = null;
        /*if (isset($_SESSION["riddler-$topic"])) {
            return $_SESSION["riddler-$topic"];
        }*/
        if (empty($topic)) {
            return 'Topic not received';
        }
        $path = TPath::fromFileRoot("application/data/riddler/$topic.ini");
        if (!file_exists($path)) {
            $path = @realpath(__DIR__ . "/../../data/$topic.ini");
            if (empty($path)) {
                return "$topic.ini not found";
            }
        }
        $data = @parse_ini_file($path, true);
        if ($data === false) {
            return "$topic.ini file invalid";
        }
        // $_SESSION["riddler-$topic"] = $data;
        return $data;
    }

    protected function run()
    {
        $response = new \stdClass();
        $response->translations = TLanguage::getTranslations(
            array(
                'riddler-header',
                'riddler-guess-limit',
                'riddler-sys-error1',
                'riddler-sys-error2',
                'riddler-error-no-answer',
                'riddler-error-bad-answer',
                'riddler-wait-check-answer'
            )
        );

        if ($this->getUser()->isAuthenticated()) {
            // empty array with no errors indicates do riddle needed.
            $response->questions = [];
        } else {
            $topic = $this->getRequest();
            $data = self::loadDataFile($topic);
            if (!is_array($data)) {
                $this->addErrorMessage($data);
                return;
            }
            if (empty($data['questions'])) {
                $this->addErrorMessage("$topic.ini file invalid. No questions section");
                return;
            }
            $questions = $data['questions'];
            $result = array();

            foreach ($questions as $key => $value) {
                $item = new \stdClass();
                $item->id = $key;
                $item->question = $value;
                $result[] = $item;
            }
            $response->questions = $result;
        }
        $this->setReturnValue($response);
    }
}