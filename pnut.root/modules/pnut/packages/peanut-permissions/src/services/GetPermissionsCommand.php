<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/25/2017
 * Time: 11:46 AM
 */

namespace Peanut\PeanutPermissions\services;

use Tops\services\TServiceCommand;
use Tops\sys\TLanguage;
use Tops\sys\TPermissionsManager;

class GetPermissionsCommand extends TServiceCommand
{
    public function __construct()
    {
        $this->addAuthorization(TPermissionsManager::managePermissionsPermissionName);
    }


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

    public static function getPermissionsList(TPermissionsManager $manager,$roles) {
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

    protected function run()
    {
        /**
         * @var $manager TPermissionsManager
         */
        $manager = TPermissionsManager::getPermissionManager();
        $result = new \stdClass();
        $result->roles = $manager->getRoles();
        $result->permissions = self::getPermissionsList($manager,$result->roles);
        $result->translations = TLanguage::getTranslations(array(
            'permission-name-title' ,
            'label-edit' ,
            'update-permission-title' ,
            'assigned-roles-title' ,
            'available-roles-title' ,
            'label-save-changes',
            'permission-wait-get',
            'permission-wait-update'
        ));

        $this->setReturnValue($result);
    }
}