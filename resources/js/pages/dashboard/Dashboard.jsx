import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axioshttp from '../../axioshttp';
import upgradeImg from '../products/upgradeImg.png';
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import VideoModal from "../tutorials/VideoModal";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Rating from '@mui/material/Rating';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Card from '@mui/material/Card';
import '../partnerApps/PartnerResponsive.css'
import { values } from 'lodash';
import appointmentImage from './images/appointment.jpg';
import ReactGA from "react-ga4";

const countries = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  VG: "British Virgin Islands",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Christmas Island",
  CC: "Cocos Islands",
  CO: "Colombia",
  KM: "Comoros",
  CK: "Cook Islands",
  CR: "Costa Rica",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  CD: "Democratic Republic of the Congo",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  TP: "East Timor",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island and McDonald Islands",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  CI: "Ivory Coast",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  XK: "Kosovo",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macau",
  MK: "Macedonia",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  AN: "Netherlands Antilles",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  KP: "North Korea",
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestinian Territory",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: "Russia",
  RW: "Rwanda",
  BL: "Saint Barthelemy",
  SH: "Saint Helena",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  MF: "Saint Martin",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia and the South Sandwich Islands",
  KR: "South Korea",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard and Jan Mayen",
  SZ: "Swaziland",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TC: "Turks and Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VA: "Vatican",
  VE: "Venezuela",
  VN: "Vietnam",
  WF: "Wallis and Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe"
}

