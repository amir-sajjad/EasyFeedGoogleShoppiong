import React, { useState, useMemo, useCallback } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import upgradeImg from '../products/upgradeImg.png'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@mui/material';
import { Divider } from '@mui/material';
import './style.scss';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import VideoModal from "../tutorials/VideoModal";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axioshttp from "../../axioshttp";
import { json } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import LoadingButton from '@mui/lab/LoadingButton';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReactGA from "react-ga4";


const promotionDetails = [
  {
    countryName: "Australia",
    targetCountry: "AU",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Australian Dollar",
    currencySymbol: "$",
    currency: "AUD"
  },
  {
    countryName: "Brazil",
    targetCountry: "BR",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Brazilian Real",
    currencySymbol: "R$",
    currency: "BRL"
  },
  {
    countryName: "Brazil",
    targetCountry: "BR",
    countryLanguage: 'Portuguese',
    contentLanguage: "pt",
    currencyName: "Brazilian Real",
    currencySymbol: "R$",
    currency: "BRL"
  },
  {
    countryName: "Canada",
    targetCountry: "CA",
    countryLanguage: 'French',
    contentLanguage: "fr",
    currencyName: "Canadian Dollar",
    currencySymbol: "$",
    currency: "CAD"
  },
  {
    countryName: "Canada",
    targetCountry: "CA",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Canadian Dollar",
    currencySymbol: "$",
    currency: "CAD"
  },
  {
    countryName: "France",
    targetCountry: "FR",
    countryLanguage: 'French',
    contentLanguage: "fr",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "France",
    targetCountry: "FR",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "Germany",
    targetCountry: "DE",
    countryLanguage: 'German',
    contentLanguage: "de",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "Germany",
    targetCountry: "DE",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "India",
    targetCountry: "IN",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Indian Rupee",
    currencySymbol: "₹",
    currency: "INR"
  },
  {
    countryName: "Italy",
    targetCountry: "IT",
    countryLanguage: 'Italian',
    contentLanguage: "it",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "Italy",
    targetCountry: "IT",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "Japan",
    targetCountry: "JP",
    countryLanguage: 'Japanese',
    contentLanguage: "ja",
    currencyName: "Japanese yen",
    currencySymbol: "¥",
    currency: "JPY"
  },
  {
    countryName: "Japan",
    targetCountry: "JP",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Japanese yen",
    currencySymbol: "¥",
    currency: "JPY"
  },
  {
    countryName: "Netherlands",
    targetCountry: "NL",
    countryLanguage: 'Dutch',
    contentLanguage: "nl",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "Netherlands",
    targetCountry: "NL",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "South Korea",
    targetCountry: "KR",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "South Korean won",
    currencySymbol: "₩",
    currency: "KWR"
  },
  {
    countryName: "South Korea",
    targetCountry: "KR",
    countryLanguage: 'Korean',
    contentLanguage: "ko",
    currencyName: "South Korean won",
    currencySymbol: "₩",
    currency: "KWR"
  },
  {
    countryName: "Spain",
    targetCountry: "ES",
    countryLanguage: 'Spanish',
    contentLanguage: "es",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "Spain",
    targetCountry: "ES",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "Euro",
    currencySymbol: "€",
    currency: "EUR"
  },
  {
    countryName: "United Kingdom",
    targetCountry: "GB",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "British Pound",
    currencySymbol: "£",
    currency: "GBP"
  },
  {
    countryName: "United States",
    targetCountry: "US",
    countryLanguage: 'English',
    contentLanguage: "en",
    currencyName: "United States Dollar",
    currencySymbol: "$",
    currency: "USD"
  },

];

