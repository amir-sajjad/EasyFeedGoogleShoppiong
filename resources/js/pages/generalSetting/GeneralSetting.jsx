import React, { useEffect, useCallback } from 'react'
import { useState } from 'react'
import axioshttp from '../../axioshttp';
import { useNavigate } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import CallMadeIcon from '@mui/icons-material/CallMade';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import { Button } from '@material-ui/core';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { Divider } from '@mui/material';
import VideoModal from "../tutorials/VideoModal";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from 'react-router';
import { values } from 'lodash';
import ReactGA from "react-ga4";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const GeneralSetting = () => {

  const feedId = useParams();
  const [allFeedsData, setAllFeedsData] = useState([]);
  const [userSettings, setuserSettings] = useState([]);
  const [singleFeedData, setSingleFeedData] = useState([]);
  const [allCollections, setAllCollections] = useState([]);
  const [notificationSetting, setNotificationSetting] = useState(null);
  const [productCategories, setProductCategories] = useState([]);
  const [isRendering, setIsRendering] = useState(true);
  const [feedName, setFeedName] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [exclude, setExclude] = useState(false);
  const [changeAccount, setchangeAccount] = useState(false);
  const [saveButtonModal, setsaveButtonModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingAccount, setIsChangingAccount] = useState(false);

  const navigate = useNavigate();

  const fetchAllFeedsData = () => {
    axioshttp.get('get/all/feeds').then(response => {
      if (response.data.feedSettings) {
        setAllFeedsData(response.data.feedSettings)
        if (feedId.feedId == 'null' || feedId.feedId == null) {
          setSingleFeedData(response.data.feedSettings[0])
        } else {
          setSingleFeedData(response.data.feedSettings.filter((element) => element.id == feedId.feedId)[0])
        }
      }
      if (response.data.userSettings) {
        setuserSettings(response.data.userSettings)
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const getFeedSettings = () => {
    axioshttp.get('get/feed/settings').then(res => {
      if (res.data.status == true) {
        setIsRendering(false);
        setAllCollections(res.data.collections);
      }
    }).catch(err => {
      setIsRendering(false);
      // console.log(err);
    })
    if (document.getElementById('productCategories')) {
      var categories = document.getElementById('productCategories').getAttribute('data');
      categories = JSON.parse(categories);
      setProductCategories(categories);
    }
  }

  const saveNotificationSetting = () => {
    const data = { notificationSetting: notificationSetting }
    axioshttp.post('notification/setting', data).then(response => {
      setuserSettings(values => ({ ...values, ['notification_setting']: notificationSetting }))
      if (response.data.hasOwnProperty('message')) {
        setToastMessage(response.data.message)
        setShowToast(true)
      }
    }).catch(error => {
      if (error.response.data.hasOwnProperty('error')) {
        setToastMessage(error.response.data.error)
        setShowToast(true);
      }
    })
  }

  const discardNotificationSetting = () => {
    setNotificationSetting(userSettings.notification_setting);
  }

  const saveName = () => {
    const data = { feedName: feedName, feedId: singleFeedData.id }
    axioshttp.post('feed/name', data).then(response => {
      if (response.data.status) {
        setSingleFeedData(values => ({ ...values, ['name']: feedName }))
        setAllFeedsData(allFeedsData.map((value, index) => {
          if (value.id == singleFeedData.id) {
            value.name = feedName;
          }
          return value;
        }));
        setToastMessage(response.data.message)
        setShowToast(true);
      }
    }).catch(error => {
      if (error.response.data.hasOwnProperty('error')) {
        setToastMessage(error.response.data.error)
        setShowToast(true);
      }
    })
  }

  const discardName = () => {
    setFeedName(singleFeedData.name)
  }

  const handleFeedSettingChanges = (e) => {
    if (e.target.name == 'productIdentifiers') {
      setSingleFeedData(values => ({ ...values, [e.target.name]: JSON.parse(e.target.value) }))
    }
    else {
      setSingleFeedData(values => ({ ...values, [e.target.name]: e.target.value }))
    }
  }

  const handleCheckboxChanges = (e) => {
    setSingleFeedData(values => ({ ...values, [e.target.name]: e.target.checked }))
  }

  const handleFeedChange = (e) => {
    setSingleFeedData(allFeedsData.filter((element) => element.id == e.target.value)[0])
  }

  const saveFeedSettings = () => {
    setsaveButtonModal(false);
    setIsUpdating(true);
    const data = { feedData: singleFeedData }
    axioshttp.post('feed/changes/save', data).then(response => {
      if (response.data.status) {
        setToastMessage(response.data.message)
        setShowToast(true)
        setTimeout(() => {
          setIsUpdating(false)
          navigate('/dashboard')
        }, 2000);
      }
      else {
        if (response.data.hasOwnProperty('error')) {
          setToastMessage(response.data.error)
          setShowToast(true)
          setIsUpdating(false)
        }
      }
    }).catch(error => {
      setIsUpdating(false)
      console.log(error);
    })
  }

  const changeAccounts = () => {
    setIsChangingAccount(true);
    axioshttp.get('changeAccountRequest').then(res => {
      if (res.data.status == true) {
        setIsChangingAccount(false);
        setchangeAccount(false);
        setToastMessage(res.data.message);
        setShowToast(true);
      }
      console.log(res);
    }).catch(error => {
      setIsChangingAccount(false);
      console.log(error);
    })
  }

  useEffect(() => {
    if (singleFeedData) {
      setFeedName(singleFeedData.name)
      if (singleFeedData.excludedCollections != null) {
        setExclude(true);
        if (typeof (singleFeedData.excludedCollections) == 'string') {
          setSingleFeedData(values => ({ ...values, ['excludedCollections']: JSON.parse(singleFeedData.excludedCollections) }))
        }
      }
      else {
        setExclude(false);
      }
      if (singleFeedData.includedCollections != null) {
        if (typeof (singleFeedData.includedCollections) == 'string') {
          setSingleFeedData(values => ({ ...values, ['includedCollections']: JSON.parse(singleFeedData.includedCollections) }))
        }
      }
    }
  }, [singleFeedData])

  useEffect(() => {
    setNotificationSetting(userSettings.notification_setting)
  }, [userSettings])

  useEffect(() => {
    setTimeout(function () {
      setShowToast(false);
      setToastMessage('');
    }, 5000)
  }, [showToast])

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/generalSetting", title: "General Setting" });
    fetchAllFeedsData()
    getFeedSettings()
  }, [])

  return (
    <>
      {isRendering && <CircularProgress style={{ color: "#008060", marginRight: "10px", marginTop: "10%", marginLeft: "40%" }} size={60} />}
      {!isRendering && <div className='p-4'>
        <div className='flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap items-center mt-2 w-full'>
          <p>Switch to see the saved feed settings.</p>
          <select
            id="countries"
            onChange={handleFeedChange}
            value={singleFeedData ? singleFeedData.id : null}
            class="text-gray-900 text-sm rounded-md w-[80%] sm:w-[25%] md:w-[20%] lg:w-[20%] xl:w-[20%] 2xl:w-[20%] p-2.5 ml-2"
          >
            <option disabled selected value>
              - - select - -
            </option>
            {allFeedsData ? allFeedsData.map((value, index) => (
              <option value={value.id}>{value.name}</option>
            )) : null}
          </select>
          <VideoModal margin='0 0 0 10px' title='Settings - Must Watch' videoSrc='https://www.youtube.com/embed/wHGntqKEhCc' />
        </div>
        <div className='flex justify-between mt-4 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
          <div className='pr-2 w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
            <p class='text-md font-medium'>Merchant Details</p>
            <span className='text-sm'>Following are details that are sent in Google Merchant Center.</span>
          </div>
          <div className='w-[100%] sm:w-[100%] md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>

            <div className='flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap justify-between items-center'>
              <p className='font-medium'>Google Account</p>
              <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap items-center'>
                <p className='mr-2 text-sm'>{userSettings && userSettings.googleAccountEmail ? userSettings.googleAccountEmail : "johnDoe@gmail.com"}</p>
                <button onClick={() => setchangeAccount(!changeAccount)} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-md border hover:bg-gray-100 text-black">
                  <ChangeCircleIcon style={{ fontSize: '20px', marginRight: '2px', color: '#d82c0d' }} />
                  Change Account
                </button>
              </div>
            </div>
            <div className='flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap justify-between items-center mt-3'>
              <p className='font-medium'>Merchant Center Website</p>
              <div className='flex items-center'>
                <a className='mr-2 text-sm flex items-center border-b border-[#008060] ' target='_blank' href={userSettings && userSettings.domain ? "https://" + userSettings.domain : "https://example.myshopify.com"}>{userSettings && userSettings.domain ? userSettings.domain : "example.myshopify.com"}<CallMadeIcon style={{ fontSize: '16px', color: '#008060', marginLeft: '5px' }} /> </a>
              </div>
            </div>
            <div className='flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap justify-between items-center mt-3'>
              <p className='font-medium'>Merchant Center Id</p>
              <p className='mr-2 text-sm'>{userSettings && userSettings.merchantAccountId ? userSettings.merchantAccountName + " - " + userSettings.merchantAccountId : "1234567890"}</p>
            </div>
            <div className='flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap justify-between items-center mt-3'>
              <p className='font-medium'>Shopify Markets</p>
              <div class="flex rounded-md w-[100%] sm:w-[42%] md:w-[52%] lg:w-[32%] xl:w-[32%] 2xl:w-[32%]">
                <input disabled value={singleFeedData && singleFeedData.market ? singleFeedData.market : null} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
              </div>
            </div>
            <div className='flex flex-wrap sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap justify-between items-center mt-3'>
              <p className='font-medium'>Primary Feed Settings</p>
              <div class="flex rounded-md w-[100%] sm:w-[42%] md:w-[52%] lg:w-[32%] xl:w-[32%] 2xl:w-[32%] justify-between">
                <input disabled value={singleFeedData && singleFeedData.country ? singleFeedData.country : null} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md mr-2" />
                <input disabled value={singleFeedData && singleFeedData.language ? singleFeedData.language : null} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md mr-2" />
                <input disabled value={singleFeedData && singleFeedData.currency ? singleFeedData.currency : null} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
              </div>
            </div>
            <br />
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center'>
              <p className='font-medium'>Feed Name</p>
              <div class="flex rounded-md w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]">
                <input type="text" name="name" onChange={(e) => { setFeedName(e.target.value) }} value={feedName} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                {(singleFeedData && feedName != singleFeedData.name) && <DoneIcon color='success' onClick={saveName} style={{ cursor: "pointer" }} />}
                {(singleFeedData && feedName != singleFeedData.name) && <ClearIcon color='warning' onClick={discardName} style={{ cursor: "pointer" }} />}
              </div>
            </div>

          </div>
        </div>
        <div className='flex justify-between mt-4 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
          <div className='pr-2 w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
            <p class='text-md font-medium'>Product Webhooks Settings</p>
            <span className='text-sm'>Instantly sync product changes from Shopify</span>
            <VideoModal margin='0 0 0 10px' title='Webhooks Settings - Must Watch' videoSrc='https://www.youtube.com/embed/sWALzgmmkYM' />
          </div>
          <div className='w-[100%] sm:w-[100%] md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>

            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                <RadioGroup value={notificationSetting} onChange={(e) => { setNotificationSetting(e.target.value) }} defaultValue="auto" row>
                  <div className='flex items-center mr-4 p-2'>
                    <FormControlLabel value="auto" control={<Radio style={{ color: '#008060' }} />} label="Auto" />
                    <Tooltip title="When any changes are made to your store's products, the same changes will be applied simultaneously using the Webhooks API inside the EasyFeed App." arrow>
                      <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                    </Tooltip>
                  </div>
                  <div className='flex items-center p-2'>
                    <FormControlLabel value="manual" control={<Radio style={{ color: '#008060' }} />} label="Manually" />
                    <Tooltip title="When any changes are made to your store products, these will not be applied inside the EasyFeed App; instead, you will be informed through a notification page using the webhooks API." arrow>
                      <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                    </Tooltip>
                  </div>
                </RadioGroup>
              </div>
              {(userSettings && notificationSetting != userSettings.notification_setting) && <div>
                <DoneIcon color='success' onClick={saveNotificationSetting} style={{ cursor: "pointer" }} />
                <ClearIcon color='warning' onClick={discardNotificationSetting} style={{ cursor: "pointer" }} />
              </div>}
            </div>

          </div>
        </div>
        <div className='flex justify-between mt-4 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
          <div className='pr-2 w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
            <p class='text-md font-medium'>Product ID Format</p>
            <span className='text-sm'>The product ID format cannot be changed if the feed submitted to Merchant Center is approved. Re-approval of the feed is required to show ads again once the existing product ID is changed. It will take 3-5 days for re-approval, and all of the feed history will be deleted. If you still want to change the product ID, you have to create a new feed and delete the existing feed as well.</span>
          </div>
          <div className='w-[100%] sm:w-[100%] md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>

            <RadioGroup name="productIdFormat" onChange={handleFeedSettingChanges} defaultValue="sku" value={singleFeedData && singleFeedData.productIdFormat ? singleFeedData.productIdFormat : null} >
              <FormControlLabel className='p-2' value="variant" control={<Radio style={{ color: '#008060' }} />} label="Variant ID as Product ID (Ex: 123456789)" />
              <FormControlLabel className='p-2' value="sku" control={<Radio style={{ color: '#008060' }} />} label="SKU as Product ID (Ex: ABCD1234)" />
              <FormControlLabel className='p-2' value="global" control={<Radio style={{ color: '#008060' }} />} label="Global Format (Ex: shopify_US_123456_987654)" />
            </RadioGroup>

          </div>
        </div>
        <div className='flex justify-between mt-4 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
          <div className='pr-2 w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
            <p class='text-md font-medium'>Preference Settings</p>
            <span className='text-sm'>This section has the settings options that you have already selected on the configuration page. Any changes in this section will directly affect your feed data, so select further options cautiously.</span>
          </div>
          <div className='w-[100%] sm:w-[100%] md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>

            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Product Title</p>
              <div class="flex rounded-md">
                <RadioGroup name="productTitle" onChange={handleFeedSettingChanges} value={singleFeedData && singleFeedData.productTitle ? 'default' : null} row defaultValue="default" >
                  <FormControlLabel disabled value="default" control={<Radio style={{ color: '#008060' }} />} label="Product Title" />
                  {/* <FormControlLabel value="seo" control={<Radio style={{ color: '#008060' }} />} label="SEO Title" /> */}
                </RadioGroup>
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Product Description</p>
              <div class="flex rounded-md">
                <RadioGroup name="productDescription" onChange={handleFeedSettingChanges} value={singleFeedData && singleFeedData.productDescription ? 'default' : null} row defaultValue="default">
                  <FormControlLabel disabled value="default" control={<Radio style={{ color: '#008060' }} />} label="Product Description" />
                  {/* <FormControlLabel value="seo" control={<Radio style={{ color: '#008060' }} />} label="SEO Description" /> */}
                </RadioGroup>
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Variant Submission</p>
              <div class="flex rounded-md">
                <RadioGroup name="variantSubmission" onChange={handleFeedSettingChanges} value={singleFeedData && singleFeedData.variantSubmission ? singleFeedData.variantSubmission : null} row defaultValue="all" >
                  <FormControlLabel value="all" control={<Radio style={{ color: '#008060' }} />} label="All Variants" />
                  <FormControlLabel value="first" control={<Radio style={{ color: '#008060' }} />} label="First Variant Only" />
                </RadioGroup>
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Brand Submission</p>
              <div class="flex rounded-md">
                <RadioGroup name="brandSubmission" onChange={handleFeedSettingChanges} value={singleFeedData && singleFeedData.brandSubmission ? singleFeedData.brandSubmission : null} row defaultValue="vendor">
                  <FormControlLabel value="vendor" control={<Radio style={{ color: '#008060' }} />} label="Vendor" />
                  <FormControlLabel value="domain" control={<Radio style={{ color: '#008060' }} />} label="Domain" />
                </RadioGroup>
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <div className='flex items-center'>
                <p className='font-medium'>Product Identifier Exists</p>
                <Tooltip title="This option will submit all the required product identifiers in the feed. If any identifier value is missing, it will not be submitted. Use this option when your products are updated with all the correct unique product identifiers (UPI) as other merchants for the same product or variant. UPI defines exactly which product you're selling." arrow>
                  <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                </Tooltip>
              </div>
              <RadioGroup name="productIdentifiers" onChange={handleFeedSettingChanges} value={singleFeedData && singleFeedData.productIdentifiers ? true : false} row defaultValue="false" >
                <FormControlLabel value={true} control={<Radio style={{ color: '#008060' }} />} label="Yes" />
                <FormControlLabel value={false} control={<Radio style={{ color: '#008060' }} />} label="No" />
              </RadioGroup>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <div className='flex items-center'>
                <p className='font-medium'>Barcode (ISBN, UPC, GTIN)</p>
                <Tooltip title="GTIN plays a significant role in the data in Google Merchant Center as a major factor for improving your product listing. Products submitted without any GTIN are difficult to classify and may not be eligible for all shopping programmes or features." arrow>
                  <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                </Tooltip>
              </div>
              <FormControlLabel name='barcode' onChange={handleCheckboxChanges} control={<Checkbox style={{ color: '#008060' }} checked={singleFeedData && singleFeedData.barcode ? true : false} />} label="Do your products Have GTINs?" />
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Sale Price With Compare Price</p>
              <FormControlLabel name='salePrice' onChange={handleCheckboxChanges} control={<Checkbox checked={singleFeedData && singleFeedData.salePrice ? true : false} style={{ color: '#008060' }} />} label="Enable Sale Price" />
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Product Image Option</p>
              <FormControlLabel name='secondImage' onChange={handleCheckboxChanges} control={<Checkbox checked={singleFeedData && singleFeedData.secondImage ? true : false} style={{ color: '#008060' }} />} label="Use the second image for products with no variants." />
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Submit Addtional Images</p>
              <FormControlLabel name='additionalImages' onChange={handleCheckboxChanges} control={<Checkbox checked={singleFeedData && singleFeedData.additionalImages ? true : false} style={{ color: '#008060' }} />} label="Check this box if you would like to submit additional images." />
            </div>
          </div>
        </div>
        <div className='flex justify-between mt-4 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
          <div className='pr-2 w-[100%] sm:w-[100%] md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
            <p class='text-md font-medium'>Source Management</p>
            <span className='text-sm'>Here you can submit all of your products, and you can also choose from your collections. If you want to exclude certain collections, you can also do it here.
            </span>
          </div>
          <div className='w-[100%] sm:w-[100%] md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
            <p className='font-medium'>Which Product Needs To Be Submitted in Feed ?</p>
            <RadioGroup name='whichProducts' onChange={handleFeedSettingChanges} value={singleFeedData && singleFeedData.whichProducts ? singleFeedData.whichProducts : ''} defaultValue="all" >
              <FormControlLabel className='p-2' value="all" control={<Radio style={{ color: '#008060' }} />} label="All Products" />
              <FormControlLabel className='p-2' value="collection" control={<Radio style={{ color: '#008060' }} />} label="Products From Collection" />
            </RadioGroup>
            {(singleFeedData && singleFeedData.whichProducts == 'collection') && (
              <div className="mt-2">
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={allCollections}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={singleFeedData && singleFeedData.includedCollections ? (typeof (singleFeedData.includedCollections) == 'string' ? JSON.parse(singleFeedData.includedCollections) : singleFeedData.includedCollections) : []}
                  onChange={(event, value) => setSingleFeedData(values => ({ ...values, ['includedCollections']: value }))}
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
            <FormControlLabel className='p-2' checked={exclude} onChange={() => { setExclude(!exclude) }} control={<Checkbox style={{ color: '#008060' }} />} label="Excluded Collection" />
            {exclude && (
              <div className="mt-2">
                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  options={allCollections}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={singleFeedData && singleFeedData.excludedCollections ? (typeof (singleFeedData.excludedCollections) == 'string' ? JSON.parse(singleFeedData.excludedCollections) : singleFeedData.excludedCollections) : []}
                  onChange={(event, value) => setSingleFeedData(values => ({ ...values, ['excludedCollections']: value }))}
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
        <div className='flex justify-between mt-4 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
          <div className='pr-2 w-[50%]'>
          </div>
          <div className='w-[100%] sm:w-[100%] md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center'>
              <p className='font-medium'>Default Google Product Category</p>
              <div className='w-[100%] sm:w-[100%] md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%]'>
                <Autocomplete
                  className="Product_Category_SelectDropdoen_1"
                  disablePortal
                  id="combo-box-demo"
                  size="small"
                  options={productCategories}
                  value={singleFeedData && singleFeedData.product_category_id ? productCategories.find(
                    (category) => category.id === singleFeedData.product_category_id
                  ) : null}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => { value != null ? setSingleFeedData(values => ({ ...values, ['product_category_id']: value.id })) : setSingleFeedData(values => ({ ...values, ['product_category_id']: value })) }}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Product Category" />
                  )}
                />
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Default Age Group</p>
              <div className='w-[100%] sm:w-[100%] md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%]'>
                <select
                  id="countries"
                  name='ageGroup'
                  onChange={handleFeedSettingChanges}
                  value={singleFeedData && singleFeedData.ageGroup ? singleFeedData.ageGroup : null}
                  class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                >
                  <option disabled selected value>

                    - - select - -
                  </option>
                  <option value="newborn">Newborn</option>
                  <option value="infant">Infant</option>
                  <option value="toddler">Toddler</option>
                  <option value="kids">Kids</option>
                  <option value="adult">Adult</option>
                </select>
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Default Gender</p>
              <div className='w-[100%] sm:w-[100%] md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%]'>
                <select
                  id="countries"
                  name='gender'
                  onChange={handleFeedSettingChanges}
                  value={singleFeedData && singleFeedData.gender ? singleFeedData.gender : null}
                  class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                >
                  <option disabled selected value>

                    - - select - -
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap p-2 2xl:flex-nowrap sm:flex-wrap justify-between items-center mt-3'>
              <p className='font-medium'>Default Product Condition</p>
              <div className='w-[100%] sm:w-[100%] md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%]'>
                <select
                  id="countries"
                  name='productCondition'
                  onChange={handleFeedSettingChanges}
                  value={singleFeedData && singleFeedData.productCondition ? singleFeedData.productCondition : null}
                  class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                >
                  <option disabled selected value>

                    - - select - -
                  </option>
                  <option value="new">New</option>
                  <option value="refurbished">Refurbished</option>
                  <option value="used">Used</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end pt-4 pb-4'>
          <Button variant="outlined" style={{ marginRight: '10px' }}>Cancel</Button>
          <Button onClick={() => setsaveButtonModal(!saveButtonModal)} variant="contained" style={{ background: '#008060', color: 'white' }}>Re-Sync</Button>
        </div>
      </div>}
      <>
        {/* save bar discard modal  */}
        {changeAccount ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => setchangeAccount(false)}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                  <div className="">
                    <div className='flex items-center p-2'>
                      <ReportProblemIcon style={{ color: '#d82c0d' }} />
                      <p className='text-lg font-medium ml-2'>Are you sure ?</p>
                      <CloseIcon onClick={() => setchangeAccount(false)} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='p-4'>
                      <p className='text-sm font-normal' >Once you change your Gmail account all of your saved product data will be permanently deleted from Google Merchant Center.</p>
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='flex justify-end'>
                      <Button onClick={() => setchangeAccount(false)} style={{ marginRight: '10px' }} variant="outlined">No</Button>
                      <Button disabled={isChangingAccount} onClick={changeAccounts} style={{ background: !isChangingAccount ? "#d82c0d" : "rgb(184 178 178 / 87%)", color: "white" }}>{isChangingAccount ? <CircularProgress color="inherit" size={25} /> : "Change"}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
      <>
        {/* save button  modal  */}
        {saveButtonModal ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => setsaveButtonModal(false)}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                  <div className="">
                    <div className='flex items-center p-2'>
                      {!isUpdating && <ReportProblemIcon style={{ color: '#ffdf02' }} />}
                      {isUpdating && <p className='text-lg font-medium ml-2'>Updating</p>}
                      {!isUpdating && <p className='text-lg font-medium ml-2'>Warning</p>}
                      <CloseIcon onClick={() => setsaveButtonModal(false)} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='p-4'>
                      {!isUpdating && <p className='text-sm font-normal' >Upon re-synchronization, earlier changes you have made in product feed settings will be deleted and new product feed settings will be sent to Google Merchant Center.</p>}
                      {isUpdating && <p className='text-sm font-normal' >We are Updating Feed</p>}
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='flex justify-end'>
                      <Button disabled={isUpdating} onClick={saveFeedSettings} style={{ background: !isUpdating ? "#008060" : "rgb(184 178 178 / 87%)", color: 'white' }} variant="contained">{isUpdating ? <CircularProgress color="inherit" size={25} /> : "Save"}</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
      {/* ------------Toast-------------- */}
      <>
        {showToast ? (
          <>
            <div id="toast-default" class="flex items-center p-4 fixed bottom-5 right-[42%] transition-opacity ease-in-out delay-100 z-50 w-full max-w-xs rounded-lg text-white bg-[#202123]" role="alert">
              <div class="ml-3 text-sm font-normal">{toastMessage}</div>
              <button onClick={() => setShowToast(false)} type="button" class="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 " data-dismiss-target="#toast-default" aria-label="Close">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </button>
            </div>
          </>
        ) : null}
      </>
    </>
  )
}
export default GeneralSetting