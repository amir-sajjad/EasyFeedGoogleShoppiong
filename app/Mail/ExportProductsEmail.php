<?php
namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use MailerSend\Helpers\Builder\Variable;
use MailerSend\LaravelDriver\MailerSendTrait;
use MailerSend\Helpers\Builder\Personalization;

class ExportProductsEmail extends Mailable
{
    use Queueable, SerializesModels, MailerSendTrait;
    public $to;
    public $attachment;
    public function __construct($attachment=null) {
        $this->attachment = $attachment??null;
    }
    public function build()
    {
        // Recipient for use with variables and/or personalization
        $to = Arr::get($this->to, '0.address');
        return $this
            ->view('email.test')
            ->text('email.test_text')
            ->attach($this->attachment);
            // ->attachFromStorageDisk('public', 'toggle-them-app.myshopify.com.csv');
            // Additional options for MailerSend API features
            // ->mailersend(
            //     template_id: jpzkmgqkzjng059v,
            //     variables: [
            //         new Variable($to, ['name' => 'Your Name'])
            //     ],
            //     tags: ['tag'],
            //     personalization: [
            //         new Personalization($to, [
            //             'var' => 'variable',
            //             'number' => 123,
            //             'object' => [
            //                 'key' => 'object-value'
            //             ],
            //             'objectCollection' => [
            //                 [
            //                     'name' => 'John'
            //                 ],
            //                 [
            //                     'name' => 'Patrick'
            //                 ]
            //             ],
            //         ])
            //     ],
            //     precedenceBulkHeader: true,
            //     sendAt: new Carbon('2022-01-28 11:53:20'),
            // );
    }
}
?>
