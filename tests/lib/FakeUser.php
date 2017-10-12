<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/22/2017
 * Time: 6:48 AM
 */
namespace Peanut\testing;

use Tops\sys\TAbstractUser;

class FakeUser extends TAbstractUser
{
    private $authenticated;
    private $roles;
    // private $permissions;

    public function __construct($roles, $authenticated=true)
    {
        $this->roles=explode(',',$roles);
        $this->authenticated = $authenticated;
    }

    /**
     * @param $id
     * @return mixed
     */
    public function loadById($id)
    {
        // TODO: Implement loadById() method.
    }

    /**
     * @param $userName
     * @return mixed
     */
    public function loadByUserName($userName)
    {
        // TODO: Implement loadByUserName() method.
    }

    /**
     * @param $email
     * @return mixed
     */
    public function loadByEmail($email)
    {
        // TODO: Implement loadByEmail() method.
    }

    /**
     * @return mixed
     */
    public function loadCurrentUser()
    {
        // TODO: Implement loadCurrentUser() method.
    }

    /**
     * @param $roleName
     * @return bool
     */
    public function isMemberOf($roleName)
    {
        return in_array($roleName,$this->roles);
    }

    /**
     * @return int
     */
    public function getId()
    {
        return 1;
    }

    /**
     * @return bool
     */
    public function isAuthenticated()
    {
        return $this->authenticated;
    }

    /**
     * @param string $value
     * @return bool
     */
    public function isAuthorized($value = '')
    {
        // TODO: Implement isAuthorized() method.
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        // TODO: Implement getFirstName() method.
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        // TODO: Implement getLastName() method.
    }

    /**
     * @return string
     */
    public function getUserName()
    {
        // TODO: Implement getUserName() method.
    }

    /**
     * @param bool $defaultToUsername
     * @return string
     */
    public function getFullName($defaultToUsername = true)
    {
        // TODO: Implement getFullName() method.
    }

    /**
     * @param bool $defaultToUsername
     * @return string
     */
    public function getUserShortName($defaultToUsername = true)
    {
        // TODO: Implement getUserShortName() method.
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        // TODO: Implement getEmail() method.
    }

    /**
     * @return bool
     */
    public function isAdmin()
    {
        return $this->isMemberOf('admin');
    }

    /**
     * @return bool
     */
    public function isCurrent()
    {
        // TODO: Implement isCurrent() method.
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
     * @param bool $defaultToUsername
     * @return string
     */
    public function getShortName($defaultToUsername = true)
    {
        // TODO: Implement getShortName() method.
    }

    public function getDisplayName($defaultToUsername = true)
    {
        // TODO: Implement getDisplayName() method.
    }

    public function getUserPicture($size = 0, array $classes = [], array $attributes = [])
    {
        // TODO: Implement getUserPicture() method.
    }

    /**
     * @return string[]
     */
    public function getRoles()
    {
        // TODO: Implement getRoles() method.
    }

    protected function loadProfile()
    {
        // TODO: Implement loadProfile() method.
    }
}