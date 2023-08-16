<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('edited_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('feed_setting_id');
            $table->unsignedBigInteger('shop_product_variant_id');
            $table->string('productId');
            $table->string('variantId');
            $table->string('color')->nullable();
            $table->string('sizes')->nullable();
            $table->string('material')->nullable();
            $table->string('pattern')->nullable();
            $table->enum('sizeSystem', ['AU', 'BR', 'CN', 'DE', 'EU', 'FR', 'IT', 'JP', 'MEX', 'UK', 'US'])->nullable();
            $table->enum('sizeType', ['regular', 'petite', 'plus', 'tall', 'big', 'maternity'])->nullable();
            $table->string('unitPricingMeasure')->nullable();
            $table->string('unitPricingBaseMeasure')->nullable();
            $table->integer('multipack')->nullable();
            $table->boolean('isBundle')->nullable();
            $table->string('promotionIds')->nullable();
            $table->string('salePriceEffectiveDate')->nullable();
            $table->boolean('adult')->nullable();
            $table->boolean('identifierExists')->nullable();
            $table->string('costOfGoodsSold')->nullable();
            $table->string('availabilityDate')->nullable();
            $table->enum('availability', ['in_stock', 'out_of_stock', 'preorder', 'backorder'])->nullable();
            $table->string('expirationDate')->nullable();
            $table->string('installment')->nullable();
            $table->string('loyaltyPoints')->nullable();
            $table->enum('energyEfficiencyClass', ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])->nullable();
            $table->enum('minEnergyEfficiencyClass', ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])->nullable();
            $table->enum('maxEnergyEfficiencyClass', ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'])->nullable();
            $table->string('maxHandlingTime')->nullable();
            $table->string('minHandlingTime')->nullable();
            $table->json('shipping')->nullable();
            $table->string('shippingHeight')->nullable();
            $table->string('shippingWidth')->nullable();
            $table->string('shippingLength')->nullable();
            $table->string('shippingWeight')->nullable();
            $table->string('productHeight')->nullable();
            $table->string('productLength')->nullable();
            $table->string('productWidth')->nullable();
            $table->string('productWeight')->nullable();
            $table->string('return_policy_label')->nullable();
            $table->string('transitTimeLabel')->nullable();
            $table->enum('pause', ['ads', 'all'])->nullable();
            $table->string('subscriptionCost')->nullable();
            $table->longText('productHighlights')->nullable();
            $table->longText('productDetails')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('feed_setting_id')->references('id')->on('feed_settings')->onDelete('cascade');
            $table->foreign('shop_product_variant_id')->references('id')->on('shop_product_variants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('edited_products');
    }
};
