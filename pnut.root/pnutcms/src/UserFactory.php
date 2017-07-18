<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/15/2017
 * Time: 10:46 AM
 */

namespace Peanut\cms;

use Tops\sys\IUser;

class UserFactory implements \Tops\sys\IUserFactory
{
    /**
     * @return IUser
     */
    public function createUser()
    {
        return new CmsUser();
    }
}