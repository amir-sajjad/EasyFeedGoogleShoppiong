import React, { useState, useEffect } from "react";
import "./Pricing.css";
import { useNavigate } from 'react-router-dom';
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";
import ConfettiExplosion from "react-confetti-explosion";
import CircularProgress from '@mui/material/CircularProgress';
import axioshttp from "../../axioshttp";
import ReactGA from "react-ga4";
// import sound from '../../coupan.mp3'


const mp1 = 4.99, mp2 = 6.99, mp3 = 9.99, mp4 = 11.99, mp5 = 12.99, mp6 = 19.99, mp7 = 24.99, mp8 = 29.99, mp9 = 34.99, mp10 = 39.99, mp11 = 49.99, mp12 = 54.99, mp13 = 59.99, mp14 = 69.99, mp15 = 79.99, mp16 = 89.99, mp17 = 99.99, mp18 = 129.99, mp19 = 149.99, mp20 = 199.99, mp21 = 249.99, mp22 = 399.99

const prices = {
  15: mp14,
  16: mp15,
  17: mp16,
  18: mp17,
  19: mp18,
  20: mp19,
  21: mp20,
  22: mp21,
  23: mp22
};
const planIdMap = {
  15: {
    62.99: 47,
    55.99: 48,
    52.49: 49,
    48.99: 50,
    34.99: 51,
  },
  16: {
    71.99: 52,
    63.99: 53,
    59.99: 54,
    55.99: 55,
    39.99: 56,
  },
  17: {
    80.99: 57,
    71.99: 58,
    67.49: 59,
    62.99: 60,
    44.99: 61,
  },
  18: {
    89.99: 62,
    79.99: 63,
    74.99: 64,
    69.99: 65,
    49.99: 66,
  },
  19: {
    116.99: 67,
    103.99: 68,
    97.49: 69,
    90.99: 70,
    65.00: 71,
  },
  20: {
    134.99: 72,
    119.99: 73,
    112.49: 74,
    104.99: 75,
    75.00: 76,
  },
  21: {
    179.99: 77,
    159.99: 78,
    149.99: 79,
    139.99: 80,
    100.00: 81,
  },
  22: {

    224.99: 82,
    199.99: 83,
    187.49: 84,
    174.99: 85,
    125.00: 86,
  },
  23: {
    359.99: 87,
    319.99: 88,
    299.99: 89,
    279.99: 90,
    200.00: 91,
    100.00: 92,
  },
};

const planIdAndPlanName = {
  1: "3 Feed - 35000 SKU'S (Standard Monthly)",
  2: "1 Feed - 500 SKU'S Monthly",
  3: "1 Feed - 1000 SKU'S Monthly",
  4: "1 Feed - 2000 SKU'S Monthly",
  5: "1 Feed - 3000 SKU'S Monthly",
  6: "1 Feed - 5000 SKU'S Monthly",
  7: "2 Feed - 10000 SKU'S Monthly",
  8: "2 Feed - 20000 SKU'S Monthly",
  9: "2 Feed - 25000 SKU'S Monthly",
  10: "2 Feed - 30000 SKU'S Monthly",
  11: "3 Feed - 35000 SKU'S Monthly",
  12: "3 Feed - 40000 SKU'S Monthly",
  13: "3 Feed - 45000 SKU'S Monthly",
  14: "3 Feed - 50000 SKU'S Monthly",
  15: "5 Feed - 100000 SKU'S Monthly",
  16: "5 Feed - 200000 SKU'S Monthly",
  17: "5 Feed - 300000 SKU'S Monthly",
  18: "5 Feed - 400000 SKU'S Monthly",
  19: "10 Feed - 500000 SKU'S Monthly",
  20: "10 Feed - 600000 SKU'S Monthly",
  21: "10 Feed - 700000 SKU'S Monthly",
  22: "10 Feed - 800000 SKU'S Monthly",
  23: "Unlimited Feed - Unlimited Sku Monthly",
  24: "3 Feed - 35000 SKU'S (Standard Annual) 20% Discounted",
  25: "1 Feed - 500 SKU'S Annual 20% Discounted",
  26: "1 Feed - 1000 SKU'S Annual 20% Discounted",
  27: "1 Feed - 2000 SKU'S Annual 20% Discounted",
  28: "1 Feed - 3000 SKU'S Annual 20% Discounted",
  29: "1 Feed - 5000 SKU'S Annual 20% Discounted",
  30: "2 Feed - 10000 SKU'S Annual 20% Discounted",
  31: "2 Feed - 20000 SKU'S Annual 20% Discounted",
  32: "2 Feed - 25000 SKU'S Annual 20% Discounted",
  33: "2 Feed - 30000 SKU'S Annual 20% Discounted",
  34: "3 Feed - 35000 SKU'S Annual 20% Discounted",
  35: "3 Feed - 40000 SKU'S Annual 20% Discounted",
  36: "3 Feed - 45000 SKU'S Annual 20% Discounted",
  37: "3 Feed - 50000 SKU'S Annual 20% Discounted",
  38: "5 Feed - 100000 SKU'S Annual 20% Discounted",
  39: "5 Feed - 200000 SKU'S Annual 20% Discounted",
  40: "5 Feed - 300000 SKU'S Annual 20% Discounted",
  41: "5 Feed - 400000 SKU'S Annual 20% Discounted",
  42: "10 Feed - 500000 SKU'S Annual 20% Discounted",
  43: "10 Feed - 600000 SKU'S Annual 20% Discounted",
  44: "10 Feed - 700000 SKU'S Annual 20% Discounted",
  45: "10 Feed - 800000 SKU'S Annual 20% Discounted",
  46: "Unlimited Feed - Unlimited Sku Annual",
  47: "5 Feed - 100000 SKU'S Monthly 10% Discounted",
  48: "5 Feed - 100000 SKU'S Monthly 20% Discounted",
  49: "5 Feed - 100000 SKU'S Monthly 25% Discounted",
  50: "5 Feed - 100000 SKU'S Monthly 30% Discounted",
  51: "5 Feed - 100000 SKU'S Monthly 50% Discounted",
  52: "5 Feed - 200000 SKU'S Monthly 10% Discounted",
  53: "5 Feed - 200000 SKU'S Monthly 20% Discounted",
  54: "5 Feed - 200000 SKU'S Monthly 25% Discounted",
  55: "5 Feed - 200000 SKU'S Monthly 30% Discounted",
  56: "5 Feed - 200000 SKU'S Monthly 50% Discounted",
  57: "5 Feed - 300000 SKU'S Monthly 10% Discounted",
  58: "5 Feed - 300000 SKU'S Monthly 20% Discounted",
  59: "5 Feed - 300000 SKU'S Monthly 25% Discounted",
  60: "5 Feed - 300000 SKU'S Monthly 30% Discountedt",
  61: "5 Feed - 300000 SKU'S Monthly 50% Discountedt",
  62: "5 Feed - 400000 SKU'S Monthly 10% Discounted",
  63: "5 Feed - 400000 SKU'S Monthly 20% Discounted",
  64: "5 Feed - 400000 SKU'S Monthly 25% Discounted",
  65: "5 Feed - 400000 SKU'S Monthly 30% Discounted",
  66: "5 Feed - 400000 SKU'S Monthly 50% Discounted",
  67: "10 Feed - 500000 SKU'S Monthly 10% Discounted",
  68: "10 Feed - 500000 SKU'S Monthly 20% Discounted",
  69: "10 Feed - 500000 SKU'S Monthly 25% Discounted",
  70: "10 Feed - 500000 SKU'S Monthly 30% Discounted",
  71: "10 Feed - 500000 SKU'S Monthly 50% Discounted",
  72: "10 Feed - 600000 SKU'S Monthly 10% Discounted",
  73: "10 Feed - 600000 SKU'S Monthly 20% Discounted",
  74: "10 Feed - 600000 SKU'S Monthly 25% Discounted",
  75: "10 Feed - 600000 SKU'S Monthly 30% Discounted",
  76: "10 Feed - 600000 SKU'S Monthly 50% Discounted",
  77: "10 Feed - 700000 SKU'S Monthly 10% Discounted",
  78: "10 Feed - 700000 SKU'S Monthly 20% Discounted",
  79: "10 Feed - 700000 SKU'S Monthly 25% Discounted",
  80: "10 Feed - 700000 SKU'S Monthly 30% Discounted",
  81: "10 Feed - 700000 SKU'S Monthly 50% Discounted",
  82: "10 Feed - 800000 SKU'S Monthly 10% Discounted",
  83: "10 Feed - 800000 SKU'S Monthly 20% Discounted",
  84: "10 Feed - 800000 SKU'S Monthly 25% Discounted",
  85: "10 Feed - 800000 SKU'S Monthly 30% Discounted",
  86: "10 Feed - 800000 SKU'S Monthly 50% Discounted",
  87: "Monthly Unlimited Sku 10% Discounted",
  88: "Monthly Unlimited Sku 20% Discounted",
  89: "Monthly Unlimited Sku 25% Discounted",
  90: "Monthly Unlimited Sku 30% Discounted",
  91: "Monthly Unlimited Sku 50% Discounted",
  92: "Monthly Unlimited Sku 75% Discounted",
}


