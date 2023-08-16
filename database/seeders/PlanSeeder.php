<?php

namespace Database\Seeders;

use Osiset\ShopifyApp\Storage\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {



        /*
        |--------------------------------------------------------------------------
        |Monthly Billing Plans
        |--------------------------------------------------------------------------
        |
        */

        $Standard = new Plan();
        $Standard->name = "3 Feed - 35000 SKU'S (Standard Monthly)";
        $Standard->type = 'RECURRING';
        $Standard->price = 39.99;
        $Standard->interval = 'EVERY_30_DAYS';
        $Standard->capped_amount = 0.00;
        $Standard->terms = "WHAT’S INCLUDED ON STANDARD :35000 Sku's 3 Feeds";
        $Standard->trial_days = 30;
        $Standard->on_install = 1;
        $Standard->save();


        // $Personalized = new Plan();
        // $Personalized->name = "Personalized";
        $OneFeed500Sku = new Plan();
        $OneFeed500Sku->name = "1 Feed - 500 SKU'S Monthly";
        $OneFeed500Sku->type = 'RECURRING';
        $OneFeed500Sku->price = 4.99;
        $OneFeed500Sku->interval = 'EVERY_30_DAYS';
        $OneFeed500Sku->capped_amount = 0.00;
        $OneFeed500Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :500 Sku's 1 Feed";
        $OneFeed500Sku->trial_days = 30;
        $OneFeed500Sku->on_install = 0;
        $OneFeed500Sku->save();



        // $Personalized_500_Sku = new Plan();
        $OneFeed1000Sku = new Plan();
        $OneFeed1000Sku->name = "1 Feed - 1000 SKU'S Monthly";
        $OneFeed1000Sku->type = 'RECURRING';
        $OneFeed1000Sku->price = 6.99;
        $OneFeed1000Sku->interval = 'EVERY_30_DAYS';
        $OneFeed1000Sku->capped_amount = 0.00;
        $OneFeed1000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED : 1000 Sku 1 Feed";
        $OneFeed1000Sku->trial_days = 30;
        $OneFeed1000Sku->on_install = 0;
        $OneFeed1000Sku->save();


        $OneFeed2000Sku = new Plan();
        $OneFeed2000Sku->name = "1 Feed - 2000 SKU'S Monthly";
        $OneFeed2000Sku->type = 'RECURRING';
        $OneFeed2000Sku->price = 9.99;
        $OneFeed2000Sku->interval = 'EVERY_30_DAYS';
        $OneFeed2000Sku->capped_amount = 0.00;
        $OneFeed2000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED : 2000 Sku's 1 Feed";
        $OneFeed2000Sku->trial_days = 30;
        $OneFeed2000Sku->on_install = 0;
        $OneFeed2000Sku->save();


        $OneFeed3000Sku = new Plan();
        $OneFeed3000Sku->name = "1 Feed - 3000 SKU'S Monthly";
        $OneFeed3000Sku->type = 'RECURRING';
        $OneFeed3000Sku->price = 11.99;
        $OneFeed3000Sku->interval = 'EVERY_30_DAYS';
        $OneFeed3000Sku->capped_amount = 0.00;
        $OneFeed3000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED : 3000 Sku's 1 Feed";
        $OneFeed3000Sku->trial_days = 30;
        $OneFeed3000Sku->on_install = 0;
        $OneFeed3000Sku->save();



        $OneFeed5000Sku = new Plan();
        $OneFeed5000Sku->name = "1 Feed - 5000 SKU'S Monthly";
        $OneFeed5000Sku->type = 'RECURRING';
        $OneFeed5000Sku->price = 12.99;
        $OneFeed5000Sku->interval = 'EVERY_30_DAYS';
        $OneFeed5000Sku->capped_amount = 0.00;
        $OneFeed5000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :5000 Sku's 1 Feed";
        $OneFeed5000Sku->trial_days = 30;
        $OneFeed5000Sku->on_install = 0;
        $OneFeed5000Sku->save();


        $TwoFeed10000Sku = new Plan();
        $TwoFeed10000Sku->name = "2 Feed - 10000 SKU'S Monthly";
        $TwoFeed10000Sku->type = 'RECURRING';
        $TwoFeed10000Sku->price = 19.99;
        $TwoFeed10000Sku->interval = 'EVERY_30_DAYS';
        $TwoFeed10000Sku->capped_amount = 0.00;
        $TwoFeed10000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :10000 Sku's 2 Feed";
        $TwoFeed10000Sku->trial_days = 30;
        $TwoFeed10000Sku->on_install = 0;
        $TwoFeed10000Sku->save();


        $TwoFeed20000Sku = new Plan();
        $TwoFeed20000Sku->name = "2 Feed - 20000 SKU'S Monthly";
        $TwoFeed20000Sku->type = 'RECURRING';
        $TwoFeed20000Sku->price = 24.99;
        $TwoFeed20000Sku->interval = 'EVERY_30_DAYS';
        $TwoFeed20000Sku->capped_amount = 0.00;
        $TwoFeed20000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :20000 Sku's 2 Feed";
        $TwoFeed20000Sku->trial_days = 30;
        $TwoFeed20000Sku->on_install = 0;
        $TwoFeed20000Sku->save();


        $TwoFeed25000Sku = new Plan();
        $TwoFeed25000Sku->name = "2 Feed - 25000 SKU'S Monthly";
        $TwoFeed25000Sku->type = 'RECURRING';
        $TwoFeed25000Sku->price = 29.99;
        $TwoFeed25000Sku->interval = 'EVERY_30_DAYS';
        $TwoFeed25000Sku->capped_amount = 0.00;
        $TwoFeed25000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :25000 Sku's 2 Feed";
        $TwoFeed25000Sku->trial_days = 30;
        $TwoFeed25000Sku->on_install = 0;
        $TwoFeed25000Sku->save();

        $TwoFeed30000Sku = new Plan();
        $TwoFeed30000Sku->name = "2 Feed - 30000 SKU'S Monthly";
        $TwoFeed30000Sku->type = 'RECURRING';
        $TwoFeed30000Sku->price = 34.99;
        $TwoFeed30000Sku->interval = 'EVERY_30_DAYS';
        $TwoFeed30000Sku->capped_amount = 0.00;
        $TwoFeed30000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :30000 Sku's 2 Feed";
        $TwoFeed30000Sku->trial_days = 30;
        $TwoFeed30000Sku->on_install = 0;
        $TwoFeed30000Sku->save();



        $ThreeFeed35000Sku = new Plan();
        $ThreeFeed35000Sku->name = "3 Feed - 35000 SKU'S Monthly";
        $ThreeFeed35000Sku->type = 'RECURRING';
        $ThreeFeed35000Sku->price = 39.99;
        $ThreeFeed35000Sku->interval = 'EVERY_30_DAYS';
        $ThreeFeed35000Sku->capped_amount = 0.00;
        $ThreeFeed35000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :35000 Sku's 3 Feed";
        $ThreeFeed35000Sku->trial_days = 30;
        $ThreeFeed35000Sku->on_install = 0;
        $ThreeFeed35000Sku->save();




        $ThreeFeed40000Sku = new Plan();
        $ThreeFeed40000Sku->name = "3 Feed - 40000 SKU'S Monthly";
        $ThreeFeed40000Sku->type = 'RECURRING';
        $ThreeFeed40000Sku->price = 49.99;
        $ThreeFeed40000Sku->interval = 'EVERY_30_DAYS';
        $ThreeFeed40000Sku->capped_amount = 0.00;
        $ThreeFeed40000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :40000 Sku's 3 Feed";
        $ThreeFeed40000Sku->trial_days = 30;
        $ThreeFeed40000Sku->on_install = 0;
        $ThreeFeed40000Sku->save();





        $ThreeFeed45000Sku = new Plan();
        $ThreeFeed45000Sku->name = "3 Feed - 45000 SKU'S Monthly";
        $ThreeFeed45000Sku->type = 'RECURRING';
        $ThreeFeed45000Sku->price = 54.99;
        $ThreeFeed45000Sku->interval = 'EVERY_30_DAYS';
        $ThreeFeed45000Sku->capped_amount = 0.00;
        $ThreeFeed45000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :45000 Sku's 3 Feed";
        $ThreeFeed45000Sku->trial_days = 30;
        $ThreeFeed45000Sku->on_install = 0;
        $ThreeFeed45000Sku->save();







        $ThreeFeed50000Sku = new Plan();
        $ThreeFeed50000Sku->name = "3 Feed - 50000 SKU'S Monthly";
        $ThreeFeed50000Sku->type = 'RECURRING';
        $ThreeFeed50000Sku->price = 59.99;
        $ThreeFeed50000Sku->interval = 'EVERY_30_DAYS';
        $ThreeFeed50000Sku->capped_amount = 0.00;
        $ThreeFeed50000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :50000 Sku's 3 Feed";
        $ThreeFeed50000Sku->trial_days = 30;
        $ThreeFeed50000Sku->on_install = 0;
        $ThreeFeed50000Sku->save();



        $FiveFeed100000Sku = new Plan();
        $FiveFeed100000Sku->name = "5 Feed - 100000 SKU'S Monthly";
        $FiveFeed100000Sku->type = 'RECURRING';
        $FiveFeed100000Sku->price = 69.99;
        $FiveFeed100000Sku->interval = 'EVERY_30_DAYS';
        $FiveFeed100000Sku->capped_amount = 0.00;
        $FiveFeed100000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $FiveFeed100000Sku->trial_days = 30;
        $FiveFeed100000Sku->on_install = 0;
        $FiveFeed100000Sku->save();




        $FiveFeed200000Sku = new Plan();
        $FiveFeed200000Sku->name = "5 Feed - 200000 SKU'S Monthly";
        $FiveFeed200000Sku->type = 'RECURRING';
        $FiveFeed200000Sku->price = 79.99;
        $FiveFeed200000Sku->interval = 'EVERY_30_DAYS';
        $FiveFeed200000Sku->capped_amount = 0.00;
        $FiveFeed200000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $FiveFeed200000Sku->trial_days = 30;
        $FiveFeed200000Sku->on_install = 0;
        $FiveFeed200000Sku->save();



        $FiveFeed300000Sku = new Plan();
        $FiveFeed300000Sku->name = "5 Feed - 300000 SKU'S Monthly";
        $FiveFeed300000Sku->type = 'RECURRING';
        $FiveFeed300000Sku->price = 89.99;
        $FiveFeed300000Sku->interval = 'EVERY_30_DAYS';
        $FiveFeed300000Sku->capped_amount = 0.00;
        $FiveFeed300000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :300000 Sku's 5 Feeds";
        $FiveFeed300000Sku->trial_days = 30;
        $FiveFeed300000Sku->on_install = 0;
        $FiveFeed300000Sku->save();



        $FiveFeed400000Sku = new Plan();
        $FiveFeed400000Sku->name = "5 Feed - 400000 SKU'S Monthly";
        $FiveFeed400000Sku->type = 'RECURRING';
        $FiveFeed400000Sku->price = 99.99;
        $FiveFeed400000Sku->interval = 'EVERY_30_DAYS';
        $FiveFeed400000Sku->capped_amount = 0.00;
        $FiveFeed400000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $FiveFeed400000Sku->trial_days = 30;
        $FiveFeed400000Sku->on_install = 0;
        $FiveFeed400000Sku->save();




        $TenFeed500000Sku = new Plan();
        $TenFeed500000Sku->name = "10 Feed - 500000 SKU'S Monthly";
        $TenFeed500000Sku->type = 'RECURRING';
        $TenFeed500000Sku->price = 129.99;
        $TenFeed500000Sku->interval = 'EVERY_30_DAYS';
        $TenFeed500000Sku->capped_amount = 0.00;
        $TenFeed500000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :500000 Sku's 10 Feeds";
        $TenFeed500000Sku->trial_days = 30;
        $TenFeed500000Sku->on_install = 0;
        $TenFeed500000Sku->save();



        $TenFeed600000Sku = new Plan();
        $TenFeed600000Sku->name = "10 Feed - 600000 SKU'S Monthly";
        $TenFeed600000Sku->type = 'RECURRING';
        $TenFeed600000Sku->price = 149.99;
        $TenFeed600000Sku->interval = 'EVERY_30_DAYS';
        $TenFeed600000Sku->capped_amount = 0.00;
        $TenFeed600000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $TenFeed600000Sku->trial_days = 30;
        $TenFeed600000Sku->on_install = 0;
        $TenFeed600000Sku->save();





        $TenFeed700000Sku = new Plan();
        $TenFeed700000Sku->name = "10 Feed - 700000 SKU'S Monthly";
        $TenFeed700000Sku->type = 'RECURRING';
        $TenFeed700000Sku->price = 199.99;
        $TenFeed700000Sku->interval = 'EVERY_30_DAYS';
        $TenFeed700000Sku->capped_amount = 0.00;
        $TenFeed700000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 10 Feeds";
        $TenFeed700000Sku->trial_days = 30;
        $TenFeed700000Sku->on_install = 0;
        $TenFeed700000Sku->save();



        $TenFeed800000Sku = new Plan();
        $TenFeed800000Sku->name = "10 Feed - 800000 SKU'S Monthly";
        $TenFeed800000Sku->type = 'RECURRING';
        $TenFeed800000Sku->price = 249.99;
        $TenFeed800000Sku->interval = 'EVERY_30_DAYS';
        $TenFeed800000Sku->capped_amount = 0.00;
        $TenFeed800000Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $TenFeed800000Sku->trial_days = 30;
        $TenFeed800000Sku->on_install = 0;
        $TenFeed800000Sku->save();



        $Personalized_Monthly_Unlimited_Sku = new Plan();
        $Personalized_Monthly_Unlimited_Sku->name = "Unlimited Feed - Unlimited Sku Monthly";
        $Personalized_Monthly_Unlimited_Sku->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku->price = 399.99;
        $Personalized_Monthly_Unlimited_Sku->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku->save();


        /*
    |--------------------------------------------------------------------------
    |Yearly Billing Plans
    |--------------------------------------------------------------------------
    |
    */


        $Standard_Annual = new Plan();
        $Standard_Annual->name = "3 Feed - 35000 SKU'S (Standard Annual) 20% Discounted";
        $Standard_Annual->type = 'RECURRING';
        $Standard_Annual->price = 383.90;
        $Standard_Annual->interval = 'ANNUAL';
        $Standard_Annual->capped_amount = 0.00;
        $Standard_Annual->terms = "WHAT’S INCLUDED ON STANDARD :35000 Sku's 3 Feeds";
        $Standard_Annual->trial_days = 30;
        $Standard_Annual->on_install = 1;
        $Standard_Annual->save();


        $Personalized_Annual = new Plan();
        $Personalized_Annual->name = "1 Feed - 500 SKU'S Annual 20% Discounted";
        $Personalized_Annual->type = 'RECURRING';
        $Personalized_Annual->price = 47.90;
        $Personalized_Annual->interval = 'ANNUAL';
        $Personalized_Annual->capped_amount = 0.00;
        $Personalized_Annual->terms = "WHAT’S INCLUDED ON PERSONALIZED :500 Sku's 1 Feed";
        $Personalized_Annual->trial_days = 30;
        $Personalized_Annual->on_install = 0;
        $Personalized_Annual->save();



        $Personalized_Annual_1000_Sku = new Plan();
        $Personalized_Annual_1000_Sku->name = "1 Feed - 1000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_1000_Sku->type = 'RECURRING';
        $Personalized_Annual_1000_Sku->price = 67.10;
        $Personalized_Annual_1000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_1000_Sku->capped_amount = 0.00;
        $Personalized_Annual_1000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :1000 Sku 1 Feed";
        $Personalized_Annual_1000_Sku->trial_days = 30;
        $Personalized_Annual_1000_Sku->on_install = 0;
        $Personalized_Annual_1000_Sku->save();


        $Personalized_Annual_2000_Sku = new Plan();
        $Personalized_Annual_2000_Sku->name = "1 Feed - 2000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_2000_Sku->type = 'RECURRING';
        $Personalized_Annual_2000_Sku->price = 95.90;
        $Personalized_Annual_2000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_2000_Sku->capped_amount = 0.00;
        $Personalized_Annual_2000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :2000 Sku's 1 Feed";
        $Personalized_Annual_2000_Sku->trial_days = 30;
        $Personalized_Annual_2000_Sku->on_install = 0;
        $Personalized_Annual_2000_Sku->save();





        $Personalized_Annual_3000_Sku = new Plan();
        $Personalized_Annual_3000_Sku->name = "1 Feed - 3000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_3000_Sku->type = 'RECURRING';
        $Personalized_Annual_3000_Sku->price = 115.10;
        $Personalized_Annual_3000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_3000_Sku->capped_amount = 0.00;
        $Personalized_Annual_3000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :3000 Sku's 1 Feed";
        $Personalized_Annual_3000_Sku->trial_days = 30;
        $Personalized_Annual_3000_Sku->on_install = 0;
        $Personalized_Annual_3000_Sku->save();



        $Personalized_Annual_5000_Sku = new Plan();
        $Personalized_Annual_5000_Sku->name = "1 Feed - 5000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_5000_Sku->type = 'RECURRING';
        $Personalized_Annual_5000_Sku->price = 124.70;
        $Personalized_Annual_5000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_5000_Sku->capped_amount = 0.00;
        $Personalized_Annual_5000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :5000 Sku's 1 Feed";
        $Personalized_Annual_5000_Sku->trial_days = 30;
        $Personalized_Annual_5000_Sku->on_install = 0;
        $Personalized_Annual_5000_Sku->save();




        $Personalized_Annual_10000_Sku = new Plan();
        $Personalized_Annual_10000_Sku->name = "2 Feed - 10000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_10000_Sku->type = 'RECURRING';
        $Personalized_Annual_10000_Sku->price = 191.90;
        $Personalized_Annual_10000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_10000_Sku->capped_amount = 0.00;
        $Personalized_Annual_10000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :10000 Sku's 2 Feed";
        $Personalized_Annual_10000_Sku->trial_days = 30;
        $Personalized_Annual_10000_Sku->on_install = 0;
        $Personalized_Annual_10000_Sku->save();





        $Personalized_Annual_20000_Sku = new Plan();
        $Personalized_Annual_20000_Sku->name = "2 Feed - 20000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_20000_Sku->type = 'RECURRING';
        $Personalized_Annual_20000_Sku->price = 239.90;
        $Personalized_Annual_20000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_20000_Sku->capped_amount = 0.00;
        $Personalized_Annual_20000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :20000 Sku's 2 Feed";
        $Personalized_Annual_20000_Sku->trial_days = 30;
        $Personalized_Annual_20000_Sku->on_install = 0;
        $Personalized_Annual_20000_Sku->save();





        $Personalized_Annual_25000_Sku = new Plan();
        $Personalized_Annual_25000_Sku->name = "2 Feed - 25000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_25000_Sku->type = 'RECURRING';
        $Personalized_Annual_25000_Sku->price = 287.90;
        $Personalized_Annual_25000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_25000_Sku->capped_amount = 0.00;
        $Personalized_Annual_25000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :25000 Sku's 2 Feed";
        $Personalized_Annual_25000_Sku->trial_days = 30;
        $Personalized_Annual_25000_Sku->on_install = 0;
        $Personalized_Annual_25000_Sku->save();




        $Personalized_Annual_30000_Sku = new Plan();
        $Personalized_Annual_30000_Sku->name = "2 Feed - 30000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_30000_Sku->type = 'RECURRING';
        $Personalized_Annual_30000_Sku->price = 335.90;
        $Personalized_Annual_30000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_30000_Sku->capped_amount = 0.00;
        $Personalized_Annual_30000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :30000 Sku's 2 Feed";
        $Personalized_Annual_30000_Sku->trial_days = 30;
        $Personalized_Annual_30000_Sku->on_install = 0;
        $Personalized_Annual_30000_Sku->save();



        $Personalized_Annual_35000_Sku = new Plan();
        $Personalized_Annual_35000_Sku->name = "3 Feed - 35000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_35000_Sku->type = 'RECURRING';
        $Personalized_Annual_35000_Sku->price = 383.90;
        $Personalized_Annual_35000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_35000_Sku->capped_amount = 0.00;
        $Personalized_Annual_35000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :35000 Sku's 3 Feed";
        $Personalized_Annual_35000_Sku->trial_days = 30;
        $Personalized_Annual_35000_Sku->on_install = 0;
        $Personalized_Annual_35000_Sku->save();


        $Personalized_Annual_40000_Sku = new Plan();
        $Personalized_Annual_40000_Sku->name = "3 Feed - 40000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_40000_Sku->type = 'RECURRING';
        $Personalized_Annual_40000_Sku->price = 479.90;
        $Personalized_Annual_40000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_40000_Sku->capped_amount = 0.00;
        $Personalized_Annual_40000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :40000 Sku's 3 Feed";
        $Personalized_Annual_40000_Sku->trial_days = 30;
        $Personalized_Annual_40000_Sku->on_install = 0;
        $Personalized_Annual_40000_Sku->save();





        $Personalized_Annual_45000_Sku = new Plan();
        $Personalized_Annual_45000_Sku->name = "3 Feed - 45000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_45000_Sku->type = 'RECURRING';
        $Personalized_Annual_45000_Sku->price = 527.90;
        $Personalized_Annual_45000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_45000_Sku->capped_amount = 0.00;
        $Personalized_Annual_45000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED: 45000 Sku's 3 Feed";
        $Personalized_Annual_45000_Sku->trial_days = 30;
        $Personalized_Annual_45000_Sku->on_install = 0;
        $Personalized_Annual_45000_Sku->save();




        $Personalized_Annual_50000_Sku_3_Feed = new Plan();
        $Personalized_Annual_50000_Sku_3_Feed->name = "3 Feed - 50000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_50000_Sku_3_Feed->type = 'RECURRING';
        $Personalized_Annual_50000_Sku_3_Feed->price = 575.90;
        $Personalized_Annual_50000_Sku_3_Feed->interval = 'ANNUAL';
        $Personalized_Annual_50000_Sku_3_Feed->capped_amount = 0.00;
        $Personalized_Annual_50000_Sku_3_Feed->terms = "WHAT’S INCLUDED ON PERSONALIZED :50000 Sku's 3 Feed";
        $Personalized_Annual_50000_Sku_3_Feed->trial_days = 30;
        $Personalized_Annual_50000_Sku_3_Feed->on_install = 0;
        $Personalized_Annual_50000_Sku_3_Feed->save();



        $Personalized_Annual_100000_Sku_5_Feed = new Plan();
        $Personalized_Annual_100000_Sku_5_Feed->name = "5 Feed - 100000 SKU'S Annual 20% Discounted";

        $Personalized_Annual_100000_Sku_5_Feed->type = 'RECURRING';
        $Personalized_Annual_100000_Sku_5_Feed->price = 671.90;
        $Personalized_Annual_100000_Sku_5_Feed->interval = 'ANNUAL';
        $Personalized_Annual_100000_Sku_5_Feed->capped_amount = 0.00;
        $Personalized_Annual_100000_Sku_5_Feed->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $Personalized_Annual_100000_Sku_5_Feed->trial_days = 30;
        $Personalized_Annual_100000_Sku_5_Feed->on_install = 0;
        $Personalized_Annual_100000_Sku_5_Feed->save();




        $Personalized_Annual_200000_Sku = new Plan();
        $Personalized_Annual_200000_Sku->name = "5 Feed - 200000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_200000_Sku->type = 'RECURRING';
        $Personalized_Annual_200000_Sku->price = 767.90;
        $Personalized_Annual_200000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_200000_Sku->capped_amount = 0.00;
        $Personalized_Annual_200000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $Personalized_Annual_200000_Sku->trial_days = 30;
        $Personalized_Annual_200000_Sku->on_install = 0;
        $Personalized_Annual_200000_Sku->save();


        $Personalized_Annual_300000_Sku = new Plan();
        $Personalized_Annual_300000_Sku->name = "5 Feed - 300000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_300000_Sku->type = 'RECURRING';
        $Personalized_Annual_300000_Sku->price = 863.90;
        $Personalized_Annual_300000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_300000_Sku->capped_amount = 0.00;
        $Personalized_Annual_300000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :300000 Sku's 5 Feeds";
        $Personalized_Annual_300000_Sku->trial_days = 30;
        $Personalized_Annual_300000_Sku->on_install = 0;
        $Personalized_Annual_300000_Sku->save();


        $Personalized_Annual_400000_Sku = new Plan();
        $Personalized_Annual_400000_Sku->name = "5 Feed - 400000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_400000_Sku->type = 'RECURRING';
        $Personalized_Annual_400000_Sku->price = 959.90;
        $Personalized_Annual_400000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_400000_Sku->capped_amount = 0.00;
        $Personalized_Annual_400000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $Personalized_Annual_400000_Sku->trial_days = 30;
        $Personalized_Annual_400000_Sku->on_install = 0;
        $Personalized_Annual_400000_Sku->save();



        $Personalized_Annual_500000_Sku = new Plan();
        $Personalized_Annual_500000_Sku->name = "10 Feed - 500000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_500000_Sku->type = 'RECURRING';
        $Personalized_Annual_500000_Sku->price = 1247.99;
        $Personalized_Annual_500000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_500000_Sku->capped_amount = 0.00;
        $Personalized_Annual_500000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :500000 Sku's 10 Feeds";
        $Personalized_Annual_500000_Sku->trial_days = 30;
        $Personalized_Annual_500000_Sku->on_install = 0;
        $Personalized_Annual_500000_Sku->save();



        $Personalized_Annual_600000_Sku = new Plan();
        $Personalized_Annual_600000_Sku->name = "10 Feed - 600000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_600000_Sku->type = 'RECURRING';
        $Personalized_Annual_600000_Sku->price = 1439.90;
        $Personalized_Annual_600000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_600000_Sku->capped_amount = 0.00;
        $Personalized_Annual_600000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $Personalized_Annual_600000_Sku->trial_days = 30;
        $Personalized_Annual_600000_Sku->on_install = 0;
        $Personalized_Annual_600000_Sku->save();


        $Personalized_Annual_700000_Sku = new Plan();
        $Personalized_Annual_700000_Sku->name = "10 Feed - 700000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_700000_Sku->type = 'RECURRING';
        $Personalized_Annual_700000_Sku->price = 1919.90;
        $Personalized_Annual_700000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_700000_Sku->capped_amount = 0.00;
        $Personalized_Annual_700000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 10 Feeds";
        $Personalized_Annual_700000_Sku->trial_days = 30;
        $Personalized_Annual_700000_Sku->on_install = 0;
        $Personalized_Annual_700000_Sku->save();



        $Personalized_Annual_800000_Sku = new Plan();
        $Personalized_Annual_800000_Sku->name = "10 Feed - 800000 SKU'S Annual 20% Discounted";
        $Personalized_Annual_800000_Sku->type = 'RECURRING';
        $Personalized_Annual_800000_Sku->price = 2399.90;
        $Personalized_Annual_800000_Sku->interval = 'ANNUAL';
        $Personalized_Annual_800000_Sku->capped_amount = 0.00;
        $Personalized_Annual_800000_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $Personalized_Annual_800000_Sku->trial_days = 30;
        $Personalized_Annual_800000_Sku->on_install = 0;
        $Personalized_Annual_800000_Sku->save();



        $Personalized_Yearly_Unlimited_Sku = new Plan();
        $Personalized_Yearly_Unlimited_Sku->name = "Unlimited Feed - Unlimited Sku Annual";
        $Personalized_Yearly_Unlimited_Sku->type = 'RECURRING';
        $Personalized_Yearly_Unlimited_Sku->price = 3839.90;
        $Personalized_Yearly_Unlimited_Sku->interval = 'ANNUAL';
        $Personalized_Yearly_Unlimited_Sku->capped_amount = 0.00;
        $Personalized_Yearly_Unlimited_Sku->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Yearly_Unlimited_Sku->trial_days = 30;
        $Personalized_Yearly_Unlimited_Sku->on_install = 0;
        $Personalized_Yearly_Unlimited_Sku->save();





        //Discounted Plan

        $Personalized_100000_Sku_5_Feed_10_Percent = new Plan();
        $Personalized_100000_Sku_5_Feed_10_Percent->name = "5 Feed - 100000 SKU'S Monthly 10% Discounted";
        $Personalized_100000_Sku_5_Feed_10_Percent->type = 'RECURRING';
        $Personalized_100000_Sku_5_Feed_10_Percent->price = 62.99;
        $Personalized_100000_Sku_5_Feed_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_100000_Sku_5_Feed_10_Percent->capped_amount = 0.00;
        $Personalized_100000_Sku_5_Feed_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $Personalized_100000_Sku_5_Feed_10_Percent->trial_days = 30;
        $Personalized_100000_Sku_5_Feed_10_Percent->on_install = 0;
        $Personalized_100000_Sku_5_Feed_10_Percent->save();


        $Personalized_100000_Sku_5_Feed_20_Percent = new Plan();
        $Personalized_100000_Sku_5_Feed_20_Percent->name = "5 Feed - 100000 SKU'S Monthly 20% Discounted";
        $Personalized_100000_Sku_5_Feed_20_Percent->type = 'RECURRING';
        $Personalized_100000_Sku_5_Feed_20_Percent->price = 55.99;
        $Personalized_100000_Sku_5_Feed_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_100000_Sku_5_Feed_20_Percent->capped_amount = 0.00;
        $Personalized_100000_Sku_5_Feed_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $Personalized_100000_Sku_5_Feed_20_Percent->trial_days = 30;
        $Personalized_100000_Sku_5_Feed_20_Percent->on_install = 0;
        $Personalized_100000_Sku_5_Feed_20_Percent->save();




        $Personalized_100000_Sku_5_Feed_25_Percent = new Plan();
        $Personalized_100000_Sku_5_Feed_25_Percent->name = "5 Feed - 100000 SKU'S Monthly 25% Discounted";
        $Personalized_100000_Sku_5_Feed_25_Percent->type = 'RECURRING';
        $Personalized_100000_Sku_5_Feed_25_Percent->price = 52.49;
        $Personalized_100000_Sku_5_Feed_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_100000_Sku_5_Feed_25_Percent->capped_amount = 0.00;
        $Personalized_100000_Sku_5_Feed_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $Personalized_100000_Sku_5_Feed_25_Percent->trial_days = 30;
        $Personalized_100000_Sku_5_Feed_25_Percent->on_install = 0;
        $Personalized_100000_Sku_5_Feed_25_Percent->save();



        $Personalized_100000_Sku_5_Feed_30_Percent = new Plan();
        $Personalized_100000_Sku_5_Feed_30_Percent->name = "5 Feed - 100000 SKU'S Monthly 30% Discounted";
        $Personalized_100000_Sku_5_Feed_30_Percent->type = 'RECURRING';
        $Personalized_100000_Sku_5_Feed_30_Percent->price = 48.99;
        $Personalized_100000_Sku_5_Feed_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_100000_Sku_5_Feed_30_Percent->capped_amount = 0.00;
        $Personalized_100000_Sku_5_Feed_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $Personalized_100000_Sku_5_Feed_30_Percent->trial_days = 30;
        $Personalized_100000_Sku_5_Feed_30_Percent->on_install = 0;
        $Personalized_100000_Sku_5_Feed_30_Percent->save();





        $Personalized_100000_Sku_5_Feed_50_Percent = new Plan();
        $Personalized_100000_Sku_5_Feed_50_Percent->name = "5 Feed - 100000 SKU'S Monthly 50% Discounted";
        $Personalized_100000_Sku_5_Feed_50_Percent->type = 'RECURRING';
        $Personalized_100000_Sku_5_Feed_50_Percent->price = 34.99;
        $Personalized_100000_Sku_5_Feed_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_100000_Sku_5_Feed_50_Percent->capped_amount = 0.00;
        $Personalized_100000_Sku_5_Feed_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :100000 Sku's 5 Feeds";
        $Personalized_100000_Sku_5_Feed_50_Percent->trial_days = 30;
        $Personalized_100000_Sku_5_Feed_50_Percent->on_install = 0;
        $Personalized_100000_Sku_5_Feed_50_Percent->save();







        $Personalized_200000_Sku_10_Percent = new Plan();
        $Personalized_200000_Sku_10_Percent->name = "5 Feed - 200000 SKU'S Monthly 10% Discounted";
        $Personalized_200000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_200000_Sku_10_Percent->price = 71.99;
        $Personalized_200000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_200000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_200000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $Personalized_200000_Sku_10_Percent->trial_days = 30;
        $Personalized_200000_Sku_10_Percent->on_install = 0;
        $Personalized_200000_Sku_10_Percent->save();




        $Personalized_200000_Sku_20_Percent = new Plan();
        $Personalized_200000_Sku_20_Percent->name = "5 Feed - 200000 SKU'S Monthly 20% Discounted";
        $Personalized_200000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_200000_Sku_20_Percent->price = 63.99;
        $Personalized_200000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_200000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_200000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $Personalized_200000_Sku_20_Percent->trial_days = 30;
        $Personalized_200000_Sku_20_Percent->on_install = 0;
        $Personalized_200000_Sku_20_Percent->save();



        $Personalized_200000_Sku_25_Percent = new Plan();
        $Personalized_200000_Sku_25_Percent->name = "5 Feed - 200000 SKU'S Monthly 25% Discounted";
        $Personalized_200000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_200000_Sku_25_Percent->price = 59.99;
        $Personalized_200000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_200000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_200000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $Personalized_200000_Sku_25_Percent->trial_days = 30;
        $Personalized_200000_Sku_25_Percent->on_install = 0;
        $Personalized_200000_Sku_25_Percent->save();



        $Personalized_200000_Sku_30_Percent = new Plan();
        $Personalized_200000_Sku_30_Percent->name = "5 Feed - 200000 SKU'S Monthly 30% Discounted";
        $Personalized_200000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_200000_Sku_30_Percent->price = 55.99;
        $Personalized_200000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_200000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_200000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $Personalized_200000_Sku_30_Percent->trial_days = 30;
        $Personalized_200000_Sku_30_Percent->on_install = 0;
        $Personalized_200000_Sku_30_Percent->save();




        $Personalized_200000_Sku_50_Percent = new Plan();
        $Personalized_200000_Sku_50_Percent->name = "5 Feed - 200000 SKU'S Monthly 50% Discounted";
        $Personalized_200000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_200000_Sku_50_Percent->price = 39.99;
        $Personalized_200000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_200000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_200000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :200000 Sku's 5 Feeds";
        $Personalized_200000_Sku_50_Percent->trial_days = 30;
        $Personalized_200000_Sku_50_Percent->on_install = 0;
        $Personalized_200000_Sku_50_Percent->save();




        $Personalized_300000_Sku_10_Percent = new Plan();
        $Personalized_300000_Sku_10_Percent->name = "5 Feed - 300000 SKU'S Monthly 10% Discounted";
        $Personalized_300000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_300000_Sku_10_Percent->price = 80.99;
        $Personalized_300000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_300000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_300000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :300000 Sku's 5 Feeds";
        $Personalized_300000_Sku_10_Percent->trial_days = 30;
        $Personalized_300000_Sku_10_Percent->on_install = 0;
        $Personalized_300000_Sku_10_Percent->save();




        $Personalized_300000_Sku_20_Percent = new Plan();
        $Personalized_300000_Sku_20_Percent->name = "5 Feed - 300000 SKU'S Monthly 20% Discounted";
        $Personalized_300000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_300000_Sku_20_Percent->price = 71.99;
        $Personalized_300000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_300000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_300000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :300000 Sku's 5 Feeds";
        $Personalized_300000_Sku_20_Percent->trial_days = 30;
        $Personalized_300000_Sku_20_Percent->on_install = 0;
        $Personalized_300000_Sku_20_Percent->save();



        $Personalized_300000_Sku_25_Percent = new Plan();
        $Personalized_300000_Sku_25_Percent->name = "5 Feed - 300000 SKU'S Monthly 25% Discounted";
        $Personalized_300000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_300000_Sku_25_Percent->price = 67.49;
        $Personalized_300000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_300000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_300000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :300000 Sku's 5 Feeds";
        $Personalized_300000_Sku_25_Percent->trial_days = 30;
        $Personalized_300000_Sku_25_Percent->on_install = 0;
        $Personalized_300000_Sku_25_Percent->save();


        $Personalized_300000_Sku_30_Percent = new Plan();
        $Personalized_300000_Sku_30_Percent->name = "5 Feed - 300000 SKU'S Monthly 30% Discountedt";
        $Personalized_300000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_300000_Sku_30_Percent->price = 62.99;
        $Personalized_300000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_300000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_300000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED: 300000 Sku's 5 Feeds";
        $Personalized_300000_Sku_30_Percent->trial_days = 30;
        $Personalized_300000_Sku_30_Percent->on_install = 0;
        $Personalized_300000_Sku_30_Percent->save();



        $Personalized_300000_Sku_50_Percent = new Plan();
        $Personalized_300000_Sku_50_Percent->name = "5 Feed - 300000 SKU'S Monthly 50% Discountedt";
        $Personalized_300000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_300000_Sku_50_Percent->price = 44.99;
        $Personalized_300000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_300000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_300000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :300000 Sku's 5 Feeds";
        $Personalized_300000_Sku_50_Percent->trial_days = 30;
        $Personalized_300000_Sku_50_Percent->on_install = 0;
        $Personalized_300000_Sku_50_Percent->save();





        $Personalized_400000_Sku_10_Percent = new Plan();
        $Personalized_400000_Sku_10_Percent->name = "5 Feed - 400000 SKU'S Monthly 10% Discounted";
        $Personalized_400000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_400000_Sku_10_Percent->price = 89.99;
        $Personalized_400000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_400000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_400000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $Personalized_400000_Sku_10_Percent->trial_days = 30;
        $Personalized_400000_Sku_10_Percent->on_install = 0;
        $Personalized_400000_Sku_10_Percent->save();






        $Personalized_400000_Sku_20_Percent = new Plan();
        $Personalized_400000_Sku_20_Percent->name = "5 Feed - 400000 SKU'S Monthly 20% Discounted";
        $Personalized_400000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_400000_Sku_20_Percent->price = 79.99;
        $Personalized_400000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_400000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_400000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $Personalized_400000_Sku_20_Percent->trial_days = 30;
        $Personalized_400000_Sku_20_Percent->on_install = 0;
        $Personalized_400000_Sku_20_Percent->save();





        $Personalized_400000_Sku_25_Percent = new Plan();
        $Personalized_400000_Sku_25_Percent->name = "5 Feed - 400000 SKU'S Monthly 25% Discounted";
        $Personalized_400000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_400000_Sku_25_Percent->price = 74.99;
        $Personalized_400000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_400000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_400000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $Personalized_400000_Sku_25_Percent->trial_days = 30;
        $Personalized_400000_Sku_25_Percent->on_install = 0;
        $Personalized_400000_Sku_25_Percent->save();




        $Personalized_400000_Sku_30_Percent = new Plan();
        $Personalized_400000_Sku_30_Percent->name = "5 Feed - 400000 SKU'S Monthly 30% Discounted";
        $Personalized_400000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_400000_Sku_30_Percent->price = 69.99;
        $Personalized_400000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_400000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_400000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $Personalized_400000_Sku_30_Percent->trial_days = 30;
        $Personalized_400000_Sku_30_Percent->on_install = 0;
        $Personalized_400000_Sku_30_Percent->save();



        $Personalized_400000_Sku_50_Percent = new Plan();
        $Personalized_400000_Sku_50_Percent->name = "5 Feed - 400000 SKU'S Monthly 50% Discounted";
        $Personalized_400000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_400000_Sku_50_Percent->price = 49.99;
        $Personalized_400000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_400000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_400000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :400000 Sku's 5 Feeds";
        $Personalized_400000_Sku_50_Percent->trial_days = 30;
        $Personalized_400000_Sku_50_Percent->on_install = 0;
        $Personalized_400000_Sku_50_Percent->save();




        $Personalized_500000_Sku_10_Percent = new Plan();
        $Personalized_500000_Sku_10_Percent->name = "10 Feed - 500000 SKU'S Monthly 10% Discounted";
        $Personalized_500000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_500000_Sku_10_Percent->price = 116.99;
        $Personalized_500000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_500000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_500000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :500000 Sku's 10 Feeds";
        $Personalized_500000_Sku_10_Percent->trial_days = 30;
        $Personalized_500000_Sku_10_Percent->on_install = 0;
        $Personalized_500000_Sku_10_Percent->save();





        $Personalized_500000_Sku_20_Percent = new Plan();
        $Personalized_500000_Sku_20_Percent->name = "10 Feed - 500000 SKU'S Monthly 20% Discounted";
        $Personalized_500000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_500000_Sku_20_Percent->price = 103.99;
        $Personalized_500000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_500000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_500000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :500000 Sku's 10 Feeds";
        $Personalized_500000_Sku_20_Percent->trial_days = 30;
        $Personalized_500000_Sku_20_Percent->on_install = 0;
        $Personalized_500000_Sku_20_Percent->save();





        $Personalized_500000_Sku_25_Percent = new Plan();
        $Personalized_500000_Sku_25_Percent->name = "10 Feed - 500000 SKU'S Monthly 25% Discounted";
        $Personalized_500000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_500000_Sku_25_Percent->price = 97.49;
        $Personalized_500000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_500000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_500000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :500000 Sku's 10 Feeds";
        $Personalized_500000_Sku_25_Percent->trial_days = 30;
        $Personalized_500000_Sku_25_Percent->on_install = 0;
        $Personalized_500000_Sku_25_Percent->save();



        $Personalized_500000_Sku_30_Percent = new Plan();
        $Personalized_500000_Sku_30_Percent->name = "10 Feed - 500000 SKU'S Monthly 30% Discounted";
        $Personalized_500000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_500000_Sku_30_Percent->price = 90.99;
        $Personalized_500000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_500000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_500000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED: 500000 Sku's 10 Feeds";
        $Personalized_500000_Sku_30_Percent->trial_days = 30;
        $Personalized_500000_Sku_30_Percent->on_install = 0;
        $Personalized_500000_Sku_30_Percent->save();



        $Personalized_500000_Sku_50_Percent = new Plan();
        $Personalized_500000_Sku_50_Percent->name = "10 Feed - 500000 SKU'S Monthly 50% Discounted";
        $Personalized_500000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_500000_Sku_50_Percent->price = 65.00;
        $Personalized_500000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_500000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_500000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :500000 Sku's 10 Feeds";
        $Personalized_500000_Sku_50_Percent->trial_days = 30;
        $Personalized_500000_Sku_50_Percent->on_install = 0;
        $Personalized_500000_Sku_50_Percent->save();





        $Personalized_600000_Sku_10_Percent = new Plan();
        $Personalized_600000_Sku_10_Percent->name = "10 Feed - 600000 SKU'S Monthly 10% Discounted";
        $Personalized_600000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_600000_Sku_10_Percent->price = 134.99;
        $Personalized_600000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_600000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_600000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $Personalized_600000_Sku_10_Percent->trial_days = 30;
        $Personalized_600000_Sku_10_Percent->on_install = 0;
        $Personalized_600000_Sku_10_Percent->save();



        $Personalized_600000_Sku_20_Percent = new Plan();
        $Personalized_600000_Sku_20_Percent->name = "10 Feed - 600000 SKU'S Monthly 20% Discounted";
        $Personalized_600000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_600000_Sku_20_Percent->price = 119.99;
        $Personalized_600000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_600000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_600000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $Personalized_600000_Sku_20_Percent->trial_days = 30;
        $Personalized_600000_Sku_20_Percent->on_install = 0;
        $Personalized_600000_Sku_20_Percent->save();



        $Personalized_600000_Sku_25_Percent = new Plan();
        $Personalized_600000_Sku_25_Percent->name = "10 Feed - 600000 SKU'S Monthly 25% Discounted";
        $Personalized_600000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_600000_Sku_25_Percent->price = 112.49;
        $Personalized_600000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_600000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_600000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $Personalized_600000_Sku_25_Percent->trial_days = 30;
        $Personalized_600000_Sku_25_Percent->on_install = 0;
        $Personalized_600000_Sku_25_Percent->save();




        $Personalized_600000_Sku_30_Percent = new Plan();
        $Personalized_600000_Sku_30_Percent->name = "10 Feed - 600000 SKU'S Monthly 30% Discounted";
        $Personalized_600000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_600000_Sku_30_Percent->price = 104.99;
        $Personalized_600000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_600000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_600000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $Personalized_600000_Sku_30_Percent->trial_days = 30;
        $Personalized_600000_Sku_30_Percent->on_install = 0;
        $Personalized_600000_Sku_30_Percent->save();




        $Personalized_600000_Sku_50_Percent = new Plan();
        $Personalized_600000_Sku_50_Percent->name = "10 Feed - 600000 SKU'S Monthly 50% Discounted";
        $Personalized_600000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_600000_Sku_50_Percent->price = 75.00;
        $Personalized_600000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_600000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_600000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :600000 Sku's 10 Feeds";
        $Personalized_600000_Sku_50_Percent->trial_days = 30;
        $Personalized_600000_Sku_50_Percent->on_install = 0;
        $Personalized_600000_Sku_50_Percent->save();





        $Personalized_700000_Sku_10_Percent = new Plan();
        $Personalized_700000_Sku_10_Percent->name = "10 Feed - 700000 SKU'S Monthly 10% Discounted";
        $Personalized_700000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_700000_Sku_10_Percent->price = 179.99;
        $Personalized_700000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_700000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_700000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 10 Feeds";
        $Personalized_700000_Sku_10_Percent->trial_days = 30;
        $Personalized_700000_Sku_10_Percent->on_install = 0;
        $Personalized_700000_Sku_10_Percent->save();





        $Personalized_700000_Sku_20_Percent = new Plan();
        $Personalized_700000_Sku_20_Percent->name = "10 Feed - 700000 SKU'S Monthly 20% Discounted";
        $Personalized_700000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_700000_Sku_20_Percent->price = 159.99;
        $Personalized_700000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_700000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_700000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 10 Feeds";
        $Personalized_700000_Sku_20_Percent->trial_days = 30;
        $Personalized_700000_Sku_20_Percent->on_install = 0;
        $Personalized_700000_Sku_20_Percent->save();





        $Personalized_700000_Sku_25_Percent = new Plan();
        $Personalized_700000_Sku_25_Percent->name = "10 Feed - 700000 SKU'S Monthly 25% Discounted";
        $Personalized_700000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_700000_Sku_25_Percent->price = 149.99;
        $Personalized_700000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_700000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_700000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 10 Feeds";
        $Personalized_700000_Sku_25_Percent->trial_days = 30;
        $Personalized_700000_Sku_25_Percent->on_install = 0;
        $Personalized_700000_Sku_25_Percent->save();





        $Personalized_700000_Sku_30_Percent = new Plan();
        $Personalized_700000_Sku_30_Percent->name = "10 Feed - 700000 SKU'S Monthly 30% Discounted";
        $Personalized_700000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_700000_Sku_30_Percent->price = 139.99;
        $Personalized_700000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_700000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_700000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 30 Feeds";
        $Personalized_700000_Sku_30_Percent->trial_days = 30;
        $Personalized_700000_Sku_30_Percent->on_install = 0;
        $Personalized_700000_Sku_30_Percent->save();





        $Personalized_700000_Sku_50_Percent = new Plan();
        $Personalized_700000_Sku_50_Percent->name = "10 Feed - 700000 SKU'S Monthly 50% Discounted";
        $Personalized_700000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_700000_Sku_50_Percent->price = 100.00;
        $Personalized_700000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_700000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_700000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :700000 Sku's 10 Feeds";
        $Personalized_700000_Sku_50_Percent->trial_days = 30;
        $Personalized_700000_Sku_50_Percent->on_install = 0;
        $Personalized_700000_Sku_50_Percent->save();







        $Personalized_800000_Sku_10_Percent = new Plan();
        $Personalized_800000_Sku_10_Percent->name = "10 Feed - 800000 SKU'S Monthly 10% Discounted";
        $Personalized_800000_Sku_10_Percent->type = 'RECURRING';
        $Personalized_800000_Sku_10_Percent->price = 224.99;
        $Personalized_800000_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_800000_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_800000_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $Personalized_800000_Sku_10_Percent->trial_days = 30;
        $Personalized_800000_Sku_10_Percent->on_install = 0;
        $Personalized_800000_Sku_10_Percent->save();






        $Personalized_800000_Sku_20_Percent = new Plan();
        $Personalized_800000_Sku_20_Percent->name = "10 Feed - 800000 SKU'S Monthly 20% Discounted";
        $Personalized_800000_Sku_20_Percent->type = 'RECURRING';
        $Personalized_800000_Sku_20_Percent->price = 199.99;
        $Personalized_800000_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_800000_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_800000_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $Personalized_800000_Sku_20_Percent->trial_days = 30;
        $Personalized_800000_Sku_20_Percent->on_install = 0;
        $Personalized_800000_Sku_20_Percent->save();






        $Personalized_800000_Sku_25_Percent = new Plan();
        $Personalized_800000_Sku_25_Percent->name = "10 Feed - 800000 SKU'S Monthly 25% Discounted";
        $Personalized_800000_Sku_25_Percent->type = 'RECURRING';
        $Personalized_800000_Sku_25_Percent->price = 187.49;
        $Personalized_800000_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_800000_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_800000_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $Personalized_800000_Sku_25_Percent->trial_days = 30;
        $Personalized_800000_Sku_25_Percent->on_install = 0;
        $Personalized_800000_Sku_25_Percent->save();



        $Personalized_800000_Sku_30_Percent = new Plan();
        $Personalized_800000_Sku_30_Percent->name = "10 Feed - 800000 SKU'S Monthly 30% Discounted";
        $Personalized_800000_Sku_30_Percent->type = 'RECURRING';
        $Personalized_800000_Sku_30_Percent->price = 174.99;
        $Personalized_800000_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_800000_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_800000_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $Personalized_800000_Sku_30_Percent->trial_days = 30;
        $Personalized_800000_Sku_30_Percent->on_install = 0;
        $Personalized_800000_Sku_30_Percent->save();






        $Personalized_800000_Sku_50_Percent = new Plan();
        $Personalized_800000_Sku_50_Percent->name = "10 Feed - 800000 SKU'S Monthly 50% Discounted";
        $Personalized_800000_Sku_50_Percent->type = 'RECURRING';
        $Personalized_800000_Sku_50_Percent->price = 125.00;
        $Personalized_800000_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_800000_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_800000_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :800000 Sku's 10 Feeds";
        $Personalized_800000_Sku_50_Percent->trial_days = 30;
        $Personalized_800000_Sku_50_Percent->on_install = 0;
        $Personalized_800000_Sku_50_Percent->save();





        $Personalized_Monthly_Unlimited_Sku_10_Percent = new Plan();
        $Personalized_Monthly_Unlimited_Sku_10_Percent->name = "Monthly Unlimited Sku 10% Discounted";
        $Personalized_Monthly_Unlimited_Sku_10_Percent->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku_10_Percent->price = 359.99;
        $Personalized_Monthly_Unlimited_Sku_10_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku_10_Percent->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku_10_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku_10_Percent->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku_10_Percent->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku_10_Percent->save();




        $Personalized_Monthly_Unlimited_Sku_20_Percent = new Plan();
        $Personalized_Monthly_Unlimited_Sku_20_Percent->name = "Monthly Unlimited Sku 20% Discounted";
        $Personalized_Monthly_Unlimited_Sku_20_Percent->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku_20_Percent->price = 319.99;
        $Personalized_Monthly_Unlimited_Sku_20_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku_20_Percent->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku_20_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku_20_Percent->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku_20_Percent->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku_20_Percent->save();




        $Personalized_Monthly_Unlimited_Sku_25_Percent = new Plan();
        $Personalized_Monthly_Unlimited_Sku_25_Percent->name = "Monthly Unlimited Sku 25% Discounted";
        $Personalized_Monthly_Unlimited_Sku_25_Percent->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku_25_Percent->price = 299.99;
        $Personalized_Monthly_Unlimited_Sku_25_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku_25_Percent->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku_25_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku_25_Percent->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku_25_Percent->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku_25_Percent->save();




        $Personalized_Monthly_Unlimited_Sku_30_Percent = new Plan();
        $Personalized_Monthly_Unlimited_Sku_30_Percent->name = "Monthly Unlimited Sku 30% Discounted";
        $Personalized_Monthly_Unlimited_Sku_30_Percent->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku_30_Percent->price = 279.99;
        $Personalized_Monthly_Unlimited_Sku_30_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku_30_Percent->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku_30_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED: Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku_30_Percent->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku_30_Percent->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku_30_Percent->save();




        $Personalized_Monthly_Unlimited_Sku_50_Percent = new Plan();
        $Personalized_Monthly_Unlimited_Sku_50_Percent->name = "Monthly Unlimited Sku 50% Discounted";
        $Personalized_Monthly_Unlimited_Sku_50_Percent->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku_50_Percent->price = 200.00;
        $Personalized_Monthly_Unlimited_Sku_50_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku_50_Percent->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku_50_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku_50_Percent->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku_50_Percent->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku_50_Percent->save();




        $Personalized_Monthly_Unlimited_Sku_75_Percent = new Plan();
        $Personalized_Monthly_Unlimited_Sku_75_Percent->name = "Monthly Unlimited Sku 75% Discounted";
        $Personalized_Monthly_Unlimited_Sku_75_Percent->type = 'RECURRING';
        $Personalized_Monthly_Unlimited_Sku_75_Percent->price = 100.00;
        $Personalized_Monthly_Unlimited_Sku_75_Percent->interval = 'EVERY_30_DAYS';
        $Personalized_Monthly_Unlimited_Sku_75_Percent->capped_amount = 0.00;
        $Personalized_Monthly_Unlimited_Sku_75_Percent->terms = "WHAT’S INCLUDED ON PERSONALIZED :Super Unlimited Sku's Super Unlimited Feeds";
        $Personalized_Monthly_Unlimited_Sku_75_Percent->trial_days = 30;
        $Personalized_Monthly_Unlimited_Sku_75_Percent->on_install = 0;
        $Personalized_Monthly_Unlimited_Sku_75_Percent->save();
    }
}
