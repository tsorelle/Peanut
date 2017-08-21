<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/20/2017
 * Time: 6:12 AM
 */

namespace Peanut\sys;


use Tops\sys\TConfiguration;
use Tops\sys\TIniSettings;
use Tops\sys\TPath;
use Tops\sys\TTemplateManager;

class ViewModelPageBuilder
{
    /**
     * @var TTemplateManager
     */
    private $templateManager;

    public function __construct()
    {
        $this->templateManager = new TTemplateManager();
    }

    public function buildPageContent(ViewModelInfo $settings, $content) {
        $view = @file_get_contents($settings->view);
        if ($view === false) {
            return false;
        }
        $view = trim($view);
        $theme = empty($settings->theme) ? TConfiguration::getValue('theme','templates','cerulean')
            : $settings->theme;

        return $this->templateManager->replaceTokens($content,array(
            'theme' => $theme,
            'view' => $view,
            'vmname' => $settings->vmName
        ));

    }

    public function buildPage(ViewModelInfo $settings, $templatePath = null) {

        if (empty($templatePath)) {
            $templatePath = TPath::getFileRoot().'application/assets/templates';
        }

        $templateName = empty($settings->template) ?  TConfiguration::getValue('template','templates','default-page.html')
            : $settings->template;

        $content = $this->templateManager->getContent($templateName,$templatePath);
        return $this->buildPageContent($settings, $content);
    }

    public static function Build($pagePath,$templatePath = null)
    {
        $settings = ViewModelManager::getViewModelSettings($pagePath);
        if ($settings === false) {
            return false;
        }
        $builder = new ViewModelPageBuilder();
        return $builder->buildPage($settings);
    }
}