const Dashboard = () => {
  const [reviewBar, setReviewBar] = useState(true)
  const [feedsData, setFeedsData] = useState([]);
  const [allfeedsData, setAllFeedsData] = useState([]);
  const [merchantId, setMerchantId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [switchChangeId, setSwitchChangeId] = useState('');
  const [deleteFeedId, setDeleteFeedId] = useState('');
  const [deleteConsent, setDeleteConsent] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [count, setCount] = useState(0);
  const [OnModal, setOnModal] = useState(false)
  const [OffModal, setOffModal] = useState(false)
  const [showModalReview, setShowModalReview] = useState(false)
  const [clickedOnReview, setClickedOnReview] = useState('');
  const [reviewChecked, setReviewChecked] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const [noRating, setNoRating] = useState(false);
  const [planLimits, setPlanLimits] = useState([]);
  const [billingStatus, setBillingStatus] = useState(false);
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);

  const navigate = useNavigate();
  const setupOnClick = useCallback(() => navigate('/setup', { replace: true }), [navigate]);
  const productsOnClick = useCallback((id) => navigate('/Products/' + id, { replace: true }), [navigate]);
  const GeneralSettingOnClick = useCallback((id) => navigate('/GeneralSetting/' + id, { replace: true }), [navigate]);

  const fetchFeedsdata = () => {
    axioshttp.get('fetch/feeds/data').then(response => {
      console.log(response);
      if (response.data.feedSetting) {
        setFeedsData(response.data.feedSetting);
        setAllFeedsData(response.data.feedSetting);
        setBillingStatus(response.data.billingStatus);
        setPlanLimits(response.data.planLimits);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
      if (response.data.merchantId) {
        setMerchantId(response.data.merchantId)
      }
    }).catch(error => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
      console.log(error);
    })
  }

  const handleChangeStatus = () => {
    const data = { id: switchChangeId }
    axioshttp.post('update/feed/status', data).then(response => {
      if (response.data.status) {
        setToastMessage(response.data.message);
        setShowToast(true);
        setFeedsData(feedsData.map((value, index) => {
          if (value.id == switchChangeId) {
            value.status = !value.status;
          }
          return value;
        }));
        setSwitchChangeId('');
      }
    }).catch(error => {
      if (error.response.data.error) {
        setToastMessage(error.response.data.error);
        setShowToast(true);
        setSwitchChangeId('');
      }
    })
  }

  const handleFeedDelBtn = (id) => {
    setShowModal(true);
    setDeleteFeedId(id);
  }

  const handleDeleteConsent = (e) => {
    setDeleteConsent(e.target.checked)
  }

  const deleteSingleFeed = () => {
    axioshttp.delete(`feed/delete/${deleteFeedId}/${deleteConsent}`
      // {
      //   data: {
      //     id: deleteFeedId
      //   }
      // }
    ).then(response => {
      console.log(response);
      if (response.data.status == true) {
        setToastMessage(response.data.message);
        setShowToast(true);
        setFeedsData((current) =>
          current.filter((value) => value.id !== deleteFeedId)
        );
        setDeleteFeedId('');
        setDeleteConsent(false);
      }
    }).catch(error => {
      if (error.response.data.error) {
        setToastMessage(error.response.data.error);
        setShowToast(true);
        setDeleteFeedId('');
      }
    })
  }

  const handleSwitchChanges = (data, index) => {
    if (billingStatus) {
      if (planLimits.feeds != "Unlimited") {
        if ((+index + +1) > planLimits.feeds) {
          setShowUpgradeModel(true);
        } else {
          if (data.status) {
            setOffModal(true);
            setSwitchChangeId(data.id);
          } else {
            setOnModal(true);
            setSwitchChangeId(data.id);
          }
        }
      } else {
        if (data.status) {
          setOffModal(true);
          setSwitchChangeId(data.id);
        } else {
          setOnModal(true);
          setSwitchChangeId(data.id);
        }
      }
    } else {
      if (data.status) {
        setOffModal(true);
        setSwitchChangeId(data.id);
      } else {
        setOnModal(true);
        setSwitchChangeId(data.id);
      }
    }
  }

  const handleSearchChange = (e) => {
    if (e.target.value.length > 0) {
      setIsLoading(true);
      setFeedsData(allfeedsData.filter((obj => obj.name.toLowerCase().includes(e.target.value.toLowerCase()))))
      setIsLoading(false);
    }
    else {
      setFeedsData(allfeedsData);
    }
  }

  const handleReviewCheckbox = (e) => {
    setReviewChecked(e.target.checked)
  }

  const handleReviewChanges = (e, value) => {
    if (e.target.name == 'rating') {
      setReviewData(values => ({ ...values, [e.target.name]: value }))
    }
    else {
      setReviewData(values => ({ ...values, [e.target.name]: e.target.value }))
    }
  }

  const clearReviewModalBelongings = () => {
    setShowModalReview(false);
    setClickedOnReview('');
    setReviewChecked(false);
    setReviewData({});
    setNoRating(false);
  }

  const submitReview = () => {
    if (reviewData.rating == null) {
      setNoRating(true)
    }
    else {
      axioshttp.post('send/review', reviewData).then(response => {
        if (response.data.status == true) {
          clearReviewModalBelongings();
          setToastMessage('Review Submitted Successfully')
          setShowToast(true);
        }
      }).catch(error => {
        clearReviewModalBelongings();
        setToastMessage('Something went wrong')
        setShowToast(true);
      })
    }
  }

  const handleUpgradeModelCancel = () => {
    setShowUpgradeModel(false);
  }

  const goodReviewClicked = () => {
    window.open('https://apps.shopify.com/easyfeed-for-google-shopping-feeds#modal-show=WriteReviewModal&st_campaign=rate-app&st_source=admin&utm_campaign=installed')
  }

  const handleUpgradeNow = useCallback(() => navigate(`/pricing`, { replace: true }), [navigate]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 2000);
    }
  }, [showToast]);

  useEffect(() => {
    if (clickedOnReview == 'good') {
      setReviewData(values => ({ ...values, ['rating']: 5 }))
    }
    else if (clickedOnReview == 'bad') {
      setReviewData(values => ({ ...values, ['rating']: 2 }))
    }
    setReviewData(values => ({ ...values, ['clicked_on']: clickedOnReview }))
  }, [clickedOnReview]);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/dashboard", title: "Dashboard" });
    fetchFeedsdata();
  }, [])

  const tableRows = feedsData.length > 0 ? feedsData.map((data, index) => (
    <tr className='hover:bg-gray-100 cursor-pointer' key={data.id}>
      <td className="py-3 pl-4">
        <div class="toggle-onoff">
          <input
            checked={data.status}
            name={'checkbox' + data.id}
            onChange={(e) => handleSwitchChanges(data, index)}
            class="toggle-onoff-checkbox"
            id={"toggle-onoff" + data.id}
            tabindex="0"
            type="checkbox"
          />
          <label class="toggle-onoff-label" for={"toggle-onoff" + data.id}>
            <span class="toggle-onoff-inner"></span>
            <span class="toggle-onoff-switch"></span>
          </label>
        </div>
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm font-medium text-gray-800 whitespace-nowrap">
        {data.name}
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {data.merchantAccountId}
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {data.channel}
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {countries[data.country]}
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {data.language} / {data.currency}
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {data.shop_product_variants_count}
      </td>
      <td onClick={() => { productsOnClick(data.id) }} className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {data.updated_at}
      </td>
      <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        <div class="rounded-md" role="group">
          <button onClick={() => { productsOnClick(data.id) }} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-l-lg border-2 hover:bg-white  focus:z-10 focus:bg-[#008060] focus:text-white text-black">
            <VisibilityIcon style={{ fontSize: '20px', marginRight: '5px' }} />
            View
          </button>
          <button onClick={(e) => { handleFeedDelBtn(data.id) }} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent border-t-2 border-b-2 hover:bg-white  focus:z-10 focus:bg-[#008060] focus:text-white text-black">
            <DeleteIcon style={{ fontSize: '20px', marginRight: '5px' }} />
            Delete
          </button>
          <button onClick={() => { GeneralSettingOnClick(data.id) }} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-r-md border-2 hover:bg-white  focus:z-10 focus:bg-[#008060] focus:text-white text-black">
            <SettingsIcon style={{ fontSize: '20px', marginRight: '5px' }} />
            Settings
          </button>
        </div>
      </td>
    </tr>
  )) :
    <tr className='bg-gray-100'>
      <td className="py-3 pl-4" colSpan={8}>No Record Found</td>
    </tr>;

  return (
    <>

      <div className="flex flex-col p-4">
        {reviewBar ? (
          <>
            <div className="text-black flex items-center justify-between p-2 px-4 w-[100%] py-2 rounded relative mb-4 border border-[#e9c794] bg-[#fff5ea]">
              <span className="text-xl flex items-center inline-block mr-2 align-middle">
                <ErrorOutlineIcon style={{ color: '#b98900' }} />
                <span className="inline-block align-middle text-sm font-normal mr-8">
                  We believe you had the best time here; please let us know how your experience went. It means a lot to us.
                </span>
              </span>
              <button className=" flex items-center bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none">
                <div className='mr-8 flex items-center'>
                  {/* <div onClick={() => { setClickedOnReview('good'); setShowModalReview(!showModalReview) }} className='flex items-center'>
                    <span className='mr-2 text-lg font-normal'>Good</span>
                    <img className='w-[40px] mr-8' src='https://media2.giphy.com/media/LOnt6uqjD9OexmQJRB/giphy.gif?cid=6c09b95285b5fb2cdca66df269901e916fea26cafe0b9ec8&rid=giphy.gif&ct=g' />
                  </div> */}
                  <div onClick={goodReviewClicked} className='flex items-center'>
                    <span className='mr-2 text-lg font-normal'>Good</span>
                    <img className='w-[40px] mr-8' src='https://media2.giphy.com/media/LOnt6uqjD9OexmQJRB/giphy.gif?cid=6c09b95285b5fb2cdca66df269901e916fea26cafe0b9ec8&rid=giphy.gif&ct=g' />
                  </div>
                  <div onClick={() => { setClickedOnReview('bad'); setShowModalReview(!showModalReview) }} className='flex items-center'>
                    <span className='mr-2 text-lg font-normal'>Bad</span>
                    <img className='w-[40px]' src='https://media2.giphy.com/media/h4OGa0npayrJX2NRPT/giphy.gif?cid=6c09b952y0ccm5pjioqdpb1onvojgj78amyj8e6bmcit2hw1&rid=giphy.gif&ct=g' />
                  </div>
                </div>
                <span onClick={() => setReviewBar(false)} className='text-3xl font-medium hover:text-red-700'>×</span>
              </button>
            </div>
          </>
        ) : null}
        <div className='flex items-center'>
          <p className="p-2 text-2xl font-medium">All Feeds</p>
          <VideoModal title='Introduction - Must Watch' videoSrc='https://www.youtube.com/embed/wE8RuU7ck7E' />
        </div>
        <div className="overflow-x-auto bg-white rounded-lg p-4" style={{
          boxShadow:
            "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
        }}>
          <div className="flex justify-between py-3 pl-2">
            <div className="xl:w-[85%] md:w-[76%] sm:w-[70%] 2xl:w-[89%] w-[40%]">
              <label htmlFor="hs-table-search" className="sr-only">
                Search
              </label>
              <input
                type="text"
                name="hs-table-search"
                onChange={handleSearchChange}
                id="hs-table-search"
                className="block w-full p-2 pl-10 text-sm border border-[#babfc3] rounded-md focus:border-blue-500 focus:ring-blue-500 "
                placeholder="Search..."
              />
            </div>
            <div>
              <Button style={{ background: '#008060' }} onClick={setupOnClick} variant="contained" className="text-white"><AddIcon /> Create Feed</Button>
            </div>
          </div>

          <div className="p-1.5 w-full inline-block align-middle">
            <div className="overflow-x-scroll border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 overflow-x-scroll">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize ">
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Feed Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Merchant Id
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Channel
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Target Country
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Language/Currency
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Total SKU'S
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Last Updated
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 overflow-x-scroll">

                  {isLoading && <tr className='hover:bg-gray-100 cursor-pointer'>
                    <td className="py-3 pl-4">
                      <CircularProgress style={{ color: "#008060", marginRight: "10px" }} size={20} />
                      <span>Loading</span>
                    </td>
                  </tr>}
                  {!isLoading && tableRows}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>



      {/* ///////////////////////////////partner apps slider//////////////////////////////////////// */}

      <>
        <div className="p-4">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            slidesPerView={3}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              400: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              2000: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              2500: {
                slidesPerView: 5,
                spaceBetween: 10,
              },
              3000: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
            }}
          >
            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/e19a1711bf244f7b4f3b425e0696175a/icon/CMj_8_LA8f0CEAE=.jpeg'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easy_to_FBTiktokpixel' target="_blank"><b>Infinite FB & Tiktok Pixels</b></a></p>
                    <div className='mb-1'><Rating defaultValue={5} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Install Unlimited Facebook &Tiktok Pixels, Conversion API</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easy_to_FBTiktokpixel' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/fc98dbd23e8e139349b2426307effd9e/icon/CLnelfCP_fcCEAE=.png'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_essential_free_shipping' target="_blank"><b>Essential Free Shipping Upsell</b></a></p>
                    <div className='mb-1'><Rating defaultValue={4.9} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Free Shipping Bar Upsell & Cross sell - Boost AOV!</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_essential_free_shipping' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/02390e57cc10c164770a62f5ff798ec9/icon/CLS1rKf0lu8CEAE=.png'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_reputon_Google_review' target="_blank"><b>Reputon for Google Reviews</b></a></p>
                    <div className='mb-1'><Rating defaultValue={4.8} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Import Google Reviews & Testimonials.</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_reputon_Google_review' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/d901cd4dbfe8eb94d9ab8c2170c2c477/icon/CILQk_3Hgf0CEAE=.png'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_GtinSync' target="_blank"><b>Easy GTIN</b></a></p>
                    <div className='mb-1'><Rating defaultValue={2.3} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Fix Limited performance due to missing [gtin] for GMC</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_GtinSync' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/a6570830ea8be24a54472b4e701c9d1a/icon/CLyg5NaTp_YCEAE=.jpeg?height=60&quality=90&width=60'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_shortly' target="_blank"><b>Shortly: Short Links & Track</b></a></p>
                    <div className='mb-1'><Rating defaultValue={4.6} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Create Influencers Link, Short Links, Discount, QR Codes</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_shortly' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/36881f6a4f1818cb5cffe1d6cf5cb302/icon/CNmw6uaeq_0CEAE=.png'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_LangShop' target="_blank"><b>LangShop</b></a></p>
                    <div className='mb-1'><Rating defaultValue={4.8} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Translate store into multi language, switcher, geolocation</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_LangShop' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/5a1479e431df4989c4aad0af02604271/icon/CN7o_Kynsf4CEAE=.png'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_PushSections' target="_blank"><b>Push Sections</b></a></p>
                    <div className='mb-1'><Rating defaultValue={5} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>No docs landing page builder! 120+ pre-design sections</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_PushSections' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/0d3f51e5a3309561a145ccd20d258bf8/icon/CNTV5Kvf8fECEAE=.jpeg'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='http://cut.live/EasyFeed_to_Wiser' target="_blank"><b>Product Recommendations</b></a></p>
                    <div className='mb-1'><Rating defaultValue={4.9} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>AI ML powered personalized recommendations app</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='http://cut.live/EasyFeed_to_Wiser' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/030fe401789c6f84cc38805e7965669b/icon/CKee5Kv1yP4CEAE=.jpeg'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_zipifyPage' target="_blank"><b>Zipify Pages Builder & Editor</b></a></p>
                    <div className='mb-1'><Rating defaultValue={4.8} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Create Smarter Sales Funnels & Landing Pages</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://cut.live/Easyfeed_to_zipifyPage' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/1f2542e8bdaa422d41642d0a756d1f54/icon/CISqvdGo4_8CEAE=.jpeg'></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://bit.ly/Efeed2EAds' target="_blank"><b>Easy Google Ads Tracking</b></a></p>
                    <div className='mb-1'><Rating defaultValue={5} precision={0.1} readOnly /></div>
                    <p style={{ wordWrap: 'break-all' }}>Easy to setup Google Ads Conversion Tracking</p>
                  </div>
                </div>
                <div className='ml-2 flex justify-center m-auto'>
                  <a className='' href='https://bit.ly/Efeed2EAds' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Try It Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

            <SwiperSlide>
              <Card>
                <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
                  <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src={appointmentImage}></img>
                  <div style={{ margin: '0px 0 0 10px' }}>
                    <p className='mb-1' variation="strong"><a className='partner__apps' href='https://calendly.com/talk-to-specialist/30min' target="_blank"><b>Book Your Free Consultation Today</b></a></p>
                    <p style={{ wordWrap: 'break-all' }}>Our team of experts is here to provide support and assistance.</p>
                  </div>
                </div>
                <div className='ml-2 mt-2 flex justify-center m-auto'>
                  <a className='' href='https://calendly.com/talk-to-specialist/30min' target='_blank'>
                    <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                      Book Now
                    </button>
                  </a>
                </div>
              </Card>
            </SwiperSlide>

          </Swiper>


        </div>
      </>

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

      {/* ////////////////////////////////////////////////////////////////////////// */}
      {showModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => { setShowModal(false); setDeleteFeedId('') }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className='flex items-center p-2'>
                    <ReportProblemIcon style={{ color: '#d82c0d' }} />
                    <p className='text-lg font-medium ml-2'>Are You Sure ?</p>
                    <CloseIcon onClick={() => { setShowModal(false); setDeleteFeedId('') }} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='p-4'>
                    <p className='font-normal' >If you delete your saved feed keep in mind that your product data will be permanently deleted from our app</p>
                    <div className='flex items-center mt-2'>
                      <input
                        checked={deleteConsent}
                        onChange={handleDeleteConsent}
                        class="w-5 h-5 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        id="flesdxCheckDefault"
                        type="checkbox"
                      />
                      <p className='text-sm flex items-center ml-2'>Yes, delete the feed from GMC&nbsp;</p>
                    </div>
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='flex justify-end'>
                    <Button onClick={() => { setShowModal(false); setDeleteFeedId('') }} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                    <Button onClick={() => { setShowModal(false); deleteSingleFeed() }} style={{ background: "#d82c0d", color: "white" }}>Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}


      {OnModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => { setOnModal(false); setSwitchChangeId('') }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className='flex items-center p-2'>
                    <ReportProblemIcon style={{ color: '#d82c0d' }} />
                    <p className='text-lg font-medium ml-2'>Are You Sure ?</p>
                    <CloseIcon onClick={() => { setOnModal(false); setSwitchChangeId('') }} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='p-4'>
                    <p className='text-sm font-normal' >Once you turn on, seamlessly we start sync product data to Google Merchant Center.</p>
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='flex justify-end'>
                    <Button onClick={() => { setOnModal(false); setSwitchChangeId('') }} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                    <Button onClick={() => { setOnModal(false); handleChangeStatus() }} style={{ background: "#008060" }} variant="contained">Turn On</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {OffModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => { setOffModal(false); setSwitchChangeId('') }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className='flex items-center p-2'>
                    <ReportProblemIcon style={{ color: '#d82c0d' }} />
                    <p className='text-lg font-medium ml-2'>Are You Sure ?</p>
                    <CloseIcon onClick={() => { setOffModal(false); setSwitchChangeId('') }} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='p-4'>
                    <p className='text-sm font-normal' >If you want to turn it off, new changes will not affect the Google Merchant Center.</p>
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='flex justify-end'>
                    <Button onClick={() => { setOffModal(false); setSwitchChangeId('') }} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                    <Button onClick={() => { setOffModal(false); handleChangeStatus() }} style={{ background: "#d82c0d", color: "white" }}>Turn Off</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* ============== Toast ================= */}

      {showToast ? (
        <>
          <div id="toast-default" class="flex items-center p-4 absolute bottom-5 right-[42%] transition-opacity ease-in-out delay-150 w-full max-w-xs rounded-lg text-white bg-[#202123]" role="alert">
            <div class="ml-3 text-sm font-normal">{toastMessage}</div>
            <button onClick={() => setShowToast(false)} type="button" class="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 " data-dismiss-target="#toast-default" aria-label="Close">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          </div>
        </>
      ) : null}
      {/* ============== Review Modal ============== */}
      <>
        {showModalReview ? (
          <>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={clearReviewModalBelongings}
              ></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                  <div className="">
                    <div className='flex items-center p-2'>
                      <p className='text-lg font-medium ml-2'>Tell us about your experience</p>
                      <CloseIcon onClick={clearReviewModalBelongings} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='p-4'>
                      <p className='text-sm font-normal'>How would you rate this app?</p>
                      <Rating name="rating" onChange={handleReviewChanges} defaultValue={clickedOnReview == 'good' ? 5 : 2} precision={1} />
                      {noRating && <div>
                        <br />
                        <div className="text-black flex items-center justify-between p-2 px-3 w-[100%] py-2 rounded relative mb-2 border border-[#e9c794] bg-[#fff5ea]">
                          <span className="text-xl flex items-center inline-block mr-2 align-middle">
                            <ErrorOutlineIcon style={{ color: '#FF0000' }} />
                            <span className="ml-2 inline-block align-middle text-sm font-medium mr-8">
                              Please Provide Some Rating
                            </span>
                          </span>
                          <button className=" flex items-center bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none">
                            <span onClick={() => { setNoRating(false) }} className='text-3xl font-medium hover:text-red-700'>×</span>
                          </button>
                        </div>
                      </div>}
                      <p className='text-sm font-normal pt-2 pb-2'>Provide some detail about what you did or did not enjoy about using this app.</p>
                      <div className='relative'>
                        <textarea name="review_text" value={reviewData && reviewData.reviewText ? reviewData.reviewText : null} onChange={e => { setCount(e.target.value.length); handleReviewChanges(e) }} id="message" rows="4" class="relative block p-2.5 w-full text-sm text-black rounded-md border border-gray-300" placeholder="Write your thoughts here...">
                        </textarea>
                        <p className='absolute inset-y-2 right-2 top-[80%] z-50 text-gray-500 text-sm'>{count}</p>
                      </div>
                      <p className='text-sm font-normal pt-2 pb-2'>Minimum 100 characters</p>
                      <div className='flex items-center'>
                        <input
                          checked={reviewChecked}
                          onChange={handleReviewCheckbox}
                          class="w-5 h-5 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          id="flesdxCheckDefault"
                          type="checkbox"
                        />
                        <p className='flex items-center ml-2'>This review is accurate and compliant with&nbsp;</p>
                        <a className='ml-1 ml-1 border-b border-[#008060] text-[#008060]' target="_blank" href="https://www.shopify.com/legal/terms" class="terms_of_service"> Terms of Service <OpenInNewIcon style={{ color: "#008060" }} /> </a>
                      </div>
                    </div>
                    <Divider style={{ margin: '10px 0 10px 0' }} />
                    <div className='flex justify-end'>
                      <Button onClick={clearReviewModalBelongings} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                      <Button className='bg-[#008060]'
                        disabled={count > 100 && reviewChecked ? false : true}
                        onClick={() => { submitReview() }} variant="contained">Submit</Button>
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

export default Dashboard

