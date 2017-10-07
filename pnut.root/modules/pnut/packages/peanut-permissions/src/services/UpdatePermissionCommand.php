<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/25/2017
 * Time: 8:41 AM
 */

namespace Peanut\PeanutPermissions\services;


use Tops\services\TServiceCommand;
use Tops\sys\IPermissionsManager;
use Tops\sys\TObjectContainer;

class UpdatePermissionCommand extends TServiceCommand
{

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
         * @var $manager IPermissionsManager
         */
        $manager = TObjectContainer::Get('tops.permissions');
        $permission = $manager->getPermission($request->permissionName);
        foreach($request->roles as $roleName) {
            if (!$permission->check($roleName)) {
                $manager->assignPermission($request->permissionName,$roleName);
            }
        }
        $currentRoles = $permission->getRoles();
        foreach ($currentRoles as $roleName) {
            if (!in_array($roleName,$request->roles)) {
                $manager->revokePermission($request->permissionName,$roleName);
            }
        }
        $permissions = GetPermissionsCommand::getPermissionsList($manager);
        $this->addInfoMessage("Updated roles for permission '$request->permissionName'");
        $this->setReturnValue($permissions);
    }
}