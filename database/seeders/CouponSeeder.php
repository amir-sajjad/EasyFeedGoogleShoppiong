<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $todayDate = Carbon::now();
        DB::table('coupons')->insert([
            [
                'coupon_code' => 'Toronto%10', 'coupon_name' => "10 Percent Discount",
                "discount_percentage" => 10, "coupon_status" => 1, "created_at" => $todayDate
            ],
            [
                'coupon_code' => 'Tokyo%20', 'coupon_name' => "20 Percent Discount",
                "discount_percentage" => 20, "coupon_status" => 1, "created_at" => $todayDate
            ],
            [
                'coupon_code' => 'Sydney%25', 'coupon_name' => "25 Percent Discount",
                "discount_percentage" => 25, "coupon_status" => 1, "created_at" => $todayDate
            ],
            [
                'coupon_code' => 'London%30', 'coupon_name' => "30 Percent Discount",
                "discount_percentage" => 30, "coupon_status" => 1, "created_at" => $todayDate
            ],
            [
                'coupon_code' => 'LasVegas%50', 'coupon_name' => "50 Percent Discount",
                "discount_percentage" => 50, "coupon_status" => 1, "created_at" => $todayDate
            ],
            [
                'coupon_code' => 'NewYork%75', 'coupon_name' => "75 Percent Discount",
                "discount_percentage" => 75, "coupon_status" => 1, "created_at" => $todayDate
            ],
        ]);
    }
}
