<?php 
/** 
 * Created by /tools/create-model.php 
 * Time:  2017-05-25 10:53:53
 */ 

namespace Bookstore\db\model;

class Invoice  extends TimeStampedEntity 
{ 
    public $id;
    public $customerid;
    public $status;
    public $invoicedate;
} 
