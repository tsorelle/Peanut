<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/25/2017
 * Time: 8:41 AM
 */

namespace Peanut\PeanutPermissions\services;


use Tops\services\TServiceCommand;
use Tops\sys\TPermissionsManager;

class UpdatePermissionCommand extends TServiceCommand
{

    public function __construct()
    {
        $this->addAuthorization(TPermissionsManager::managePermissionsPermissionName);
    }

    /*******
     * Service Contract
     *	 request:
     *		{
     *			permissionName: string;
     *			roles: string[]
     *		}
     *	 response:
     *		array of
     *		 interface IPermission {
     *			permissionName : string;
     *			description: string;
     *			roles: string[];
     *		}
     *******/

    protected function run()
    {
        $request = $this->getRequest();
        /**
         * @var $manager TPermissionsManager
         */
        $manager = TPermissionsManager::getPermissionManager();
        $permission = $manager->getPermission($request->permissionName);
        $roleKeys = [];
        foreach($request->roles as $role) {
            $roleKeys[] = $role->Key;
            if (!$permission->check($role->Key)) {
                $manager->assignPermission($role->Key,$request->permissionName);
            }
        }
        $currentRoles = $permission->getRoles();
        foreach ($currentRoles as $roleKey) {
            if (!in_array($roleKey,$roleKeys)) {
                $manager->revokePermission($roleKey,$request->permissionName);
            }
        }
        $permissions = GetPermissionsCommand::getPermissionsList($manager,$manager->getRoles());
        $this->addInfoMessage("Updated roles for permission '$request->permissionName'");
        $this->setReturnValue($permissions);
    }
}