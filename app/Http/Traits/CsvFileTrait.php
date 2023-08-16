<?php

namespace App\Http\Traits;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

trait CsvFileTrait
{
    public function addSelectToQuery(array $fieldsToExport)
    {
        $data = [];
        $editedTableData = config('CsvFile.editedProductsColums');
        $imagesTableData = config('CsvFile.productImagesColums');
        $productLabelsTableData = config('CsvFile.productLabels');

        foreach ($fieldsToExport as $key => $value) :
            if (in_array($value, $editedTableData) || $value == 'productHighlights') :
                $data['edited_products'][] = $value;
            elseif (in_array($value, $imagesTableData)) :
                $data['images'][] = $value;
            elseif (in_array($value, $productLabelsTableData)) :
                $data['labels'][] = $value;
            else :
                $data['variantData'][] = $value;
            endif;
        endforeach;

        return $data;
    }

    public function renameCsvHeader(array $headersFields = null)
    {
        $matchColumName = config('CsvFile.mapKeys');
        $UPCFields = array_map('ucwords', $headersFields);

        $CamelCaseFields = array_map(function ($singleField) use ($matchColumName) {
            $smallCaseIndex = strtolower($singleField[0]);
            $restString = substr($singleField, 1);
            $fullString = $smallCaseIndex . $restString;
            return array_key_exists($fullString, $matchColumName) ? $matchColumName[$fullString] : $fullString;
        }, $UPCFields);

        $CamelCaseFields = str_replace(' ', '', array_values($CamelCaseFields));
        return $CamelCaseFields;
    }

    /*---------Function For Verifying/Validating Header Name Of CSV/Zip File[ Working-Optimized ]-----------*/

    public function verifyHeaderFieldsOfCreateCsv(array $headersFields = null)
    {
        $matchColumName = config('CsvFile.matchColumName');
        $UPCFields = array_map('ucwords', $headersFields);
        $CamelCaseFields = array_map(function ($singleField) use ($matchColumName) {
            $smallCaseIndex = strtolower($singleField[0]);
            $restString = substr($singleField, 1);
            $fullString = $smallCaseIndex . $restString;

            return array_key_exists($fullString, $matchColumName) ? $matchColumName[$fullString] : $fullString;
        }, $UPCFields);

        //Final Camel Case Fields Name
        $CamelCaseFields = str_replace(' ', '', array_values($CamelCaseFields));

        //Required Fields Names To Export
        $requiredFields = ['feedId', 'productId', 'variantId', 'title'];

        $missingFields = array_diff($requiredFields, $CamelCaseFields);

        if (!empty($missingFields)) {
            return ['status' => 'error', 'error' => $missingFields, 'message' => 'These Fields are Required: ' . implode(', ', $missingFields)];
        }
        $CamelCaseFields = array_slice($CamelCaseFields, 3);

        return $CamelCaseFields;
    }

    /*---------Function For Verifying Header Name For Reading Csv File [ Working ]-----------*/

    public function verifyHeaderFieldsOfReadCsv(array $headersFields = null)
    {
        $errorFields = [];
        $allColumsName = config('CsvFile.headerFieldsToReadCsv');
        // $allColumsName = array_map('strtolower', config('CsvFile.headerFieldsToReadCsv'));

        $allColumsName = array_map(function ($value) {
            // return trim(ucwords($value)); //Trim And Uppercase the first character of each word
            // return  strtolower(preg_replace('/\s{2,}/', ' ', trim(ucwords($value)))); //Trim And Uppercase the first character of each word
            return preg_replace('/\s{2,}/', ' ', trim(ucwords(str_replace('"', '', $value))));
        }, $allColumsName);


        $matchColumName = config('CsvFile.matchColumName');
        $UPCFields = array_map(function ($value) {
            // return trim(ucwords($value)); //Trim And Uppercase the first character of each word
            // return  strtolower(preg_replace('/\s{2,}/', ' ', trim(ucwords($value)))); //Trim And Uppercase the first character of each word
            return preg_replace('/\s{2,}/', ' ', trim(ucwords(str_replace('"', '', $value))));
        }, $headersFields);

        $UPCFields = array_filter($UPCFields);
        $errorFields = array_diff($UPCFields, array_intersect($UPCFields, $allColumsName));

        // dd(array_diff($UPCFields, array_intersect($UPCFields, $allColumsName)), array_intersect($UPCFields, $allColumsName));


        if (count($errorFields) > 0) {
            return ['status' => 'error', 'error' => array_values($errorFields), 'message' => 'Invalid Fields Name'];
        }
        $CamelCaseFields = array_map(function ($singleField) use ($matchColumName) {
            $smallCaseIndex = strtolower($singleField[0]);
            $restString = substr($singleField, 1);
            $fullString = $smallCaseIndex . $restString;
            return array_key_exists($fullString, $matchColumName) ? $matchColumName[$fullString] : $fullString;
        }, $UPCFields);
        //Final Camel Case Fields Name
        $CamelCaseFields = str_replace(' ', '', array_values($CamelCaseFields));
        //Required Fields Names To Import A Csv
        $requiredFields = [
            // 'feedId', 'productId', 'variantId',
            'appId'
        ];
        $missingFields = array_diff($requiredFields, $CamelCaseFields);
        return (count($missingFields) == 0) ? $CamelCaseFields : ['status' => 'error', 'error' => $missingFields, 'message' => 'These Fields are Required: ' . implode(', ', $missingFields)];
    }

