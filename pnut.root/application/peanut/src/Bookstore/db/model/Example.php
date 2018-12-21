<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 5/5/2017
 * Time: 7:18 PM
 */

namespace Bookstore\db\model;


class Example extends TimeStampedEntity
{
    public $id;
    public $name;
    public $isbn;
    public $authors;
    public $price;

    private $message;

    public function __construct()
    {
        $this->message = 'loaded';
    }

    public function fullTitle() {
        return  "$this->title by $this->author";
    }
}


