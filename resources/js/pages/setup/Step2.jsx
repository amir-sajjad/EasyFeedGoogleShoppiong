import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';

const Step2 = () => {
  const [value, setValue] = useState("");
  const handleSelect = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="m-4">
      <div
        style={{
          boxShadow:
            "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
        }}
        class="bg-white rounded-lg p-4"
      >
        <div className="grid lg:grid-cols-2 gap-2 pb-4">
          <div>
            <h5 className="font-normal text-lg">Shopify Markets<span class="inline-block blink px-1 ml-2 text-center align-baseline font-medium bg-gradient-to-r from-[#fe6447] to-[#f49989] text-white rounded-md text-sm">New</span></h5>
            <p class="mt-2 text-gray-600 text-sm">
              The shopping ads will only appear on your selected market
            </p>
          </div>
          <div>
            <div className="mb-2">
              <p>Following options are determine based on your store</p>
              <div>
                <select
                  onChange={handleSelect}
                  id="countries"
                  class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                >
                  <option disabled selected value>
                    - - Select - -
                  </option>
                  <option value="value 1">Option 1</option>
                  <option value="value">Option 2</option>
                  <option value="value">option 3</option>
                </select>
              </div>
            </div>
            {/* if value 1 is selected then show this */}
            {value === "value 1" && (
              <div className="flex justify-between flex-wrap">
                <div>
                  <select
                    id="countries"
                    class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                  >
                    <option disabled selected value>
                      - - Choose a country - -
                    </option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                  </select>
                </div>
                <div>
                  <select
                    id="countries"
                    class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                  >
                    <option disabled selected value>
                      - - Choose a language - -
                    </option>
                    <option value="US">Hindi</option>
                    <option value="CA">Urdu</option>
                    <option value="FR">Italian</option>
                    <option value="DE">French</option>
                  </select>
                </div>
                <div>
                  <select
                    id="countries"
                    class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                  >
                    <option disabled selected value>
                      - - Choose a Currency - -
                    </option>
                    <option value="US">Pak Ruppee</option>
                    <option value="CA">Dollor</option>
                    <option value="FR">Euro</option>
                    <option value="DE">Chinese Yuan</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-2 pb-4">
          <div>
            <h5 className="font-normal text-lg">Shipping Settings</h5>
            <p class="mt-2 text-gray-600 text-sm">
              Set up your shipping costs based on how you charge shipping
            </p>
          </div>
          <div>
            <RadioGroup
              defaultValue="Setup Free Shipping"
            >
              <FormControlLabel value="Setup Free Shipping" control={<Radio style={{color:'#008060'}} />} label="Setup Free Shipping" />
              <FormControlLabel value="other" control={<Radio style={{color:'#008060'}} />} label="Manually Configure Shipping in Merchant Center" />
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
