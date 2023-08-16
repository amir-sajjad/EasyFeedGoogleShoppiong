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
        Schema::create('draft_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('shop_product_variant_id');
            $table->bigInteger('originalProductId');
            $table->bigInteger('draftProductId');
            $table->bigInteger('imagesCount');
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
        Schema::dropIfExists('draft_products');
    }
};
