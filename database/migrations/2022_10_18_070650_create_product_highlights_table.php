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
        Schema::create('product_highlights', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_product_variant_id');
            $table->bigInteger('variantId');
            $table->string('highlight1')->nullable();
            $table->string('highlight2')->nullable();
            $table->string('highlight3')->nullable();
            $table->string('highlight4')->nullable();
            $table->string('highlight5')->nullable();
            $table->string('highlight6')->nullable();
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
        Schema::dropIfExists('product_highlights');
    }
};
