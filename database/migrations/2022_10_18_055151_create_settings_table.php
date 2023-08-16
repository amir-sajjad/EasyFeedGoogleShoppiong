<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->boolean('setup')->default(0);
            $table->text('storeFrontAccessToken')->nullable();
            $table->text('googleAccessToken')->nullable();
            $table->text('googleRefreshToken')->nullable();
            $table->text('googleAccountId')->nullable();
            $table->text('googleAccountName')->nullable();
            $table->text('googleAccountEmail')->nullable();
            $table->text('googleAccountAvatar')->nullable();
            $table->text('merchantAccountId')->nullable();
            $table->text('merchantAccountName')->nullable();
            $table->longText('connectedMerchants')->nullable();
            $table->string('country');
            $table->string('language');
            $table->string('currency');
            $table->string('themeId');
            $table->string('domain');
            $table->text('store_name')->nullable();
            $table->text('store_email')->nullable();
            $table->string('store_phone')->nullable();
            $table->string('country_name')->nullable();
            $table->string('plan_display_name')->nullable();
            $table->enum('notification_setting', ['auto', 'manual'])->default('auto');
            $table->integer('feedsCount')->default(0);
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
        Schema::dropIfExists('settings');
    }
};