const p1 = (mp1 * 12).toFixed(2), p2 = (mp2 * 12).toFixed(2), p3 = (mp3 * 12).toFixed(2), p4 = (mp4 * 12).toFixed(2), p5 = (mp5 * 12).toFixed(2), p6 = (mp6 * 12).toFixed(2), p7 = (mp7 * 12).toFixed(2), p8 = (mp8 * 12).toFixed(2), p9 = (mp9 * 12).toFixed(2), p10 = (mp10 * 12).toFixed(2), p11 = (mp11 * 12).toFixed(2), p12 = (mp12 * 12).toFixed(2), p13 = (mp13 * 12).toFixed(2), p14 = (mp14 * 12).toFixed(2), p15 = (mp15 * 12).toFixed(2), p16 = (mp16 * 12).toFixed(2), p17 = (mp17 * 12).toFixed(2), p18 = (mp18 * 12).toFixed(2), p19 = (mp19 * 12).toFixed(2), p20 = (mp20 * 12).toFixed(2), p21 = (mp21 * 12).toFixed(2), p22 = (mp22 * 12).toFixed(2)




const discount1 = ((p1) - (((p1) * 20) / 100)).toFixed(2);
const discount2 = ((p2) - (((p2) * 20) / 100)).toFixed(2);
const discount3 = ((p3) - (((p3) * 20) / 100)).toFixed(2);
const discount4 = ((p4) - (((p4) * 20) / 100)).toFixed(2);
const discount5 = ((p5) - (((p5) * 20) / 100)).toFixed(2);
const discount6 = ((p6) - (((p6) * 20) / 100)).toFixed(2);
const discount7 = ((p7) - (((p7) * 20) / 100)).toFixed(2);
const discount8 = ((p8) - (((p8) * 20) / 100)).toFixed(2);
const discount9 = ((p9) - (((p9) * 20) / 100)).toFixed(2);
const discount10 = ((p10) - (((p10) * 20) / 100)).toFixed(2);
const discount11 = ((p11) - (((p11) * 20) / 100)).toFixed(2);
const discount12 = ((p12) - (((p12) * 20) / 100)).toFixed(2);
const discount13 = ((p13) - (((p13) * 20) / 100)).toFixed(2);
const discount14 = ((p14) - (((p14) * 20) / 100)).toFixed(2);
const discount15 = ((p15) - (((p15) * 20) / 100)).toFixed(2);
const discount16 = ((p16) - (((p16) * 20) / 100)).toFixed(2);
const discount17 = ((p17) - (((p17) * 20) / 100)).toFixed(2);
const discount18 = ((p18) - (((p18) * 20) / 100)).toFixed(2);
const discount19 = ((p19) - (((p19) * 20) / 100)).toFixed(2);
const discount20 = ((p20) - (((p20) * 20) / 100)).toFixed(2);
const discount21 = ((p21) - (((p21) * 20) / 100)).toFixed(2);
const discount22 = ((p22) - (((p22) * 20) / 100)).toFixed(2);



