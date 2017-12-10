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
use Tops\sys\TLanguage;
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

    private function getTemplateComponents($templatePath=null) {
        if($templatePath == null) {
            $templatePath = TPath::fromFileRoot('application/assets/templates');
        }
        $theme = PeanutSettings::GetThemeName();
        return [
            'theme' => $theme,
            'head' => $this->getTemplate('head',$templatePath),
            'css' => $this->getCssOverrides($theme),
            'navbar' =>  $this->getTemplate("navbar",$templatePath),
            'bodyheader' => $this->getTemplate('bodyheader',$templatePath),
        ];
    }

    private function getCssOverrides($theme) {
        $themeDir = TPath::fromFileRoot('application/assets/themes/'.$theme);
        return (file_exists($themeDir.'/style.css')) ?
            '<link rel="stylesheet" type="text/css" href="/application/assets/themes/'.$theme.'/style.css" />' :
            '';
    }

    private function getTemplate($templateName,$templatePath=null) {
        if (empty($templatePath)) {
            $templatePath = TPath::getFileRoot().'application/assets/templates';
        }
        $content = $this->templateManager->getContent($templateName.'.html',$templatePath);
        return $content === false ? '' : $content;
    }

    public function buildView(ViewModelInfo $settings, $templatePath = null) {
        $templateName = empty($settings->template) ?  TConfiguration::getValue('view','pages','default-page')
            : $settings->template;
        $pageContent = $this->getTemplate($templateName,$templatePath);
        $view = @file_get_contents($settings->view);
        if ($view === false) {
            return false;
        }
        $view = trim($view);
        $templateComponents = $this->getTemplateComponents($templatePath);

        return $this->templateManager->replaceTokens($pageContent,
            array_merge($templateComponents,
                [
                    'title' => $settings->pageTitle,
                    'heading' => $settings->heading,
                    'loader' => PeanutSettings::GetPeanutLoaderScript(),
                    'content' => $view,
                    'vmname' => $settings->vmName
                ]));

    }

    private function buildMessage($message, $content, $title, $alert,$templatePath) {
        $template = $this->getTemplate('message-page.html',$templatePath);
        $templateComponents = $this->getTemplateComponents($templatePath);
        return $this->templateManager->replaceTokens($template,
            array_merge($templateComponents, [
            'title' => $title,
            'alert' => $alert,
            'message' => $message,
            'content' => $content
            ]));
    }

    // public for unit testing
    public function buildPage($content, $title, $templatePath=null) {
        $template = $this->getTemplate('static-page',$templatePath);
        $templateComponents = $this->getTemplateComponents($templatePath);
        return $this->templateManager->replaceTokens($template,
            array_merge($templateComponents, [
                'title' => $title,
                'content' => $content
            ]));
    }

    public static function Build($pagePath,$templatePath = null,$authorize=true)
    {
        $pagePath = ViewModelManager::ExtractVmName($pagePath);
        $settings = ViewModelManager::getViewModelSettings($pagePath);
        if ($settings === false) {
            return false;
        }
        if ($authorize) {
            ViewModelManager::authorize($settings);
        }
        $builder = new ViewModelPageBuilder();
        return $builder->buildView($settings);
    }

    public static function BuildStaticPage($content,$title=null,$templatePath = null )
    {
        $builder = new ViewModelPageBuilder();
        if ($title==null) {
            $title = TConfiguration::getValue('page-title','pages','Peanut');
        }
        return $builder->buildPage($content,$title,$templatePath);
    }

    public static function BuildMessagePage($message,$title=null, $content='',$alert="danger",$templatePath=null)
    {
        $builder = new ViewModelPageBuilder();
        if ($title == null) {
            $title = TLanguage::text('error-not-authorized-title');
        }
        $errcode = $message;
        $title   = TLanguage::text('page-error-'.$errcode.'-title');
        $message = TLanguage::text('page-error-'.$errcode.'-message');
        $content = TLanguage::text('page-error-'.$errcode.'-content');

        switch ($errcode) {
            case 'not-authorized' :
                $content = "<strong><a href='/'>$content >></a></strong>";
                break;
            case 'not-authenticated' :
                $href = PeanutSettings::GetLoginPage();
                $content = "<strong><a href='/$href'>$content >></a></strong>";
                break;
            case 'page-not-found' :
                $content = "<h2>$content</h2>";
                break;
        }

        return $builder->buildMessage($message, $content, $title, $alert, $templatePath);
    }
}