<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('local_inventory_feeds', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('feed_setting_id');
            $table->string('feed_name');
            $table->text('feed_url')->nullable();
            $table->enum('feed_type', ['local', 'regional'])->default('local');
            $table->text('code')->nullable();
            $table->enum('availability', ['in_stock', 'out_of_stock', 'preorder', 'backorder'])->nullable();
            $table->string('salePriceEffectiveDate')->nullable();
            $table->boolean('salePrice')->default(0);
            $table->string('pickupMethod')->nullable();
            $table->string('pickupSla')->nullable();
            $table->text('instoreProductLocation')->nullable();
            $table->string('skus')->nullable();
            $table->boolean('status')->default(1);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('feed_setting_id')->references('id')->on('feed_settings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_inventory_feeds');
    }
};
