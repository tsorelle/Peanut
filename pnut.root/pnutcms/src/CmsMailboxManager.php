<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 9/16/2017
 * Time: 2:47 PM
 */

namespace Peanut\cms;


use Tops\mail\IMailbox;
use Tops\mail\IMailboxManager;
use Tops\mail\TMailbox;

class CmsMailboxManager implements IMailboxManager
{
    private $config;

    public function __construct()
    {
        global $_SESSION;
        if (isset($_SESSION['mailbox-manager'])) {
            $this->config = $_SESSION['mailbox-manager'];
        }
        else {
            $this->config = parse_ini_file(__DIR__.'/../mailboxes.ini',true);
            $this->saveChanges();
        }

    }

    private function infoToMailbox(array $info) {
        $result = new TMailbox();
        $result->setDescription(empty($info['description']) ? '' : $info['description']);
        $result->setMailboxId(empty($info['id']) ? 0 : $info['id']);
        $result->setMailboxCode(empty($info['code']) ? '' : $info['code']);
        $result->setEmail(empty($info['email']) ? '' : $info['email']);
        $result->setName(empty($info['name']) ? '' : $info['name']);
        return $result;
    }

    private function searchMailbox($key,$value) {
        foreach ($this->config as $info) {
            if ($info[$key] = $value) {
                return $info;
            }
        }
        return false;
    }

    /**
     *
     * @param $id
     * @return IMailbox
     */
    public function find($id)
    {
        $info = $this->searchMailbox('id',$id);
        return empty($info) ? false : $this->infoToMailbox($info);

    }

    /**
     * @param $id
     */
    public function drop($id)
    {
        $mb = $this->find($id);
        if($mb != false) {
            unset($this->config[$mb->getMailboxCode()]);
        }
    }

    /**
     * @param $mailboxCode
     * @return bool|IMailbox
     */
    public function findByCode($mailboxCode)
    {
        if (isset($this->config[$mailboxCode])) {
            $info = $this->config[$mailboxCode];
            return $this->infoToMailbox($info);
        }
    }

    /**
     * @param null $filter
     * @return \stdClass[]
     */
    public function getMailboxes($showAll = false)
    {
        $result = array();
        foreach ($this->config as $info) {
            $box = new \stdClass();
            $box->description = empty($info['description']) ? '' : $info['description'];
            $box->id =empty($info['id']) ? 0 : $info['id'];
            $box->code = empty($info['code']) ? '' : $info['code'];
            $box->email = empty($info['email']) ? '' : $info['email'];
            $box->name = empty($info['name']) ? '' : $info['name'];
            $result[] = $box;
        }
    }

    /**
     * @param $code
     * @param $name
     * @param $address
     * @param $description
     * @return IMailbox
     */
    public function addMailbox($code, $name, $address, $description)
    {
        $this->config[$code]['code'] = $code;
        $this->config[$code]['name'] = $name;
        $this->config[$code]['email'] = $address;
        $this->config[$code]['description'] = $description;
        $this->config[$code]['id'] = sizeof($this->config) + 1;
    }

    /**
     * @param IMailbox $mailbox
     * @return int
     */
    public function updateMailbox(IMailbox $mailbox)
    {
        $code = $mailbox->getMailboxCode();
        $this->config[$code]['code'] = $code;
        $this->config[$code]['name'] = $mailbox->getName();
        $this->config[$code]['email'] = $mailbox->getEmail();
        $this->config[$code]['description'] = $mailbox->getDescription();
    }

    /**
     * @param $code
     * @param $name
     * @param $address
     * @param $description
     * @return bool|IMailbox
     */
    public function createMailbox($code, $name, $address, $description)
    {
        $result = new TMailbox();
        $result->setMailboxCode($code);
        $result->setName($name);
        $result->setEmail($address);
        $result->setDescription($description);
        return $result;
    }

    public function saveChanges()
    {
        global $_SESSION;
        if (isset($_SESSION)) {
            $_SESSION['mailbox-manager'] = $this->config;
        }
    }

    /**
     * @param $id
     */
    public function remove($mailboxCode)
    {
        // TODO: Implement remove() method.
    }

    /**
     * @param $mailboxCode string
     */
    public function restore($mailboxCode)
    {
        // TODO: Implement restore() method.
    }
}