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
use Tops\sys\TStrings;
use Tops\sys\TUser;

class CmsPermissionsManager implements IPermissionsManager
{
    /**
     * @var TPermission[];
     */
    private $permissions = array();
    private $roles = array();
    private $initializing = true;

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
            if ($role != TUser::AdminRole && $role != TUser::GuestRole) {

                $this->addRole($role,$description);
            }
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
        $this->initializing = false;
    }

    /**
     * @param string $roleName
     * @param string $roleDescription
     */
    public function addRole($roleName, $roleDescription = '')
    {
        $this->roles[$roleName] = $roleDescription;
        $this->saveChanges();
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
        $this->saveChanges();
        return true;
    }

    /**
     * @return \stdClass[]
     */
    public function getRoles()
    {
        $result = $this->getActualRoles();
        $virtualRoles = TUser::getVirtualRoles();
        $result[] = $virtualRoles[TUser::AuthenticatedRole];
        $result[] = $virtualRoles[TUser::GuestRole];

        return $result;
    }

    public function getActualRoles() {
        $result = array();
        foreach ($this->roles as $name => $description) {
            $item = new \stdClass();
            $item->Key = TStrings::ConvertNameFormat($name,IPermissionsManager::roleKeyFormat);
            $item->Name = TStrings::ConvertNameFormat($name,IPermissionsManager::roleNameFormat);
            $item->Description = TStrings::ConvertNameFormat($name,IPermissionsManager::roleDescriptionFormat);
            $result[] = $item;
        }
        return $result;
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
        $this->saveChanges();
    }

    private function getNullPermission($name) {
        $permission = new TPermission();
        $permission->setDescription('null permission');
        $permission->setPermissionName($name);
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
        $result = false;
        if (isset($this->permissions[$permissionName])) {
            $this->permissions[$permissionName]->addRole($roleName);
            $result = true;
        }
        $this->saveChanges();
        return $result;
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
        $this->saveChanges();
        return true;
    }

    public function removePermission($name)
    {
        $result = true;
        if (isset($this->permissions[$name])) {
            unset($this->permissions[$name]);
            $result = false;
        }
        $this->saveChanges();
        return $result;

    }

    public function saveChanges() {
        if ($this->initializing) {
            return;
        }
        global $_SESSION;

        $config = array();
        $roles = $this->getActualRoles();
        foreach ($roles as $role) {
            $config['roles'][$role->Key] = $role->Description;
        }
        $permissions = $this->getPermissions();
        foreach ($permissions as $p) {
            $config['permissions'][$p->getPermissionName()] = $p->getDescription();
            $config['permission-roles'][$p->getPermissionName()] = join(',',$p->getRoles());
        }
        $_SESSION['permission-manager'] = $config;
    }

}