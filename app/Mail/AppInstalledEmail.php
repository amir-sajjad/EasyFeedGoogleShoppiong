<?php


namespace App\Mail;

/** ... **/

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use MailerSend\Helpers\Builder\Variable;
use MailerSend\LaravelDriver\MailerSendTrait;
use MailerSend\Helpers\Builder\Personalization;

class AppInstalledEmail extends Mailable
{
    use Queueable, SerializesModels, MailerSendTrait;

    /** ... **/

    public $data;

    public function __construct($data)
    {
        $this->data=$data;

    }
    public function build()
    {
        return $this
        ->subject($this->data['subject'])
        ->from('support@easyfeedforgoogleshopping.com', 'Easy Feed For Google Shopping')
        ->mailersend(
            template_id: $this->data['templateId'],
            variables: [
                new Variable($this->data['toMail'], ['name' => $this->data['shopName']])
            ],
        );
    }
}