    /*---------Function For Sending Email To Merchant with Zip File[ Working ]-----------*/
    public function sendMailWithAttachmentPostMark($attachmentFile)
    {
        $data['email'] = 'nabeda8466@kixotic.com';
        $data['title'] = 'Export of your products';
        $data['body'] = 'Your products have finished exporting and are ready to download...........';
        $files = [
            $attachmentFile,
        ];

        Mail::send('myTestMail', $data, function ($message) use ($data, $files) {
            $message->to($data['email'])
                ->subject($data['title']);
            foreach ($files as $file) {
                $message->attach($file);
            }
        });

        return 'Mail sent successfully';
    }

    public function sendMailWithAttachmentMailerSend($attachmentFile, $storeEmail)
    {
        try {
            // Method To Send Mail With SMTP With Custom Blade View Start
            $data['mailerName'] = 'Easy Feed For Google Shopping';
            $data['fromMail'] = 'support@alpha-developer.com';
            $data['toMail'] = $storeEmail;
            $data['subject'] = 'Export of your products';
            $data['body'] = 'Your products have finished exporting and are ready to download...........';
            $files = [
                $attachmentFile,
                // storage_path('app/public/media/searchedProducts[pk.sapphireonline.pk]-2022_7_13_10_57_31.csv'),
            ];
            $Mailresponse = Mail::send('email.test', $data, function ($message) use ($data, $files) {
                $message->to($data['toMail'])
                    ->subject($data['subject']);
                $message->from($data['fromMail'], $data['mailerName'])
                    ->text('email.textViewForMail');
                foreach ($files as $file) {
                    $message->attach($file);
                }
            });

            return $Mailresponse;
        } catch (\Exception $e) {
            info($e->getMessage());

            return $e->getMessage();
        }
    }

    /*---------Function For Tranforming DB Data For Creating CSV [ Working ]-----------*/
    /*---------START-----------*/

    public function convertJsonToString($value)
    {
        if ($value != null) {

            $string = array_values(json_decode($value, true));

            return implode(':', [$string[0], $string[1]]);
        }

        return $value;
    }

    public function convertJsonInstallmentToString($value)
    {
        if ($value != null) {
            $string = json_decode($value, true);

            return implode(':', [$string['months'], $string['amount']['value'], $string['amount']['currency']]);
        }

        return $value;
    }

    public function convertJsonProductHighlightsToString($value)
    {
        $highlights = ($value != null) ? json_decode($value, true) : [];
        $highlight_values = array_slice($highlights, 0, 6);
        $highlight_values = array_pad($highlight_values, 6, null);
        $highlight_keys = array_map(function ($i) {
            return "productHighlight$i";
        }, range(1, 6));
        $newProduct = array_combine($highlight_keys, $highlight_values);

        return $newProduct;
    }

    public function convertJsonSubscriptionCostToString($value)
    {
        if ($value != null) {
            $string = json_decode($value, true);

            return implode(':', [$string['period'], $string['periodLength'], $string['amount']['value'], $string['amount']['currency']]);
        }

        return $value;
    }
    /*---------END-----------*/


    /*---------Functions To Validate Csv File Data For DataBase Tables And Google Feed [ Working--]READ CSV-----------*/

