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
        Schema::create('feed_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->text('merchantAccountId')->nullable();
            $table->text('merchantAccountName')->nullable();
            $table->string('name');
            $table->string('market');
            $table->string('country');
            $table->string('language');
            $table->string('currency');
            $table->enum('channel', ['online', 'local'])->default('online');
            $table->enum('shipping', ['auto', 'manual'])->default('auto');
            $table->enum('productIdFormat', ['global', 'sku', 'variant'])->default('variant');
            $table->enum('whichProducts', ['all', 'collection'])->default('all');
            $table->text('includedCollections')->nullable();
            $table->text('excludedCollections')->nullable();
            $table->enum('productTitle', ['default', 'seo'])->default('default');
            $table->enum('productDescription', ['default', 'seo'])->default('default');
            $table->enum('variantSubmission', ['first', 'all'])->default('all');
            $table->enum('brandSubmission', ['vendor', 'domain'])->default('vendor');
            // $table->enum('productIdentifiers', ['allIdentifiers', 'brandMPN', 'none'])->default('none');
            $table->boolean('productIdentifiers')->default(1);
            $table->boolean('barcode')->default(1);
            $table->boolean('salePrice')->default(1);
            $table->boolean('secondImage')->default(1);
            $table->boolean('additionalImages')->default(1);
            $table->unsignedBigInteger('product_category_id')->nullable();
            $table->enum('ageGroup', ['blank', 'newborn', 'infant', 'toddler', 'kids', 'adult'])->nullable();
            $table->enum('gender', ['blank', 'male', 'female', 'unisex'])->nullable();
            $table->enum('productCondition', ['blank', 'new', 'refurbished', 'used'])->nullable();
            $table->string('utm_campaign')->default('EasyFeed');
            $table->string('utm_source')->default('Google');
            $table->string('utm_medium')->default('Shopping Ads');
            $table->boolean('status')->default(1);
            $table->timestamp('last_updated')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('feed_settings');
    }
};
