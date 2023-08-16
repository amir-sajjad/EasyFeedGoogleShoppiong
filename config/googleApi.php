<?php

return [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'apiKey'    => "AIzaSyA6MaJMlGNO5_2qxMhmhvvQ9v3JKcmi784",
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'scopes' => [
        'https://www.googleapis.com/auth/content',
        'https://www.googleapis.com/auth/siteverification',
        // 'https://www.googleapis.com/auth/adwords',
    ],
    'contentApis' => [
        'getMainMerchantAccount' => [
            "https://www.googleapis.com/content/v2.1/accounts/authinfo?key="
        ],
        'createAccount' => [
            'https://www.googleapis.com/content/v2.1/accounts'
        ],
        'getAccountInfo' => [
            "https://shoppingcontent.googleapis.com/content/v2.1/",
            "/accounts/",
            "?key="
        ],
        'getSubMerchantAccounts' => [
            'https://www.googleapis.com/content/v2.1/',
            "/accounts?key="
        ],
        'getAllProducts' => [
            'https://www.googleapis.com/content/v2.1/',
            "/products?key="
        ],
        'addProduct' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/',
            '/products?key='
        ],
        'addBulkProducts' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/products/batch'
        ],
        'removeBulkProducts' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/products/batch'
        ],
        'updateAccountInfo' => [
            'https://www.googleapis.com/content/v2.1/',
            '/accounts/',
            '?key='
        ],
        'updateShippingSettings' => [
            "https://shoppingcontent.googleapis.com/content/v2.1/",
            "/shippingsettings/",
            "?key="
        ],
        'claimWebsite' => [
            'https://www.googleapis.com/content/v2.1/',
            '/accounts/',
            '/claimwebsite?key='
        ],
        'refreshToken' => [
            'https://oauth2.googleapis.com/token'
        ],
        'revokeToken' => [
            'https://oauth2.googleapis.com/revoke?token='
        ],
        'getStatuses' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/productstatuses/batch'
        ],
        'getStatusesParticularFields' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/productstatuses/batch?fields=entries(productStatus(productId,destinationStatuses(destination,status),itemLevelIssues(destination,description)))'
        ],
        'getAccountStatuses' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/accountstatuses/batch'
        ],
        'getProduct' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/',
            '/products/',
            '?key='
        ],
        'updateSingleProduct' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/'
        ],
        'createPromotion' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/',
            '/promotions'
        ],
        'getPromotion' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/',
            '/promotions/'
        ],
        'syncLocalFeed' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/localinventory/batch'
        ],
        'syncRegionalFeed' => [
            'https://shoppingcontent.googleapis.com/content/v2.1/regionalinventory/batch'
        ],
    ],
    'siteVerificationApis' => [
        'getSiteVerificationToken' => [
            'https://www.googleapis.com/siteVerification/v1/token?key='
        ],
        'verifySite' => [
            'https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=META&key='
        ]
    ],
    // 'promotion' => [
    //     'createPromotion' => [
    //         'https://shoppingcontent.googleapis.com/content/v2.1/',
    //         '/promotions'
    //     ],
    //     'getPromotion' => [
    //         'https://shoppingcontent.googleapis.com/content/v2.1/',
    //         '/promotions'
    //     ]
    // ],
    'strings' => [
        'AutomaticShippingName' => 'Free Shipping By EasyFeedForGoogleShopping',
        'AutomaticShippingLabel' => 'Free Shipping'
    ],
];
