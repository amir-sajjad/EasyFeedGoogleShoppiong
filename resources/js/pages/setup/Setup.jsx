import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import axioshttp from '../../axioshttp';
import upgradeImg from '../products/upgradeImg.png';
import Stepper from "@mui/material/Stepper";
import CircularProgress from "@mui/material/CircularProgress";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FlagIcon from '@mui/icons-material/Flag';
import LinearProgressWithLabel from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import VideoModal from "../tutorials/VideoModal";
import CloseIcon from '@mui/icons-material/Close';
import domainverfiedimage3 from './images/domainverfiedimage3.png';
import domainverfiedimg2 from './images/domainverfiedimg2.png';
import domainveri4 from './images/domainveri4.png';
import domianverifed5 from './images/domianverifed5.png';
import merchantcenterimg1 from './images/merchantcenterimg1.png';
import scopesImages from './images/scopesSelection.png';
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
import SimpleSnackbar from "../../snackbarComponent";
import { values } from "lodash";
import ReactGA from "react-ga4";

export default function Setup () {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [signInName, setSignInName] = useState('Sign in with Google');
  const [connectMerchantName, setConnectMerchantName] = useState('Connect Merchant Center');
  const [changeAccBtnName, setChangeAccBtnName] = useState('Change Account');
  const [shortMessage, setShortMessage] = useState('');
  const [setup, setSetup] = useState();
  const [setupCheck, setSetupCheck] = useState(false);
  const [syncingSetup, setSyncingSetup] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [merchConnected, setMerchConnected] = useState(false);
  const [merchantAccConnected, setMerchantAccConnected] = useState(false);
  const [merchantAccId, setMerchantAccId] = useState(null);
  const [isDomainVerified, setIsDomainVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isRendering, setIsRendering] = useState(true);
  const [merchantAccNotFound, setMerchantAccNotFound] = useState(false);
  const [loadingMerchantAccounts, setLoadingMerchantAccounts] = useState(false);
  const [userSignInData, setUserSignInData] = useState([]);
  const [merchantAccounts, setMerchantAccounts] = useState([]);
  const [allMarkets, setAllMarkets] = useState([]);
  const [isMarketSelected, setIsMarketSelected] = React.useState(false);
  const [selectedMarket, setSelectedMarket] = React.useState(null);
  const [allCollections, setAllCollections] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [singleMarketDetails, setSingleMarketDetails] = useState([]);
  const [inputs, setInputs] = React.useState({
    channel: "online",
    shipping: "auto",
    productIdFormat: "sku",
    whichProducts: "all",
    productTitle: "default",
    productDescription: "default",
    variantSubmission: "all",
    brandSubmission: "vendor",
    productIdentifiers: "false",
    salePrice: 1,
    secondImage: 1,
    additionalImages: 1,
    barcode: 0,
  });
  const [defaultError, setDefaultError] = React.useState({
    name: false,
    market: false,
    country: false,
    language: false,
    currency: false,
    ageGroup: false,
    gender: false,
    productCondition: false,
    includedCollections: false,
  });
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);
  const [featuresStatus, setFeaturesStatus] = useState({});
  const navigate = useNavigate();

  // show and hide Toast
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  setTimeout(function () {
    setShowToast(false);
    setToastMessage('');
  }, 5000)

  const getSetup = () => {
    axioshttp.get('/get/setup').then(response => {
      setPageLoading(false)
      if (response.data.hasOwnProperty('setup')) {
        setSetup(response.data.setup);
        setMerchConnected(response.data.merchantConnected)
        if (response.data.setup && response.data.merchantConnected) {
          setSetupCheck(true);
          // setActiveStep(1);
          // setProgress((prevProgress) => prevProgress + 33.3);
        }
      }
    }).catch(error => {
      setPageLoading(false)
      console.log(error)
    })
  }

  const fetchGoogleData = () => {
    axioshttp.get('get/google/data').then(response => {
      if (response.data.settings) {
        fetchMerchantAccounts();
        setUserSignInData(response.data.settings)
        if (response.data.settings.merchantAccountId != null) {
          setMerchantAccId(response.data.settings.merchantAccountId);
          setConnectMerchantName('Connected');
          if (!setup && merchConnected) {
            domainVerify();
          } else {
            setMerchantAccConnected(true);
          }
          // setTimeout(() => {
          //   setIsRendering(false);
          // }, 1500)
        }
        else {
          // setIsRendering(false);
        }
        setIsSignIn(true);
      }
    }).catch(error => {
      // setIsRendering(false)
    })
  }

  const fetchMerchantAccounts = () => {
    setLoadingMerchantAccounts(true);
    axioshttp.get('/get/accounts').then(response => {
      if (response.data.accounts) {
        setMerchantAccounts(response.data.accounts);
        setLoadingMerchantAccounts(false);
      }
    }).catch(error => {
      if (error.response.data.error) {
        setMerchantAccNotFound(true)
        // setToastMessage(error.response.data.error)
        // setShowToast(true);
        setLoadingMerchantAccounts(false);
      }
    })
  }

  const handleSignIn = () => {
    setSignInName('Signing in to Google');
    window.open('https://staggingeasyfeed.com/setup/google?token=' + window.sessionToken);
    const ConnectionInterval = setInterval(() => {
      axioshttp.get('/get/connection/status').then(response => {
        if (response.data.status == true) {
          clearInterval(ConnectionInterval)
          setUserSignInData(response.data);
          setIsSignIn(true);
          fetchMerchantAccounts();
        }
      }).catch(error => {
        // console.log(error);
      })
    }, 1000);
  }

  console.log(userSignInData);
  const handleMerchantChange = (e) => {
    if (userSignInData.hasOwnProperty('merchantAccountId')) {
      console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
      if (userSignInData.merchantAccountId == e.target.value && !merchantAccConnected) {
        setMerchantAccId(e.target.value)
        setMerchantAccConnected(true);
        setConnectMerchantName('Connected')
      } else {
        setMerchantAccId(e.target.value)
        setMerchantAccConnected(false);
        setConnectMerchantName('Connect')
      }
    } else {
      setMerchantAccId(e.target.value)
      setMerchantAccConnected(false);
      setConnectMerchantName('Connect')
    }
  }

  const handleMerchantAccConnect = () => {
    if (merchantAccId != null) {
      if (!merchantAccConnected) {
        setIsLoading(true);
        setShortMessage('Connecting Merchant Account');
        const dd = { account_id: merchantAccId }
        axioshttp.post('setup/account/connect', dd).then(response => {
          if (response.data.status == true) {
            // setMerchantAccConnected(true);
            fetchGoogleData();
            setConnectMerchantName('Connected');
            setShortMessage(response.data.success);
            setTimeout(() => {
              domainVerify()
            }, 1000)
          }
        }).catch(error => {
          if (error.response.data.error) {
            // setConnectMerchantName("Couldn't Connect Account");
            // setToastMessage(error.response.data.error)
            setShortMessage(error.response.data.error)
            setIsLoading(false);
            setTimeout(() => {
              setShortMessage('');
            }, 1500)
            // setShowToast(true);
          }
        });
      }
      else {
        setToastMessage('Account Already Connected');
        setShowToast(true);
      }
    } else {
      setShortMessage('Please Select A Merchant Account');
    }
  }

  const domainVerify = () => {
    setIsDomainVerified(true);
    setIsLoading(true);
    // setMerchantAccConnected(true);
    setShortMessage("Websites are verifying & claiming…");
    axioshttp.get('setup/domain/verify').then(response => {
      if (response.data.status == true) {
        setIsLoading(false);
        setMerchantAccConnected(true);
        setShortMessage(response.data.message);
        setTimeout(() => {
          setShortMessage('');
        }, 1500)
      }
      else {
        setShortMessage(response.data.message);
        setIsDomainVerified(false);
        setIsLoading(false);
      }
    }).catch(error => {
      // console.log(error);
    })
  }

  const handleSkipDomainVerification = () => {
    setMerchantAccConnected(true);
    setIsDomainVerified(true);
    setShortMessage("");
  }

  const googleAccountDisconnect = () => {
    setChangeAccBtnName('Disconnect');
    axioshttp.get('setup/google/disconnect').then(res => {
      if (res.data.status == true) {
        merchantDisconnect();
        setIsSignIn(false);
        setShortMessage('');
        setToastMessage(res.data.success)
        setShowToast(true);
        setMerchantAccNotFound(false)
      }
      else {
        setToastMessage(res.data.error)
        setShowToast(true);
      }
    }).catch(err => {
      // console.log(err);
    })
  }

  const merchantDisconnect = () => {
    axioshttp.get('setup/account/disconnect').then(res => {
      if (res.data.status == true) {
        setMerchantAccId(null);
        setMerchantAccConnected(false);
        setConnectMerchantName('Connect Merchant Center')
      }
    }).catch(err => {
      // console.log(err);
    })
  }

  const getMarkets = () => {
    axioshttp.get('get/markets').then(res => {
      if (res.data.status == true) {
        setAllMarkets(res.data.markets);
        // setIsRendering(false);
      }
    }).catch(err => {
      // console.log(err);
    })
  }

  const handleMarketChange = (e) => {
    setIsMarketSelected(false);
    setSelectedMarket(e.target.value);
    getMarketDetails(e.target.value);
    setInputs(values => ({ ...values, ["market"]: e.target.selectedOptions[0].text }))
    setInputs(values => ({ ...values, ["country"]: null }))
    setInputs(values => ({ ...values, ["language"]: null }))
    setInputs(values => ({ ...values, ["currency"]: null }))
  }

  const handleInputChange = (e) => {
    setInputs(values => ({ ...values, [e.target.name]: e.target.value }))
  }

  const handleCheckboxChanges = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setInputs(values => ({ ...values, [name]: value }))
  }

  const getMarketDetails = (marketId) => {
    setIsLoading(true);
    setShortMessage("Please Wait...");
    const dd = { market_id: marketId }
    axioshttp.post('get/market/details', dd).then(response => {
      if (response.data.status == true) {
        setSingleMarketDetails(values => ({ ...values, ['countries']: response.data.country }));
        setSingleMarketDetails(values => ({ ...values, ['languages']: response.data.language }));
        setSingleMarketDetails(values => ({ ...values, ['currencies']: response.data.currency }));
        setIsLoading(false);
        setShortMessage("");
        setIsMarketSelected(true);
      }
    }).catch(error => {
      // console.log(error);
    });
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

  const setupSync = () => {
    setSyncingSetup(true);
    axioshttp.post('setup/sync', inputs).then(response => {
      setSyncingSetup(false);
      if (response.data.status == true) {
        navigate(response.data.route);
      }
      else {
        if (response.data.hasOwnProperty('limit')) {
          // setToastMessage(response.data.message);
          // setShowToast(true);
          // setTimeout(() => {
          //   navigate(response.data.route);
          // }, 2000)
          setShowUpgradeModel(true);
        }
        if (response.data.hasOwnProperty('error')) {
          setToastMessage(response.data.error);
          setShowToast(true);
        }
      }
    }).catch(error => {
      setSyncingSetup(false);
      var allErrors = error.response.data.errors;
      for (const error in allErrors) {
        console.log(error);
        setDefaultError(values => ({ ...values, [error]: true }))
      }
      if (allErrors) {
        setToastMessage('Required Fields are Missing');
        setShowToast(true);
      }
    })
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

  useEffect(() => {
    // if (document.getElementById('setup')) {
    //   setSetup(JSON.parse(document.getElementById('setup').getAttribute('data')))
    //   if (JSON.parse(document.getElementById('setup').getAttribute('data'))) {
    //     setActiveStep(1);
    //     setProgress((prevProgress) => prevProgress + 33.3);
    //   }
    // }
    ReactGA.send({ hitType: "pageview", page: "/setup", title: "Setup" });
    fetchFeaturesStatus();
    getSetup();
    fetchGoogleData();
    getMarkets();
    getFeedSettings();
  }, [])

  const handleNext = () => {
    if (isSignIn && merchantAccConnected) {
      if (activeStep === 1) {
        const requiredFields = ['market', 'country', 'language', 'currency'];
        const missingFields = requiredFields.filter(field => {
          return !inputs.hasOwnProperty(field) || inputs[field] === null;
        });
        if (missingFields.length > 0) {
          missingFields.forEach(field => {
            setDefaultError(values => ({ ...values, [field]: true }));
          });
        } else {
          setActiveStep(prevActiveStep => prevActiveStep + 1);
          setProgress(prevProgress => prevProgress + 33.3);
        }
      } else if (activeStep === 2) {
        const requiredFields = ['name', 'ageGroup', 'gender', 'productCondition'];
        const missingFields = requiredFields.filter(field => {
          return !inputs.hasOwnProperty(field) || inputs[field] === null;
        });

        // Additional condition
        if (inputs.whichProducts === 'collection' && (!inputs.hasOwnProperty('includedCollections') || inputs.includedCollections.length == 0)) {
          missingFields.push('includedCollections');
        }

        if (missingFields.length > 0) {
          missingFields.forEach(field => {
            setDefaultError(values => ({ ...values, [field]: true }));
          });
        } else {
          setActiveStep(prevActiveStep => prevActiveStep + 1);
          setProgress(prevProgress => prevProgress + 33.3);
        }

      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setProgress((prevProgress) => prevProgress + 33.3);
      }
    }
    else {
      if (!isSignIn) {
        setSignInMessage("Please Sign In First");
      }
      if (!merchantAccConnected) {
        setMerchantAccMessage("Please Connect Your Merchant Account");
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setProgress((prevProgress) => prevProgress - 33.3);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Excluded Collection show and hide checkbox state

  const [excludeChecked, setExcludeChecked] = useState(false);

  const handleChecked = () => {
    // Change state to the opposite (to ture) when checkbox changes
    setExcludeChecked(!excludeChecked);
  };

  const dashboardOnClick = useCallback(() => navigate('/dashboard', { replace: true }), [navigate]);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const steps = [
    {
      label: "Connect Google Account",
      description: <div className="m-4">
        {!isSignIn && <div style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)", }} className="bg-white rounded-lg p-4 grid lg:grid-cols-2 gap-2 pb-4" >
          <div>
            <h5 className="font-normal text-lg">Google Account</h5>
            <p class="mt-2 text-gray-600 text-sm">Sign in with your account</p>
          </div>
          <div class="flex justify-end mt-1">
            <a onClick={handleSignIn} className="signInGoogleBtn shadow-md cursor-pointer flex items-center inline-block bg-white px-4 py-1.5 text-base font-base leading-7 text-black">
              <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="29px" height="40px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              {signInName}
            </a>
          </div>
        </div>}
        {isSignIn && <div style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)", }}
          className="bg-white mt-4 rounded-lg p-4 grid lg:grid-cols-2 gap-2 pb-4" >
          <div>
            <h5 className="font-normal text-lg">Google Account</h5>
            <p class="mt-2 text-gray-600 text-sm">
              Disconnect or change your account
            </p>
          </div>
          <div>
            <div class="flex justify-end flex-wrap">
              <div className="self-center">
                <img
                  className="w-10 rounded-full mr-2"
                  src={userSignInData && userSignInData.image ? userSignInData.image : "https://cdn-icons-png.flaticon.com/512/219/219983.png"}
                />
              </div>
              <div>
                <p className="text-gray-900 self-center">{userSignInData && userSignInData.name ? userSignInData.name : "John Doe"}</p>
                <p className="text-gray-900 self-center text-sm">
                  {userSignInData && userSignInData.email ? userSignInData.email : "example@gmail.com"}
                </p>
              </div>
            </div>
            {!setupCheck && <div class="flex justify-end mt-4">
              <a onClick={googleAccountDisconnect} className="signInGoogleBtn shadow-md cursor-pointer flex items-center inline-block bg-white px-4 py-1.5 text-base font-base leading-7 text-black">
                <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="29px" height="40px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                {changeAccBtnName}
              </a>
            </div>}
          </div>
        </div>}
        {isSignIn && <div style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)", }}
          className="bg-white mt-4 rounded-lg p-4 grid lg:grid-cols-2 gap-2" >
          <div>
            <h5 className="font-normal text-lg">Merchant Center Account</h5>
            <p class="mt-2 text-gray-600 text-sm">
              Make the right selection of your Merchant Center account because this will be used to sync your store product data, and we will also claim and verify the domain using the selected Merchant Center
            </p>
          </div>
          <div>
            <div class="flex justify-end">
              <div>
                <select
                  id="merchantAccounts"
                  class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-64 p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                  onChange={handleMerchantChange}
                  value={merchantAccId}
                >
                  <option disabled selected value>
                    - - select - -
                  </option>
                  {merchantAccounts.length > 0 ? merchantAccounts.map((value, index) => (
                    <option value={value.value}>{value.label + " - " + value.value}</option>
                  )) : null}
                </select>
                {/* <div className="flex justify-end mt-2">
                  {loadingMerchantAccounts && <CircularProgress style={{ color: "#008060", marginRight: "10px" }} size={25} />}
                  {loadingMerchantAccounts && <p>Please wait</p>}
                </div> */}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <a
                className="cursor-pointer flex items-center inline-block bg-[#008060] px-4 py-1.5 text-base font-base leading-7 text-white shadow-sm  hover:bg-green-800"
                sx={{ m: 2 }}
                onClick={handleMerchantAccConnect}
                style={{ backgroundColor: merchantAccConnected ? "rgb(188 190 193)" : "#008060", color: merchantAccConnected ? "#808080" : "white", pointerEvents: merchantAccConnected ? "none" : "auto" }}
              >
                <img
                  className="w-8 mr-2"
                  src="https://cdn.cdnlogo.com/logos/g/38/google-merchant-center.svg"
                />
                {connectMerchantName}
              </a>
            </div>
            <div className="flex justify-end mt-2">
              {isLoading && <CircularProgress style={{ color: "#008060", marginRight: "10px" }} size={25} />}
              {<p>{shortMessage}</p>}
            </div>
          </div>
        </div>}
        <>
          {merchantAccNotFound && <div className="bg-white mt-4 rounded-lg p-4" style={{
            boxShadow:
              "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
          }}>
            <p>Before proceeding, please ensure that you have already registered for a Merchant Center account. Once you have done that, the next step is to select the "<b>uncheck scope</b>" option, which grants us permission to access the data from your Merchant Center account. This is a necessary step in order for us to effectively gather the information we need.</p>
            <br />
            <div className="flex justify-center">
              <img style={{ width: '30%' }} src={scopesImages} />
            </div>
            <br />
          </div>}
          {!isDomainVerified && <div className="bg-white mt-4 rounded-lg p-4" style={{
            boxShadow:
              "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
          }}>
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '6px', marginBottom: '3px' }}>
              <Button onClick={handleSkipDomainVerification} style={{ marginRight: '5px' }} variant="text">Skip Domain Verification</Button>
              <Button onClick={domainVerify} style={{ backgroundColor: '#008060' }} variant="contained">Test Your Domain</Button>
            </div>
            <p>1. Open your Merchant Center, go to <b> Settings </b> and under the heading <b> Tools </b> click <b> Business Information </b> then click <b> Website </b>.</p>
            <br />
            <img style={{ width: '100%' }} src={merchantcenterimg1} />
            <br />
            <br />
            <p>2. You can verify your domain with the HTML Tag method which can be found under the <b> Add an HTML tag or upload an HTML file to your website ➔ Add an HTML tag </b>.</p>
            <br />
            <img style={{ width: '100%' }} src={domainverfiedimg2} />
            <br />
            <br />
            <p>3. Now after copying the code open your <b> Shopify Store ➔ Online Stores ➔ Themes ➔ Live Theme ➔ Actions ➔ Edit Code </b>. Paste in theme.liquid Header section {'<head> </head>'} After the completion of process go back to Merchant Center and hit Verify Website</p>
            <br />
            <img style={{ width: '100%' }} src={domainverfiedimage3} />
            <br />
            <br />
            <p>4. When Google redirects you back after verifying your domain you will see a link to <b> Claim this URL </b>, click on it and your store will be ready for the next step.</p>
            <br />
            <img style={{ width: '100%' }} src={domainveri4} />
            <br />
            <br />
            <p>5. Once you have <b> Verified and claimed </b> showing, click <b> Test your domain </b></p>
            <br />
            <img style={{ width: '100%' }} src={domianverifed5} />
            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '6px', marginBottom: '3px' }}>
              <Button onClick={handleSkipDomainVerification} style={{ marginRight: '5px' }} variant="text">Skip Domain Verification</Button>
              <Button onClick={domainVerify} style={{ backgroundColor: '#008060' }} variant="contained">Test Your Domain</Button>
            </div>
          </div>}
        </>
      </div>,
    },
    {
      label: "Store Settings",
      description: <div className="m-4">
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
                The shopping ads will only appear in your selected market.
              </p>
            </div>
            <div>
              <div className="mb-2">
                <p>The following options are determined based on your store:</p>
                <div>
                  <select
                    onChange={(e) => { setDefaultError(values => ({ ...values, ['market']: false })); handleMarketChange(e) }}
                    id="market"
                    class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                    value={selectedMarket}
                  >
                    <option disabled selected value>
                      - - Select - -
                    </option>
                    {allMarkets.length > 0 ? allMarkets.map((value, index) => (
                      <option value={value.value}>{value.label}</option>
                    )) : null}
                  </select>
                  {defaultError.market && (
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
                        Market Is Required.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {isLoading && <CircularProgress style={{ color: "#008060", marginRight: "10px" }} size={25} />}
              {isLoading && <span>{shortMessage}</span>}
              {isMarketSelected && (
                <div className="mt-2 w-full flex">
                  <div className="w-full mr-2">
                    <select
                      id="country"
                      name="country"
                      onChange={(e) => { setDefaultError(values => ({ ...values, ['country']: false })); handleInputChange(e) }}
                      class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      value={inputs && inputs.country ? inputs.country : null}
                    >
                      <option disabled selected value>
                        - - Country - -
                      </option>
                      {singleMarketDetails && singleMarketDetails.countries.length > 0 ? singleMarketDetails.countries.map((value, index) => (
                        <option value={value.value}>{value.label}</option>
                      )) : null}
                    </select>
                    {defaultError.country && (
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
                          Country Is Required.
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full mr-2">
                    <select
                      id="language"
                      name="language"
                      onChange={(e) => { setDefaultError(values => ({ ...values, ['language']: false })); handleInputChange(e) }}
                      class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      value={inputs && inputs.language ? inputs.language : null}
                    >
                      <option disabled selected value>
                        - - Language - -
                      </option>
                      {singleMarketDetails && singleMarketDetails.languages.length > 0 ? singleMarketDetails.languages.map((value, index) => (
                        <option value={value.value}>{value.label}</option>
                      )) : null}
                    </select>
                    {defaultError.language && (
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
                          Language Is Required.
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <select
                      id="currency"
                      name="currency"
                      onChange={(e) => { setDefaultError(values => ({ ...values, ['currency']: false })); handleInputChange(e) }}
                      class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      value={inputs && inputs.currency ? inputs.currency : null}
                    >
                      <option disabled selected value>
                        - - Currency - -
                      </option>
                      {singleMarketDetails && singleMarketDetails.currencies.length > 0 ? singleMarketDetails.currencies.map((value, index) => (
                        <option value={value.value}>{value.label}</option>
                      )) : null}
                    </select>
                    {defaultError.currency && (
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
                          Currency Is Required.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4">
            <div>
              <h5 className="font-normal text-lg">Channel Settings</h5>
              <p class="mt-2 text-gray-600 text-sm">
                Choose the marketing channel for your products to optimize<br />visibility and reach your target audience effectively.
              </p>
            </div>
            <div>
              <RadioGroup
                defaultValue="online"
                name="channel"
                value={inputs && inputs.channel ? inputs.channel : null}
                onChange={handleInputChange}
              >
                <FormControlLabel value="online" disabled={!featuresStatus.localInventory} control={<Radio style={{ color: '#008060' }} />} label="Online" />
                <FormControlLabel value="local" disabled={!featuresStatus.localInventory} control={<Radio style={{ color: '#008060' }} />} label="Local" />
              </RadioGroup>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4">
            <div>
              <h5 className="font-normal text-lg">Shipping Settings</h5>
              <p class="mt-2 text-gray-600 text-sm">
                Set up your shipping costs based on how you charge shipping.
              </p>
            </div>
            <div>
              <RadioGroup
                defaultValue="auto"
                name="shipping"
                value={inputs && inputs.shipping ? inputs.shipping : null}
                onChange={handleInputChange}
              >
                <FormControlLabel value="auto" control={<Radio style={{ color: '#008060' }} />} label="Setup Free Shipping" />
                <FormControlLabel value="manual" control={<Radio style={{ color: '#008060' }} />} label="Manually Configure Shipping in Merchant Center" />
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>,
    },
    {
      label: "Merchant Feed Settings",
      description: <div className="m-4">
        <div
          style={{
            boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
          }}
          class="bg-white rounded-lg p-4"
        >
          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Your Feed Name</h5>
              <p class="mt-2 text-gray-600 text-sm">Help to distinguish multiple feeds.</p>
            </div>
            <div>
              <div>
                <input
                  style={{
                    borderWidth: "2px",
                    borderColor: defaultError.name ? "rgba(215, 44, 13, 1)" : "#008060",
                  }}
                  onChange={(event) => {
                    event.target.value.length > 0 ? setDefaultError(values => ({ ...values, ['name']: false })) : setDefaultError(values => ({ ...values, ['name']: true }));
                    handleInputChange(event);
                  }}
                  onBlur={(e) => { e.target.value.length <= 0 ? setDefaultError(values => ({ ...values, ['name']: true })) : null }}
                  type="text"
                  name="name"
                  value={inputs && inputs.name ? inputs.name : null}
                  id="name"
                  class="block w-full p-2 text-black bg-white rounded-lg focus:ring-green-900 dark:placeholder-gray-400  dark:focus:ring-green-900 "
                />

                {defaultError.name && (
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
              <p class="mt-2 text-gray-600 text-sm w-[90%]">
                Use the product ID attribute to uniquely identify each product. The ID won’t be shown to customers who view your products online. The product ID format cannot be changed if the submitted feed to Merchant Center is approved.
              </p>
            </div>
            <div className="mt-2">
              <RadioGroup
                defaultValue="sku"
                name="productIdFormat"
                onChange={handleInputChange}
                value={inputs && inputs.productIdFormat ? inputs.productIdFormat : null}
              >
                <div className="flex items-center">
                  <FormControlLabel value="sku" control={<Radio style={{ color: '#008060' }} />} label="SKU as Product ID (Ex:ABCD1234)" />
                  <Tooltip title="The app will submit a variant SKU as a product ID. If some of your products are missing SKUs, then do not use this option, as those products could not be submitted in the feed." arrow>
                    <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                  </Tooltip>
                </div>
                <div className="flex items-center">
                  <FormControlLabel value="variant" control={<Radio style={{ color: '#008060' }} />} label="Variant ID as Product ID (Ex: 123456789)" />
                  <Tooltip title="The app will submit variants with a unique ID numeric value, which is automatically generated by Shopify as the product ID for the shopping feed.This numeric value is stored under the variant ID element in the source code of any product." arrow>
                    <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                  </Tooltip>
                </div>
                <div className="flex items-center">
                  <FormControlLabel value="global" control={<Radio style={{ color: '#008060' }} />} label="Global Format (Ex: Shopify_US_123456_987654)" />
                  <Tooltip title="The app will submit Shopify Native Product ID formatted items to Google Merchant Centre as item IDs. Ex: shopify_US_1534976491587_13765092900931" arrow>
                    <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                  </Tooltip>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Source Management</h5>
              <p class="mt-2 text-gray-600 text-sm w-[90%]">
                Here you can submit all of your products, and you can also choose from your collections. If you want to exclude certain collections, you can also do it here.
              </p>
            </div>
            <div className="mt-2">
              <RadioGroup
                defaultValue="All Products"
                name="whichProducts"
                onChange={handleInputChange}
                value={inputs && inputs.whichProducts ? inputs.whichProducts : null}
              >
                <FormControlLabel value="all" control={<Radio style={{ color: '#008060' }} />} label="All Products" />
                <FormControlLabel value="collection" control={<Radio style={{ color: '#008060' }} />} label="Products From Collection" />
              </RadioGroup>

              {inputs.whichProducts === "collection" && (
                <div className="mt-2">
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={allCollections.length > 0 ? allCollections : []}
                    onChange={(event, value) => { setInputs(values => ({ ...values, ['includedCollections']: value })); value.length > 0 ? setDefaultError(values => ({ ...values, ['includedCollections']: false })) : setDefaultError(values => ({ ...values, ['includedCollections']: true })) }}
                    value={inputs && inputs.includedCollections ? inputs.includedCollections : []}
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

              {(defaultError.includedCollections && inputs.whichProducts === "collection") && (
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
                    Please Select a Collection
                  </span>
                </div>
              )}

              <div>
                <div class="flex items-center mt-2">
                  <FormControlLabel checked={excludeChecked} onChange={handleChecked} control={<Checkbox style={{ color: '#008060' }} />} label="Exclude Collection" />
                </div>
                {excludeChecked && (
                  <div className="mt-2">
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={allCollections.length > 0 ? allCollections : []}
                      onChange={(event, value) => setInputs(values => ({ ...values, ['excludedCollections']: value }))}
                      value={inputs && inputs.excludedCollections ? inputs.excludedCollections : []}
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
              defaultValue="default"
              name="productTitle"
              onChange={handleInputChange}
              value={inputs && inputs.productTitle ? inputs.productTitle : null}
              row
            >
              <FormControlLabel disabled value="default" control={<Radio style={{ color: '#008060' }} />} label="Product Title" />
              {/* <FormControlLabel value="seo" control={<Radio style={{ color: '#008060' }} />} label="SEO Title" /> */}
            </RadioGroup>

          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Product Description</h5>
            </div>
            <RadioGroup
              defaultValue="default"
              name="productDescription"
              onChange={handleInputChange}
              value={inputs && inputs.productDescription ? inputs.productDescription : null}
              row
            >
              <FormControlLabel disabled value="default" control={<Radio style={{ color: '#008060' }} />} label="Product Description" />
              {/* <FormControlLabel value="seo" control={<Radio style={{ color: '#008060' }} />} label="SEO Description" /> */}
            </RadioGroup>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Variant Submission</h5>
            </div>
            <RadioGroup
              defaultValue="all"
              name="variantSubmission"
              onChange={handleInputChange}
              value={inputs && inputs.variantSubmission ? inputs.variantSubmission : null}
              row
            >
              <FormControlLabel value="all" control={<Radio style={{ color: '#008060' }} />} label="All Variants" />
              <FormControlLabel value="first" control={<Radio style={{ color: '#008060' }} />} label="First Variant Only" />
            </RadioGroup>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Brand Submission</h5>
            </div>
            <RadioGroup
              defaultValue="vendor"
              name="brandSubmission"
              onChange={handleInputChange}
              value={inputs && inputs.brandSubmission ? inputs.brandSubmission : null}
              row
            >
              <FormControlLabel value="vendor" control={<Radio style={{ color: '#008060' }} />} label="Vendor" />
              <FormControlLabel value="domain" control={<Radio style={{ color: '#008060' }} />} label="Domain" />
            </RadioGroup>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Product Identifier Exists</h5>
            </div>
            <RadioGroup
              defaultValue="true"
              name="productIdentifiers"
              onChange={handleInputChange}
              value={inputs && inputs.productIdentifiers ? inputs.productIdentifiers : null}
              row
            >
              <FormControlLabel value={true} control={<Radio style={{ color: '#008060' }} />} label="Yes" />
              <FormControlLabel value={false} control={<Radio style={{ color: '#008060' }} />} label="No" />
            </RadioGroup>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Barcode (ISBN, UPC, GTIN)</h5>
              <p class="mt-2 text-gray-600 w-[90%] text-sm">
                GTIN plays a significant role in the data in Google Merchant Center as a major factor for improving your product listing. Products submitted without any GTIN are difficult to classify and may not be eligible for all shopping programmes or features.
              </p>
            </div>
            <FormControlLabel name="barcode" onChange={handleCheckboxChanges} control={<Checkbox style={{ color: '#008060' }} checked={inputs.barcode} />} label="Do your products have GTINs ?" />
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">
                Sale Price With Compare Price
              </h5>
            </div>
            <div>
              <FormControlLabel name="salePrice" onChange={handleCheckboxChanges} control={<Checkbox defaultChecked style={{ color: '#008060' }} checked={inputs.salePrice} />} label="Enable sale price" />
              <Tooltip title="Tell users how much you will charge for your product during a sale by using the sale price feature. Your sale price will be reflected as the current price in the ads. When you follow the conditions with the initial pricing and purchase pricing, the original price will be shown along with the selling price to allow customers to see the difference. Mobile supports the ads that show the original price and sale price." arrow>
                <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
              </Tooltip>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Product Image Option</h5>
            </div>
            <FormControlLabel name="secondImage" onChange={handleCheckboxChanges} control={<Checkbox defaultChecked style={{ color: '#008060' }} checked={inputs.secondImage} />} label="Use a second image for products that have no variant." />
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div>
              <h5 className="font-normal text-lg">Submit Additional Images</h5>
            </div>
            <FormControlLabel name="additionalImages" onChange={handleCheckboxChanges} control={<Checkbox defaultChecked style={{ color: '#008060' }} checked={inputs.additionalImages} />} label="Check this box if you would like to submit additional images." />
          </div>

          <div className="grid lg:grid-cols-2 gap-2 pb-4 mt-2 mb-2">
            <div className="flex items-center">
              <h5 className="font-normal text-lg">Google Product Category</h5>
              <p className="ml-1">(optional)</p>
            </div>
            <div>
              <Autocomplete
                className="Product_Category_SelectDropdoen_1"
                disablePortal
                id="combo-box-demo"
                size="small"
                value={inputs && inputs.product_category_id ? productCategories.find(
                  (category) => category.id === inputs.product_category_id
                ) : null}
                options={productCategories}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => { value != null ? setInputs(values => ({ ...values, ['product_category_id']: value.id })) : setInputs(values => ({ ...values, ['product_category_id']: value })) }}
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
                  borderColor: defaultError.ageGroup ? "rgba(215, 44, 13, 1)" : "#008060",
                }}
                onChange={(event) => { setDefaultError(values => ({ ...values, ['ageGroup']: false })); handleInputChange(event) }}
                value={inputs && inputs.ageGroup ? inputs.ageGroup : null}
                id="ageGroup"
                name="ageGroup"
                class="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
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
              {defaultError.ageGroup && (
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
                  borderColor: defaultError.gender ? "rgba(215, 44, 13, 1)" : "#008060",
                }}
                onChange={(event) => { setDefaultError(values => ({ ...values, ['gender']: false })); handleInputChange(event) }}
                value={inputs && inputs.gender ? inputs.gender : null}
                name="gender"
                id="gender"
                class="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
              >
                <option disabled selected value>
                  - - select - -
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unisex">Unisex</option>
              </select>
              {defaultError.gender && (
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
                  borderColor: defaultError.productCondition ? "rgba(215, 44, 13, 1)" : "#008060",
                }}
                onChange={(event) => { setDefaultError(values => ({ ...values, ['productCondition']: false })); handleInputChange(event) }}
                value={inputs && inputs.productCondition ? inputs.productCondition : null}
                id="productCondition"
                name="productCondition"
                class="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-green-700 focus:border-green-700 block w-full p-2.5  dark:border-green-700 dark:placeholder-gray-400  dark:focus:ring-green-800 dark:focus:border-green-800"
              >
                <option disabled selected value>
                  - - select - -
                </option>
                <option value="new">New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Used</option>
              </select>
              {defaultError.productCondition && (
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
            <div className="flex items-center">
              <div className="flex items-center">
                <h5 className="font-normal text-lg">UTM Tracking Parameters</h5>
                <p className="ml-1">(optional)</p>
              </div>
              <div className="ml-2">
                <Tooltip title="Once a shopper clicks on any of your products from Google, these parameters will be appended to the end of the product link. You'll be able to see a breakdown of this data in your Google Analytics." arrow>
                  <HelpIcon style={{ cursor: 'help', color: '#008060' }} />
                </Tooltip>
              </div>
            </div>
            <div className="flex justify-between mt-4 w-full">
              <input
                class="text-black border h-12 mt-2 pl-2 bg-white rounded-lg w-[30%]"
                placeholder="Campaign"
                type="text"
                id="small-input"
                name="utm_campaign"
                onChange={handleInputChange}
                value={inputs && inputs.utm_campaign ? inputs.utm_campaign : null}
              />
              <input
                class="text-black border h-12 mt-2 pl-2 bg-white rounded-lg  w-[30%]"
                placeholder="Source"
                type="text"
                id="small-input"
                name="utm_source"
                onChange={handleInputChange}
                value={inputs && inputs.utm_source ? inputs.utm_source : null}
              />
              <input
                class="text-black border h-12 mt-2 pl-2 bg-white rounded-lg w-[30%]"
                placeholder="Medium"
                type="text"
                name="utm_medium"
                onChange={handleInputChange}
                value={inputs && inputs.utm_medium ? inputs.utm_medium : null}
                id="small-input"
              />
            </div>
          </div>
        </div>
      </div>,
    },
  ];

  return (
    <>
      {/* ------------Toast-------------- */}
      <>
        {showToast ? (
          <>
            <div id="toast-default" class="flex items-center p-4 absolute bottom-5 right-[42%] transition-opacity ease-in-out delay-100 z-50 w-full max-w-xs rounded-lg text-white bg-[#202123]" role="alert">
              <div class="ml-3 text-sm font-normal">{toastMessage}</div>
              <button onClick={() => setShowToast(false)} type="button" class="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 " data-dismiss-target="#toast-default" aria-label="Close">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </button>
            </div>
          </>
        ) : null}
      </>


      {pageLoading && <CircularProgress style={{ color: "#008060", marginRight: "10px", marginTop: "10%", marginLeft: "40%" }} size={60} />}
      {!pageLoading && <div style={{ margin: "10px" }}>
        {/* //////////////////////////// Dashboard Button //////////////////////////// */}
        {setup ? <div onClick={dashboardOnClick} className="flex items-center justify-end mr-8">
          <CloseIcon className="cursor-pointer hover:bg-gray-200 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer" />
        </div> : null}
        {/* /////////////////////////// Setup Guide /////////////////////////// */}
        <div className="grid md:grid-cols-5 sm:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 mx-8">
          <div>
            <div className="flex items-center w-full">
              <FlagIcon style={{ color: '#008060' }} />
              <p className="text-lg font-medium ">Setup Guide</p>
            </div>
            <div className="text-lg">{activeStep} of 3 task Completed</div>
            <VideoModal title='Complete Guide For Initial Setup' videoSrc='https://www.youtube.com/embed/XcIQXvg_IVw' />
          </div>
          <div className="flex justify-center items-center col-span-4">
            <LinearProgressWithLabel id='progress' style={{ width: '100%', height: '5px', marginRight: '10px' }} variant="determinate" value={progress} />
            <label for='progress'>{(progress).toFixed(0)}%</label>
          </div>
        </div>

        {isRendering && <center>
          <CircularProgress style={{ color: "#008060", marginRight: "10px", marginTop: "100px" }} />
        </center>}
        {!isRendering &&
          <div>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    optional={
                      index === 2 ? (
                        <Typography variant="caption">Last Step</Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    <div sx={{ mb: 9 }}>
                      <div>
                        <Button
                          style={{ background: (isSignIn && merchantAccConnected && isDomainVerified) ? "#008060" : "#f6f6f7" }}
                          variant="contained"
                          disabled={isSignIn && merchantAccConnected && isDomainVerified ? false : true}
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? "Finish" : "Continue"}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length && (
              <div square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed successfully</Typography>
                {/* <Link to="/setupPrice"> */}
                <Button className="flex items-center"
                  style={{ background: syncingSetup ? "#f6f6f7" : "#008060" }}
                  variant="contained"
                  onClick={setupSync}
                  disabled={syncingSetup}
                  sx={{ mt: 1, mr: 1 }}
                >
                  <svg width='24' fill="white" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m370.72 133.28c-31.262-29.272-71.832-45.318-114.872-45.28-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15h-57.303c-7.498 0-13.194-6.807-11.807-14.176 21.637-114.9 122.517-201.824 243.704-201.824 66.448 0 126.791 26.136 171.315 68.685l35.715-35.715c15.119-15.119 40.97-4.411 40.97 16.971v134.059c0 13.255-10.745 24-24 24h-134.059c-21.382 0-32.09-25.851-16.971-40.971zm-338.72 162.72h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176-21.638 114.898-122.518 201.822-243.705 201.822-66.448 0-126.791-26.136-171.315-68.685l-35.715 35.715c-15.119 15.119-40.97 4.411-40.97-16.971v-134.059c0-13.255 10.745-24 24-24z" /></svg>
                  <p className="ml-2">Sync Now</p>
                </Button>
                {/* </Link> */}
                <Button className='back__button'
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Back
                </Button>
              </div>
            )}
          </div>
        }
      </div>}

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
                      <p className='text-2xl text-center font-medium' >It’s Time for Your Upgrade!</p>
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
  );


}
