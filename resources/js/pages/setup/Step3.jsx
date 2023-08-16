import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';




const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Step3 = () => {
  /// input field { feed name } error state

  const [state, setState] = useState("active");

  const [show, setShow] = useState(true);
  const handleChange = (event) => {
    if (event.target.value.length > 0) {
      setState("");
      setShow(false);
    } else {
      setShow(true);
      setState("active");
    }
  };
  /// Age Group error state

  const [state1, setState1] = useState("active");

  const [show1, setShow1] = useState(true);
  const handleChange1 = (event) => {
    if (event.target.value.length > 0) {
      setState1("");
      setShow1(false);
    } else {
      setShow1(true);
      setState1("active");
    }
  };
  /// Gender error state

  const [state2, setState2] = useState("active");

  const [show2, setShow2] = useState(true);
  const handleChange2 = (event) => {
    if (event.target.value.length > 0) {
      setState2("");
      setShow2(false);
    } else {
      setShow2(true);
      setState2("active");
    }
  };
  /// Condition error state

  const [state3, setState3] = useState("active");

  const [show3, setShow3] = useState(true);
  const handleChange3 = (event) => {
    if (event.target.value.length > 0) {
      setState3("");
      setShow3(false);
    } else {
      setShow3(true);
      setState3("active");
    }
  };

  // product from collection show and hide radio button state

  const [status, setStatus] = React.useState(0); // 0: no show, 1: show yes, 2: show no.

  const radioHandler = (status) => {
    setStatus(status);
  };

  // Excluded Collection show and hide checkbox state

  const [checked, setChecked] = useState(false);

  const handleChecked = () => {
    // Change state to the opposite (to ture) when checkbox changes
    setChecked(!checked);
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
        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Your Feed Name</h5>
            <p class="mt-2 text-gray-600 text-sm">It must be a unique name</p>
          </div>
          <div>
            <div>
              <input
                style={{
                  borderWidth: "2px",
                  borderColor:
                    state === "active" ? "rgba(215, 44, 13, 1)" : "#008060",
                }}
                onChange={(event) => handleChange(event)}
                type="text"
                id="small-input"
                class="block w-full p-2 text-black bg-white rounded-lg focus:ring-green-900 dark:placeholder-gray-400  dark:focus:ring-green-900 "
              />

              {show && (
                <div className="flex">
                  <span>
                    <svg
                      fill="rgba(215, 44, 13, 1)"
                      width="20px"
                      viewBox="0 0 20 20"
                      class="Polaris-Icon__Svg"
                      focusable="false"
                      aria-hidden="true"
                    >
                      <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                    </svg>
                  </span>
                  <span
                    style={{ color: "rgba(215, 44, 13, 1)" }}
                    class="ml-2 block sm:inline text-base"
                  >
                    Please Enter Feed Name
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Product Id Format</h5>
            <p class="mt-2 text-gray-600 text-sm">
              Use the product ID attribute to uniquely identify each product.
              The ID won’t be shown to customers<br /> who view your products
              online.Product ID format cannot be changed if submitted feed to
              Merchant<br /> Center is approved
            </p>
          </div>
          <div className="mt-2">
            <RadioGroup

              defaultValue="SKU as Product ID (Ex:ABCD1234)"
            >
              <div className="flex items-center">
                <FormControlLabel value="SKU as Product ID (Ex:ABCD1234)" control={<Radio style={{ color: '#008060' }} />} label="SKU as Product ID (Ex:ABCD1234)" />
                <Tooltip title="App will submit product/variant SKU as Product ID. If Some of your products is Missing SKU then do not use this Option as those products could not be submitted in Feed" arrow>
                  <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                </Tooltip>
              </div>
              <div className="flex items-center">
                <FormControlLabel value="Variant ID as Product ID (Ex: 123456789)" control={<Radio style={{ color: '#008060' }} />} label="Variant ID as Product ID (Ex: 123456789)" />
                <Tooltip title="App will submit variants unique ID Numeric Value which is automatically generated by Shopify as Product ID for Shopping Feed This Numeric Value is stored under variant Id element in source code of any product" arrow>
                  <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                </Tooltip>
              </div>
              <div className="flex items-center">
                <FormControlLabel value="Global Format (Ex: Shopify_US_123456_987654)" control={<Radio style={{ color: '#008060' }} />} label="Global Format (Ex: Shopify_US_123456_987654)" />
                <Tooltip title="App will submit Shopify Native Product ID format to Google Merchant Center as item ID. Ex: shopify_US_1534976491587_13765092900931" arrow>
                  <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                </Tooltip>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Source Management</h5>
            <p class="mt-2 text-gray-600 text-sm">
              Here you can submit all of your products and also you can choose
              from your collections as well.<br /> If you want to exclude certain
              collections you can also do it here
            </p>
          </div>
          <div className="mt-2">
            <RadioGroup
              defaultValue="All Products"
            >
              <FormControlLabel Checked={status === 1} onClick={(e) => radioHandler(1)} value="All Products" control={<Radio style={{ color: '#008060' }} />} label="All Products" />
              <FormControlLabel defaultChecked={status === 2} onClick={(e) => radioHandler(2)} value="Products From Collection" control={<Radio style={{ color: '#008060' }} />} label="Products From Collection" />
            </RadioGroup>

            {status === 2 && (
              <div className="mt-2">
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={top100Films}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.title}
                    </li>
                  )}
                  style={{ width: "auto" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Custom Collections"
                      placeholder="Select Custom Collections"
                    />
                  )}
                />
              </div>
            )}

            <div>
              <div class="flex items-center mt-2">
                <FormControlLabel checked={checked} onChange={handleChecked} control={<Checkbox style={{ color: '#008060' }} />} label="Exclude Collection" />
              </div>
              {checked && (
                <div className="mt-2">
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={top10000Films}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.title}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.title}
                      </li>
                    )}
                    style={{ width: "auto" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Excluded Collection"
                        placeholder="Select Excluded Collection"
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Product Title</h5>
          </div>
          <RadioGroup
            defaultValue="Default Product Title"
            row
          >
            <FormControlLabel value="Default Product Title" control={<Radio style={{ color: '#008060' }} />} label="Default Product Title" />
            <FormControlLabel value="SEO Title" control={<Radio style={{ color: '#008060' }} />} label="SEO Title" />
          </RadioGroup>

        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Product Description</h5>
          </div>
          <RadioGroup
            defaultValue="Default Product Description"
            row
          >
            <FormControlLabel value="Default Product Description" control={<Radio style={{ color: '#008060' }} />} label="Default Product Description" />
            <FormControlLabel value="SEO Description" control={<Radio style={{ color: '#008060' }} />} label="SEO Description" />
          </RadioGroup>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Variant Submission</h5>
          </div>
          <RadioGroup
            defaultValue="All Variants"
            row
          >
            <FormControlLabel value="All Variants" control={<Radio style={{ color: '#008060' }} />} label="All Variants" />
            <FormControlLabel value="First Variant Only" control={<Radio style={{ color: '#008060' }} />} label="First Variant Only" />
          </RadioGroup>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Brand Submission</h5>
          </div>
          <RadioGroup
            defaultValue="Vendor"
            row
          >
            <FormControlLabel value="Vendor" control={<Radio style={{ color: '#008060' }} />} label="Vendor" />
            <FormControlLabel value="Domain" control={<Radio style={{ color: '#008060' }} />} label="Domain" />
          </RadioGroup>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Product Identifier Exists</h5>
          </div>
          <RadioGroup
            defaultValue="Yes"
            row
          >
            <FormControlLabel value="Yes" control={<Radio style={{ color: '#008060' }} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio style={{ color: '#008060' }} />} label="No" />
          </RadioGroup>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Barcode (ISBN, UPC, GTIN)</h5>
            <p class="mt-2 text-gray-600 text-sm">
              GTIN plays a significant role for data in Google Merchant Center
              as its major factor for improving<br /> your product listing.Products
              submitted without any GTIN are difficult to classify and may not
              be<br /> eligible for all Shopping programs or features
            </p>
          </div>
          <FormControlLabel control={<Checkbox style={{ color: '#008060' }} />} label="Do your products have GTINs ?" />
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">
              Sale Price With Compare Price
            </h5>
          </div>
          <div>
            <FormControlLabel control={<Checkbox defaultChecked style={{ color: '#008060' }} />} label="Enable sale price" />
            <Tooltip title="Tell users how much you will charge your product during a sale by using the sale price feature. Your sale price shall be reflected as the current price in ads. When you follow the conditions with the initial pricing and purchase pricing, the original price will be shown along with the selling price to allow customers to see the difference. Mobile supports the ads that show the original price and sale price" arrow>
              <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
            </Tooltip>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Product Image Option</h5>
          </div>
          <FormControlLabel control={<Checkbox defaultChecked style={{ color: '#008060' }} />} label="Use second image for product having no variant" />
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Submit Additional Images</h5>
          </div>
          <FormControlLabel control={<Checkbox defaultChecked style={{ color: '#008060' }} />} label="Check this if you would like to submit additional images" />
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">
              Default Google Product Category
            </h5>
          </div>
          <div>
            <Autocomplete
              className="Product_Category_SelectDropdoen_1"
              disablePortal
              id="combo-box-demo"
              size="small"
              options={top1100Films}
              renderInput={(params) => (
                <TextField {...params} label="Select Product Category" />
              )}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Default Age Group</h5>
          </div>
          <div>
            <select
              style={{
                borderWidth: "2px",
                borderColor:
                  state1 === "active" ? "rgba(215, 44, 13, 1)" : "#008060",
              }}
              onChange={(event) => handleChange1(event)}
              id="countries"
              class="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
            >
              <option disabled selected value>
                - - select - -
              </option>
              <option value="Newborn">Newborn</option>
              <option value="Infant">Infant</option>
              <option value="Toddler">Toddler</option>
              <option value="Kids">Kids</option>
              <option value="Adult">Adult</option>
            </select>
            {show1 && (
              <div className="flex">
                <span>
                  <svg
                    fill="rgba(215, 44, 13, 1)"
                    width="20px"
                    viewBox="0 0 20 20"
                    class="Polaris-Icon__Svg"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                  </svg>
                </span>
                <span
                  style={{ color: "rgba(215, 44, 13, 1)" }}
                  class="ml-2 block sm:inline text-base"
                >
                  Age Group Is Required.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Default Gender</h5>
          </div>
          <div>
            <select
              style={{
                borderWidth: "2px",
                borderColor:
                  state2 === "active" ? "rgba(215, 44, 13, 1)" : "#008060",
              }}
              onChange={(event) => handleChange2(event)}
              id="countries"
              class="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
            >
              <option disabled selected value>
                - - select - -
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
            {show2 && (
              <div className="flex">
                <span>
                  <svg
                    fill="rgba(215, 44, 13, 1)"
                    width="20px"
                    viewBox="0 0 20 20"
                    class="Polaris-Icon__Svg"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                  </svg>
                </span>
                <span
                  style={{ color: "rgba(215, 44, 13, 1)" }}
                  class="ml-2 block sm:inline text-base"
                >
                  Gender Is Required.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">Default Product Condition</h5>
          </div>
          <div>
            <select
              style={{
                borderWidth: "2px",
                borderColor:
                  state3 === "active" ? "rgba(215, 44, 13, 1)" : "#008060",
              }}
              onChange={(event) => handleChange3(event)}
              id="countries"
              class="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
            >
              <option disabled selected value>
                - - select - -
              </option>
              <option value="New">New</option>
              <option value="Refurbished">Refurbished</option>
              <option value="Used">Used</option>
            </select>
            {show3 && (
              <div className="flex">
                <span>
                  <svg
                    fill="rgba(215, 44, 13, 1)"
                    width="20px"
                    viewBox="0 0 20 20"
                    class="Polaris-Icon__Svg"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                  </svg>
                </span>
                <span
                  style={{ color: "rgba(215, 44, 13, 1)" }}
                  class="ml-2 block sm:inline text-base"
                >
                  Condition Is Required.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
          <div>
            <h5 className="font-normal text-lg">UTM Tracking Parameters</h5>
            <p class="mt-2 text-gray-600 text-sm">
              Once a shopper clicks on any of your products from Google, these
              parameters will be appended to<br /> the end of the products link.You'll be able to see a breakdown of these data in your Google
              Analytics
            </p>
          </div>
          <div className="flex justify-between flex-wrap mt-4">
            <input
              placeholder="Campaign Name"
              type="text"
              id="small-input"
              class="text-black border h-12 mt-2 bg-white rounded-lg"
            />
            <input
              placeholder="Campaign Source"
              type="text"
              id="small-input"
              class="text-black border h-12 mt-2 bg-white rounded-lg"
            />
            <input
              placeholder="Campaign Medium"
              type="text"
              id="small-input"
              class="text-black border h-12 mt-2 bg-white rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];
const top10000Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];
const top1100Films = [
  { label: "The Shawshank Redemption", value: 1994 },
  { label: "The Godfather", value: 1972 },
  { label: "The Godfather: Part II", value: 1974 },
  { label: "The Dark Knight", value: 2008 },
  { label: "12 Angry Men", value: 1957 },
  { label: "Schindler's List", value: 1993 },
  { label: "Pulp Fiction", value: 1994 },
  { label: "Amadeus", value: 1984 },
  { label: "To Kill a Mockingbird", value: 1962 },
  { label: "Toy Story 3", value: 2010 },
  { label: "Logan", value: 2017 },
  { label: "Full Metal Jacket", value: 1987 },
  { label: "Dangal", value: 2016 },
  { label: "The Sting", value: 1973 },
  { label: "2001: A Space Odyssey", value: 1968 },
  { label: "Singin' in the Rain", value: 1952 },
  { label: "Toy Story", value: 1995 },
  { label: "Bicycle Thieves", value: 1948 },
  { label: "The Kid", value: 1921 },
  { label: "Inglourious Basterds", value: 2009 },
  { label: "Snatch", value: 2000 },
  { label: "3 Idiots", value: 2009 },
  { label: "Monty Python and the Holy Grail", value: 1975 },
];
