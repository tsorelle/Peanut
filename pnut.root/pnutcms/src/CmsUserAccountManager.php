<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/29/2019
 * Time: 9:15 AM
 */

namespace Peanut\cms;
use Tops\sys\IUserAccountManager;
use Tops\sys\TAddUserAccountResponse;

class CmsUserAccountManager implements IUserAccountManager
{

    /**
     * @param $username
     * @return number | null
     */
    public function getCmsUserId($username)
    {
        // TODO: Implement getCmsUserId() method.
        return 1;
    }

    /**
     * @param $email
     * @return number | null
     */
    public function getCmsUserIdByEmail($email)
    {
        // TODO: Implement getCmsUserIdByEmail() method.
        return 1;
    }

    /**
     * @return TAddUserAccountResponse
     */
    public function addAccount($username, $password, $email = null, $roles = [], $profile = [])
    {
        // TODO: Implement addAccount() method.
        return new TAddUserAccountResponse();
    }

    public function getPasswordResetUrl()
    {
        // TODO: Implement getPasswordResetUrl() method.
        return null;
    }

    public function getLoginUrl()
    {
        // TODO: Implement getLoginUrl() method.
        return null;
    }
}