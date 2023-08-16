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
        Schema::create('shop_product_variants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('feed_setting_id');
            $table->unsignedBigInteger('shop_product_id');
            $table->string('productId');
            $table->string('variantId');
            $table->text('itemId');
            $table->text('title');
            $table->text('description');
            $table->text('handle')->nullable();
            $table->text('image')->nullable();
            $table->unsignedBigInteger('product_category_id')->nullable();
            $table->string('productTypes')->nullable();
            $table->string('brand')->nullable();
            $table->string('barcode')->nullable();
            $table->string('sku')->nullable();
            $table->integer('quantity')->default(0)->nullable();
            $table->enum('ageGroup', ['newborn', 'infant', 'toddler', 'kids', 'adult'])->nullable();
            $table->enum('gender', ['male', 'female', 'unisex'])->nullable();
            $table->enum('productCondition', ['new', 'refurbished', 'used'])->nullable();
            $table->string('status')->default('Pending');
            $table->text('merchantErrors')->nullable();
            $table->string('score')->nullable();
            $table->string('salePrice')->nullable();
            $table->string('comparePrice')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('shop_product_id')->references('id')->on('shop_products')->onDelete('cascade');
            $table->foreign('product_category_id')->references('id')->on('product_categories')->onDelete('cascade');
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
        Schema::dropIfExists('shop_product_variants');
    }
};
