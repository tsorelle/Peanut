<?php
/**
 * Created by PhpStorm.
 * User: terry
 * Date: 5/15/2017
 * Time: 10:40 AM
 */

namespace Peanut\cms;


use Tops\sys\TAbstractUser;
use Tops\sys\TUser;
use Tops\sys\TPermissionsManager;

class CmsUser extends TAbstractUser
{

    private $roles = array();
    private $email = '';
    private $displayname = '';

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
        $this->id = empty($userInfo['id']) ? false : $userInfo['id'];
        $this->userName = empty($userInfo['name']) ? 'guest' : $userInfo['name'];
        $this->roles = empty($userInfo['roles']) ? array() : explode(',',$userInfo['roles']);
        $this->email = empty($userInfo['email']) ? '' : $userInfo['email'];
        $this->displayname = empty($userInfo['displayname']) ? '' : $userInfo['displayname'];
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

    private function getUserInfo($userName) {
        $config = $this->getConfig();
        return empty($config[$userName]) ? array() : $config[$userName];
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
        $userName =  $this->getCurrentUserName();
        $info = $this->getUserInfo($userName);
        $this->loadUserInfo($info);
        return (!empty($info));
    }

    /**
     * @param $roleName
     * @return bool
     */
    public function isMemberOf($roleName)
    {
        return parent::isMemberOf($roleName) || in_array($roleName,$this->roles);
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
        return $this->userName != 'guest';
    }

    public function isAuthorized($permissionName = '')
    {

        $result = parent::isAuthorized($permissionName);
        if (!$result) {
            $manager = TPermissionsManager::getPermissionManager();
            $permission = $manager->getPermission($permissionName);
            $roles = $this->getRoles();
            foreach ($roles as $role) {
                if ($permission->check($role)) {
                    return true;
                }
            }

            return $result;
        }
        return $result;
    }

    /**
     * @return bool
     */
    public function isAdmin()
    {
        return in_array(TPermissionsManager::adminRole,$this->roles);
    }

    /**
     * @return bool
     */
    public function isCurrent()
    {
        return $this->userName == $this->getCurrentUserName();
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

    /**
     * @return string[]
     */
    public function getRoles()
    {
        return $this->roles;
    }

    protected function loadProfile()
    {
        $this->profile = [
             TUser::profileKeyEmail => $this->email,
             TUser::profileKeyDisplayName => $this->displayname,
             TUser::profileKeyShortName => $this->displayname,
             TUser::profileKeyFullName => $this->displayname
        ];
    }

    public function signIn($username, $password = null)
    {
        // TODO: Implement signIn() method.
        return true;
    }
}