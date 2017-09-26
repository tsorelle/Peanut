<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/25/2017
 * Time: 11:46 AM
 */

namespace Peanut\Permissions\services;


use Tops\services\TServiceCommand;
use Tops\sys\IPermissionsManager;
use Tops\sys\TObjectContainer;

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

    public static function getPermissionsList(IPermissionsManager $manager) {
        $result = array();
        $permissions = $manager->getPermissions();
        foreach ($permissions as $permission) {
            $item = new \stdClass();
            $item->permissionName = $permission->getPermissionName();
            $item->description = $permission->getDescription();
            $item->roles = $permission->getRoles();
            $result[] = $item;
        }
        return $result;

    }

    protected function run()
    {
        /**
         * @var $manager IPermissionsManager
         */
        $manager = TObjectContainer::Get('tops.permissions');
        $result = new \stdClass();
        $result->roles = $manager->getRoles();
        $result->permissions = self::getPermissionsList($manager);
        $this->setReturnValue($result);

    }
}