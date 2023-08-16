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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('promotionId');
            $table->string('longTitle');
            $table->string('targetCountry');
            $table->string('contentLanguage');
            $table->string('selectedRegion')->nullable();
            $table->string('couponValueType');
            $table->string('promotionTypeName')->nullable();
            $table->string('couponValueCategory')->nullable();
            $table->string('promotionDestinationIds');
            $table->enum('offerType',["NO_CODE","GENERIC_CODE"]);
            $table->string('genericRedemptionCode')->nullable();
            $table->string('promotionDisplayTimePeriod');
            $table->string('promotionEffectiveTimePeriod');
            $table->string('redemptionChannel');
            $table->string('minimumPurchaseAmount')->nullable();
            $table->string('moneyOffAmount')->nullable();
            $table->string('minimumPurchaseQuantity')->nullable();
            $table->enum('productApplicability',['ALL_PRODUCTS','SPECIFIC_PRODUCTS']);
            $table->string('getThisQuantityDiscounted')->nullable();
            $table->string('percentOff')->nullable();
            $table->string('freeGiftDescription')->nullable();
            $table->string('freeGiftValue')->nullable();
            $table->string('freeGiftItemId')->nullable();
            $table->longText('promotionStatus')->nullable();
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
        Schema::dropIfExists('promotions');
    }
};