const Promotion = () => {

  const navigate = useNavigate()
  const [featuresStatus, setFeaturesStatus] = useState({});
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [dataArray, setDataArray] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [showDrawer, setShowDrawer] = useState(false)
  //radio button content show
  const [status, setStatus] = useState('MONEY_OFF');
  const [redeemCount, setRedeemCount] = useState(0);
  const [redeemCode, setRedeemCode] = useState('');
  const [couponValueType, setCouponValueType] = useState('MONEY_OFF');
  const [selectedCountry, setSelectedCountry] = useState("default");
  const [currentDate, setTodayDate] = useState(new Date().toISOString());
  const [tomorrowDate, setTomorrowDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString());
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [nextSixmonthDate, setNextSixMonthDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString());
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [minimumPurchaseAmountCount, setMinimumPurchaseAmountCount] = useState(0);
  const [minimumPurchaseQuantityCount, setMinimumPurchaseQuantityCount] = useState(0);
  const [status3, setStatus3] = useState('GENERIC_CODE')
  const [freeGiftDescription, setFreeGiftDescription] = useState('')
  const [freeGiftValue, setFreeGiftValue] = useState('')
  const [freeGiftItemId, setFreeGiftItemId] = useState('')
  const [promotionToDelete, setPromotionToDelete] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [promotionButtonLoading, setPromotionButtonLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [notFoundText, setNotFoundText] = useState(null);
  const [couponValueCategory, setCouponValueCategory] = useState('Amount Off');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionError, setRegionError] = useState(false);
  const [promoTitleError, setPromoTitleError] = useState(false);
  const [promotionDestinationError, setPromotionDestinationError] = useState(false);
  const [promoIDError, setPromoIDError] = useState(false);
  const [discountCodeError, setDiscountCodeError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState(false);
  const [promotionsOtherErrors, setPromotionsOtherErrors] = React.useState(false);
  const [promotionsOtherErrorsMsg, setPromotionsOtherErrorsMsg] = React.useState(null);
  const [dateError, setDateError] = useState(false);
  const [discountAmountError, setDiscountAmountError] = useState(false);


  const [inputs, setInputs] = useState(
    {
      id: null,
      longTitle: null,
      targetCountry: null,
      contentLanguage: null,
      currency: null,
      couponValueType: 'MONEY_OFF',
      promotionDestinationIds: ["Free_listings", "Shopping_ads"],
      offerType: "GENERIC_CODE",
      promotionDisplayTimePeriod: { startTime: startDate, endTime: endDate },
      promotionEffectiveTimePeriod: { startTime: startDate, endTime: endDate },
      redemptionChannel: [
        "ONLINE"
      ],
      productApplicability: "SPECIFIC_PRODUCTS"

    });
  const promotionCategoryHandler = (couponValueTypeValue) => {
    setStatus(couponValueTypeValue);
    setInputs((values) => ({ ...values, ['couponValueType']: couponValueTypeValue }));

  };
  const handleCouponValueType = (couponValue) => {
    setInputs((values) => ({ ...values, ['couponValueType']: couponValue }));
  };

  const handleRadioChange = (event) => {
    setStatus3(event.target.value);
    setInputs((values) => ({ ...values, [event.target.name]: event.target.value }));
  };
  const handleRadioChange1 = (event) => {
    setInputs((values) => ({ ...values, [event.target.name]: event.target.value }));
  };



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [text, setText] = useState('')
  const [percentOffText, setPercentOffText] = useState('')
  const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState("");
  const [minimumPurchaseQuantity, setMinimumPurchaseQuantity] = useState("");
  const [quantityDiscounted, setQuantityDiscounted] = useState("");
  const [promotionTitle, setPromotionTitle] = useState("");
  const [promotionID, setPromotionID] = useState("");
  const [freeListing, setFreeListing] = useState(true);
  const [shoppingAds, setShoppingAds] = useState(true);
  ////////////////////////////////////////////////////////////////////
  const [pauseModal, setpauseModal] = useState(false)

  /////////////////////////////////////////////////////////////////

  const handlePromotionID = (e) => {
    // cannot use special characters
    setCount1(e.target.value.length)
    const regex = /^[a-zA-Z0-9-_]*$/;
    if (regex.test(e.target.value)) {
      if (e.target.value.length > 0) {
        setPromoIDError(false);
        setPromotionID(e.target.value);
        setInputs((values) => ({ ...values, ['id']: e.target.value, ['promotionId']: e.target.value }))
      } else {
        setPromoIDError(true);
        setPromotionID(null);
        setInputs((values) => ({ ...values, ['id']: null, ['promotionId']: null }))
      }
      // ['promotionId']: `online:${contentLanguage}:${targetCountry}:${e.target.value}`,
    }
  }
  const handleSearchChange = (e) => {
    // cannot use special characters
    const regex = /^[a-zA-Z0-9-_]*$/;
    if (regex.test(e.target.value)) {
      if (e.target.value.length > 0) {
        setIsLoading(true);
        setDataArray(filterArray.filter((obj) => {
          let searchValues = e.target.value.toLowerCase().split(" ");
          return searchValues.every((val) =>
            obj.longTitle.toLowerCase().includes(val)
            || obj.promotionId.toLowerCase().includes(val)
            || obj.promotionTypeName.toLowerCase().includes(val)
            || obj.couponValueCategory.toLowerCase().includes(val));
        }))
        setIsLoading(false);

      } else {
        setDataArray(filterArray);
      }
    }
  }
  const handlePromoTitle = (e) => {
    setCount(e.target.value.length);
    if (e.target.value.length > 0 && e.target.value !== '') {
      setPromoTitleError(false);
      setPromotionTitle(e.target.value),
        setInputs((values) => ({ ...values, ['longTitle']: e.target.value }))
    } else {
      setPromotionTitle(null);
      setPromoTitleError(true);
      setInputs((values) => ({ ...values, ['longTitle']: null }))
    }
  }
  const handleRedeemCode = (e) => {
    setRedeemCount(e.target.value.length);
    if (e.target.value.length > 0 && e.target.value !== '') {
      setRedeemCode(e.target.value);
      setDiscountCodeError(false);
      setInputs((values) => ({ ...values, ['genericRedemptionCode']: e.target.value }))

    } else {
      setDiscountCodeError(true);
      setRedeemCode(null);
      setInputs((values) => ({ ...values, ['genericRedemptionCode']: null }))
    }
  }
  const handleDestination1 = (event) => {
    setShoppingAds(event.target.checked);
    if (event.target.checked) {
      setPromotionDestinationError(false);
      let destination = [event.target.value];
      if (freeListing) destination.push('Free_listings');
      setInputs((values) => ({ ...values, promotionDestinationIds: destination }));
    } else if (freeListing) {
      setPromotionDestinationError(false);

      setInputs((values) => ({ ...values, promotionDestinationIds: ['Free_listings'] }))
    } else {
      const newInputs = { ...inputs };
      delete newInputs.promotionDestinationIds;
      setInputs(newInputs);
      setPromotionDestinationError(true);

      //   setInputs((values) => ({ ...values, promotionDestinationIds: [] }))

    }
  };
  const handleDestination2 = (event) => {
    setFreeListing(event.target.checked);
    if (event.target.checked) {
      setPromotionDestinationError(false);
      let destination = [event.target.value];
      if (shoppingAds) destination.push('Shopping_ads');
      setInputs((values) => ({ ...values, promotionDestinationIds: destination }));
    } else if (shoppingAds) {
      setInputs((values) => ({ ...values, promotionDestinationIds: ['Shopping_ads'] }))
      setPromotionDestinationError(false);
    } else {
      const newInputs = { ...inputs };
      delete newInputs.promotionDestinationIds;
      setInputs(newInputs);
      setPromotionDestinationError(true);
      //   setInputs((values) => ({ ...values, promotionDestinationIds: [] }))

    }
  };

  /*
   |--------------------------------------------------------------------------
   | Custom States  For Storing States on API calls And Event Handling [BACKEND]
   |--------------------------------------------------------------------------
   |
   */

  const today = new Date();
  // const todayDate = today.toISOString().slice(0, 10);
  const todayDate = today.toISOString();
  const handleStartDateChange = (event) => {
    setDateError(false);
    let startDate = new Date(event.target.value);
    startDate = startDate.toISOString()
    if (startDate < todayDate) {
      setDateError(true);
      //   alert('Invalid date. Please select a date from today or future');
    } else {
      setStartDate(startDate);
      setInputs((values) => ({
        ...values,
        promotionDisplayTimePeriod: { startTime: startDate, endTime: endDate },
        promotionEffectiveTimePeriod: { startTime: startDate, endTime: endDate }
      }))
    }
  }
  const handleEndDateChange = (event) => {
    setDateError(false);
    let endDate = new Date(event.target.value);
    endDate = endDate.toISOString()
    if (endDate < todayDate || endDate < startDate) {
      setDateError(true);
      //   alert('Invalid date. Please select a date from today or future');
    } else {
      setEndDate(endDate);
      setInputs((values) => ({
        ...values,
        promotionDisplayTimePeriod: { startTime: startDate, endTime: endDate },
        promotionEffectiveTimePeriod: { startTime: startDate, endTime: endDate }

      }))
    }
  }




  /*
   |--------------------------------------------------------------------------
   | Custom Functions For API calls And Event Handling [BACKEND]
   |--------------------------------------------------------------------------
   |
   */
  const handleMoneyOff = (e) => {
    setText(e.target.value);
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      newInputs.moneyOffAmount = { value: e.target.value, currency: inputs.currency }
    } else {
      delete newInputs.moneyOffAmount;
    }
    setInputs(newInputs);
  }
  const handlePercentOff = (e) => {
    setPercentOffText(e.target.value);
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      if (e.target.value > 0 && e.target.value <= 100) {
        setDiscountAmountError(false);
        newInputs.percentOff = e.target.value
      } else {
        delete newInputs.percentOff;
        setDiscountAmountError(true);
      }
    } else {
      delete newInputs.percentOff;
    }
    setInputs(newInputs);

  }
  const handleMinimumPurchaseAmount = (e) => {
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      if (e.target.value.length < 11) {
        setMinimumPurchaseAmount(e.target.value);
        setMinimumPurchaseAmountCount(e.target.value.length);
        newInputs.minimumPurchaseAmount = { value: e.target.value, currency: inputs.currency }
      }
    } else {
      setMinimumPurchaseAmount(e.target.value);
      setMinimumPurchaseAmountCount(e.target.value.length);
      delete newInputs.minimumPurchaseAmount;
    }
    setInputs(newInputs);
  }
  const handleGiftCardValue = (e) => {
    setFreeGiftValue(e.target.value);
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      newInputs.freeGiftValue = { value: e.target.value, currency: inputs.currency }
    } else {
      delete newInputs.freeGiftValue;
    }
    setInputs(newInputs);
  }
  const handleQuantityDiscounted = (e) => {
    setQuantityDiscounted(e.target.value);
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      newInputs.getThisQuantityDiscounted = e.target.value;
    } else {
      delete newInputs.getThisQuantityDiscounted;
    }
    setInputs(newInputs);
  }
  const handleMinimumPurchaseQuantity = (e) => {
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      if (e.target.value.length < 4) {
        setMinimumPurchaseQuantity(e.target.value);
        setMinimumPurchaseQuantityCount(e.target.value.length);
        newInputs.minimumPurchaseQuantity = e.target.value;
        // newInputs.minimumPurchaseQuantity = 452;
      }
    } else {
      setMinimumPurchaseQuantity(e.target.value);
      setMinimumPurchaseQuantityCount(e.target.value.length);
      delete newInputs.minimumPurchaseQuantity;
    }
    setInputs(newInputs);

  }
  const handleFreeGiftDescription = (e) => {
    setFreeGiftDescription(e.target.value);
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      newInputs.freeGiftDescription = e.target.value;
    } else {
      delete newInputs.freeGiftDescription;
    }
    setInputs(newInputs);
  }
  const handleFreeGiftItemID = (e) => {
    setFreeGiftItemId(e.target.value);
    const newInputs = { ...inputs };
    if (e.target.value.length > 0 && e.target.value !== '') {
      newInputs.freeGiftItemId = e.target.value;
    } else {
      delete newInputs.freeGiftItemId;
    }
    setInputs(newInputs);
  }
  const handleRegion = (event) => {
    const region = event.target.value;
    setSelectedRegion(`${promotionDetails[event.target.value].countryName} - ${promotionDetails[event.target.value].countryLanguage} -  ${promotionDetails[event.target.value].currencyName}`);
    setSelectedCountry(region);
    setRegionError(false);
    const updatedValues = {};
    if (text !== null && text.length > 0) {
      updatedValues.moneyOffAmount = { value: text, currency: promotionDetails[region].currency };
    }
    if (minimumPurchaseAmount !== null && minimumPurchaseAmount.length > 0) {
      updatedValues.minimumPurchaseAmount = { value: minimumPurchaseAmount, currency: promotionDetails[region].currency };
    }
    if (freeGiftValue !== null && freeGiftValue.length > 0) {
      updatedValues.freeGiftValue = { value: freeGiftValue, currency: promotionDetails[region].currency };
    }
    updatedValues.targetCountry = promotionDetails[event.target.value].targetCountry;
    updatedValues.contentLanguage = promotionDetails[event.target.value].contentLanguage;
    updatedValues.currency = promotionDetails[event.target.value].currency;
    setInputs(values => ({ ...values, ...updatedValues }));

  }
  const displayPromotionData = (promotionsData) => {
    if (promotionsData.length > 0) {
      const newPromotions = promotionsData.map(({ id, region, productApplicability, couponValueType, promotionTypeName, promotionDestinationIds, couponValueCategory, selectedRegion, ...element }, index) => {
        let promotionEffectiveTimePeriod = JSON.parse(element.promotionEffectiveTimePeriod)
        let promotionStatus = JSON.parse(element.promotionStatus)
        const { status1, status2, freeListingStatus, shoppingAdsStatus } = (promotionStatus !== null) ? extractData(promotionStatus) : {};
        if (promotionEffectiveTimePeriod) {
          const { startTime, endTime } = promotionEffectiveTimePeriod;
          const start = formatDate(startTime, region);
          const end = formatDate(endTime, region);
          const couponValue = couponValueType.replaceAll(/_/g, ' ');
          const applicability = productApplicability.replace(/_/g, ' ');
          let destinationIds = promotionDestinationIds ? JSON.parse(promotionDestinationIds).toString().replace(/_/g, ' ') : "";
          return Object.assign({ id: id, start, end, selectedRegion: selectedRegion, couponValueType: couponValue, promotionTypeName: promotionTypeName, couponValueCategory: couponValueCategory, productApplicability: applicability, promotionDestinationIds: destinationIds, status1: status1, status2: status2, freeListingStatus: freeListingStatus, shoppingAdsStatus: shoppingAdsStatus }, element);

        }
      });
      console.log(newPromotions)
      setNotFoundText(null);
      setDataArray(newPromotions);
      setFilterArray(newPromotions);
    } else {
      setNotFoundText("No Prmotion Found")
    }
  }
  const displayResponseErrors = (errors) => {
    for (const key in errors) {
      // console.log(errors[key]);
      if (key === 'contentLanguage') setRegionError(true);
      if (key === 'longTitle') setPromoTitleError(true);
      if (key === 'promotionId') setPromoIDError(true);
      if (key === 'genericRedemptionCode') setDiscountCodeError(true);
      if (key === 'promotionDisplayTimePeriod.endTime' || key === 'promotionDisplayTimePeriod.endTime') setDateError(true);
      if (key === 'promotionDestinationIds') setPromotionDestinationError(true);

    }
  }
  const setStatesToDefault = () => {
    setInputs({
      id: null,
      longTitle: null,
      targetCountry: null,
      contentLanguage: null,
      currency: null,
      couponValueType: 'MONEY_OFF',
      promotionDestinationIds: ["Free_listings", "Shopping_ads"],
      offerType: "GENERIC_CODE",
      promotionDisplayTimePeriod: { startTime: startDate, endTime: endDate },
      promotionEffectiveTimePeriod: { startTime: startDate, endTime: endDate },
      redemptionChannel: [
        "ONLINE"
      ],
      productApplicability: "SPECIFIC_PRODUCTS"

    });
    setText("");
    setPercentOffText("");
    setMinimumPurchaseAmount("");
    setMinimumPurchaseQuantity("");
    setQuantityDiscounted("");
    setPromotionTitle("");
    setPromotionID("");
    setFreeListing(true);
    setShoppingAds(true);
    setStatus3("GENERIC_CODE");
    setMinimumPurchaseQuantityCount(0);
    setMinimumPurchaseAmountCount(0);
    setSelectedCountry("default");
    setDiscountAmountError(false);
    setStatus("MONEY_OFF");
    setFreeGiftDescription("");
    setFreeGiftValue("");
  }

  const handleCancelButton = () => {
    setShowDrawer(false);
    setRegionError(false);
    setPromoTitleError(false);
    setPromoIDError(false);
    setDiscountCodeError(false);
    setDiscountCodeError(false);
    setDateError(false);
    setPromotionDestinationError(false);
    setFormErrorMessage(false);
    setPromotionButtonLoading(false);
    setIsDisabled(false);
    setPromotionsOtherErrors(false);
  }




  const removeInvalidIndexes = () => {
    if (inputs.couponValueType == "BUY_M_GET_PERCENT_OFF" && 'getThisQuantityDiscounted' in inputs) {
      delete inputs.getThisQuantityDiscounted;
    }
    if (inputs.couponValueType == "PERCENT_OFF" && 'minimumPurchaseQuantity' in inputs) {
      delete inputs.minimumPurchaseQuantity;
    }
    if (inputs.couponValueType == "BUY_M_GET_PERCENT_OFF" && 'getThisQuantityDiscounted' in inputs) {
      delete inputs.getThisQuantityDiscounted;
    }
    if (inputs.couponValueType == "BUY_M_GET_N_PERCENT_OFF" && 'minimumPurchaseAmount' in inputs) {
      delete inputs.minimumPurchaseAmount;
    }
    if (inputs.couponValueType == "MONEY_OFF" && 'minimumPurchaseQuantity' in inputs) {
      delete inputs.minimumPurchaseQuantity;
    }
    if (inputs.couponValueType == "BUY_M_GET_PERCENT_OFF" && 'minimumPurchaseAmount' in inputs) {
      delete inputs.minimumPurchaseAmount;
    }
    if (inputs.couponValueType == "MONEY_OFF" && 'getThisQuantityDiscounted' in inputs) {
      delete inputs.getThisQuantityDiscounted;
    }
    if (inputs.couponValueType == "BUY_M_GET_MONEY_OFF" && 'getThisQuantityDiscounted' in inputs) {
      delete inputs.getThisQuantityDiscounted;
    }
    if (inputs.couponValueType == "PERCENT_OFF" && 'getThisQuantityDiscounted' in inputs) {
      delete inputs.getThisQuantityDiscounted;
    }
    if (inputs.couponValueType == "BUY_M_GET_N_PERCENT_OFF" && 'getThisQuantityDiscounted' in inputs) {
      delete inputs.getThisQuantityDiscounted;
    }
    if (inputs.couponValueType == "FREE_GIFT" && 'freeGiftItemId' in inputs) {
      delete inputs.freeGiftItemId;
    }
    if (inputs.couponValueType == "FREE_GIFT" && 'freeGiftValue' in inputs) {
      delete inputs.freeGiftValue;
    }
    if (inputs.couponValueType == "FREE_GIFT_WITH_VALUE" && 'freeGiftDescription' in inputs) {
      delete inputs.freeGiftDescription;
    }
    if (inputs.couponValueType == "FREE_GIFT_WITH_VALUE" && 'freeGiftItemId' in inputs) {
      delete inputs.freeGiftItemId;
    }
    if (inputs.couponValueType == "FREE_GIFT_WITH_ITEM_ID" && 'freeGiftDescription' in inputs) {
      delete inputs.freeGiftDescription;
    }
  }




  const createPromotion = () => {
    setFormErrorMessage(false);
    setPromotionButtonLoading(true);
    setIsDisabled(true);

    removeInvalidIndexes();

    axioshttp
      .post("createPromo", { inputs, couponValueCategory, selectedRegion })
      .then((response) => {
        if (response.data.status === true) {
          setStatesToDefault();
          setShowDrawer(false);
          setShowDrawer(false)
          displayPromotionData(response.data.promotions);
          setToastMessage(response.data.message);
          setShowToast(true);
          // setIsLoading(false);
          setPromotionButtonLoading(false);
          setIsDisabled(false);
          setSelectedCountry("default");
          setRedeemCode('');

        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setPromotionButtonLoading(false);
        setIsDisabled(false);
        if (error.response.data.status === false) {
          if (typeof error.response.data.message === 'object') {
            if (Object.keys(error.response.data.message).length > 0) {
              displayResponseErrors(error.response.data.message);
              setFormErrorMessage(true);
            }
          } else {
            setPromotionsOtherErrors(true);
            setPromotionsOtherErrorsMsg(error.response.data.message);
          }
          console.log(error.response.data);

        }
      });
  };
  const formatDate = (date, region) => {
    const options = { month: "2-digit", day: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat(region, options).format(new Date(date));
  };
  const extractData = (data) => {
    let destinations1 = "";
    let destinations2 = "";
    let promotion = "";
    let shoppingAdsStatus = "";
    let freeListingStatus = "";
    data.destinationStatuses.forEach(({ destination, status }) => {
      if (destination === 'surfaces_across_google') {
        if (status === "REJECTED") {
          shoppingAdsStatus = "error";
          // setShoppingAdsStatus("error");
        } else {
          shoppingAdsStatus = "success";
          // setShoppingAdsStatus("success")
        }
        destinations1 = `Shopping Ads : ${status}`;
      } else {
        if (status === "REJECTED") {
          freeListingStatus = "error";
          // setFreeListingStatus("error");
        } else {
          freeListingStatus = "success";
          // setFreeListingStatus("success");

        }
        destinations2 = `Free Listing : ${status}`;
      }
    });
    return { status1: destinations1, status2: destinations2, freeListingStatus: freeListingStatus, shoppingAdsStatus: shoppingAdsStatus };
    // return { status: `${destinations+" "+promotion}`};
  }
  const getPromotions = () => {
    axioshttp
      .get("getPromotions")
      .then((response) => {
        setIsLoading(false);
        if (response.data.status === true) {
          displayPromotionData(response.data.promotions);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deletePromotion = () => {
    setLoading(true);
    setDisabled(true);
    axioshttp
      .delete(`/deletePromotion/${promotionToDelete.id}`)
      .then((response) => {
        setpauseModal(false);
        setLoading(false);
        setDisabled(false)
        setToastMessage(response.data.message);
        setShowToast(true);
        displayPromotionData(response.data.promotions);
      })
      .catch((error) => {
        console.log(error);
        setpauseModal(false);
        setLoading(false);
        setDisabled(false)
        setToastMessage("Something Went Wrong");
        setShowToast(true);

      });
  };

  const handleCreatePromotionClick = () => {
    if (featuresStatus.promotion) {
      setShowDrawer(true);
    } else {
      setShowUpgradeModel(true);
    }
  }

  const handleUpgradeModelCancel = () => {
    setShowUpgradeModel(false);
  }

  const fetchFeaturesStatus = () => {
    axioshttp.get('get/features/status').then(response => {
      if (response.data.status == true) {
        setFeaturesStatus(response.data.features)
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const handleUpgradeNow = useCallback(() => navigate(`/pricing`, { replace: true }), [navigate]);


  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/promotion", title: "Promotion" });
    fetchFeaturesStatus();
    setIsLoading(true);
    getPromotions();
  }, []);

  React.useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 4000);
    }
  }, [showToast]);

  return (
    <>
      <div className='p-8'>
        <>
          <p className='pt-2 pb-4'>Offer discounts and free gifts with your products by setting up promotions. Your promotions must meet the participation requirements. <a className='text-blue-600 font-semibold' target='_blank' href='https://support.google.com/merchants/answer/4588748?hl=en'>Learn more</a></p>
          <VideoModal margin='0 0 0 10px' title='How to setup promotions ?' videoSrc='https://www.youtube.com/embed/Cid-DOFiDl4' />
        </>
        <>
          <div className='bg-white rounded-md p-3' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
            <div className='flex items-center justify-between pt-1 pb-2'>
              <div className='mr-2 flex items-center'>
                <Button className='flex items-center' onClick={handleCreatePromotionClick} variant='contained' style={{ color: 'white', background: '#008060', textTransform: 'capitalize' }}>
                  <AddCircleOutlineIcon />
                  <p className='ml-2'>Create Promotion</p>
                </Button>
              </div>
              <div class="relative w-[25%]">
                <input onChange={handleSearchChange} type="text" name="hs-table-search" id="hs-table-search" class="block w-full p-2 pl-10 text-sm border border-[#babfc3] rounded-md focus:border-blue-500 focus:ring-blue-500 " placeholder="Promotion Id and title" />
                <SearchIcon style={{ position: 'absolute', top: '10px', left: '10px' }} />
              </div>
            </div>
            <div className="overflow-x-scroll border rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-gray-50 overflow-x-scroll">
                  <tr>
                    <td scope="col" className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize ">
                      Title
                    </td>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Promotion ID
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Promo code
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Promotion Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Promotion Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Start
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      End
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Product applicability
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Country - Language - Currency
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Promotion  Destination
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Promotion Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Action
                    </th>
                  </tr>
                </tbody>
                {isLoading &&
                  <>
                    <tr className='hover:bg-gray-100 cursor-pointer'>

                      <td className="px-6 py-2 text-sm font-medium text-blue-400 whitespace-nowrap">
                        <CircularProgress
                          size={20}
                          style={{ color: "#008060", marginRight: "10px", marginTop: "5px" }}
                        />
                        <span className='text-gray-600 mr-8 mt-3 inline-block'>Gettting Promotions.... </span>
                      </td>
                    </tr>

                  </>
                }
                {notFoundText !== null &&
                  <tr className='hover:bg-gray-100 cursor-pointer'>

                    <td className="px-6 py-2 text-sm font-medium text-blue-400 whitespace-nowrap">
                      <span className='text-gray-600 mr-8 mt-3 inline-block'>{notFoundText}</span>
                    </td>
                  </tr>
                }
                {(!isLoading && notFoundText == null) &&
                  <tbody className="divide-y divide-gray-200 overflow-x-scroll">
                    {dataArray.length > 0 &&
                      dataArray.map((data, index) => (
                        <tr className='hover:bg-gray-100 cursor-pointer' key={data.id}>
                          {/* To Be Continueeeee.................... */}
                          <td className="w-[50px] px-6 overflow-hidden py-2 text-sm font-medium text-blue-400 whitespace-nowrap">
                            <p className="w-full">{data.longTitle}</p>
                          </td>
                          <td className="w-[50px] px-6 overflow-hidden py-2 text-sm text-gray-800 whitespace-nowrap">
                            <p className="w-full">{data.promotionId}</p>
                          </td>


                          {/* <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
    {data.promoCode}
  </td> */}
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.couponValueCategory}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.promotionTypeName}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.start}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.end}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.productApplicability}
                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.selectedRegion}
                          </td>
                          {/* <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            {data.promotionDestinationIds}
                          </td> */}
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            <p>
                              {(data.shoppingAdsStatus === "success") &&
                                <CheckCircleOutlineIcon style={{ color: "#008060" }} />
                              }
                              {(data.shoppingAdsStatus === "error") &&
                                <WarningIcon style={{ color: "red" }} />}
                              {data.status1}
                            </p>
                            <p>
                              {(data.freeListingStatus === "success") &&
                                <CheckCircleOutlineIcon style={{ color: "#008060" }} />
                              }
                              {(data.freeListingStatus === "error") &&
                                <WarningIcon style={{ color: "red" }} />}
                              {data.status2}
                            </p>

                          </td>
                          <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
                            <div class="rounded-md" role="group">
                              <button
                                onClick={() => { setPromotionToDelete({ id: data.id }), setpauseModal(true) }}
                                type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-md border-2 hover:bg-white  focus:z-10 focus:bg-[#008060] focus:text-white text-black">
                                <PauseCircleFilledIcon style={{ fontSize: '20px', marginRight: '5px' }} />
                                End Promotion
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}



                  </tbody>
                }
              </table>
            </div>
          </div>
        </>
      </div>


      {/* create promotion drawer component */}

      <>
        {showDrawer ? (
          // <!-- drawer component -->
          <div className=''>
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={handleCancelButton}
            ></div>
            <div style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)" }}
              className={`top-0 right-0 overflow-x-auto  rounded-tl-lg rounded-bl-lg w-[95%] sm:w-[85%] md:w-[90%] lg:w-[70%] xl:w-[50%] 2xl:w-[60%] bg-white transition-all  p-4 text-black fixed h-full z-40  ease-in-out duration-900 ${showDrawer ? "translate-x-0 " : "translate-x-full"
                }`}
            >
              <div className='p-2'>
                <p className='text-xl font-medium'>Create Promotion</p>
                <p className='text-sm font-medium pt-2 pb-2'>Tell us about your promotion and where you want to show it.</p>
                <div className='pt-2 pb-4'>
                  <p className='text-sm font-medium pt-2 pb-2'>Target Country/Region, language and Currency</p>
                  <select id="countries" class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                    onChange={handleRegion} //Country Region & language
                    value={selectedCountry || "default"}
                  >
                    <option disabled="" value="default">- - Select - -</option>
                    {promotionDetails.map((item, key) => (
                      < option value={key} > {`${item.countryName} - ${item.countryLanguage} - ${item.currencyName}`}</option>
                    ))}
                  </select>
                  {regionError &&
                    <span class="text-red-600 text-xs font-bold ">Please Select a Region it is Required</span>
                  }
                </div>
                <>
                  <div class="container">
                    <p className='font-medium pb-2'>Promotion Category</p>
                    <div class="grid-wrapper grid-col-auto">
                      <label for="radio-card-1" class="radio-card">
                        <input checked={status === 'MONEY_OFF'} onClick={(e) => { setStatesToDefault(), promotionCategoryHandler("MONEY_OFF"); setCouponValueCategory("Amount Off") }} className='radioBtn' type="radio" name="radio-card" id="radio-card-1" defaultChecked />
                        <div class="card-content-wrapper">
                          <span class="check-icon"></span>
                          <div class="card-content">
                            <h4><AttachMoneyIcon style={{ fontSize: '50px' }} /></h4>
                            <h5>Amount off</h5>
                          </div>
                        </div>
                      </label>

                      <label for="radio-card-2" class="radio-card">
                        <input checked={status === 'PERCENT_OFF'}

                          onClick={(e) => { setStatesToDefault(), promotionCategoryHandler("PERCENT_OFF"); setCouponValueCategory("Percent Off") }} className='radioBtn' type="radio" name="radio-card" id="radio-card-2" />
                        <div class="card-content-wrapper">
                          <span class="check-icon"></span>
                          <div class="card-content">
                            <h4><PercentIcon style={{ fontSize: '50px' }} /></h4>
                            <h5>Percent off</h5>
                          </div>
                        </div>
                      </label>

                      <label for="radio-card-3" class="radio-card">
                        <input checked={status === 'FREE_GIFT'} onClick={(e) => { setStatesToDefault(), promotionCategoryHandler('FREE_GIFT'); setCouponValueCategory("Free Gift") }} className='radioBtn' type="radio" name="radio-card" id="radio-card-3" />
                        <div class="card-content-wrapper">
                          <span class="check-icon"></span>
                          <div class="card-content">
                            <h4><CardGiftcardIcon style={{ fontSize: '50px' }} /></h4>
                            <h5>Free gift</h5>
                          </div>
                        </div>
                      </label>
                      <label for="radio-card-4" class="radio-card">
                        <input checked={status === "FREE_SHIPPING_STANDARD"} onClick={(e) => { setStatesToDefault(), promotionCategoryHandler("FREE_SHIPPING_STANDARD"), setCouponValueCategory("Free Shipping") }} className='radioBtn' type="radio" name="radio-card" id="radio-card-4" />
                        <div class="card-content-wrapper">
                          <span class="check-icon"></span>
                          <div class="card-content">
                            <h4><LocalShippingIcon style={{ fontSize: '50px' }} /></h4>
                            <h5>Free shipping</h5>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>


                  <>
                    <div className='bg-[#f6f6f7] mt-4 p-4'>
                      <p className='font-medium pb-2'>Promotion Type</p>
                      {status === 'MONEY_OFF' &&
                        <>
                          <RadioGroup
                            value={inputs.couponValueType || "MONEY_OFF"}
                          >
                            <FormControlLabel checked={inputs.couponValueType === 'MONEY_OFF'} onChange={(e) => handleCouponValueType('MONEY_OFF')}
                              value="MONEY_OFF" control={<Radio style={{ color: '#008060' }} />} label="Amount off" />
                            <FormControlLabel checked={inputs.couponValueType === 'BUY_M_GET_MONEY_OFF'} onChange={(e) => { handleCouponValueType('BUY_M_GET_MONEY_OFF') }} value="BUY_M_GET_MONEY_OFF" control={<Radio style={{ color: '#008060' }} />} label="Buy quantity of products, get amount off" />
                            <FormControlLabel checked={inputs.couponValueType === 'BUY_M_GET_N_MONEY_OFF'} onChange={(e) => handleCouponValueType('BUY_M_GET_N_MONEY_OFF')} value="BUY_M_GET_N_MONEY_OFF" control={<Radio style={{ color: '#008060' }} />} label="Buy quantity of products, get the same item at a discount" />
                          </RadioGroup>
                          <>
                            <div className='mt-8'>
                              {inputs.couponValueType === 'MONEY_OFF' &&
                                <>
                                  <TextField type='number'

                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 5)
                                    }}
                                    min={0}
                                    value={text} error={text === ""} helperText={text === "" ? 'Please enter an amount' : ' '}
                                    onChange={handleMoneyOff}
                                    fullWidth size='small' id="outlined-basic" label="Discount amount *" variant="outlined" />
                                  <br />
                                  <br />
                                  <TextField fullWidth type='number'
                                    maxlength="10"
                                    value={minimumPurchaseAmount}
                                    onChange={handleMinimumPurchaseAmount}
                                    size='small' id="outlined-basic"
                                    label="Minimum purchase amount (optional)" variant="outlined" />
                                  <span class="w-10 h-6 text-black text-sm">{minimumPurchaseAmountCount}/10</span>
                                </>
                              }
                              {inputs.couponValueType === 'BUY_M_GET_MONEY_OFF' &&
                                <>
                                  <TextField type='number'
                                    //  InputProps={{ inputProps: { maxLength: 5 } }}
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 5)
                                    }}
                                    min={0}

                                    value={minimumPurchaseQuantity} error={minimumPurchaseQuantity === ""} helperText={minimumPurchaseQuantity === "" ? 'Please enter an amount' : ' '}
                                    onChange={handleMinimumPurchaseQuantity}

                                    fullWidth size='small' id="outlined-basic" label="Quantity purchased *" variant="outlined" />
                                  <br />
                                  <br />
                                  <TextField type='number'
                                    // InputProps={{ inputProps: { maxLength: 5 } }}

                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 5)
                                    }}
                                    min={0}

                                    value={text} error={text === ""} helperText={text === "" ? 'Please enter a value' : ' '}
                                    onChange={handleMoneyOff}
                                    fullWidth size='small' id="outlined-basic" label="Discount amount *" variant="outlined" />
                                </>
                              }
                              {inputs.couponValueType === 'BUY_M_GET_N_MONEY_OFF' &&
                                <>
                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 5)
                                    }}
                                    min={0}

                                    value={minimumPurchaseQuantity} error={minimumPurchaseQuantity === ""} helperText={minimumPurchaseQuantity === "" ? 'Please enter a value' : ' '}
                                    onChange={handleMinimumPurchaseQuantity}
                                    fullWidth size='small' id="outlined-basic" label="Quantity purchased *" variant="outlined" />
                                  <br />
                                  <br />
                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}

                                    value={quantityDiscounted} error={quantityDiscounted === ""} helperText={quantityDiscounted === "" ? 'Please enter a value' : ' '}
                                    onChange={handleQuantityDiscounted}

                                    fullWidth size='small' id="outlined-basic" label="Quantity discounted *" variant="outlined" />
                                  <br />
                                  <br />
                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 6)
                                    }}
                                    min={0}
                                    value={text} error={text === ""} helperText={text === "" ? 'Please enter an amount' : ' '}
                                    onChange={handleMoneyOff}
                                    fullWidth size='small' id="outlined-basic" label="Discount amount *" variant="outlined" />
                                </>
                              }
                            </div>
                          </>
                        </>
                      }
                      {status === "PERCENT_OFF" &&
                        <>
                          <RadioGroup
                            value={inputs.couponValueType || "PERCENT_OFF"}
                          >
                            <FormControlLabel checked={inputs.couponValueType === 'PERCENT_OFF'} onChange={(e) => handleCouponValueType('PERCENT_OFF')} value="PERCENT_OFF" control={<Radio style={{ color: '#008060' }} />} label="Percent off" />
                            <FormControlLabel checked={inputs.couponValueType === 'BUY_M_GET_PERCENT_OFF'} onChange={(e) => handleCouponValueType('BUY_M_GET_PERCENT_OFF')} value="BUY_M_GET_PERCENT_OFF" control={<Radio style={{ color: '#008060' }} />} label="Buy quantity of products, get percent off" />
                            <FormControlLabel checked={inputs.couponValueType === 'BUY_M_GET_N_PERCENT_OFF'} onChange={(e) => handleCouponValueType('BUY_M_GET_N_PERCENT_OFF')} value="BUY_M_GET_N_PERCENT_OFF" control={<Radio style={{ color: '#008060' }} />} label="Buy quantity of products, get the same item at a percent off" />
                          </RadioGroup>
                          <>
                            <div className='mt-8'>
                              {inputs.couponValueType === 'PERCENT_OFF' &&
                                <>
                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}
                                    value={percentOffText} error={percentOffText === ""} helperText={percentOffText === "" ? 'Please enter a value' : ' '}
                                    onChange={handlePercentOff}
                                    fullWidth size='small' id="outlined-basic" label="Discount percentage *" variant="outlined" />
                                  {discountAmountError &&
                                    <span class="text-red-600 text-xs font-bold">Discount Percentage Must Me Beween 0-100</span>
                                  }
                                  <br />
                                  <br />
                                  <TextField fullWidth type='number'
                                    maxlength="10"
                                    value={minimumPurchaseAmount}
                                    onChange={handleMinimumPurchaseAmount}
                                    size='small' id="outlined-basic" label="Minimum purchase amount (optional)" variant="outlined" />
                                  <span class="w-10 h-6 text-black text-sm">{minimumPurchaseAmountCount}/10</span>
                                </>
                              }
                              {inputs.couponValueType === 'BUY_M_GET_PERCENT_OFF' &&
                                <>

                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}
                                    value={minimumPurchaseQuantity} error={minimumPurchaseQuantity === ""} helperText={minimumPurchaseQuantity === "" ? 'Please enter an amount' : ' '}
                                    onChange={handleMinimumPurchaseQuantity}
                                    fullWidth size='small' id="outlined-basic" label="Quantity purchased *" variant="outlined" />

                                  <br />
                                  <br />

                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}
                                    value={percentOffText} error={percentOffText === ""} helperText={percentOffText === "" ? 'Please enter a value' : ' '}
                                    onChange={handlePercentOff}
                                    fullWidth size='small' id="outlined-basic" label="Discount percentage *" variant="outlined" />
                                  {discountAmountError &&
                                    <span class="text-red-600 text-xs font-bold">Discount Percentage Must Me Beween 0-100</span>
                                  }
                                </>
                              }
                              {inputs.couponValueType === 'BUY_M_GET_N_PERCENT_OFF' &&
                                <>
                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}
                                    value={minimumPurchaseQuantity} error={minimumPurchaseQuantity === ""} helperText={minimumPurchaseQuantity === "" ? 'Please enter an amount' : ' '}
                                    onChange={handleMinimumPurchaseQuantity}
                                    fullWidth size='small' id="outlined-basic" label="Quantity purchased *" variant="outlined" />
                                  <br />
                                  <br />

                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}
                                    value={quantityDiscounted} error={quantityDiscounted === ""} helperText={quantityDiscounted === "" ? 'Please enter a value' : ' '}
                                    onChange={handleQuantityDiscounted}
                                    fullWidth size='small' id="outlined-basic" label="Quantity discounted *" variant="outlined" />
                                  <br />
                                  <br />
                                  <TextField type='number'
                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
                                    }}
                                    min={0}
                                    value={percentOffText} error={percentOffText === ""} helperText={percentOffText === "" ? 'Please enter a value' : ' '}
                                    onChange={handlePercentOff}
                                    fullWidth size='small' id="outlined-basic" label="Discount percentage *" variant="outlined" />
                                  {discountAmountError &&
                                    <span class="text-red-600 text-xs font-bold">Discount Percentage Must Me Beween 0-100</span>
                                  }
                                </>
                              }
                            </div>
                          </>
                        </>
                      }
                      {status === 'FREE_GIFT' &&
                        <>
                          <RadioGroup
                            name="promotionType"
                            value={inputs.couponValueType || "FREE_GIFT"}
                          >
                            <FormControlLabel checked={inputs.couponValueType === 'FREE_GIFT'} onChange={(e) => handleCouponValueType('FREE_GIFT')} value="FREE_GIFT" control={<Radio style={{ color: '#008060' }} />} label="Get a free gift" />
                            <FormControlLabel checked={inputs.couponValueType === 'FREE_GIFT_WITH_VALUE'} onChange={(e) => handleCouponValueType('FREE_GIFT_WITH_VALUE')} value="FREE_GIFT_WITH_VALUE" control={<Radio style={{ color: '#008060' }} />} label="Get a gift card" />
                            {/* <FormControlLabel checked={inputs.couponValueType === 'FREE_GIFT_WITH_ITEM_ID'} onChange={(e) => handleCouponValueType('FREE_GIFT_WITH_ITEM_ID')} value="FREE_GIFT_WITH_ITEM_ID" control={<Radio style={{ color: '#008060' }} />} label="Give a free gift from your inventory" /> */}
                          </RadioGroup>
                          <>
                            <div className='mt-8'>
                              {inputs.couponValueType === 'FREE_GIFT' &&
                                <>
                                  <TextField type='text'
                                    InputProps={{ inputProps: { maxLength: 100 } }}
                                    value={freeGiftDescription} error={freeGiftDescription === ""} helperText={freeGiftDescription === "" ? 'Please enter a value' : ' '}
                                    onChange={handleFreeGiftDescription}
                                    fullWidth size='small' id="outlined-basic" label="Free gift description *" variant="outlined" />

                                  <TextField fullWidth type='number'
                                    maxlength="10"
                                    value={minimumPurchaseAmount}
                                    onChange={handleMinimumPurchaseAmount}
                                    size='small' id="outlined-basic" label="Minimum purchase amount (optional)" variant="outlined" />
                                  <span class="w-10 h-6 text-black text-sm">{minimumPurchaseAmountCount}/10</span>
                                  <br />
                                  <br />

                                  <TextField type='number'
                                    maxlength="5"
                                    value={minimumPurchaseQuantity}
                                    onChange={handleMinimumPurchaseQuantity}
                                    fullWidth size='small' id="outlined-basic" label="Minimum purchase quantity (optional)*" variant="outlined" />
                                  <div class="flex items-center justify-center px-4 mt-1">
                                    <span class="w-10 h-6 text-black text-sm">{minimumPurchaseQuantityCount}/3</span>
                                  </div>
                                </>
                              }
                              {inputs.couponValueType === 'FREE_GIFT_WITH_VALUE' &&
                                <>
                                  <TextField type='number'

                                    onInput={(e) => {
                                      e.target.value =
                                        Math.max(0, parseInt(e.target.value)).toString().slice(0, 12)
                                    }}
                                    min={0}
                                    value={freeGiftValue} error={freeGiftValue === ""} helperText={freeGiftValue === "" ? 'Please enter a value' : ' '}
                                    onChange={handleGiftCardValue}
                                    fullWidth size='small' id="outlined-basic" label="Gift card value *" variant="outlined" />
                                  <br />
                                  <br />

                                  <TextField fullWidth type='number'
                                    maxlength="10"
                                    value={minimumPurchaseAmount}
                                    onChange={handleMinimumPurchaseAmount}
                                    size='small' id="outlined-basic" label="Minimum purchase amount (optional)" variant="outlined" />
                                  <span class="w-10 h-6 text-black text-sm">{minimumPurchaseAmountCount}/10</span>
                                  <br />
                                  <br />


                                  <TextField type='number'
                                    maxlength="5"
                                    value={minimumPurchaseQuantity}
                                    onChange={handleMinimumPurchaseQuantity}
                                    fullWidth size='small' id="outlined-basic" label="Minimum purchase quantity (optional)*" variant="outlined" />
                                  <div class="flex items-center justify-center px-4 mt-1">
                                    <span class="w-10 h-6 text-black text-sm">{minimumPurchaseQuantityCount}/3</span>
                                  </div>

                                </>
                              }
                              {/*  {inputs.couponValueType === 'FREE_GIFT_WITH_ITEM_ID' &&
                                <>
                                  <TextField type='text'
                                  InputProps={{ inputProps: { maxLength: 50 } }}
                                  value={freeGiftItemId} error={freeGiftItemId === ""} helperText={freeGiftItemId === "" ? 'Please enter a value' : ' '}
                                    onChange={handleFreeGiftItemID}
                                    fullWidth size='small' id="outlined-basic" label="Item ID of free gift *" variant="outlined" />
                                  <br />
                                  <br />

                                  <TextField fullWidth type='number'
                                    maxlength="10"
                                    value={minimumPurchaseAmount}
                                    onChange={handleMinimumPurchaseAmount}
                                    size='small' id="outlined-basic" label="Minimum purchase amount (optional)" variant="outlined" />
                                  <span class="w-10 h-6 text-black text-sm">{minimumPurchaseAmountCount}/10</span>
                                  <br />
                                  <br />
                                  <TextField type='number'
                                    maxlength="5"
                                    value={minimumPurchaseQuantity}
                                    onChange={handleMinimumPurchaseQuantity}
                                    fullWidth size='small' id="outlined-basic" label="Minimum purchase quantity (optional)*" variant="outlined" />
                                  <span class="w-10 h-6 text-black text-sm">{minimumPurchaseQuantityCount}/3</span>
                                </>
                              } */}
                            </div>
                          </>
                        </>
                      }
                      {status === 'FREE_SHIPPING_STANDARD' &&
                        <>
                          <RadioGroup
                            value={inputs.couponValueType || "FREE_SHIPPING_STANDARD"}
                          >
                            <FormControlLabel checked={inputs.couponValueType === 'FREE_SHIPPING_STANDARD'} onChange={(e) => handleCouponValueType('FREE_SHIPPING_STANDARD')} value="FREE_SHIPPING_STANDARD" control={<Radio style={{ color: '#008060' }} />} label="Free standard shipping" />
                            <FormControlLabel checked={inputs.couponValueType === 'FREE_SHIPPING_OVERNIGHT'} onChange={(e) => handleCouponValueType('FREE_SHIPPING_OVERNIGHT')} value="FREE_SHIPPING_OVERNIGHT" control={<Radio style={{ color: '#008060' }} />} label="Free overnight shipping" />
                            <FormControlLabel checked={inputs.couponValueType === 'FREE_SHIPPING_TWO_DAY'} onChange={(e) => handleCouponValueType('FREE_SHIPPING_TWO_DAY')}
                              value="FREE_SHIPPING_TWO_DAY" control={<Radio style={{ color: '#008060' }} />} label="Free 2-day shipping" />
                          </RadioGroup>
                          <>
                            <div className='mt-8'>
                              <>
                                <TextField fullWidth type='number'
                                  maxlength="10"
                                  value={minimumPurchaseAmount}
                                  onChange={handleMinimumPurchaseAmount}
                                  size='small' id="outlined-basic" label="Minimum purchase amount (optional)" variant="outlined" />
                                <span class="w-10 h-6 text-black text-sm">{minimumPurchaseAmountCount}/10</span>
                                <br />
                                <br />
                                <TextField type='number'
                                  maxlength="5"
                                  value={minimumPurchaseQuantity}
                                  onChange={handleMinimumPurchaseQuantity}
                                  fullWidth size='small' id="outlined-basic" label="Minimum purchase quantity (optional)*" variant="outlined" />
                                <span class="w-10 h-6 text-black text-sm">{minimumPurchaseQuantityCount}/3</span>
                              </>
                            </div>
                          </>
                        </>
                      }
                    </div>
                  </>
                  <Divider style={{ margin: '20px 0 10px 0' }} />
                  <div>
                    <>
                      <p className='text-sm font-medium pt-2 pb-2'>Title*</p>
                      <div class="flex rounded-md w-[100%]">
                        <input
                          onChange={handlePromoTitle}
                          value={promotionTitle}
                          maxlength="60" type="text"
                          class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                          placeholder='Type your promo as you would explain it to customers' />
                        <div class="flex items-center justify-center px-4 mt-1">
                          <span class="w-10 h-6 text-black text-sm">{count}/60</span>
                        </div>
                      </div>
                      {promoTitleError &&
                        <span class="text-red-600 text-xs font-bold">Promotion Title Is Required</span>
                      }
                    </>
                    <>
                      <div className='mt-4 mb-4'>
                        <p className='text-sm font-medium pt-2 pb-2'>Promotion Id*</p>
                        <div class="flex rounded-md w-[100%]">
                          <input
                            value={promotionID}
                            onChange={handlePromotionID}
                            placeholder='Type an ID that contains only letters, numbers, hyphens, and underscores'
                            maxlength="50" type="text"
                            class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                          <div class="flex items-center justify-center px-4 mt-1">
                            <span class="w-10 h-6 text-black text-sm">{count1}/50</span>
                          </div>

                        </div>
                        {promoIDError &&
                          <span class="text-red-600 text-xs font-bold">Promotion ID  Is Required</span>

                        }
                      </div>
                    </>
                    <>
                      <p className='text-sm font-medium pt-2 pb-2'>Destination*</p>
                      <div>
                        <FormGroup
                          row
                        >

                          <FormControlLabel control={<Checkbox checked={shoppingAds} style={{ color: '#008060' }} />}
                            value="Shopping_ads" name="Shopping_ads" label="Shopping ads" onChange={handleDestination1} />
                          <FormControlLabel control={<Checkbox checked={freeListing} style={{ color: '#008060' }} />}
                            value="Free_listings" name="Free_listings" label="Free listings" onChange={handleDestination2} />
                        </FormGroup>
                        {promotionDestinationError &&
                          <span class="text-red-600 text-xs font-bold">Promotion Destination Is Required</span>
                        }
                      </div>
                    </>
                    <>
                      <p className='text-sm font-medium pt-2 pb-2'>Promotion display dates</p>
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                          <p className='mr-4'>Start</p>
                          <div className='flex items-center'>
                            {/* <input type="date" value={startDate.substring(0,10)} onChange={handleStartDateChange} /> */}
                            <input type="date" min={currentDate.substring(0, 10)} value={startDate.substring(0, 10)} max={nextSixmonthDate.substring(0, 10)} onChange={handleStartDateChange} />
                          </div>
                        </div>
                        <div className='flex items-center'>
                          <p className='mr-4'>End</p>
                          <div className='flex items-center'>
                            {/* <input type="date" value={endDate.substring(0,10)} onChange={handleEndDateChange} /> */}
                            <input type="date" min={tomorrowDate.substring(0, 10)} value={endDate.substring(0, 10)} max={nextSixmonthDate.substring(0, 10)} onChange={handleEndDateChange} />

                          </div>
                        </div>
                      </div>
                      {dateError &&
                        <span class="text-red-600 text-xs font-bold"> Please Choose A Valid Date</span>
                      }
                      <Divider style={{ margin: '20px 0 10px 0' }} />
                      <p className='text-sm font-medium pt-2 pb-2'>Redemption code*</p>
                      <RadioGroup
                        name="offerType"
                        value={status3 || "GENERIC_CODE"}
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel value="GENERIC_CODE" control={<Radio style={{ color: '#008060' }} defaultChecked />} label="Generic code" />
                        {status3 === "GENERIC_CODE" &&
                          <>
                            <div className='bg-[#f6f6f7] p-4'>
                              <div className='flex items-center'>
                                <p className='text-sm font-medium'>Discount code</p>
                              <VideoModal margin='0 0 0 10px' title='Where to get it ?' videoSrc='https://www.youtube.com/embed/Z58G4DfvP7k' />
                              </div>

                              <div class="flex rounded-md w-[100%]">
                                <input
                                  onChange={handleRedeemCode}
                                  value={redeemCode}
                                  maxlength="20" type="text"
                                  class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                  placeholder='Enter Your Discount Code Here...' />
                                <div class="flex items-center justify-center px-4 mt-1">
                                  <span class="w-10 h-6 text-black text-sm">{redeemCount}/20</span>
                                </div>
                              </div>
                              {discountCodeError &&
                                <span class="text-red-600 text-xs font-bold ">Discount Code  Is Required</span>
                              }

                            </div>
                          </>
                        }
                        <FormControlLabel value="NO_CODE" control={<Radio style={{ color: '#008060' }} />} label="No code" />
                        {status3 === "NO_CODE" &&
                          <></>
                        }
                      </RadioGroup>
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <p className='text-sm font-medium pt-2 pb-2'>Product applicability</p>
                      <RadioGroup
                        name="productApplicability"
                        value={inputs.productApplicability || "SPECIFIC_PRODUCTS"}
                        onChange={handleRadioChange1}
                      >
                        <div>
                          <FormControlLabel value="SPECIFIC_PRODUCTS" control={<Radio style={{ color: '#008060' }} />} label="Specific products" />
                          <Tooltip title='Map the promotion ID to products in your product feed: For Google to recognize the products included in your promotion, submit a value for the promotion ID [promotion ID] attribute and map that to the eligible products in your products feed.' arrow>
                            <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                          </Tooltip>
                        </div>
                        <FormControlLabel value="ALL_PRODUCTS" control={<Radio style={{ color: '#008060' }} defaultChecked />} label="All products" />
                      </RadioGroup>
                    </>
                  </div>

                </>
                <div className='w-[96%] mt-8 mb-4'>
                  <Divider />
                  <div className='flex justify-start mt-2'>
                    {/* <Button iconStart={<CheckCircleIcon />} onClick={() => setShowDrawer(false)} style={{ background: "#008060", marginRight: '10px' }} variant="contained">Create Promotion</Button> */}
                    {/* <Button iconStart={<CheckCircleIcon />} onClick={createPromotion}
                      style={{ background: "#008060", marginRight: '10px' }} variant="contained">Create Promotion</Button> */}
                    <Button disabled={isDisabled === true} onClick={createPromotion} style={{ background: "#008060", marginRight: '10px' }} variant="contained">{promotionButtonLoading ? <CircularProgress color="inherit" size={20} /> : "Create Promotion"}</Button>
                    <Button onClick={handleCancelButton} variant="outlined">Cancel</Button>
                  </div>
                  {formErrorMessage &&
                    <div style={{ marginTop: '10px' }}>
                      <span class="mt-4 text-red-600 text-sm font-bold ">Please Fill The Above Fields To Continue.</span>
                    </div>
                  }
                  {promotionsOtherErrors &&
                    <div style={{ marginTop: '10px' }}>
                      <span class="mt-4 text-red-600 text-sm font-bold ">{promotionsOtherErrorsMsg}</span>
                    </div>
                  }
                </div>
              </div>

              {/* <div>
                <span>Errors will be here</span>
              </div> */}

            </div>
          </div>
        ) : null}
      </>

      {/*   modal show on pause    */}


      {
        pauseModal ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => { setpauseModal(false); setLoading(false); setDisabled(false) }}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                  <div className="">
                    <div className='flex items-center p-2'>
                      {/* <ReportProblemIcon style={{ color: '#d82c0d' }} /> */}
                      <p className='text-lg font-medium ml-2'>End this promotion?</p>
                      <CloseIcon onClick={() => setpauseModal(false)} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='p-4'>
                      <p className='text-sm font-normal' >If you end this promotion, you won't be able to restart it.</p>
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='flex justify-end'>
                      <Button onClick={() => { setpauseModal(false); setLoading(false); setDisabled(false) }} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                      {/* <Button onClick={deletePromotion} style={{ background: "#d82c0d" }} variant="contained" startIcon={<DeleteIcon />}>End Promotion</Button> */}
                      <LoadingButton
                        onClick={deletePromotion}
                        // endIcon={<DeleteIcon />}
                        loading={loading}
                        loadingPosition="end"
                        style={{ background: "#d82c0d", color: "white" }}
                        disabled={disabled}>
                        <span>End Promotion</span>
                      </LoadingButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null
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

      {/* ------------  upgrade modal  -------------- */}

      <>
        {showUpgradeModel ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={handleUpgradeModelCancel}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                  <div className="">
                    <div className='flex items-center p-2'>
                      <CloseIcon onClick={handleUpgradeModelCancel} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                    </div>
                    <div className='p-4'>
                      <p className='text-2xl text-center font-medium' >It's Time for Your Upgrade!</p>
                      <p className='text-md text-center font-normal' >You have reached the limit of your current plan.<br />To add extra features,you need to choose a higher plan.</p>
                      <div className="flex justify-center">
                        <img className="w-[70%]" src={upgradeImg} />
                      </div>
                      <p className='text-md text-center font-normal'>By using this coupon <b><i>Tokyo%20</i></b>&nbsp; you will get 20% Off only on Unlimited Plan</p>
                    </div>
                    <div className='flex justify-center'>
                      <Button onClick={handleUpgradeNow} style={{ marginRight: '10px', background: '#fa6102' }} variant="contained">Upgrade Now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>

    </>


  )
}

export default Promotion;