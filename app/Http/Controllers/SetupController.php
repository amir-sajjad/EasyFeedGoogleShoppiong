<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Traits\GoogleApiTrait;
use Laravel\Socialite\Facades\Socialite;

class SetupController extends Controller
{
    use GoogleApiTrait;

    public function redirectToProvider()
    {
        return Socialite::driver('google')
            ->stateless()
            ->scopes(config('googleApi.scopes'))
            ->with(["access_type" => "offline", "prompt" => "consent select_account"])
            ->redirect();
    }

    public function callback_url_handler(Request $request)
    {
        if (!$request->has('code') || $request->has('denied')) {
            return '<script type="text/javascript">window.close();</script>';
        }
        $user = Socialite::driver('google')->stateless()->user();
        // return $user;
        $data['googleAccountId'] = $user->getId();
        $data['googleAccountEmail'] = $user->getEmail();
        $data['googleAccountName'] = $user->name;
        $data['googleAccessToken'] = $user->token;
        $data['googleRefreshToken'] = $user->refreshToken;
        $data['expiresIn'] = $user->expiresIn;
        $data['googleAccountAvatar'] = $user->avatar_original;
        $shop = auth()->user();
        if ($shop->settings->update($data)) :
            $shop->load('settings');
            return '<script type="text/javascript">window.close();</script>';
        else :
            return "Something Went Wrong.";
        endif;
    }

    public function accountConnect(Request $request)
    {
        $account = $this->getAccountInfo($request->account_id);
        if ($account) :
            if (auth()->user()->settings->update(['merchantAccountId' => $request->account_id, 'merchantAccountName' => $account['name']])) :
                $connectedMerchants = collect(json_decode(auth()->user()->settings->connectedMerchants, true));
                $existingMerchantIndex = $connectedMerchants->search(function ($merchant) use ($request) {
                    return $merchant['merchantAccountId'] === $request->account_id;
                });
                if ($existingMerchantIndex !== false) :
                    $connectedMerchants->transform(function ($merchant) use ($request, $account) {
                        if ($merchant['merchantAccountId'] === $request->account_id) {
                            $merchant['merchantAccountName'] = $account['name'];
                        }
                        return $merchant;
                    });
                else :
                    $newMerchant = [
                        'merchantAccountId' => $request->account_id,
                        'merchantAccountName' => $account['name'],
                    ];
                    $connectedMerchants->push($newMerchant);
                endif;
                auth()->user()->settings->update([
                    'connectedMerchants' => $connectedMerchants->toJson(),
                ]);
                auth()->user()->load('settings');
                return response()->json(['success' => 'Account Connected.', 'status' => true], $status = 200);
            else :
                return response()->json(['error' => 'Could Not Save Account Details.', 'status' => false], $status = 401);
            endif;
        else :
            return response()->json(['error' => 'Cound Not Get Merchant Account Details.', 'status' => false], $status = 404);
        endif;
    }

    public function domainVerify()
    {
        $res = $this->getSiteVerificationToken();
        if ($res) :
            if ($this->addTokenToTheme($res['token'])) :
                if ($this->verifySite()) :
                    if ($this->updateDomaintoMerchantAccount()) :
                        if ($this->claimSite()) :
                            return response()->json(['message' => 'Website Claimed.', 'status' => true]);
                        else :
                            return response()->json(['message' => 'Could Not Claim.', 'status' => false]);
                        endif;
                    else :
                        return response()->json(['message' => 'Could Not Update Domain Name.', 'status' => false]);
                    endif;
                else :
                    return response()->json(['message' => 'Could Not Verify Website Claim.', 'status' => false]);
                endif;
            else :
                return response()->json(['message' => 'Could Not Add Token to Theme.', 'status' => false]);
            endif;
        else :
            return response()->json(['message' => 'Could Not get Site Verification Token.', 'status' => false]);
        endif;
        return response()->json(['message' => 'Could Not Claim Domain.', 'status' => false]);
    }

    public function disconnect()
    {
        if ($this->disconnectGoogle()) :
            return response()->json(['status' => true, 'success' => "Account Disconnected."]);
        endif;
        return response()->json(['status' => false, 'error' => "Something Went Wrong."]);
    }

    public function accountDisconnect()
    {
        if (auth()->user()->settings->update(['merchantAccountId' => null, 'merchantAccountName' => null])) :
            auth()->user()->load('settings');
            return response()->json(['success' => 'Account Disconnected.', 'status' => true]);
        else :
            return response()->json(['error' => 'Something Went Wrong.', 'status' => false]);
        endif;
    }
}
