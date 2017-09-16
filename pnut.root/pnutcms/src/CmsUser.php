<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/15/2017
 * Time: 10:40 AM
 */

namespace Peanut\cms;


use Tops\sys\TAbstractUser;

class CmsUser extends TAbstractUser
{

    private $username='guest';
    private $roles = array();
    private $id = false;
    private $email = '';
    private $first = '';
    private $last = '';

    private $config;
    private function getConfig() {
        if (!isset($this->config)) {
            $this->config = parse_ini_file(__DIR__.'/../users.ini',true);
        }
        return $this->config;
    }

    public function __construct($config=null)
    {
        if ($config != null) {
            $this->config = $config;
        }
    }

    private function loadUserInfo(array $userInfo) {
        $this->id = empty($userInfo['id'] ? false : $userInfo['id']);
        $this->username = empty($userInfo['name'] ? 'guest' : $userInfo['name']);
        $this->roles = empty($userInfo['roles']) ? array() : explode(',',$userInfo['roles']);
        $this->email = empty($userInfo['email'] ? '' : $userInfo['email']);
        $this->first = empty($userInfo['first'] ? '' : $userInfo['first']);
        $this->email = empty($userInfo['last'] ? '' : $userInfo['last']);
    }

    private function searchUsers($key,$value)
    {
        $config = $this->getConfig();
        foreach (array_keys($this->getConfig()) as $sectionKey) {
            if ($sectionKey != 'settings' && $config[$sectionKey[$key] == $value]) {
                return $config[$sectionKey];
            }
        }
        return array();
    }

    private function getUserInfo($username) {
        $config = $this->getConfig();
        return empty($config[$username]) ? array() : $config[$username];
    }


    /**
     * @param $id
     * @return mixed
     */
    public function loadById($id)
    {
        $info = $this->searchUsers('id',$id);
        $this->loadUserInfo($info);
        return (!empty($info));
    }

    /**
     * @param $userName
     * @return mixed
     */
    public function loadByUserName($userName)
    {
        $config = $this->getConfig();
        $info = array_key_exists($userName,$config) ? $config[$userName] : array();
        $this->loadUserInfo($info);
        return (!empty($info));
    }

    private function getCurrentUserName() {
        $config = $this->getConfig();
        return  empty($config['settings']['current']) ? '' : $config['settings']['current'];

    }

    /**
     * @return mixed
     */
    public function loadCurrentUser()
    {
        $username =  $this->getCurrentUserName();
        $info = $this->getUserInfo($username);
        $this->loadUserInfo($info);
        return (!empty($info));
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
        return $this->getCurrentUserName() == $this->username;
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return $this->first;
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return $this->last;
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
        return "$this->first $this->last";
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
        return $this->email;
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
        return $this->username == $this->getCurrentUserName();
    }

    public function getProfileValue($key)
    {
        // not implemented
        return false;
    }

    public function setProfileValue($key, $value)
    {
        // not implemented
    }

    /**
     * @param $email
     * @return mixed
     */
    public function loadByEmail($email)
    {
        $info = $this->searchUsers('email',$email);
        $this->loadUserInfo($info);
        return (!empty($info));
    }

    protected function test()
    {
        return true;
    }

    /**
     * @return string[]
     */
    public function getRoles()
    {
        return $this->roles;
    }

    protected function loadProfile()
    {
        // not implemented
        return false;
    }
}