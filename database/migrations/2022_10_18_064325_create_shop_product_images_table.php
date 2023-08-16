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
        Schema::create('shop_product_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_product_variant_id');
            $table->string('productId');
            $table->string('variantId');
            $table->text('additionalImage01')->nullable();
            $table->text('additionalImage02')->nullable();
            $table->text('additionalImage03')->nullable();
            $table->text('additionalImage04')->nullable();
            $table->text('additionalImage05')->nullable();
            $table->text('additionalImage06')->nullable();
            $table->text('additionalImage07')->nullable();
            $table->text('additionalImage08')->nullable();
            $table->text('additionalImage09')->nullable();
            $table->text('additionalImage10')->nullable();
            $table->timestamps();
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
        Schema::dropIfExists('shop_product_images');
    }
};
