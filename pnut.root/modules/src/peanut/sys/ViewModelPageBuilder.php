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
        $theme = PeanutSettings::GetThemeName();
        $loader = PeanutSettings::GetPeanutLoaderScript();

        return $this->templateManager->replaceTokens($content,array(
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
        $content = $this->getTemplate($templateName,$templatePath);
        return $this->buildPageContent($settings, $content);
    }

    private function buildMessage($message, $content, $title, $alert,$templatePath) {
        $content = $this->getTemplate('message-page',$templatePath);
        $theme = PeanutSettings::GetThemeName();
        return $this->templateManager->replaceTokens($content,array(
            'theme' => $theme,
            'title' => $title,
            'alert' => $alert,
            'message' => $message,
            'content' => $content
        ));
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
                $content = "<a href='/'>Please return to home page >></a>";
                break;
            case 'not-authenticated' :
                $title = 'Please sign in';
                $message = 'You must sign in to your account to access the page.';
                $href = PeanutSettings::GetLoginPage();
                $content = "<a href='/$href'>Please sign in or create an account >></a>";
                break;
        }

        return $builder->buildMessage($message, $content, $title, $alert, $templatePath);
    }
}