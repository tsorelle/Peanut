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

    public function buildView(ViewModelInfo $settings, $templatePath = null) {
        $templateName = empty($settings->template) ?  TConfiguration::getValue('template','templates','default-page.html')
            : $settings->template;
        $pageContent = $this->getTemplate($templateName,$templatePath);
        $navbar = TConfiguration::getValue('navbar','pages','default');
        $navbarContent = $this->getTemplate("navbar-$navbar.html",$templatePath);

        return $this->buildPageContent($settings, $pageContent,$navbarContent);
    }

    private function buildMessage($message, $content, $title, $alert,$templatePath) {
        $template = $this->getTemplate('message-page.html',$templatePath);
        $navbar = TConfiguration::getValue('navbar','pages','default');
        $navbarContent = $this->getTemplate("navbar-$navbar.html",$templatePath);
        $theme = PeanutSettings::GetThemeName();
        return $this->templateManager->replaceTokens($template,array(
            'theme' => $theme,
            'navbar' => $navbarContent,
            'title' => $title,
            'alert' => $alert,
            'message' => $message,
            'content' => $content
        ));
    }

    private function buildPage($content, $title, $templatePath) {
        $template = $this->getTemplate('static-page.html',$templatePath);
        $navbar = TConfiguration::getValue('navbar','pages','default');
        $navbarContent = $this->getTemplate("navbar-$navbar.html",$templatePath);
        $theme = PeanutSettings::GetThemeName();
        return $this->templateManager->replaceTokens($template,array(
            'theme' => $theme,
            'navbar' => $navbarContent,
            'title' => $title,
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
        return $builder->buildView($settings);
    }

    public static function BuildStaticPage($content,$title=null,$templatePath = null )
    {
        $builder = new ViewModelPageBuilder();
        if ($title==null) {
            $title = TConfiguration::getValue('page-title','templates','Peanut');
        }
        return $builder->buildPage($content,$title,$templatePath);
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
            case 'page-not-found' :
                $title = 'Page not found';
                $message = 'Your page was not found.';
                $content = "<h2>Sorry, your page is not available.</h2>";
                break;
        }

        return $builder->buildMessage($message, $content, $title, $alert, $templatePath);
    }
}