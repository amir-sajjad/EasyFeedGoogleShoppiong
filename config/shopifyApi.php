<?php
$apiVersion = config("shopify-app.api_version");
return [
  //apis used for the app
  "apis" => [
    //get shop settings i.e. shop api
    "shop" => [
      "/admin/api/{$apiVersion}/shop.json"
    ],
    //get all themes api
    "getAllThemes" => [
      "/admin/api/{$apiVersion}/themes.json"
    ],
    //save script tag api
    "saveScriptTag" => [
      "/admin/api/{$apiVersion}/script_tags.json"
    ],
    //get single asset of a theme
    "getSingleAsset" => [
      "/admin/api/{$apiVersion}/themes/",
      "/assets.json"
    ],
    //save single asset of a theme
    "saveSingleAsset" => [
      "/admin/api/{$apiVersion}/themes/",
      "/assets.json"
    ],
    //delete asset of a theme
    "deleteAsset" => [
      "/admin/api/{$apiVersion}/themes/",
      "/assets.json"
    ],
    //products count
    "getProductsCount" => [
      "/admin/api/{$apiVersion}/products/count.json"
    ],
    //apis for testing purpose

    // get all webhooks
    "getWebhooks" => [
      "/admin/api/{$apiVersion}/webhooks.json"
    ],
    "cancelCharge" => [
      "/admin/api/{$apiVersion}/recurring_application_charges/",
      ".json"
    ],
    "getProducts" => [
      "/admin/api/{$apiVersion}/products.json"
    ],
    "getProductById" => [
      "/admin/api/{$apiVersion}/products/",
      ".json"
    ],
    "getCustomCollection" => [
      "/admin/api/{$apiVersion}/custom_collections.json"
    ],
    "getAutomaticCollection" => [
      "/admin/api/{$apiVersion}/smart_collections.json"
    ],
    "getSingleAutomaticCollection" => [
      "/admin/api/{$apiVersion}/smart_collections/",
      ".json"
    ],
    "getSingleCustomCollection" => [
      "/admin/api/{$apiVersion}/custom_collections/",
      ".json"
    ],
    "shippingApi" => [
      "/admin/api/{$apiVersion}/shipping_zones.json"
    ],
    "getCollectionProducts" => [
      "/admin/api/{$apiVersion}/collections/",
      "/products.json"
    ],
    "getVariants" => [
      "/admin/api/{$apiVersion}/products/",
      "/variants.json"
    ],
    "getSingleVariant" => [
      "/admin/api/{$apiVersion}/variants/",
      ".json"
    ],
    "getProductCollectionIds" => [
      "/admin/api/{$apiVersion}/collects.json"
    ],
    "getProductMetaFields" => [
      "/admin/api/{$apiVersion}/products/",
      "/metafields.json"
    ],
    "getVariantMetaFields" => [
      "/admin/api/{$apiVersion}/variants/",
      "/metafields.json"
    ],
    "storeFrontAccessToken" => [
      "/admin/api/{$apiVersion}/storefront_access_tokens.json"
    ]
  ],

  "graphQl" => [
    "apis" => [
      'getProductsBySearch' => [
        '{
                    products(query:"title:',
        '*",',
        ':',
        '',
        '',
        ')
                    {
                        pageInfo{
                            hasNextPage
                            hasPreviousPage
                        }
                        edges {
                            cursor
                            node {
                                id
                                title
                                featuredImage {
                                    src
                                }
                                publishedAt
                            }
                        }
                    }
                }'
      ],
      "getVarientByProductId" => [
        '{
                    product(id: "gid://shopify/Product/',
        '") 
                    {
                        variants(first: 100) {
                            edges {
                                node {
                                    image {
                                        src
                                    }
                                    id
                                    sku
                                    title
                                }
                            }
                        }
                    }
                }'
      ],
      "getMarkets" => [
        '{
          markets(first: 10,', '', ') {
            nodes {
              id
              name
              enabled
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }'
      ],
      "getSingleMarket" => [
        '{
          market(id: "', '") {
            currencySettings {
              baseCurrency {
                currencyCode
                currencyName
              }
            }
            regions(first: 10,', '', ') {
              nodes {
                ... on MarketRegionCountry {
                  name
                  code
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
            webPresence {
              defaultLocale
              alternateLocales
              rootUrls{
                url
                locale
              }
            }
          }
        }
        '
      ],
      "getMarketByGeography" => [
        '{
          marketByGeography(countryCode: ', ') {
            name
            id
          }
        }'
      ],
      "getShopLocale" => [
        '{
                    shopLocales(published: true) {
                      locale
                      name
                    }
                }'
      ],
      "getLocaleWebPresence" => [
        '{
          shopLocales(published: true) {
            locale
            name
            marketWebPresences{
              domain{
                url
              }
              rootUrls{
                locale
                url
              }
            }
          }
        }'
      ],
      "getProductMetafields" => [
        '{
          metafieldDefinitions(ownerType: PRODUCT, first: 10,', '', ') {
            nodes {
              id
              key
              name
              namespace
              ownerType
              type {
                name
                valueType
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }'
      ],
      "getVariantMetafields" => [
        '{
          metafieldDefinitions(ownerType: PRODUCTVARIANT, first: 10,', '', ') {
            nodes {
              id
              key
              name
              namespace
              ownerType
              type {
                name
                valueType
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }'
      ],
      // "insertPrivateMetaField" => [
      //     'mutation($input: ProductInput!) {
      //         productUpdate(input: $input) {
      //             product {
      //                 id
      //             }
      //         }
      //     }'
      // ],
      // "getPrivateMetaField" => [
      //     '{
      //         product(id: "gid://shopify/Product/',
      //         '") {
      //             metafield(namespace: "',
      //             '", key: "',
      //             '") {
      //                 value
      //             }
      //         }
      //     }'
      // ],
      "insertGoogleStatusTags" => [
        'mutation tagsAdd($id: ID!, $tags: [String!]!) {
                    tagsAdd(id: $id, tags: $tags) {
                        node {
                            id
                        }
                    }
                }'
      ],
      "removeGoogleStatusTags" => [
        'mutation tagsRemove($id: ID!, $tags: [String!]!) {
                    tagsRemove(id: $id, tags: $tags) {
                        node {
                            id
                        }
                    }
                }'
      ],
    ]
  ],
  "storeFront" => [
    "apis" => [
      "allProducts"         => [
        'query productDetails @inContext(country: ', ',language:', ') {
                products(first:100,', '', ') {
                  nodes{
                    id
                    title
                    description
                    descriptionHtml
                    onlineStoreUrl
                    vendor
                    productType
                    handle
                    publishedAt
                    featuredImage{
                      url
                    }
                    variants(first:100){
                      nodes{
                        id
                        title
                        price{
                          amount
                          currencyCode
                        }
                        compareAtPrice{
                          amount
                          currencyCode
                        }
                        sku
                        quantityAvailable
                        selectedOptions{
                          name
                          value
                        }
                        barcode
                        image{
                          url
                        }
                        weight
                        weightUnit
                      }
                    }
                    images(first:10){
                      nodes{
                        url
                      }
                    }
                    options{
                      id
                      name
                      values
                    }
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }'
      ],
      "collectionProducts"  => [
        'query productDetails @inContext(country: ', ',language:', ') {
                    collection(id: "gid://shopify/Collection/', '") {
                      products(first: 100,', '', ') {
                        nodes {
                          id
                          title
                          description
                          descriptionHtml
                          onlineStoreUrl
                          vendor
                          productType
                          handle
                          publishedAt
                          featuredImage {
                            url
                          }
                          variants(first: 100) {
                            nodes {
                              id
                              title
                              price {
                                amount
                                currencyCode
                              }
                              compareAtPrice {
                                amount
                                currencyCode
                              }
                              sku
                              quantityAvailable
                              selectedOptions {
                                name
                                value
                              }
                              barcode
                              image {
                                url
                              }
                              weight
                              weightUnit
                            }
                          }
                          images(first: 10) {
                            nodes {
                              url
                            }
                          }
                          options {
                            id
                            name
                            values
                          }
                        }
                        pageInfo {
                          hasNextPage
                          endCursor
                        }
                      }
                    }
                  }
                  '
      ],
      "singleProduct"       => [
        'query productDetails @inContext(country: ', ',language:', ') {
          product(id: "gid://shopify/Product/', '") {
            id
            title
            description
            descriptionHtml
            onlineStoreUrl
            vendor
            productType
            handle
            publishedAt
            featuredImage {
              url
            }
            variants(first: 100) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                sku
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                barcode
                image {
                  url
                }
                weight
                weightUnit
              }
            }
            images(first: 10) {
              nodes {
                url
              }
            }
            options {
              id
              name
              values
            }
          }
        }'
      ],
      "productMetafield"   => [
        'query productDetails @inContext(country: ', ',language:', ') {
          product(id: "gid://shopify/Product/', '") {
            metafield(key: "', '", namespace: "', '") {
              id
              key
              namespace
              type
              value
            }
          }
        }'
      ]
    ]
  ],
  // constant string used in the app
  'strings' => [
    "graphQlProductIdentifier" => "gid://shopify/Product/",
    "graphQlVarientIdentifier" => "gid://shopify/ProductVariant/",
    "privateMetaFieldsPrefix" => env('APP_URL'),
    "googleStatusApproved" => "Approved",
    "googleStatusDisapproved" => "Disapproved",
    "googleStatusPending" => "Pending",
    'app_include' => [
      "\n{% comment %}//EasyFeed For Google Shopping Start{% endcomment %}\n",
      "\n{% comment %}//EasyFeed For Google Shopping End{% endcomment %}\n"
    ],
    'app_start_identifier' => "\n{% comment %}//EasyFeed For Google Shopping Start{% endcomment %}\n",
    'app_end_identifier' => "\n{% comment %}//EasyFeed For Google Shopping End{% endcomment %}\n",
    'app_include_before_tag' => "<meta",
    'theme_liquid_file' => "layout/theme.liquid",
    'userEmailAddress' => env('MAIL_USERNAME')
  ],
  'plans' => ['Basic', 'Small', 'Medium', 'Ultimate']

  // 'assets' => [
  //     'flags' => [
  //         "key" => "assets/alphaCurrencyFlags.png",
  //         "src" => "assets/images/flags.png"
  //     ],
  //     'css' => [
  //         "key" => "assets/alphaCurrencyCss.css",
  //         "src" => "assets/css/css.css"
  //     ]
  //     ],
  // 'defaults' => [
  //     'default_countries' => [
  //         'USD','EUR','GBP','CAD','AUD'
  //     ]
  // ]

];
