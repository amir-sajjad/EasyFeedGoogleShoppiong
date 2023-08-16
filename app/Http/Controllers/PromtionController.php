<?php

namespace App\Http\Controllers;

use App\Http\Traits\GoogleApiTrait;
use App\Jobs\GetPromotionDetails;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PromtionController extends Controller
{
    protected $user;

    protected $user_id;

    protected $promotionaData = [];

    use GoogleApiTrait;

    public function createPromotion(Request $request)
    {
        $matchColumName = config('formValidation.promotionTypeName');
        if (auth()->user()->settings->merchantAccountId == null) :
            return response()->json(['status' => false, 'message' => 'Please Connect A Merchant Account First'], 422);
        endif;
        $validator = validator($request->post('inputs'), config('formValidation.promotionForm'));
        if ($validator->fails()) :
            return response()->json(['status' => false, 'message' => $validator->errors()], 422);
        endif;
        $validated = $validator->validated();

        if (isset($validated['promotionDestinationIds'])) {
            unset($validated['promotionDestinationIds']);
        }

        // $validated['promotionDestinationIds']=["surfaces_across_google","shopping_plus"];

        $response = $this->ContentApiRequest('createPromotion', [auth()->user()->settings->merchantAccountId], $validated, 'post');
        if (!$response) :
            return response()->json(['status' => false, 'message' => !empty($response) ? $response : "Unable To Create Promotion."]);
        endif;

        if (!isset($response['error'])) :
            $columnsToJsonEncode = config('formValidation.jsonEncodedColumns');
            foreach ($validated as $key => $value) :
                if (in_array($key, $columnsToJsonEncode)) :
                    $validated[$key] = json_encode($value);
                else :
                    $validated[$key] = $value;
                endif;
            endforeach;
            //Adding  Additional Fields To Table For Dispaly Only........
            $validated['promotionTypeName'] = $matchColumName[$validated['couponValueType']];
            $validated['couponValueCategory'] = $request->post('couponValueCategory');
            $validated['selectedRegion'] = $request->post('selectedRegion');
            $validated['user_id'] = auth()->user()->id;
            $promotion = Promotion::insert($validated);
            $PromotionsDetails = $this->getAllPromotions(auth()->user()->id);
            return response()->json(['status' => true, 'message' => 'Promotion Created SuccessFully', 'promotions' => $PromotionsDetails], 201);
        endif;
        return response()->json(['status' => false, 'message' => !empty($response['error']['message']) ? $response['error']['message'] : 'Error Creating Promotion'], $response['error']['code']);
    }

    public function getAllPromotions($user_id = null)
    {
        $this->user_id = ($user_id !== null) ? $user_id : auth()->user()->id;
        $PromotionsDetails = Promotion::where(['user_id' => $this->user_id])
            ->select([
                'id', 'promotionId', 'longTitle',
                DB::raw("CONCAT(contentLanguage, '-', targetCountry) as region"),
                'selectedRegion', 'couponValueType', 'promotionTypeName', 'couponValueCategory', 'promotionDestinationIds', 'offerType', 'genericRedemptionCode',
                'promotionDisplayTimePeriod', 'promotionEffectiveTimePeriod', 'redemptionChannel',
                'minimumPurchaseAmount', 'moneyOffAmount', 'minimumPurchaseQuantity', 'productApplicability',
                'getThisQuantityDiscounted', 'percentOff', 'freeGiftDescription',
                'freeGiftValue', 'freeGiftItemId', 'promotionStatus',
            ])
            ->orderBy('id', 'DESC')
            ->get();

        return $PromotionsDetails;
    }

    public function getPromotions()
    {
        // id Format=online:en:CA:67676t
        // GetPromotionDetails::dispatch();
        $PromotionsDetails = $this->getAllPromotions(auth()->user()->id);

        return response()->json(['status' => true, 'promotions' => $PromotionsDetails]);
    }

    public function deletePromotion($promotionToDelete)
    {
        $passedDate = Carbon::now()->sub(5, 'days')->toIso8601String(); //Date Before Current Date To Delete A Promotion
        $promotionColumnsForDeletion = config('formValidation.columnsForDeletePromotion');
        $columnsToJsonDecode = config('formValidation.jsonEncodedColumns');
        if (!empty($promotionToDelete)) {
            $promotion = Promotion::where(['user_id' => auth()->user()->id, 'id' => $promotionToDelete])->select($promotionColumnsForDeletion)->first();
            if ($promotion !== null) {
                //To Get Data From Table Json Decode Some Value  And Format It For Content Api Request
                $formattedPromotion = collect($promotion)->map(function ($value, $columnName) use ($columnsToJsonDecode, $passedDate) {
                    if (!in_array($columnName, $columnsToJsonDecode)) {
                        return $value;
                    }
                    if (in_array($columnName, ['promotionDisplayTimePeriod', 'promotionEffectiveTimePeriod'])) {
                        return ['startTime' => $passedDate, 'endTime' => $passedDate];
                    }

                    return json_decode($value);
                });
                $response = $this->ContentApiRequest('createPromotion', [auth()->user()->settings->merchantAccountId], $formattedPromotion, 'post');
                if (!isset($response['error'])) {
                    $record = Promotion::where(['user_id' => auth()->user()->id, 'id' => $promotionToDelete])->find($promotionToDelete);
                    $record->delete();
                    $PromotionsDetails = $this->getAllPromotions(auth()->user()->id);

                    return response()->json(['status' => true, 'message' => 'Promotion Ended Successfully', 'promotions' => $PromotionsDetails]);
                }

                return response()->json(['status' => true, 'message' => $response], 401);
            }
        }

        return response()->json(['status' => false, 'message' => 'No Promotion Found!'], 404);
    }
}