const source = {
  position: "fixed",
  top: '1px',
  right: "50%",
  left: "50%",
  zIndex: 99999,
  // bottom: '100%'
};
const bigExplodeProps = {
  force: 0.3,
  duration: 7000,
  particleCount: 1000,
  floorHeight: 1600,
  floorWidth: 1600
};

const littleExplodeProps = {
  force: 0.2,
  duration: 5000,
  particleCount: 300,
  floorHeight: 10,
  floorWidth: 1000
};

const tinyExplodeProps = {
  force: 0.1,
  duration: 3000,
  particleCount: 100,
  floorHeight: 500,
  floorWidth: 300
};

const SetupPrice = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [couponCodeLoading, setCouponCodeLoading] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [discountedPlanId, setDiscountedPlanId] = useState(null);
  const [discountedPlanName, setDiscountedPlanName] = useState(null);
  const [couponMsg, setCouponMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(null);
  const [totalVariants, setTotalVariants] = useState(0);
  // let audio = new Audio("../../coupan.mp3")
  // const audio = new Audio(sound)
  const applyCouponCode = async (couponCode) => {
    await axioshttp
      .post(`applyCoupon`, { coupon: couponCode, selectedPlan: price })
      .then((response) => {
        setCouponCodeLoading(false);
        setIsButtonDisabled(false);
        if (response.data.status) {
          // setCouponMsg(response.data.message);
          // setSuccessMsg(true);
          setToastMessage(response.data.message)
          setShowToast(true);
          if (prices[price]) {
            changePlanPrice(prices[price], (prices[price] - (prices[price] * response.data.discount) / 100).toFixed(2), price);
          } else {
            setCouponMsg(response.data.message);
            setSuccessMsg(false);
            // setToastMessage(response.data.message)
            // setShowToast(true);
          }
        }
      })
      .catch((error) => {
        setCouponCodeLoading(false);
        setIsButtonDisabled(false);
        if (error.response.data.status === false) {
          setCouponMsg(error.response.data.message);
          setSuccessMsg(false);
        }
      });
  };

  const changePlanPrice = (Nprice, Ndiscount, selectedPlan) => {
    const selectedPlanInt = parseFloat(selectedPlan);
    const newPrice = parseFloat(Ndiscount);
    const planPrice = parseFloat(Nprice);
    let planId = null;
    let planName = null;
    setActiveCoupon(true);
    setDiscountedPrice(Ndiscount);

    if (selectedPlanInt > 14 && selectedPlanInt <= 23) {
      planId = planIdMap[selectedPlanInt][newPrice];
      planName = planIdAndPlanName[planId];
      console.log({ selectedPlanInt, planId, planName, newPrice, Nprice, Ndiscount, selectedPlan })
      if (planId) {
        setDiscountedPlanId(planId);
        setDiscountedPlanName(planName);
      }
    }
  }


  const [isExploding, setIsExploding] = React.useState(false);
  const [show, setShow] = React.useState(false)

  const activateCoupon = () => {
    let couponCode = inputVal.replace(/\s/g, "");
    if (couponCode.length < 1 || couponCode.length > 100) {
      setCouponMsg("Coupon Code Must Be Between 1 to 100 Chracters");
      setSuccessMsg(false);
      setToastMessage('Coupon Code Must Be Between 1 to 100 Chracters')
      setShowToast(true);
      return;
    }

    setCouponCodeLoading(true);
    setIsButtonDisabled(true);
    setCouponMsg(null);
    setSuccessMsg(false);
    const allowedPlanIds = [15, 16, 17, 18, 19, 20, 21, 22, 23];
    const allowed = allowedPlanIds.some(elem => elem == price);
    if (allowed === false) {
      setCouponMsg("Coupon Code Cannot Be Applied On This Plan");
      setSuccessMsg(false);
      setCouponCodeLoading(false);
      setIsButtonDisabled(false);
      return;
    }
    applyCouponCode(couponCode);
  }

  /*
      |--------------------------------------------------------------------------
      | Custom States  For Storing States on API calls And Event Handling [BACKEND]
      |--------------------------------------------------------------------------
      |
      */

  const [isLoading, setLoading] = useState(true);
  const [shopifyPlanName, setShopifyPlanName] = useState(null);
  const [currentPlanName, setCurrentPlanName] = useState(null);
  // const [price, setPrice] = useState(null); //Used
  const [recommendedPlanId, setRecommendedPlanId] = useState(null);
  const plansToBeDiscounted = ['15', '16', '17', '18', '19', '20', '21', '22', '23'];




  /*
  |--------------------------------------------------------------------------
  | Custom Functions For API calls And Event Handling [BACKEND]
  |--------------------------------------------------------------------------
  |
  */

  const freePlan = async () => {
    await axioshttp
      .post(`activateFreePlan`)
      .then((response) => {
        if (response.data.status === true) {
          setToastMessage(response.data.message)
          setShowToast(true);
          navigate("/Loading");
        }
      })
      .catch((error) => console.log(error));
  };

  const getPlan = (event) => {
    let store_url = app.hostOrigin;
    let plan_id = event.target.id;
    let plan_name = event.target.value;
    const isValidPlan = planIdAndPlanName.hasOwnProperty(plan_id) && planIdAndPlanName[plan_id] === plan_name;
    if (isValidPlan) {
      if (document.getElementById("shopName")) {
        var shopName = document.getElementById("shopName").getAttribute("data");
        const modifiedShopName = `${shopName.replace(".myshopify.com", "")}`;
        const url = `/admin.shopify.com/store/${modifiedShopName}`;
        const encodedUrl = btoa(url);
        window.open(`billing/${plan_id}?token=${window.sessionToken}&shop=${modifiedShopName}&host=${encodedUrl}`);

        // window.open(`billing/${plan_id}?token=${window.sessionToken}&shop=${modifiedShopName}&host=${encodedUrl}`, "_self");
      }
    } else {
      setToastMessage(`Plan ID ${plan_id} either doesn't exist or its value is not ${plan_name}`);
      setShowToast(true);

    }
    //   window.open("billing/"+plan_id+"?shop="+store_url);

    // window.open("billing/" + plan_id + "?shop=" + store_url, "_self");
  };


  const [recommendedPlanDiv, setRecommendedPlanDiv] = useState(null);
  const getPlanName = async () => {
    await axioshttp.get(`getShopifyPlanName`).then((response) => {
      setLoading(false);
      if (response.data.status === true) {
        setTotalVariants(response.data.variantsCount);
        setRecommendedPlan(response.data.variantsCount);
        setShopifyPlanName(response.data.shopifyPlanName);
        setCurrentPlanName(response.data.userPlanName);
      }
    });

  };
  const [price, setPrice] = React.useState(15);
  const handlePlanChange = (event) => {
    setPrice(event.target.value);
    setIsExploding(false);
    setActiveCoupon(false);
    setDiscountedPrice(null);
    setDiscountedPlanId(null);
  };

  const [status, setStatus] = React.useState(1); // 0: no show, 1: show yes, 2: show no.
  const radioHandler = (status) => {
    setStatus(status);
    setIsExploding(false);
  };

  const [inputVal, setInputVal] = useState("");
  const handleInput = (e) => {
    setInputVal(e.target.value);
    setIsExploding(false);
  }
  const MonthlyRecommended = [

    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp8}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        25,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="9"
                  value="2 Feed - 25000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp9}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        30,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="10"
                  value="2 Feed - 30000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 3 feed MonthlyStandard pricing
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp10}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        35,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="11"
                  value="3 Feed - 35000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp11}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        40,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="12"
                  value="3 Feed - 40000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp12}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        45,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="13"
                  value="3 Feed - 45000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp13}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        50,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="14"
                  value="3 Feed - 50000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 5 feed MonthlyStandard pricing
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>

                <p className="text-7xl font-bold text-center">{mp14}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        100,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="15"
                  value="5 Feed - 100000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp15}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        200,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="16"
                  value="5 Feed - 200000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>

              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp16}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        300,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="17"
                  value="5 Feed - 300000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp17}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        400,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="18"
                  value="5 Feed - 400000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 10 feed MonthlyStandard pricing
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp18}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        500,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="19"
                  value="10 Feed - 500000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>

              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp19}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        600,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="20"
                  value="10 Feed - 600000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>

              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp20}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        700,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="21"
                  value="10 Feed - 700000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>

              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp21}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        800,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="22"
                  value="10 Feed - 800000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },

    // Unlimited feed MonthlyStandard pricing
    {
      UnlimitedFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
            }}
            className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
          >
            <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
              <div className='flex items-center justify-center'>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
              </div>
            </div>
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Standard
              </p>
              <p className="text-center text-sm font-medium pb-4">
                A package developed that brings you happiness and sales together
              </p>

              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp22}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON STANDARD :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Super Unlimited SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Super Unlimited Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="23"
                  value="Unlimited Feed - Unlimited Sku Monthly"
                  onClick={getPlan}

                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  const MonthlyPersonalized = [
    // 1 feed MonthlyPersonalized pricing
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp1}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        500 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="2"
                  value="1 Feed - 500 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp2}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        1,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="3"
                  value="1 Feed - 1000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp3}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        2,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="4"
                  value="1 Feed - 2000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp4}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        3,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="5"
                  value="1 Feed - 3000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp5}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        5,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="6"
                  value="1 Feed - 5000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 2 feed MonthlyPersonalized pricing
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp6}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        10,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="7"
                  value="2 Feed - 10000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp7}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        20,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="8"
                  value="2 Feed - 20000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp8}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        25,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="9"
                  value="2 Feed - 25000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp9}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        30,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="10"
                  value="2 Feed - 30000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 3 feed MonthlyPersonalized pricing
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp10}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        35,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="11"
                  value="3 Feed - 35000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp11}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        40,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="12"
                  value="3 Feed - 40000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp12}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        45,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="13"
                  value="3 Feed - 45000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{mp13}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        50,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="14"
                  value="3 Feed - 50000 SKU'S Monthly"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 5 feed MonthlyPersonalized pricing
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {/* {price=14 &&
                <p className="text-3xl font-simibold line-through text-center">
                ${mp14 * 12}
              </p>} */}

              {(price == 15 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp14}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>

                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp14}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        100,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "15"}
                  value={activeCoupon ? discountedPlanName : "5 Feed - 100000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 16 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp15}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp15}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        200,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "16"}
                  value={activeCoupon ? discountedPlanName : "5 Feed - 200000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 17 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp16}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp16}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        300,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "17"}
                  value={activeCoupon ? discountedPlanName : "5 Feed - 300000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 18 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp17}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp17}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        400,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "18"}
                  value={activeCoupon ? discountedPlanName : "5 Feed - 400000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 10 feed MonthlyPersonalized pricing
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 19 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp18}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp18}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        500,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "19"}
                  value={activeCoupon ? discountedPlanName : "10 Feed - 500000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 20 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp19}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp19}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        600,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "20"}
                  value={activeCoupon ? discountedPlanName : "10 Feed - 600000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 21 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp20}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp20}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        700,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "21"}
                  value={activeCoupon ? discountedPlanName : "10 Feed - 700000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 22 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp21}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp21}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        800,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id={activeCoupon ? discountedPlanId : "22"}
                  value={activeCoupon ? discountedPlanName : "10 Feed - 800000 SKU'S Monthly"}
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // Unlimited feed MonthlyPersonalized pricing
    {
      UnlimitedFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              {(price == 23 && activeCoupon) ? (
                <p className="text-3xl font-simibold line-through text-center">
                  ${mp22}
                </p>
              ) : null}
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">{discountedPrice !== null ? discountedPrice : mp22}</p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/mo</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Super Unlimited SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Super Unlimited Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  // id="23"
                  id={activeCoupon ? discountedPlanId : "23"}
                  value={activeCoupon ? discountedPlanName : "Unlimited Feed - Unlimited Sku Monthly"}
                  // value="Unlimited Feed - Unlimited Sku Monthly"
                  onClick={getPlan}

                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  const YearlyPersonalized = [
    // 1 feed YearlyPersonalized pricing
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p1}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount1}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        500 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="25"
                  value="1 Feed - 500 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p2}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount2}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        1,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="26"
                  value="1 Feed - 1000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p3}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount3}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        2,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="27"
                  value="1 Feed - 2000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p4}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount4}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        3,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="28"
                  value="1 Feed - 3000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      OneFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p5}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount5}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        5,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">1 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Real Time Sync
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Email Support
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="29"
                  value="1 Feed - 5000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 2 feed YearlyPersonalized pricing
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p6}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount6}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        10,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="30"
                  value="2 Feed - 10000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p7}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount7}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        20,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="31"
                  value="2 Feed - 20000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p8}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount8}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        25,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="32"
                  value="2 Feed - 25000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TwoFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p9}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount9}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        30,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">2 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="33"
                  value="2 Feed - 30000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 3 feed YearlyPersonalized pricing
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p10}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount10}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        35,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="34"
                  value="3 Feed - 35000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p11}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount11}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        40,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="35"
                  value="3 Feed - 40000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p12}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount12}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        45,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="36"
                  value="3 Feed - 45000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      ThreeFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p13}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount13}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        50,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">3 Feed</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Live Chat</span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="37"
                  value="3 Feed - 50000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 5 feed YearlyPersonalized pricing
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p14}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount14}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        100,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="38"
                  value="5 Feed - 100000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p15}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount15}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        200,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="39"
                  value="5 Feed - 200000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p16}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount16}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        300,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="40"
                  value="5 Feed - 300000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      FiveFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p17}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount17}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        400,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">5 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed Data
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Personal Feed Setup Assistance
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="41"
                  value="5 Feed - 400000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // 10 feed YearlyPersonalized pricing
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p18}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount18}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        500,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="42"
                  value="10 Feed - 500000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p19}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount19}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        600,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="43"
                  value="10 Feed - 600000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p20}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount20}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        700,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="44"
                  value="10 Feed - 700000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      TenFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p21}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount21}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        800,000 SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">10 Feeds</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="45"
                  value="10 Feed - 800000 SKU'S Annual 20% Discounted"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    // Unlimited feed YearlyPersonalized pricing
    {
      UnlimitedFeed: (
        <>
          <div
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              height: "fit-content",
            }}
            className="bg-white rounded-lg mt-6 w-[35 %]"
          >
            <div className="p-4">
              <p className="text-center text-3xl font-medium p-4 text-gray-800">
                Personalized
              </p>
              <p className="text-center text-sm font-medium pb-4">
                Choose the plan that’s right for you and start your 30-day trial
                today
              </p>
              <p className="text-3xl font-simibold line-through text-center">
                ${p22}
              </p>
              <div className="flex justify-center p-4">
                <p className="font-medium text-2xl text-center mt-4">
                  <sup className="flex">
                    <p className="text-gray-500">USD</p>
                    <b>$</b>
                  </sup>
                </p>
                <p className="text-7xl font-bold text-center">
                  {discount22}
                </p>
                <p className="text-2xl mt-8 font-medium text-center">
                  <sub>/yr</sub>
                </p>
              </div>
              <hr className="mt-2 mb-2" />
              <div>
                <p className="p-4 font-medium">
                  WHAT’S INCLUDED ON PERSONALIZED :
                </p>
                <ul className="p-2">
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Super Unlimited SKU'S
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Super Unlimited Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Language
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Multi-Currency
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Filter Product Feeds
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Bulk Editing
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Real Time Sync</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Upload Custom Images
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Metafields Mapping
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Include/Exclude Products
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Local Inventory Feed
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Import and Export Feed with Custom Field
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        VIP support with feed approval/optimization assist
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Google Ads Tracking Setup
                      </span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">Create Promotions</span>
                    </p>
                  </li>
                  <li className="p-1">
                    <p className="flex">
                      <CheckIcon style={{ color: "#008060" }} />
                      <span className="slef-center text-sm ml-4">
                        Dedicated Resources
                      </span>
                    </p>
                  </li>
                </ul>
                <Button
                  className="flex justify-center w-full"
                  style={{ background: "#008060 " }}
                  variant="contained"
                  id="46"
                  value="Unlimited Feed - Unlimited Sku Annual"
                  onClick={getPlan}
                >
                  Try It Now
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  const setRecommendedPlan = (totalVariants) => {
    if (totalVariants > 0 && totalVariants <= 25000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[0].TwoFeed}</>);
    } else if (totalVariants > 25000 && totalVariants <= 30000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[1].TwoFeed}</>);
    } else if (totalVariants > 30000 && totalVariants <= 35000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[2].ThreeFeed}</>);
    } else if (totalVariants > 35000 && totalVariants <= 40000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[3].ThreeFeed}</>);
    } else if (totalVariants > 40000 && totalVariants <= 45000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[4].ThreeFeed}</>);
    } else if (totalVariants > 45000 && totalVariants <= 50000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[5].ThreeFeed}</>);
    } else if (totalVariants > 50000 && totalVariants <= 100000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[6].FiveFeed}</>);
    } else if (totalVariants > 100000 && totalVariants <= 200000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[7].FiveFeed}</>);
    } else if (totalVariants > 200000 && totalVariants <= 300000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[8].FiveFeed}</>);
    } else if (totalVariants > 300000 && totalVariants <= 400000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[9].FiveFeed}</>);
    } else if (totalVariants > 400000 && totalVariants <= 500000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[10].TenFeed}</>);
    } else if (totalVariants > 500000 && totalVariants <= 600000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[11].TenFeed}</>);
    } else if (totalVariants > 700000 && totalVariants <= 800000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[12].TenFeed}</>);
    } else if (totalVariants > 800000) {
      setRecommendedPlanDiv(<>{MonthlyRecommended[13].UnlimitedFeed}</>);
    }
    setRecommendedPlanId("9");
  }


  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/setupPrice", title: "Setup Price" });
    setLoading(true);
    getPlanName();
  }, [])
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 4000);
    }
  }, [showToast]);

  return (
    <>
      {!isLoading &&
        <div className="md:container md:mx-auto">

          <div class="container p-4">
            <div class="switches-container">
              <input
                checked={status === 1}
                onClick={(e) => radioHandler(1)}
                defaultChecked
                type="radio"
                id="switchMonthly"
                name="switchPlan"
                value="Monthly"
              />
              <input
                checked={status === 2}
                onClick={(e) => radioHandler(2)}
                type="radio"
                id="switchYearly"
                name="switchPlan"
                value="Yearly"
              />
              <label for="switchMonthly">Monthly</label>
              <label for="switchYearly">
                Yearly <b>Save 20%</b>
              </label>
              <div class="switch-wrapper">
                <div class="switch">
                  <div>Monthly</div>
                  <div>
                    Yearly <b>Save 20%</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xl font-small p-2">Select Plan: Based on your total SKU(<span className="font-bold">{totalVariants}</span>)</p>
          <div className="flex justify-center p-2 lg:w-2/6 md:w-2/3 sm:w-full m-auto">
            <select
              onChange={handlePlanChange}
              id="countries"
              class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
            >
              <option style={{ background: "#fffcd6b9" }} value="2">
                1 Feed - 500 SKU'S
              </option>
              <option style={{ background: "#fffcd6b9" }} value="3">
                1 Feed - 1,000 SKU'S
              </option>
              <option style={{ background: "#fffcd6b9" }} value="4">
                1 Feed - 2,000 SKU'S
              </option>
              <option style={{ background: "#fffcd6b9" }} value="5">
                1 Feed - 3,000 SKU'S
              </option>
              <option style={{ background: "#fffcd6b9" }} value="6">
                1 Feed - 5,000 SKU'S
              </option>
              <option style={{ background: "#d8b4fe" }} value="7">
                2 Feed - 10,000 SKU'S
              </option>
              <option style={{ background: "#d8b4fe" }} value="8">
                2 Feed - 20,000 SKU'S
              </option>
              <option style={{ background: "#d8b4fe" }} value="9">
                2 Feed - 25,000 SKU'S
              </option>
              <option style={{ background: "#d8b4fe" }} value="10">
                2 Feed - 30,000 SKU'S
              </option>
              <option style={{ background: "#e4e5e0" }} value="11">
                3 Feed - 35,000 SKU'S
              </option>
              <option style={{ background: "#e4e5e0" }} value="12">
                3 Feed - 40,000 SKU'S0
              </option>
              <option style={{ background: "#e4e5e0" }} value="13">
                3 Feed - 45,000 SKU'S
              </option>
              <option style={{ background: "#e4e5e0" }} value="14">
                3 Feed - 50,000 SKU'S
              </option>
              <option selected style={{ background: "#f2bfbf" }} value="15">
                5 Feed - 100,000 SKU'S
              </option>
              <option style={{ background: "#f2bfbf" }} value="16">
                5 Feed - 200,000 SKU'S
              </option>
              <option style={{ background: "#f2bfbf" }} value="17">
                5 Feed - 300,000 SKU'S
              </option>
              <option style={{ background: "#f2bfbf" }} value="18">
                5 Feed - 400,000 SKU'S
              </option>
              <option style={{ background: "#d4e7e5" }} value="19">
                10 Feed - 500,000 SKU'S
              </option>
              <option style={{ background: "#d4e7e5" }} value="20">
                10 Feed - 600,000 SKU'S
              </option>
              <option style={{ background: "#d4e7e5" }} value="21">
                10 Feed - 700,000 SKU'S
              </option>
              <option style={{ background: "#d4e7e5" }} value="22">
                10 Feed - 800,000 SKU'S
              </option>
              <option style={{ background: "#ff8181" }} value="23">
                Unlimited Feed - Unlimited SKU'S
              </option>
            </select>
          </div>

          {/* monthly pricing  */}

          {status === 1 && (
            <>
              <div className="flex justify-center">
                {recommendedPlanDiv}
                {/* // 1 feed Monthly Personalized pricing card // */}
                {price == 2 ? (
                  <>{MonthlyPersonalized[0].OneFeed}</>
                ) : null}
                {price == 3 ? (
                  <>{MonthlyPersonalized[1].OneFeed}</>
                ) : null}
                {price == 4 ? (
                  <>{MonthlyPersonalized[2].OneFeed}</>
                ) : null}
                {price == 5 ? (
                  <>{MonthlyPersonalized[3].OneFeed}</>
                ) : null}
                {price == 6 ? (
                  <>{MonthlyPersonalized[4].OneFeed}</>
                ) : null}
                {/* // 2 feed Monthly Personalized pricing card // */}
                {price == 7 ? (
                  <>{MonthlyPersonalized[5].TwoFeed}</>
                ) : null}
                {price == 8 ? (
                  <>{MonthlyPersonalized[6].TwoFeed}</>
                ) : null}
                {price == 9 ? (
                  <>{MonthlyPersonalized[7].TwoFeed}</>
                ) : null}
                {price == 10 ? (
                  <>{MonthlyPersonalized[8].TwoFeed}</>
                ) : null}
                {/* // 3 feed Monthly Personalized pricing card // */}
                {price == 11 ? (
                  <>{MonthlyPersonalized[9].ThreeFeed}</>
                ) : null}
                {price == 12 ? (
                  <>{MonthlyPersonalized[10].ThreeFeed}</>
                ) : null}
                {price == 13 ? (
                  <>{MonthlyPersonalized[11].ThreeFeed}</>
                ) : null}
                {price == 14 ? (
                  <>{MonthlyPersonalized[12].ThreeFeed}</>
                ) : null}
                {/* // 5 feed Monthly Personalized pricing card // */}
                {price == 15 ? (
                  <>{MonthlyPersonalized[13].FiveFeed}</>
                ) : null}
                {price == 16 ? (
                  <>{MonthlyPersonalized[14].FiveFeed}</>
                ) : null}
                {price == 17 ? (
                  <>{MonthlyPersonalized[15].FiveFeed}</>
                ) : null}
                {price == 18 ? (
                  <>{MonthlyPersonalized[16].FiveFeed}</>
                ) : null}
                {/* // 10 feed Monthly Personalized pricing card // */}
                {price == 19 ? (
                  <>{MonthlyPersonalized[17].TenFeed}</>
                ) : null}
                {price == 20 ? (
                  <>{MonthlyPersonalized[18].TenFeed}</>
                ) : null}
                {price == 21 ? (
                  <>{MonthlyPersonalized[19].TenFeed}</>
                ) : null}
                {price == 22 ? (
                  <>{MonthlyPersonalized[20].TenFeed}</>
                ) : null}
                {/* // Unlimited feed Monthly Personalized pricing card // */}
                {price == 23 ? <>{MonthlyPersonalized[21].UnlimitedFeed}</> : null}
                <div
                  style={{
                    boxShadow:
                      "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
                  }}
                  className="bg-white rounded-lg mt-6 w-[25%] md:w-[55%] sm:w-[55%] lg:w-[24%] h-fit"
                >
                  <div className="p-4">
                    <p className="text-center text-3xl font-medium p-4 text-gray-800">
                      Free
                    </p>
                    <p className="text-center text-sm font-medium pb-4">
                      Think Big Not Free
                    </p>
                    <div className="flex justify-center p-4">
                      <p className="font-medium text-2xl text-center mt-4">
                        <sup className="flex">
                          <p className="text-gray-500">USD</p>
                          <b>$</b>
                        </sup>
                      </p>
                      <p className="text-7xl font-bold text-center">0</p>
                      <p className="text-2xl mt-8 font-medium text-center">
                        <sub>/mo</sub>
                      </p>
                    </div>
                    <hr className="mt-2 mb-2" />
                    <div>
                      <p className="p-4 font-medium">WHAT’S INCLUDED ON FREE :</p>
                      <ul className="p-2">
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              50 SKU'S
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">1 Feed</span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Real Time Sync
                            </span>
                          </p>
                        </li>
                      </ul>
                      <Button
                        className="flex justify-center w-full"
                        style={{ background: "#008060 " }}
                        variant="contained"
                        onClick={freePlan}
                      >
                        Try It Now
                      </Button >
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Yearly Pricing */}

          {status === 2 && (
            <>
              <div className="flex justify-center">
                <div
                  style={{
                    boxShadow:
                      "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
                  }}
                  className="bg-[#f1f8f5] rounded-b-lg relative mt-6 h-fit w-[35 %]"
                >
                  <div className="absolute bottom-[100%] bg-[#008060] w-full rounded-t-lg">
                    <div className='flex items-center justify-center'>
                      <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                      <p className='text-white font-bold text-center mr-2 ml-2'>Recommended</p>
                      <img src='https://cdn.shopify.com/shopifycloud/brochure/assets/pricing/redesign/sparkles-right-35abb2fb9b1fd67c6c7036bddc225c6c8aab2610f7a38664f5429fd7203c2da5.svg' />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-center text-3xl font-medium p-4 text-gray-800">
                      Standard
                    </p>
                    <p className="text-center text-sm font-medium pb-4">
                      A package developed that brings you happiness and sales
                      together
                    </p>
                    <p className="text-3xl font-simibold line-through text-center">
                      ${(39.99 * 12).toFixed(2)}
                    </p>
                    <div className="flex justify-center p-4">
                      <p className="font-medium text-2xl text-center mt-4">
                        <sup className="flex">
                          <p className="text-gray-500">USD</p>
                          <b>$</b>
                        </sup>
                      </p>
                      <p className="text-7xl font-bold text-center">
                        {(39.99 * 12 - ((39.99 * 12) / 100) * 20).toFixed(2)}
                      </p>
                      <p className="text-2xl mt-8 font-medium text-center">
                        <sub>/yr</sub>
                      </p>
                    </div>
                    <hr className="mt-2 mb-2" />
                    <div>
                      <p className="p-4 font-medium">
                        WHAT’S INCLUDED ON STANDARD :
                      </p>
                      <ul className="p-2">
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              12000 SKU'S
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              3 Feeds
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Multi-Language
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Multi-Currency
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Filter Product Feeds
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Bulk Editing
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Metafields Mapping
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Include/Exclude Products
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Live Chat
                            </span>
                          </p>
                        </li>
                      </ul>
                      <Button
                        className="flex justify-center w-full"
                        style={{ background: "#008060 " }}
                        variant="contained"
                        id="24"
                        value="3 Feed - 35000 SKU'S (Standard Annual) 20% Discounted"
                        onClick={getPlan}

                      >
                        Try It Now
                      </Button>
                    </div>
                  </div>
                </div>
                {/* // 1 feed Monthly Personalized pricing card // */}
                {price == 2 ? (
                  <>{YearlyPersonalized[0].OneFeed}</>
                ) : null}
                {price == 3 ? (
                  <>{YearlyPersonalized[1].OneFeed}</>
                ) : null}
                {price == 4 ? (
                  <>{YearlyPersonalized[2].OneFeed}</>
                ) : null}
                {price == 5 ? (
                  <>{YearlyPersonalized[3].OneFeed}</>
                ) : null}
                {price == 6 ? (
                  <>{YearlyPersonalized[4].OneFeed}</>
                ) : null}
                {/* // 2 feed Monthly Personalized pricing card // */}
                {price == 7 ? (
                  <>{YearlyPersonalized[5].TwoFeed}</>
                ) : null}
                {price == 8 ? (
                  <>{YearlyPersonalized[6].TwoFeed}</>
                ) : null}
                {price == 9 ? (
                  <>{YearlyPersonalized[7].TwoFeed}</>
                ) : null}
                {price == 10 ? (
                  <>{YearlyPersonalized[8].TwoFeed}</>
                ) : null}
                {/* // 3 feed Monthly Personalized pricing card // */}
                {price == 11 ? (
                  <>{YearlyPersonalized[9].ThreeFeed}</>
                ) : null}
                {price == 12 ? (
                  <>{YearlyPersonalized[10].ThreeFeed}</>
                ) : null}
                {price == 13 ? (
                  <>{YearlyPersonalized[11].ThreeFeed}</>
                ) : null}
                {price == 14 ? (
                  <>{YearlyPersonalized[12].ThreeFeed}</>
                ) : null}
                {/* // 5 feed Monthly Personalized pricing card // */}
                {price == 15 ? (
                  <>{YearlyPersonalized[13].FiveFeed}</>
                ) : null}
                {price == 16 ? (
                  <>{YearlyPersonalized[14].FiveFeed}</>
                ) : null}
                {price == 17 ? (
                  <>{YearlyPersonalized[15].FiveFeed}</>
                ) : null}
                {price == 18 ? (
                  <>{YearlyPersonalized[16].FiveFeed}</>
                ) : null}
                {/* // 10 feed Monthly Personalized pricing card // */}
                {price == 19 ? (
                  <>{YearlyPersonalized[17].TenFeed}</>
                ) : null}
                {price == 20 ? (
                  <>{YearlyPersonalized[18].TenFeed}</>
                ) : null}
                {price == 21 ? (
                  <>{YearlyPersonalized[19].TenFeed}</>
                ) : null}
                {price == 22 ? (
                  <>{YearlyPersonalized[20].TenFeed}</>
                ) : null}
                {/* // Unlimited feed Monthly Personalized pricing card // */}
                {price == 23 ? <>{YearlyPersonalized[21].UnlimitedFeed}</> : null}
                <div
                  style={{
                    boxShadow:
                      "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
                  }}
                  className="bg-white rounded-lg mt-6 w-[25%] md:w-[55%] sm:w-[55%] lg:w-[24%] h-fit"
                >
                  <div className="p-4">
                    <p className="text-center text-3xl font-medium p-4 text-gray-800">
                      Free
                    </p>
                    <p className="text-center text-sm font-medium pb-4">
                      Think Big Not Free
                    </p>
                    <div className="flex justify-center p-4">
                      <p className="font-medium text-2xl text-center mt-4">
                        <sup className="flex">
                          <p className="text-gray-500">USD</p>
                          <b>$</b>
                        </sup>
                      </p>
                      <p className="text-7xl font-bold text-center">0</p>
                      <p className="text-2xl mt-8 font-medium text-center">
                        <sub>/yr</sub>
                      </p>
                    </div>
                    <hr className="mt-2 mb-2" />
                    <div>
                      <p className="p-4 font-medium">WHAT’S INCLUDED ON FREE :</p>
                      <ul className="p-2">
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              50 SKU'S
                            </span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">1 Feed</span>
                          </p>
                        </li>
                        <li className="p-1">
                          <p className="flex">
                            <CheckIcon style={{ color: "#008060" }} />
                            <span className="slef-center text-sm ml-4">
                              Real Time Sync
                            </span>
                          </p>
                        </li>
                      </ul>
                      <Button
                        className="flex justify-center w-full"
                        style={{ background: "#008060 " }}
                        variant="contained"
                        onClick={freePlan}
                      >
                        Try It Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {status === 1 &&
            <>
              <Divider style={{ width: "30%", margin: "auto", marginTop: "10px" }} />
              <div className="flex justify-center flex-wrap m-auto mt-4">
                <div className="flex">
                  <input
                    placeholder="Enter Your Coupon Code"
                    value={inputVal}
                    onChange={handleInput}
                    type="text"
                    id="small-input"
                    className="block w-full mr-2 p-2 text-black border-2 border-[#008060] bg-white rounded-lg focus:ring-green-900 dark:placeholder-gray-400 dark:focus:ring-green-900 "
                  />
                  <Button
                    onClick={activateCoupon}
                    style={{ background: "#008060" }}
                    disabled={!inputVal || isButtonDisabled}
                    className="flex item-center align-center justify-center"
                    variant="contained"
                  >
                    {isExploding && (
                      <div style={source}>
                        <ConfettiExplosion {...bigExplodeProps} />
                      </div>
                    )}
                    {couponCodeLoading ? <CircularProgress color="inherit" size={20} /> : "Apply"}
                  </Button>
                </div>
              </div>
              {couponMsg !== null &&
                <span className={!successMsg ? "block w-[22%] m-auto p-2 text-red-600 flex rounded-lg mb-8 text-sm" : "text-sm mb-8 block w-[22%] m-auto p-2 text-green-600 flex rounded-lg"}>{couponMsg}</span>
              }
            </>
          }
        </div>
      }
      {isLoading &&
        <div className="flex justify-center m-auto"><CircularProgress style={{ color: '#008060' }} size={50} /></div>
      }
      {/* ============== Toast ================= */}

      {showToast ? (
        <>
          <div id="toast-default" class="flex items-center p-4 fixed bottom-5 right-[42%] transition-opacity ease-in-out delay-150 w-full max-w-xs rounded-lg text-white bg-[#202123]" role="alert">
            <div class="ml-3 text-sm font-normal">{toastMessage}</div>
            <button onClick={() => setShowToast(false)} type="button" class="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 " data-dismiss-target="#toast-default" aria-label="Close">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </>
      ) : null}
    </>
  );
};

export default SetupPrice;