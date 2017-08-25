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

    public function buildPageContent(ViewModelInfo $settings, $content, $navbarContent='') {
        $view = @file_get_contents($settings->view);
        if ($view === false) {
            return false;
        }
        $view = trim($view);
        $theme = PeanutSettings::GetThemeName();
        $loader = PeanutSettings::GetPeanutLoaderScript();
        $navbar = PeanutSettings::getNavBar();

        return $this->templateManager->replaceTokens($content,array(
            'title' => $settings->pageTitle,
            'navbar' => $navbarContent,
            'theme' => $theme,
            'loader' => $loader,
            'view' => $view,
            'vmname' => $settings->vmName
        ));

    }

    private function getTemplate($templateName,$templatePath=null) {
        if (empty($templatePath)) {
            $templatePath = TPath::getFileRoot().'application/assets/templates';
        }
        return $this->templateManager->getContent($templateName,$templatePath);
    }

    public function buildPage(ViewModelInfo $settings, $templatePath = null) {
        $templateName = empty($settings->template) ?  TConfiguration::getValue('template','templates','default-page.html')
            : $settings->template;
        $pageContent = $this->getTemplate($templateName,$templatePath);
        $navbar = TConfiguration::getValue('navbar','pages','default');
        $navbarContent = $this->getTemplate("navbar-$navbar.html",$templatePath);


        return $this->buildPageContent($settings, $pageContent,$navbarContent);
    }

    private function buildMessage($message, $content, $title, $alert,$templatePath) {
        $template = $this->getTemplate('message-page.html',$templatePath);
        $theme = PeanutSettings::GetThemeName();
        return $this->templateManager->replaceTokens($template,array(
            'theme' => $theme,
            'title' => $title,
            'alert' => $alert,
            'message' => $message,
            'content' => $content
        ));
    }

    public static function Build($pagePath,$templatePath = null,$authorize=true)
    {
        $settings = ViewModelManager::getViewModelSettings($pagePath);
        if ($settings === false) {
            return false;
        }
        if ($authorize) {
            ViewModelManager::authorize($settings);
        }
        $builder = new ViewModelPageBuilder();
        return $builder->buildPage($settings);
    }

    public static function BuildMessagePage($message,$title=null, $content='',$alert="danger",$templatePath=null)
    {
        $builder = new ViewModelPageBuilder();
        if ($title == null) {
            $title = 'Not authorized';
        }
        switch ($message) {
            case 'not-authorized' :
                $title = 'Not authorized';
                $message = 'Sorry, you are not authorized to access this page. Please contact the site administrator.';
                $content = "<strong><a href='/'>Please return to home page >></a></strong>";
                break;
            case 'not-authenticated' :
                $title = 'Please sign in';
                $message = 'You must sign in to your account to access the page.';
                $href = PeanutSettings::GetLoginPage();
                $content = "<strong><a href='/$href'>Please sign in or create an account >></a></strong>";
                break;
        }

        return $builder->buildMessage($message, $content, $title, $alert, $templatePath);
    }
}