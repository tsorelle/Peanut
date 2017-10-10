<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/25/2017
 * Time: 11:46 AM
 */

namespace Peanut\PeanutPermissions\services;

use Tops\services\TServiceCommand;
use Tops\sys\IPermissionsManager;
use Tops\sys\TObjectContainer;
use Tops\sys\TUser;

class GetPermissionsCommand extends TServiceCommand
{
    /*******
     * Service Contract
     *	 request: (none)
     *  response:
     *    interface IGetPermissionsResponse {
     *        permissions: IPermission[]
     *			{
     *				permissionName : string;
     *				description: string;
     *				roles: string[];
     *			};
     *        roles: string[];
     *    }
     *******/

    public static function getPermissionsList(IPermissionsManager $manager,$roles) {
        $result = array();
        $permissions = $manager->getPermissions();
        $roleIndex = [];
        foreach ($roles as $role) {
            $roleIndex[$role->Key] = $role;
        }
        foreach ($permissions as $permissionRow) {
            $permission = $manager->getPermission($permissionRow->getPermissionName());
            $item = new \stdClass();
            $item->permissionName = $permission->getPermissionName();
            $item->description = $permission->getDescription();
            $item->roles = [];
            $permissionRoles = $permission->getRoles();
            foreach ($permissionRoles as $roleKey) {
                if (array_key_exists($roleKey,$roleIndex)) {
                    $item->roles[] = $roleIndex[$roleKey];
                }
            }
            $result[] = $item;
        }
        return $result;

    }

    /**
     * @param $manager IPermissionsManager
     * @return \stdClass[];
     */
    public static function getRoles($manager) {
        $roles = $manager->getRoles();
        $authRole = new \stdClass();
        $authRole->Key = TUser::AuthenticatedRole;
        $authRole->Name = 'Authenticated user';
        $authRole->Description = 'Authenticated user';
        $roles[] = $authRole;
        return $roles;

    }
    protected function run()
    {
        /**
         * @var $manager IPermissionsManager
         */
        $manager = TObjectContainer::Get('tops.permissions');
        if ($manager === false) {
            $this->addErrorMessage('Permision manager not defined.');
        }
        $result = new \stdClass();
        $result->roles = self::getRoles($manager);
        $result->permissions = self::getPermissionsList($manager,$result->roles);
        $this->setReturnValue($result);
    }
}