<?php 
/** 
 * Created by /tools/create-model.php 
 * Time:  2017-05-25 10:53:53
 */ 

namespace Bookstore\db\model;

class Customer  extends TimeStampedEntity 
{ 
    public $id;
    public $customertypeid;
    public $name;
    public $address;
    public $city;
    public $state;
    public $postalcode;
    public $buyer;
    public $active;
} 
