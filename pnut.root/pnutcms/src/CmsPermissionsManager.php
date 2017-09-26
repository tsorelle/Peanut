<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/16/2017
 * Time: 9:41 AM
 */

namespace Peanut\cms;


use Tops\sys\IPermissionsManager;
use Tops\sys\TPermission;

class CmsPermissionsManager implements IPermissionsManager
{
    /**
     * @var TPermission[];
     */
    private $permissions = array();
    private $roles = array();

    public function __construct()
    {
        global $_SESSION;
        if (isset($_SESSION['permission-manager'])) {
            $config = $_SESSION['permission-manager'];
        }
        else {
            $config = parse_ini_file(__DIR__.'/../permissions.ini',true);
            if (isset($_SESSION)) {
                $_SESSION['permission-manager'] = $config;
            }
        }

        foreach($config['roles'] as $role => $description) {
            $this->addRole($role,$description);
        }
        foreach($config['permissions'] as $name => $description) {
            $this->addPermission($name,$description);
        }

        foreach($config['permission-roles'] as $permission => $roleList) {
            $roles = explode(',',$roleList);
            foreach ($roles as $roleName) {
                $this->assignPermission($roleName,$permission);
            }
        }
    }

    /**
     * @param string $roleName
     * @param string $roleDescription
     */
    public function addRole($roleName, $roleDescription = '')
    {
        $this->roles[$roleName] = $roleDescription;
    }

    /**
     * @param string $roleName
     * @return bool
     */
    public function removeRole($roleName)
    {
        if (!empty($this->roles[$roleName])) {
            unset($this->roles[$roleName]);
            $keys = array_keys($this->permissions);
            foreach ($keys as $permissionKey) {
               $this->revokePermission($roleName,$permissionKey);
            }
        }
    }

    /**
     * @return string[]
     */
    public function getRoles()
    {
        return array_keys($this->roles);
    }

    /**
     * @return TPermission[]
     */
    public function getPermissions()
    {
        return $this->permissions;
    }

    public function addPermission($name, $description)
    {
        $permission = new TPermission();
        $permission->setDescription($description);
        $permission->setPermissionName($name);
        // $permission->setRoles(array());
        $this->permissions[$name] = $permission;
    }

    private function getNullPermission($name) {
        $permission = new TPermission();
        $permission->setDescription('null permission');
        $permission->setPermissionName($name);
        $permission->setRoles(array());
        return $permission;
    }

    /**
     * @return TPermission
     */
    public function getPermission($permissionName)
    {
        $permission = (isset($this->permissions[$permissionName])) ? $this->permissions[$permissionName] : $this->getNullPermission($permissionName);
        return $permission;
    }

    /**
     * @param string $roleName
     * @param string $permissionName
     * @return bool
     */
    public function assignPermission($roleName, $permissionName)
    {
        if (isset($this->permissions[$permissionName])) {
            $this->permissions[$permissionName]->addRole($roleName);
            return true;
        }
        return false;
    }

    /**
     * @param string $roleName
     * @param string $permissionName
     * @return bool
     */
    public function revokePermission($roleName, $permissionName)
    {
        if (isset($this->permissions[$permissionName])) {
            $this->permissions[$permissionName]->removeRole($roleName);
        }
        return true;
    }

    public function removePermission($name)
    {
        if (isset($this->permissions[$name])) {
            unset($this->permissions[$name]);
            return false;
        }
        return true;

    }
}