    // return $this->validateNumber($fieldName, $isNumber, $charLimit, $isArray);
    private function limitValue($fieldName, $isNumber = null, $charLimit = null, $isArray = null)
    {
        if ($isNumber === true) {
            if (ctype_digit($fieldName)) {
                // return Str::limit(round($fieldName, 0), $strLimit);
                return substr(round($fieldName, 0), 0, $charLimit);
            }
        } elseif ($isArray === true) {
            // return [Str::limit($fieldName, $charLimit)];
            return [substr($fieldName, 0, $charLimit)];
        } else {
            return substr($fieldName, 0, $charLimit);
            // return Str::limit($fieldName, $charLimit);
        }
    }

    private function validateEditedProductsTable($key = null, $value = null)
    {
        $sizeSystemCheck = ['AU', 'BR', 'CN', 'DE', 'EU', 'FR', 'IT', 'JP', 'MEX', 'UK', 'US'];
        $sizeTypeCheck = ['regular', 'petite', 'plus', 'tall', 'big', 'maternity'];
        $energyEfficiencyCheck = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
        $energyEfficiencyFields = ['energyEfficiencyClass', 'maxEnergyEfficiencyClass', 'minEnergyEfficiencyClass'];
        $handlingTimeAndMultipack = ['maxHandlingTime', 'minHandlingTime', 'multipack'];
        $lwhwCheck = ['shippingHeight', 'shippingWidth', 'shippingLength', 'shippingWeight', 'productHeight', 'productLength', 'productWidth', 'productWeight'];
        if ($key == 'color' || $key == 'material' || $key == 'pattern') {
            return  Str::limit($value, '95');
        } elseif ($key === 'sizeSystem') {
            return $this->checkIndex($value, true, $sizeSystemCheck) ?? null;
        } elseif ($key === 'identifierExists') {
            $value = strtolower($value);
            if ($value == 'true' || $value == 'yes' || $value == '1') {
                return true;
            } elseif ($value == 'false' || $value == 'no' || $value == '0') {
                return false;
            } else {
                return null;
            }
        } elseif ($key === 'pause') {
            $value = strtolower($value);

            return $value === 'ads' || $value === 'all' ? $value : null;
        } elseif ($key === 'sizeType') {
            return $this->checkIndex($value, false, $sizeTypeCheck) ?? null;
        } elseif (in_array($key, $energyEfficiencyFields)) {
            return $this->checkIndex($value, true, $energyEfficiencyCheck) ?? null;
            // to be continueeeee........
        } elseif (in_array($key, $lwhwCheck)) {
            $pattern = '/[:]/';
            // $productLWHW = "12:in";
            $my_array = preg_split($pattern, $value);
            if (count($my_array) === 2) {
                // $values['value'] = (int) ($my_array[0]);
                $values['value'] = ($my_array[0]);
                $values['unit'] = $my_array[1];
                return json_encode($values);
            } else {
                return null;
            }
        } elseif (in_array($key, $handlingTimeAndMultipack)) {
            return $this->limitValue($value, true, '10', false);
        } elseif ($key == 'taxCategory' || $key == 'shippingLabel' || $key == 'adsGrouping') {
            return $this->limitValue($value, false, 100, false);
        } elseif ($key === 'adult') {
            return $this->validateTrueOrFalse($value, $key);
        } elseif ($key === 'isBundle') {
            return $this->validateTrueOrFalse($value, $key);
        } elseif ($key === 'transitTimeLabel') {
            return  $this->limitValue($value, false, 100, false);
        } elseif ($key === 'subscriptionCost') {
            $pattern = '/[:]/';
            // $subscriptionCost = "month:14:38.00:EUR";
            $my_array = preg_split($pattern, $value);
            if (count($my_array) === 4) {
                $period = strtolower($my_array[0]);
                if ($period === "month" || $period === "year") {
                    $values['period'] = $period;
                    $values['periodLength'] = $my_array[1];
                    $values['amount'] = ['value' => $my_array[2], 'currency' => $my_array[3]];
                    return json_encode($values);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } elseif ($key === 'promotionIds') {
            $pattern = '/[,]/';
            // $promotionIds = "myPromo1,BlackFriday";
            $my_array = preg_split($pattern, $value);
            $values = array_slice(array_filter($my_array), 0, 10);
            return json_encode($values);
        } elseif ($key === 'salePriceEffectiveDate') {
            $parts = preg_split('/\//', $value);
            return (count($parts) == 2) ? $value : null;
        } elseif ($key === 'installment') {
            $pattern = '/[:]/';
            // $installment = "12:18:EUR";
            $my_array = preg_split($pattern, $value);
            if (count($my_array) === 3) {
                $values['months'] = $my_array[0];
                $values['amount'] = ['value' => $my_array[1], 'currency' => $my_array[2]];

                return json_encode($values);
            } else {
                return null;
            }
        } elseif ($key === 'loyaltyPoints') {
            $pattern = '/[:]/';
            // $installment = "Program A:100:0.5";
            $my_array = preg_split($pattern, $value);
            if (count($my_array) === 3) {
                $values['name'] = $my_array[0];
                $values['pointsValue'] = $my_array[1];
                $values['ratio'] = (int) $my_array[2];

                return json_encode($values);
            } else {
                return null;
            }
        } elseif ($key === 'unitPricingMeasure' || $key === 'unitPricingBaseMeasure' || $key === 'costOfGoodsSold') {
            $pattern = '/[:]/';
            // $unitPricingMeasure = "10:lbs";
            $my_array = preg_split($pattern, $value);
            if (count($my_array) === 2) {
                if ($key === 'costOfGoodsSold') {
                    $values['value'] = $my_array[0];
                    $values['currency'] = $my_array[1];

                    return json_encode($values);
                }
                $values['value'] = ($my_array[0]);
                $values['unit'] = $my_array[1];

                return json_encode($values);
            } else {
                return null;
            }
        } elseif ($key === 'expirationDate') {
            $date = $value;
            $regex_pattern = '/^(?:\d{1,2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}|(?:\d{1,2}\/)?\d{1,2}\/\d{2,4}(?:\s\d{1,2}:\d{2}\s?(?:AM|PM))?|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{1,2}(?:st|nd|rd|th)?,\s\d{4}|(?:\d{1,2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2,4}))$/i';
            if (preg_match($regex_pattern, $date, $matches)) {
                $day = "";
                $month = "";
                $year = "";
                if (strpos($matches[0], '-') !== false) {
                    // format dd-Mon-yyyy or dd-Mon-yy
                    $date_parts = explode('-', $matches[0]);
                    if (strlen($date_parts[2]) == 2) {
                        $date_parts[2] = '20' . $date_parts[2];
                    }
                    $day = $date_parts[0];
                    $month = date('m', strtotime($date_parts[1]));
                    $year = $date_parts[2];
                } elseif (strpos($matches[0], ',') !== false) {
                    // format Friday, April 21, 2023
                    $date_parts = explode(' ', str_replace(',', '', $matches[0]));
                    $day = $date_parts[1];
                    $month = date('m', strtotime($date_parts[0]));
                    $year = $date_parts[2];
                } elseif (strpos($matches[0], '/') !== false) {
                    // format mm/dd/yy or mm/dd/yyyy or mm/dd/yyyy hh:mm AM/PM
                    $date_parts = explode('/', $matches[0]);
                    if (count($date_parts) == 2) {
                        $month = $date_parts[0];
                        $day = $date_parts[1];
                        $year = date('Y');
                    } else {
                        $month = $date_parts[0];
                        $day = substr($date_parts[1], 0, 2);
                        $year = ($date_parts[2] < 100 ? '20' : '') . $date_parts[2];
                        if (isset($date_parts[3])) {
                            $time_parts = explode(' ', $date_parts[3]);
                            $hour = str_pad($time_parts[0], 2, '0', STR_PAD_LEFT);
                            $minute = str_pad(substr($time_parts[1], 0, 2), 2, '0', STR_PAD_LEFT);
                            $ampm = strtoupper(substr($time_parts[1], -2));
                            if ($ampm == 'PM' && $hour < 12) {
                                $hour += 12;
                            }
                            $hour = str_pad($hour, 2, '0', STR_PAD_LEFT);
                            $iso_time = $hour . ':' . $minute;
                        }
                    }
                }
                // $iso_date = $year . '-' .
                $iso_date = $year . '-' . $month . '-' . $day;
                // return formatted date
                return $iso_date;
            } else {
                return null;
            }

            return $value;
        } elseif ($key === 'sizes') {
            return  $this->limitValue($value, false, 100, false);
        } elseif ($key === 'shipping') {
            $values = explode(':', $value);
            if (strlen($value) < 100) :
                if (isset($values[1]) && isset($values[2]) && isset($values[3])) :
                    $data = [
                        'price' => [
                            'value' => isset($values[1]) ? $values[1] : null,
                            'currency' => isset($values[2]) ? $values[2] : null
                        ],
                        'country' => isset($values[0]) ? $values[0] : null,
                        'service' => isset($values[3]) ? $values[3] : null,
                        'locationId' => isset($values[4]) ? $values[4] : null,
                        'locationGroupName' => isset($values[5]) ? $values[5] : null,
                        'minHandlingTime' => isset($values[6]) ? $values[6] : null,
                        'maxHandlingTime' => isset($values[7]) ? $values[7] : null,
                        'minTransitTime' => isset($values[8]) ? $values[8] : null,
                        'maxTransitTime' => isset($values[9]) ? $values[9] : null
                    ];
                    $data = array_filter($data);
                    $json = json_encode($data);
                    return $json;
                endif;
            endif;
            // dd($value,$json);
            return null;
        }
    }

    private function validateShopVariantsTable($key = null, $value = null)
    {
        $ageGroupCheck = ['newborn', 'infant', 'toddler', 'kids', 'adult'];
        $genderCheck = ['male', 'female', 'unisex'];
        $productConditionCheck = ['new', 'refurbished', 'used'];
        $validateTable = [
            // 'title' => htmlentities($this->limitValue($value, false, 150, false)),
            // 'description' => htmlentities($this->limitValue($value, false, 4990, false)),
            'title' => ($this->limitValue($value, false, 150, false)),
            'description' => ($this->limitValue($value, false, 4990, false)),
            'ageGroup' => $this->checkIndex($value, false, $ageGroupCheck),
            'gender' => $this->checkIndex($value, false, $genderCheck),
            'productCondition' => $this->checkIndex($value, false, $productConditionCheck),
            'condition' => $this->checkIndex($value, false, $productConditionCheck),
            'image' => $this->limitValue($value, false, 2000, false),
            'score' => null,
            'barcode' => $this->limitValue($value, false, 14, false),
        ];
        $value = $this->trimSpaces($value);
        if (array_key_exists($key, $validateTable)) {
            return $validateTable[$key];
        } elseif ($key === 'product_category_id') {
            $check_product_category_id = $this->limitValue($value, true, 10, false);
            if ($check_product_category_id > 1 && $check_product_category_id <= 5582) {
                return $check_product_category_id;
            }
        }

        return $this->limitValue($value, false, 100, false) ?? null;
    }

    /*---------Functions To Remove White Spaces And Trim ExtraSpaces From Csv File Data [ Working-- ]READ CSV-----------*/
    private function trimSpaces($value = null)
    {
        $value = preg_replace('/\s+/', ' ', $value); //Replace Extra Spaces In String
        return trim($value); //Replace Extra Spaces In String
    }

    /*---------Function To Add Data To Seprate Array Fileds Related To Their DB TABLE  Of Csv File Data [ Working-- ]READ CSV-----------*/
    private function checkIndex($fields = null, $toUpperCase = false, $searchInArray = null)
    {
        if ($toUpperCase === true) {
            $fields = strtoupper($fields);
        } else {
            $fields = strtolower($fields);
        }
        if (in_array($fields, $searchInArray)) {
            return $fields;
        }
    }

    /*---------Function To Return Bolean[True Or False] For Adult And IsBundle Field [ Working-- ]READ CSV-----------*/

    private function validateTrueOrFalse($field, $key)
    {
        $field = strtolower($field);
        if ($field == 'true' || $field == 'yes' || $field == '1') {
            return '1';
        } elseif ($field == 'false' || $field == 'no' || $field == '0') {
            return '0';
        } else {
            return null;
        }
    }

    /*---------Function To Validate If Value is Number [Final And Tested]-----------*/

    private function validateNumber($fieldName, $isNumber, $strLimit, $isArray)
    {
        if ($isNumber === true) {
            if (ctype_digit($fieldName)) {
                // return Str::limit(round($fieldName, 0), $strLimit);
                return substr(round($fieldName, 0), 0, $strLimit);
            }
        } elseif ($isArray === true) {
            // return [Str::limit($fieldName, $strLimit)];
            return [substr($fieldName, 0, $strLimit)];
        } else {
            return substr($fieldName, 0, $strLimit);
            // return Str::limit($fieldName, $strLimit);
        }
    }

    /*---------Function To Validate Image Links [ Working-----]Testing Purpose Only-----------*/

    // private function validateImageLink($imageLink = null, $fieldName)
    // {
    //     $validationUrl = "https://cdn.shopify.com";
    //     if (strpos($imageLink, $validationUrl) !== false) :
    //         echo "$imageLink contains $validationUrl";
    //     endif;
    // }

    /*---------Functions To Filter Array For Empty Fileds And Validate Array Of Csv File Data [ Working-- ]READ CSV-----------*/

    private function filterAndValidate($fields = null, $fieldName = null, $length = null, $strLength = null)
    {
        $row[$fieldName] = array_filter(array_values($fields));
        $row[$fieldName] = array_slice(array_map(function ($element) use ($strLength) {
            return Str::limit($element, $strLength);
        }, $row[$fieldName]), 0, $length);

        return $row[$fieldName];
    }



    /*---------[ Working-- Not Using Currently] Function To make Feed Data From Returned Database From Csv File Data READ CSV-----------*/

    public function makeFeedData($product = null)
    {
        $values = [];
        $jsonDecodeValues = ['costOfGoodsSold', 'promotionIds', 'unitPricingMeasure', 'unitPricingBaseMeasure', 'installment', 'loyaltyPoints', 'subscriptionCost', 'shippingHeight', 'shippingWidth', 'shippingLength', 'shippingWeight', 'productHeight', 'productLength', 'productWidth', 'productWeight'];
        if (is_array($product)) {
            foreach ($product as $key => $value) {
                if (in_array($key, ['color', 'material', 'pattern'])) {
                    $values[$key] = Str::limit($value, '95');
                } elseif (in_array($key, ['productId', 'variantId', 'shop_product_variant_id', 'user_id', 'feed_setting_id'])) {
                    continue;
                } elseif ($key === 'barcode') {
                    $values['gtin'] = $value;
                } elseif ($key === 'productCondition' || $key === 'condition') {
                    $values['condition'] = $value;
                } elseif ($key === 'additionalImageLinks') {
                    $values['additionalImageLinks'] = $this->filterAndValidate($value, 'additionalImageLinks', 9, 2000);
                } elseif ($key === 'customLabel') {
                    $count = 0;
                    foreach ($value as $key => $label) {
                        if ($count == 4) {
                            $values['customLabel' . $count] = $label;
                            break;
                        }
                        $values['customLabel' . $count] = $label;
                        $count++;
                    }
                } elseif ($key === 'productHighlights') {
                    $values['productHighlights'] = json_decode($value);
                } elseif ($key === 'product_category_id') {
                    // $product_category_value = ProductCategory::find($value);
                    /*    $product_category_value = $this->productCategories->where('id', $value)->first();
                    if (! empty($product_category_value)) {
                        $values['googleProductCategory'] = $product_category_value->value;
                    } */
                } elseif ($key === 'image') {
                    $values['imageLink'] = $value;
                } elseif ($key === 'identifierExists') {
                    $values['identifierExists'] = $value;
                } elseif ($key === 'productTypes') {
                    $values[$key] = $this->limitValue($value, false, '750', true);
                } elseif ($key === 'maxHandlingTime' || $key === 'multipack') {
                    $values[$key] = $this->limitValue($value, false, '50', false);
                } elseif (in_array($key, $jsonDecodeValues)) {
                    $values[$key] = json_decode($value, true);
                } else {
                    $values[$key] = $value;
                }
            }

            return $values;
        }
    }

    private function makeCompleteProductData(&$completeProduct, $mappedKeys)
    {
        if (isset($completeProduct['description'])) :
            $completeProduct['description'] = strip_tags($completeProduct['description']);
        endif;
        $completeProduct['easyFeedId'] = "EasyFeed:{$completeProduct['feed_setting_id']}:{$completeProduct['variantId']}";
        $completeProduct = Arr::except($completeProduct, ['feed_setting_id', 'variantId', 'productId', 'productHighlights']);
        $completeProduct = array_replace(array_flip($mappedKeys), $completeProduct);
    }
    private function makeCsvFileRowData($completeProduct)
    {
        $productValues = array_values($completeProduct); // Replace any consecutive newline characters with a single newline character
        $productValues = preg_replace('/\n+/', "\n", $productValues); // Convert the line to UTF-8 encoding
         return  mb_convert_encoding($productValues, 'UTF-8'); // // Write the modified line to the temporary file
    }

    private function writeProductToCsv($products,$fields,$mappedKeys,$requiredFields,&$file,$unitValues,$fieldsToExport){
        $images = $editedProducts = $labelsData = $highlight = [];
        $editedTableData = config('CsvFile.editedProductsColums');
        $productLabelsTableData = config('CsvFile.productLabels');
        $imagesTableData = config('CsvFile.productImagesColums');
        $collectionOfProducts = collect($products->toArray())
            ->each(function ($product, $key) use ($fields, $highlight, $mappedKeys, $requiredFields, $file, $unitValues, $labelsData, $productLabelsTableData, $imagesTableData, $editedTableData, $images, $editedProducts, $fieldsToExport) {
                //Find Common Keys And Get Data from Related Table
                $imageFound = array_intersect($imagesTableData, $fieldsToExport);
                $editedProductFound = array_intersect($editedTableData, $fieldsToExport);
                $productLabelsFound = array_intersect($productLabelsTableData, $fieldsToExport);
                $variantData = Arr::only($product, [...$requiredFields['variantData'], ...['feed_setting_id', 'productId', 'variantId']]);
                if (in_array("productHighlights", $fieldsToExport)) :
                    if (isset($product['edited_product'])) :
                        $highlight["productHighlights"] = $product['edited_product']["productHighlights"];
                    else :
                        $highlight["productHighlights"] = null;
                    endif;
                endif;
                if (count($imageFound) > 0) :
                    if (isset($product['product_image'])) :
                        $images = Arr::only($product['product_image'], $imageFound);
                    else :
                        $images = array_fill_keys($imageFound, null);
                    endif;
                endif;
                if (count($editedProductFound) > 0) :
                    if (isset($product['edited_product'])) :
                        $editedProducts = Arr::only($product['edited_product'], $editedProductFound);
                    else :
                        $editedProducts = array_fill_keys($editedProductFound, null);
                    endif;
                endif;
                if (count($productLabelsFound) > 0) :
                    if (isset($product['product_label'])) :
                        $labelsData = Arr::only($product['product_label'], $productLabelsFound);
                    else :
                        $labelsData = array_fill_keys($productLabelsFound, null);
                    endif;
                endif;
                $finalProduct = [...$variantData, ...$images, ...$highlight, ...$editedProducts, ...$labelsData];
                $completeProduct = [];
                foreach ($finalProduct as $key => $value) :
                    if (in_array($key, $unitValues)) :
                        $completeProduct[$key] = $this->convertJsonToString($value);
                    elseif ($key == "subscriptionCost") :
                        $completeProduct[$key] = $this->convertJsonSubscriptionCostToString($value);
                    elseif ($key == "productHighlights") :
                        $completeProduct = array_merge($finalProduct, $this->convertJsonProductHighlightsToString($value));
                    elseif ($key == "promotionIds") :
                        $completeProduct[$key] = ($value != null) ? implode(',', json_decode($value, true)) : null;
                    elseif ($key == "installment") :
                        $completeProduct[$key] = $this->convertJsonInstallmentToString($value);
                    elseif ($key == "shipping") :
                        if ($value != null) :
                            $string = json_decode($value, true);
                            $result = implode(':', array_map(function ($field) use ($string) {
                                $value = $string;
                                foreach (explode('.', $field) as $key) :
                                    $value = $value[$key] ?? null;
                                endforeach;
                                return $value;
                            }, $fields));
                            $completeProduct[$key] = $result;
                        else :
                            $completeProduct[$key] = null;
                        endif;
                    else :
                        $completeProduct[$key] = $value;
                    endif;
                endforeach;
                $this->makeCompleteProductData($completeProduct, $mappedKeys);
                $productValues = $this->makeCsvFileRowData($completeProduct);
                // fwrite($tmpFile, $line);
                fputcsv($file, $productValues);
            });
    }

    private function extractVariantAndFeedId($id){
        list(, $feedId, $variantId) = explode(":", $id);
        return [(int)$feedId,$variantId];
    }
}
