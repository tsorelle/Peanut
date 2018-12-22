<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/4/2017
 * Time: 10:57 AM
 */

namespace Peanut\sys;


class ViewModelInfo
{
    public $id; // used if a unique id is required. see Drupal 8 implementation.
    public $pathAlias;
    public $vmName;
    public $view;
    public $template;
    public $theme;
    public $roles;
    public $permissions;
    public $pageTitle;
    public $heading;
    public $context;
}