<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/15/2017
 * Time: 10:40 AM
 */

namespace Peanut\cms;


use Tops\sys\TConfiguration;

class CmsUser implements \Tops\sys\IUser
{

    private $username = 'tester';
    private $roles = array();
    private $id;



    /**
     * @param $id
     * @return mixed
     */
    public function loadById($id)
    {
        $this->loadByUserName($id == 1 ? 'admin' : 'tester');
    }

    /**
     * @param $userName
     * @return mixed
     */
    public function loadByUserName($userName)
    {
        $this->username = $userName;
        if ($userName == 'admin') {
            $this->id = 1;
            $this->roles = array('admin');
        }
        else {
            $this->id = 2;
            $this->roles = array('finance');
        }
    }

    /**
     * @return mixed
     */
    public function loadCurrentUser()
    {
        $this->loadByUserName('tester');
    }

    /**
     * @param $roleName
     * @return bool
     */
    public function isMemberOf($roleName)
    {
        return (
            $this->isAdmin() || in_array($roleName,$this->roles)
        );
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return bool
     */
    public function isAuthenticated()
    {
        return true;
    }

    /**
     * @param string $value
     * @return bool
     */
    public function isAuthorized($value = '')
    {
        if ($this->isAdmin()) {
            return true;
        }
        $roles = TConfiguration::getValue($value,'permissions');
        if (empty($roles)) {
            return false;
        }
        if ($roles == 'authenticated') {
            return $this->isAuthenticated();
        }
        $roles = explode(',',$roles);
        foreach ($roles as $value) {
            if (in_array($value,$this->roles)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return "Tommy";
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return "Tester";
    }

    /**
     * @return string
     */
    public function getUserName()
    {
        return $this->username;
    }

    /**
     * @param bool $defaultToUsername
     * @return string
     */
    public function getFullName($defaultToUsername = true)
    {
        return "Tommy Tester";
    }

    /**
     * @param bool $defaultToUsername
     * @return string
     */
    public function getUserShortName($defaultToUsername = true)
    {;
        return $this->username;
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        return 'tester@tops.com';
    }

    /**
     * @return bool
     */
    public function isAdmin()
    {
        return in_array('admin',$this->roles);
    }

    /**
     * @return bool
     */
    public function isCurrent()
    {
        return true;
    }

    public function getProfileValue($key)
    {
        // TODO: Implement getProfileValue() method.
    }

    public function setProfileValue($key, $value)
    {
        // TODO: Implement setProfileValue() method.
    }

    /**
     * @param $email
     * @return mixed
     */
    public function loadByEmail($email)
    {
        // TODO: Implement loadByEmail() method.
    }
}