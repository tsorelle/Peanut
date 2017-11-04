<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 11/4/2017
 * Time: 11:43 AM
 */

namespace Peanut\sys;


use Tops\sys\TIniTranslator;

class PeanutIniTranslator extends TIniTranslator
{
    public function importIniTranslations(&$ini)
    {
        PeanutTranslator::GetPeanutTranslations($ini);
    }
}