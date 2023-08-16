<?php

namespace App\Jobs;

use Throwable;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UpdateMerchantCenterIdJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $updatedCount = 0;

    public function handle()
    {
        DB::table('shop_product_variants')
            ->join('feed_settings', 'shop_product_variants.feed_setting_id', '=', 'feed_settings.id')
            ->whereNotNull('shop_product_variants.feed_setting_id')
            ->select(
                'shop_product_variants.id as variant_id',
                'feed_settings.productIdFormat as format',
                'feed_settings.channel',
                'feed_settings.language',
                'feed_settings.country',
                'shop_product_variants.sku',
                'shop_product_variants.variantId',
                'shop_product_variants.productId'
            )
            ->orderBy('shop_product_variants.id')
            ->chunk(1000, function ($variants) {
                DB::beginTransaction();

                try {
                    foreach ($variants as $variant) {
                        $merchantCenterId = null;

                        switch ($variant->format) {
                            case 'sku':
                                $merchantCenterId = $variant->channel . ':' . $variant->language . ':' . $variant->country . ':' . $variant->sku;
                                break;
                            case 'variant':
                                $merchantCenterId = $variant->channel . ':' . $variant->language . ':' . $variant->country . ':' . $variant->variantId;
                                break;
                            case 'global':
                                $merchantCenterId = $variant->channel . ':' . $variant->language . ':' . $variant->country . ':Shopify_' . $variant->country . '_' . $variant->productId . '_' . $variant->variantId;
                                break;
                        }

                        DB::table('shop_product_variants')
                            ->where('id', $variant->variant_id)
                            ->update(['merchantCenterId' => $merchantCenterId]);

                        $this->updatedCount++;
                    }

                    DB::commit();
                } catch (Throwable $e) {
                    DB::rollback();
                    Log::error($e);
                    // You can log the error or perform any error handling here
                    // For example, you can log the error using Log::error($e);
                    // or throw a new exception to retry the chunk: throw new \Exception($e->getMessage());
                }
            });

        info("Total records updated: " . $this->updatedCount);
        Log::info("Total records updated: " . $this->updatedCount);
    }
}
