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
        Schema::create('product_labels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_product_variant_id');
            $table->unsignedBigInteger('feed_setting_id');
            $table->string('variantId');
            $table->string('customLabel0')->nullable(); 
            $table->string('customLabel1')->nullable();
            $table->string('customLabel2')->nullable();
            $table->string('customLabel3')->nullable();
            $table->string('customLabel4')->nullable();
            $table->string('adsLabels')->nullable();
            $table->string('adsGrouping')->nullable();
            $table->string('shippingLabel')->nullable();
            $table->string('taxCategory')->nullable();
            $table->timestamps();
            $table->foreign('shop_product_variant_id')->references('id')->on('shop_product_variants')->onDelete('cascade');
            $table->foreign('feed_setting_id')->references('id')->on('feed_settings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_labels');
    }
};
