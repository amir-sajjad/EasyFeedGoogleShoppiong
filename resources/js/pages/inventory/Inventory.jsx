import React, { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import { Divider } from "@mui/material";
import "./style.scss";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import VideoModal from "../tutorials/VideoModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import YouTubeIcon from "@mui/icons-material/YouTube";
import "./switch.scss";
import upgradeImg from './upgradeImg.png';
import { useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axioshttp from '../../axioshttp';
import ReactGA from "react-ga4";

const Inventory = () => {

  const navigate = useNavigate();
  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localFeeds, setLocalFeeds] = useState([]);
  const [allLocalFeeds, setAllLocalFeeds] = useState([]);
  const [allPrimaryFeeds, setAllPrimaryFeeds] = useState([]);
  const [primaryLocalFeeds, setPrimaryLocalFeeds] = useState([]);
  const [primaryOnlineFeeds, setPrimaryOnlineFeeds] = useState([]);
  const [planLimits, setPlanLimits] = useState([]);
  const [billingStatus, setBillingStatus] = useState(false);
  const [feedInputs, setFeedInputs] = useState({
    feed_type: "local"
  });
  const [defaultErrors, setDefaultErrors] = useState({
    feed_name: false,
    feed_setting_id: false,
    feed_type: false,
    code: false,
    pickupMethod: false,
    pickupSla: false
  });
  const [createFeedButtonDisable, setCreateFeedButtonDisable] = useState(false);
  const [pickupMethodRadioButtonValue, setPickupMethodRadioButtonValue] = useState("notSet");
  const [pickupSlaRadioButtonValue, setPickupSlaRadioButtonValue] = useState("notSet");
  const [deleteFeedId, setDeleteFeedId] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [OnModal, setOnModal] = useState(false)
  const [OffModal, setOffModal] = useState(false)
  const [switchChangeId, setSwitchChangeId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [featuresStatus, setFeaturesStatus] = useState({});
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);

  const handleUpgradeNow = useCallback(() => navigate(`/pricing`, { replace: true }), [navigate]);

  setTimeout(function () {
    setShowToast(false);
    setToastMessage('');
  }, 5000)

  const fetchFeaturesStatus = () => {
    axioshttp.get('get/features/status').then(response => {
      if (response.data.status == true) {
        setFeaturesStatus(response.data.features)
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const fetchLocalFeeds = () => {
    axioshttp.get('local/feeds').then(response => {
      if (response.data.status) {
        setIsLoading(false);
        setLocalFeeds(response.data.localFeeds)
        setAllLocalFeeds(response.data.localFeeds)
      }
    }).catch(error => {
      setIsLoading(false);
      console.log(error)
    })
  }

  const fetchPrimaryFeeds = () => {
    axioshttp.get('fetch/feeds/data').then(response => {
      if (response.data.feedSetting) {
        setAllPrimaryFeeds(response.data.feedSetting);
        setPrimaryLocalFeeds(response.data.feedSetting.filter((element) => element.channel == "local"));
        setPrimaryOnlineFeeds(response.data.feedSetting.filter((element) => element.channel == "online"));
        setAllLocalFeeds(response.data.feedSetting);
        setBillingStatus(response.data.billingStatus);
        setPlanLimits(response.data.planLimits);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }).catch(error => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
      console.log(error);
    })
  }

  const handleInputChange = (e) => {
    setDefaultErrors(values => ({ ...values, [e.target.name]: false }))
    setFeedInputs(values => ({ ...values, [e.target.name]: e.target.value }))
  }

  const handlePickUpMethod = (e) => {
    if (e.target.value == "notSet" && feedInputs.hasOwnProperty('pickupMethod')) {
      const { pickupMethod, ...updatedInputs } = feedInputs;
      setFeedInputs(updatedInputs);
    }
    setPickupMethodRadioButtonValue(e.target.value);
  }

  const handlePickUpSla = (e) => {
    if (e.target.value == "notSet" && feedInputs.hasOwnProperty('pickupSla')) {
      const { pickupSla, ...updatedInputs } = feedInputs;
      setFeedInputs(updatedInputs);
    }
    setPickupSlaRadioButtonValue(e.target.value);
  }

  const handleCancelFeed = () => {
    setFeedInputs({
      feed_type: "local"
    });
    setPickupMethodRadioButtonValue('notSet')
    setPickupSlaRadioButtonValue('notSet')
    setDefaultErrors({
      feed_name: false,
      feed_setting_id: false,
      feed_type: false,
      code: false,
      pickupMethod: false,
      pickupSla: false
    });
    setCreateFeedButtonDisable(false);
    setShowDrawer(false);
  }

  const handleCreateFeed = () => {
    setCreateFeedButtonDisable(true);
    axioshttp.post('sync/local/feed', feedInputs).then(response => {
      setCreateFeedButtonDisable(false);
      if (response.data.status) {
        setToastMessage(response.data.success)
        setShowToast(true);
        handleCancelFeed();
        fetchLocalFeeds();
      }
    }).catch(error => {
      setCreateFeedButtonDisable(false);
      var allErrors = error.response.data.errors;
      for (const error in allErrors) {
        console.log(error);
        setDefaultErrors(values => ({ ...values, [error]: true }))
      }
    })
  }

  const handleDeleteButtonClick = (id) => {
    setDeleteModal(true);
    setDeleteFeedId(id);
  }

  const confirmDeleteFeed = () => {
    axioshttp.delete(`local/feed/delete/${deleteFeedId}`
      // {
      //   data: {
      //     id: deleteFeedId
      //   }
      // }
    ).then(response => {
      if (response.data.status == true) {
        setToastMessage(response.data.message);
        setShowToast(true);
        setDeleteFeedId('');
        fetchLocalFeeds();
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const handleSwitchChange = (value) => {
    if (featuresStatus.localInventory) {
      if (value.status) {
        setOffModal(true);
        setSwitchChangeId(value.id)
      } else {
        setOnModal(true);
        setSwitchChangeId(value.id)
      }
    } else {
      setShowUpgradeModel(true);
    }
  }

  const handleChangeStatus = () => {
    const data = { id: switchChangeId }
    axioshttp.post('update/local/status', data).then(response => {
      if (response.data.status) {
        setToastMessage(response.data.message);
        setShowToast(true);
        setLocalFeeds(localFeeds.map((value, index) => {
          if (value.id == switchChangeId) {
            value.status = !value.status;
          }
          return value;
        }));
        setSwitchChangeId(null);
      }
    }).catch(error => {
      if (error.response.data.error) {
        setToastMessage(error.response.data.error);
        setShowToast(true);
        setSwitchChangeId(null);
      }
    })
  }

  const handleSearchChange = (e) => {
    if (e.target.value.length > 0) {
      setIsLoading(true);
      setLocalFeeds(allLocalFeeds.filter((obj => obj.feed_name.toLowerCase().includes(e.target.value.toLowerCase()))))
      setIsLoading(false);
    }
    else {
      setLocalFeeds(allLocalFeeds);
      setIsLoading(false);
    }
  }

  const handleCheckboxChanges = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setFeedInputs(values => ({ ...values, [name]: value }))
  }

  const handleCreateLocalFeedButton = () => {
    if (featuresStatus.localInventory) {
      setShowDrawer(true);
    } else {
      setShowUpgradeModel(true);
    }
  }

  const handleUpgradeModelCancel = () => {
    setShowUpgradeModel(false);
  }

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/inventory", title: "Local Inventory" });
    fetchFeaturesStatus();
    fetchLocalFeeds();
    fetchPrimaryFeeds();
  }, []);

  const handleToggle = () => {
    setOnOffModal(!OnOffModal);
  }

  const textRef = useRef(null);

  const handleCopyClick = () => {
    const textToCopy = textRef.current.textContent;
    navigator.clipboard.writeText(textToCopy);
    alert("Copied to clipboard");
  };

  const localFeedsRows = localFeeds.length > 0 ?
    localFeeds.map((value, index) => (
      <tr className="hover:bg-gray-100 cursor-pointer" key={value.id}>
        <td className="px-6 py-2 text-sm font-medium text-blue-400 whitespace-nowrap">
          <div class="">
            <div class="toggle-onoff">
              <input
                checked={value.status}
                name={'checkbox' + value.id}
                onChange={(e) => handleSwitchChange(value)}
                class="toggle-onoff-checkbox"
                id={"toggle-onoff" + value.id}
                type="checkbox"
              />
              <label class="toggle-onoff-label" for={"toggle-onoff" + value.id}>
                <span class="toggle-onoff-inner"></span>
                <span class="toggle-onoff-switch"></span>
              </label>
            </div>
          </div>
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.feed_name}
        </td>
        {/* <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          <div className="flex items-center" title={value.feed_url}>
            <p ref={textRef} className="truncate w-[8vw]">
              {value.feed_url}
            </p>
            <div onClick={handleCopyClick}>
              <ContentCopyIcon
                style={{ fontSize: "18px", color: "#2da0fd" }}
              />
            </div>
          </div>
        </td> */}
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.feed_type}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.code}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.availability}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.salePrice ? "True" : "False"}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.salePriceEffectiveDate}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.instoreProductLocation}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.pickupMethod}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.pickupSla}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.skus}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          {value.created_at}
        </td>
        <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
          <div class="rounded-md" role="group">
            <button
              onClick={(e) => { handleDeleteButtonClick(value.id) }}
              type="button"
              class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-md border-2 hover:bg-white  focus:z-10 focus:bg-[#008060] focus:text-white text-black"
            >
              <DeleteIcon
                style={{ fontSize: "20px", marginRight: "5px" }}
              />
              Delete
            </button>
          </div>
        </td>
      </tr>
    )) : <tr className="">
      <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap"> No Record Found</td>
    </tr>

  const [dataArray, setDataArray] = useState([
    {
      id: 1,
      feed: "John Doe",
      url: "google.com",
      type: "123",
      code: "bc25",
      pickupSla: "amount off",
      pickupMethod: "amount off",
      sku: "amount off",
      createdAt: "Aug 18, 2022",
    },
  ]);

  const [status, setStatus] = React.useState(1);

  const radioHandler = (status) => {
    setStatus(status);
  };

  const [pauseModal, setpauseModal] = useState(false);

  const [OnOffModal, setOnOffModal] = useState(false);

  const [checked, setChecked] = useState(false);

  return (
    <>
      <div className="p-8">
        <>
          <p className="pt-2 pb-4">
            The Local Inventory Feed is designed to help merchants effortlessly manage and showcase their products available at local stores. Syncing data with Google Merchant Center ensures accurate, real-time information for customers searching nearby.{" "}
            <a
              className="text-blue-600 font-semibold"
              target="_blank"
              href="https://support.google.com/merchants/answer/3057972?hl=en"
            >
              Learn more
            </a>
          </p>
        </>
        <>
          <div
            className="bg-white rounded-md p-3"
            style={{
              boxShadow:
                "0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)",
            }}
          >
            <div className="flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap items-center justify-between pt-1 pb-2">
              <div className="mr-2 flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap items-center">
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleCreateLocalFeedButton}
                  variant="contained"
                  style={{
                    color: "white",
                    background: "#008060",
                    textTransform: "capitalize",
                  }}
                >
                  Create Local Inventory Feed
                </Button>
                <VideoModal
                  margin="0 0 0 10px"
                  title="How to setup Local Inventory ?"
                  videoSrc="https://www.youtube.com/embed/oQUCKqn8Wpo"
                />
              </div>
              <div class="relative xl:w-[30%] md:w-[25%] sm:w-[28%] 2xl:w-[30%] w-[20%] mt-2 sm:">
                <input
                  type="text"
                  name="hs-table-search"
                  onChange={handleSearchChange}
                  id="hs-table-search"
                  class="block w-full p-2 pl-10 text-sm border border-[#babfc3] rounded-md focus:border-blue-500 focus:ring-blue-500 "
                  placeholder="Feed title"
                />
                <SearchIcon
                  style={{ position: "absolute", top: "10px", left: "10px" }}
                />
              </div>
            </div>
            <div className="overflow-x-scroll border rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 overflow-x-scroll">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Feed
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Feed Url
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Feed Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Store Code / Region Id
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Availability
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Sale Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Sale Price Effective Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      In Store Product Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Pickup Method
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Pickup Sla
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Total Sku's
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 overflow-x-scroll">
                  {isLoading && <tr className="hover:bg-gray-100 cursor-pointer">
                    <td className="px-6 py-2 text-sm font-medium text-blue-400 whitespace-nowrap">
                      <CircularProgress style={{ color: "#008060", marginRight: "10px" }} size={20} />
                      <span>Loading</span>
                    </td>
                  </tr>}
                  {!isLoading && localFeedsRows}
                  {/* {localFeedsRows} */}
                </tbody>
              </table>
            </div>
          </div>
        </>
      </div>

      {/* create promotion drawer component */}

      <>
        {showDrawer ? (
          // <!-- drawer component -->
          <div className="">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={handleCancelFeed}
            ></div>
            <div
              style={{
                boxShadow:
                  "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
              }}
              className={`top-0 right-0 overflow-x-auto  rounded-tl-lg rounded-bl-lg w-[95%] sm:w-[85%] md:w-[90%] lg:w-[70%] xl:w-[50%] 2xl:w-[60%] bg-white transition-all  p-4 text-black fixed h-full z-40  ease-in-out duration-900 ${showDrawer ? "translate-x-0 " : "translate-x-full"
                }`}
            >
              <div className="p-2">
                <p className="text-xl font-medium">Create Feed</p>
                <p className="text-sm font-medium pt-2 pb-2">
                  Tell us about your feed and where you want to show it.
                </p>
                <>
                  <div class="container">
                    <p className="font-medium pb-2">Feed Type</p>
                    <div class="grid-wrapper grid-col-auto">
                      <label for="radio-card-1" class="radio-card">
                        <input
                          checked={feedInputs.feed_type == "local"}
                          onClick={(e) => {
                            if (feedInputs.feed_type != "local") {
                              setFeedInputs({ feed_type: "local" })
                            }
                          }}
                          className="radioBtn"
                          type="radio"
                          name="radio-card"
                          id="radio-card-1"
                          defaultChecked
                        />
                        <div class="card-content-wrapper">
                          <span class="check-icon"></span>
                          <div class="card-content">
                            <h4>
                              <svg
                                className="flex justify-center m-auto"
                                height="45"
                                viewBox="0 0 24 24"
                                width="45"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill="#444"
                                  d="m22 8.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5l1.39-5.42s.29-1.08 1.31-1.08h14.6c1.02 0 1.31 1.08 1.31 1.08zm-1 3.7v7.8c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-7.8c.46.19.97.3 1.5.3.95 0 1.82-.33 2.5-.88.69.55 1.56.88 2.5.88.95 0 1.82-.33 2.5-.88.69.55 1.56.88 2.5.88.95 0 1.82-.33 2.5-.88.68.55 1.56.88 2.5.88.53 0 1.04-.11 1.5-.3m-2 5.13c0-.2 0-.41-.05-.63l-.03-.16h-2.97v1.17h1.81c-.06.22-.14.44-.31.62-.33.33-.78.51-1.26.51-.5 0-.99-.21-1.35-.56-.69-.71-.69-1.86.02-2.58.69-.7 1.83-.7 2.55-.03l.14.13.84-.85-.16-.14c-.56-.52-1.3-.81-2.08-.81h-.01c-.81 0-1.57.31-2.14.87-.59.58-.92 1.34-.92 2.13 0 .8.31 1.54.88 2.09.58.57 1.39.91 2.22.91h.02c.8 0 1.51-.29 2.03-.8.47-.48.77-1.2.77-1.87z"
                                />
                              </svg>
                            </h4>
                            <h5>Local Inventory</h5>
                          </div>
                        </div>
                      </label>

                      <label for="radio-card-2" class="radio-card">
                        <input
                          checked={feedInputs.feed_type == "regional"}
                          onClick={(e) => {
                            if (feedInputs.feed_type != "regional") {
                              setFeedInputs({ feed_type: "regional" })
                            }
                          }}
                          className="radioBtn"
                          type="radio"
                          name="radio-card"
                          id="radio-card-2"
                        />
                        <div class="card-content-wrapper">
                          <span class="check-icon"></span>
                          <div class="card-content">
                            <h4>
                              <svg
                                className="flex justify-center m-auto"
                                height="45"
                                viewBox="0 0 16 16"
                                width="45"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="m8 0c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm5.2 5.3c.4 0 .7.3 1.1.3-.3.4-1.6.4-2-.1.3-.1.5-.2.9-.2zm-12.2 2.7c0-.4 0-.8.1-1.3.1 0 .2.1.3.1 0 0 .1.1.1.2 0 .3.3.5.5.5.8.1 1.1.8 1.8 1 .2.1.1.3 0 .5-.6.8-.1 1.4.4 1.9.5.4.5.8.6 1.4 0 .7.1 1.5.4 2.2-2.5-1.2-4.2-3.6-4.2-6.5zm7 7c-.7 0-1.5-.1-2.1-.3-.1-.2-.1-.4 0-.6.4-.8.8-1.5 1.3-2.2.2-.2.4-.4.4-.7 0-.2.1-.5.2-.7.3-.5.2-.8-.2-.9-.8-.2-1.2-.9-1.8-1.2s-1.2-.5-1.7-.2c-.2.1-.5.2-.5-.1 0-.4-.5-.7-.4-1.1-.1 0-.2 0-.3.1s-.2.2-.4.1c-.2-.2-.1-.4-.1-.6.1-.2.2-.3.4-.4.4-.1.8-.1 1 .4.3-.9.9-1.4 1.5-1.8 0 0 .8-.7.9-.7s.2.2.4.3c.2 0 .3 0 .3-.2.1-.5-.2-1.1-.6-1.2 0-.1.1-.1.1-.1.3-.1.7-.3.6-.6 0-.4-.4-.6-.8-.6-.2 0-.4 0-.6.1-.4.2-.9.4-1.5.4 1.1-.8 2.5-1.2 3.9-1.2h.8c-.6.1-1.2.3-1.6.5.6.1.7.4.5.9-.1.2 0 .4.2.5s.4.1.5-.1c.2-.3.6-.4.9-.5.4-.1.7-.3 1-.7 0-.1.1-.1.2-.2.6.2 1.2.6 1.8 1-.1 0-.1.1-.2.1-.2.2-.5.3-.2.7.1.2 0 .3-.1.4-.2.1-.3 0-.4-.1s-.1-.3-.4-.3c-.1.2-.4.3-.4.6.5 0 .4.4.5.7-.6.1-.8.4-.5.9.1.2-.1.3-.2.4-.4.6-.8 1-.8 1.7s.5 1.4 1.3 1.3c.9-.1.9-.1 1.2.7 0 .1.1.2.1.3.1.2.2.4.1.6-.3.8.1 1.4.4 2 .1.2.2.3.3.4-1.3 1.4-3 2.2-5 2.2z"
                                  fill="#444"
                                />
                              </svg>
                            </h4>
                            <h5>Regional Inventory</h5>
                          </div>
                        </div>
                      </label>
                    </div>
                    {defaultErrors.feed_type && (
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
                          Please select feed type.
                        </span>
                      </div>
                    )}
                  </div>
                </>
                <>
                  {feedInputs.feed_type == "local" && <div>

                    <div className="pt-2 pb-2">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Enter your feed name
                      </p>
                      <input
                        placeholder="Feed name"
                        name="feed_name"
                        value={feedInputs && feedInputs.feed_name ? feedInputs.feed_name : null}
                        onChange={handleInputChange}
                        type="text"
                        class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                      ></input>
                      {defaultErrors.feed_name && (
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
                            Please enter feed name.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className=" pb-4">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Select your primary local feed
                      </p>
                      <select
                        id="countries"
                        name="feed_setting_id"
                        value={feedInputs && feedInputs.feed_setting_id ? feedInputs.feed_setting_id : null}
                        onChange={handleInputChange}
                        class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      >
                        <option disabled="" value="true">
                          - - Select - -
                        </option>
                        {primaryLocalFeeds.map((value, index) => (
                          <option value={value.id}>{value.name}</option>
                        ))}
                      </select>
                      {defaultErrors.feed_setting_id && (
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
                            Please select a primary feed.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="my-2">
                      <div className="w-[100%]">
                        <div className="flex items-center">
                          <p className="text-sm font-medium">Store code</p>
                          <a className="ml-2" target="_blank" href="https://www.youtube.com/embed/3man5vDb_xU">
                            <div className="flex items-center">
                              <YouTubeIcon style={{ color: "#fd0000" }} />
                              <p className="text-[#fd0000] font-semibold text-base ml-1 ">Where to get it?</p>
                            </div>
                          </a>
                        </div>
                        <input
                          placeholder="Store code"
                          name="code"
                          value={feedInputs && feedInputs.code ? feedInputs.code : null}
                          onChange={handleInputChange}
                          type="text"
                          class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                        ></input>
                        {defaultErrors.code && (
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
                              Please enter store code.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className=" pb-4">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Availability
                      </p>
                      <select
                        id="countries"
                        name="availability"
                        value={feedInputs && feedInputs.availability ? feedInputs.availability : null}
                        onChange={handleInputChange}
                        class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      >
                        <option disabled="" value="true">
                          - - Select - -
                        </option>
                        <option value='in_stock'> In stock </option>
                        <option value='out_of_stock'> Out of stock </option>
                        <option value='preorder'> Preorder </option>
                        <option value='backorder'> Backorder </option>
                      </select>
                    </div>

                    <div className=" pb-4">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Sale price effective date
                      </p>
                      <div className='my-2 flex items-center justify-between'>
                        <div className='mr-2'>
                          <p>Start date</p>
                          <input
                            value={feedInputs && feedInputs.salePriceEffectiveDate && feedInputs.salePriceEffectiveDate.start ? feedInputs.salePriceEffectiveDate.start : null}
                            onChange={(e) => {
                              setFeedInputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'start': e.target.value } }))
                            }}
                            name="salePriceEffectiveDate"
                            type='date' />
                        </div>
                        <div>
                          <p>End date</p>
                          <input
                            value={feedInputs && feedInputs.salePriceEffectiveDate && feedInputs.salePriceEffectiveDate.end ? feedInputs.salePriceEffectiveDate.end : null}
                            onChange={(e) => {
                              setFeedInputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'end': e.target.value } }))
                            }}
                            className='mr-2'
                            name="salePriceEffectiveDate"
                            type='date' />
                        </div>
                      </div>
                    </div>

                    <div className="pb-4">
                      <FormControlLabel name="salePrice" onChange={handleCheckboxChanges} control={<Checkbox style={{ color: '#008060' }} checked={feedInputs && feedInputs.salePrice} />} label="Enable sale price" />
                    </div>

                    {/* <div className="my-2">
                      <div className="w-[100%]">
                        <div className="flex">
                          <p className="text-sm font-medium">In store product location</p>
                        </div>
                        <input
                          placeholder="In store product location"
                          name="instoreProductLocation"
                          value={feedInputs && feedInputs.instoreProductLocation ? feedInputs.instoreProductLocation : null}
                          onChange={handleInputChange}
                          type="text"
                          class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                        ></input>
                      </div>
                    </div> */}

                    <div className="flex justify-between items-center w-full mt-4 flex-wrap">
                      <div class="w-[45%] rounded shadow borderd bg-gray-100 p-4">
                        <div className="">
                          <div className="flex items-center">
                            <p className="font-semibold">Pickup method</p>
                            <a className="ml-2 text-sm font-normal text-blue-500 underline"
                              target="_blank"
                              href="https://support.google.com/merchants/answer/3061342"
                            >
                              Learn More
                            </a>
                          </div>
                          <FormControl>
                            <RadioGroup defaultValue="notSet" onChange={handlePickUpMethod}>
                              <FormControlLabel
                                value="notSet"
                                control={<Radio style={{ color: "#008060" }} />}
                                label="Not set"
                              />
                              <FormControlLabel
                                value="custom"
                                control={<Radio style={{ color: "#008060" }} />}
                                label="Custom"
                              />
                            </RadioGroup>
                          </FormControl>
                        </div>
                        {pickupMethodRadioButtonValue == "custom" && <div className="">
                          <select
                            id="countries"
                            name="pickupMethod"
                            value={feedInputs && feedInputs.pickupMethod ? feedInputs.pickupMethod : null}
                            onChange={handleInputChange}
                            class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                          >
                            <option disabled="" value="true">
                              - - select - -
                            </option>
                            <option value="buy">Buy</option>
                            <option value="reserve">Reserve</option>
                            <option value="ship to store">Ship to Store</option>
                            <option value="not supported">Not Supported</option>
                          </select>
                        </div>}
                      </div>
                      <div class=" w-[45%] rounded shadow borderd bg-gray-100 p-4">
                        <div>
                          <div className="flex items-center">
                            <p className="font-semibold">Pickup SLA</p>
                            <a className="ml-2 text-sm font-normal text-blue-500 underline"
                              target="_blank"
                              href="https://support.google.com/merchants/answer/3061342"
                            >
                              Learn More
                            </a>
                          </div>
                          <FormControl>
                            <RadioGroup defaultValue="notSet" onChange={handlePickUpSla}>
                              <FormControlLabel
                                value="notSet"
                                control={<Radio style={{ color: "#008060" }} />}
                                label="Not set"
                              />
                              <FormControlLabel
                                value="custom"
                                control={<Radio style={{ color: "#008060" }} />}
                                label="Custom"
                              />
                            </RadioGroup>
                          </FormControl>
                        </div>
                        {pickupSlaRadioButtonValue == "custom" && <div>
                          <select
                            id="countries"
                            name="pickupSla"
                            value={feedInputs && feedInputs.pickupSla ? feedInputs.pickupSla : null}
                            onChange={handleInputChange}
                            class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                          >
                            <option disabled="" value="true">
                              - - select - -
                            </option>
                            <option value="same day">Same Day</option>
                            <option value="next day">Next Day</option>
                            <option value="2-day">2-Day</option>
                            <option value="3-day">3-Day</option>
                            <option value="4-day">4-Day</option>
                            <option value="5-day">5-Day</option>
                            <option value="6-day">6-Day</option>
                            <option value="7-day">7-Day</option>
                            <option value="multi-week">Multi-Week</option>
                          </select>
                        </div>}
                      </div>
                    </div>

                  </div>}

                  {feedInputs.feed_type == "regional" && <div>

                    <div className="pt-2 pb-2">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Enter your feed name
                      </p>
                      <input
                        placeholder="Feed name"
                        name="feed_name"
                        value={feedInputs && feedInputs.feed_name ? feedInputs.feed_name : null}
                        onChange={handleInputChange}
                        type="text"
                        class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                      ></input>
                      {defaultErrors.feed_name && (
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
                            Please enter feed name.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className=" pb-4">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Select your primary online feed
                      </p>
                      <select
                        id="countries"
                        name="feed_setting_id"
                        value={feedInputs && feedInputs.feed_setting_id ? feedInputs.feed_setting_id : null}
                        onChange={handleInputChange}
                        class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      >
                        <option disabled="" value="true">
                          - - Select - -
                        </option>
                        {primaryOnlineFeeds.map((value, index) => (
                          <option value={value.id}>{value.name}</option>
                        ))}
                      </select>
                      {defaultErrors.feed_setting_id && (
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
                            Please select a primary feed.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-[100%]">
                      <div className="flex items-center">
                        <p className="text-sm font-medium">Region ID</p>
                        <a className="ml-2" target="_blank" href="https://www.youtube.com/embed/xu1O3lTBaYE">
                          <div className="flex items-center">
                            <YouTubeIcon style={{ color: "#fd0000" }} />
                            <p className="text-[#fd0000] font-semibold text-base ml-1 ">Where to get it?</p>
                          </div>
                        </a>
                      </div>
                      <input
                        placeholder="Region ID"
                        name="code"
                        value={feedInputs && feedInputs.code ? feedInputs.code : null}
                        onChange={handleInputChange}
                        type="text"
                        class="input-focus-none w-[100%] px-4 py-2 focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                      ></input>
                      {defaultErrors.code && (
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
                            Please enter region ID.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className=" pb-4">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Availability
                      </p>
                      <select
                        id="countries"
                        name="availability"
                        value={feedInputs && feedInputs.availability ? feedInputs.availability : null}
                        onChange={handleInputChange}
                        class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                      >
                        <option disabled="" value="true">
                          - - Select - -
                        </option>
                        <option value='in_stock'> In stock </option>
                        <option value='out_of_stock'> Out of stock </option>
                        <option value='preorder'> Preorder </option>
                        <option value='backorder'> Backorder </option>
                      </select>
                    </div>

                    <div className=" pb-4">
                      <p className="text-sm font-medium pt-2 pb-2">
                        Sale price effective date
                      </p>
                      <div className='my-2 flex items-center justify-between'>
                        <div className='mr-2'>
                          <p>Start date</p>
                          <input
                            value={feedInputs && feedInputs.salePriceEffectiveDate && feedInputs.salePriceEffectiveDate.start ? feedInputs.salePriceEffectiveDate.start : null}
                            onChange={(e) => {
                              setFeedInputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'start': e.target.value } }))
                            }}
                            name="salePriceEffectiveDate"
                            type='date' />
                        </div>
                        <div>
                          <p>End date</p>
                          <input
                            value={feedInputs && feedInputs.salePriceEffectiveDate && feedInputs.salePriceEffectiveDate.end ? feedInputs.salePriceEffectiveDate.end : null}
                            onChange={(e) => {
                              setFeedInputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'end': e.target.value } }))
                            }}
                            className='mr-2'
                            name="salePriceEffectiveDate"
                            type='date' />
                        </div>
                      </div>
                    </div>

                    <div className="pb-4">
                      <FormControlLabel name="salePrice" onChange={handleCheckboxChanges} control={<Checkbox style={{ color: '#008060' }} checked={feedInputs && feedInputs.salePrice} />} label="Enable sale price" />
                    </div>

                  </div>}
                </>

                <div className="w-[96%] mt-8 mb-4">
                  <Divider />
                  <div className="flex justify-start mt-2">
                    <Button
                      iconStart={<CheckCircleIcon />}
                      onClick={handleCreateFeed}
                      style={{ background: "#008060", marginRight: "10px" }}
                      variant="contained"
                      disabled={createFeedButtonDisable}
                    >
                      Create Feed
                    </Button>
                    <Button
                      onClick={handleCancelFeed}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>

      {/*   modal show on pause    */}

      {deleteModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setDeleteModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className="flex items-center p-2">
                    {/* <ReportProblemIcon style={{ color: '#d82c0d' }} /> */}
                    <p className="text-lg font-medium ml-2">
                      Delete This Feed ?
                    </p>
                    <CloseIcon
                      onClick={() => setDeleteModal(false)}
                      className="absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer"
                    />
                  </div>
                  <Divider style={{ margin: "10px 0 10px 0" }} />
                  <div className="p-4">
                    <p className="text-sm font-normal">
                      If you delete this feed, you won't be able to restart it.
                    </p>
                  </div>
                  <Divider style={{ margin: "10px 0 10px 0" }} />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setDeleteModal(false)}
                      style={{ marginRight: "10px" }}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => { setDeleteModal(false); confirmDeleteFeed() }}
                      style={{ background: "#d82c0d" }}
                      variant="contained"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {/*   on off modal    */}

      {OnModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => { setOnModal(false); setSwitchChangeId(null) }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className='flex items-center p-2'>
                    <ReportProblemIcon style={{ color: '#d82c0d' }} />
                    <p className='text-lg font-medium ml-2'>Are You Sure ?</p>
                    <CloseIcon onClick={() => { setOnModal(false); setSwitchChangeId(null) }} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='p-4'>
                    <p className='text-sm font-normal' >Once you turn on, seamlessly we start sync product data to Google Merchant Center.</p>
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='flex justify-end'>
                    <Button onClick={() => { setOnModal(false); setSwitchChangeId(null) }} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
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
              onClick={() => { setOffModal(false); setSwitchChangeId(null) }}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className='flex items-center p-2'>
                    <ReportProblemIcon style={{ color: '#d82c0d' }} />
                    <p className='text-lg font-medium ml-2'>Are You Sure ?</p>
                    <CloseIcon onClick={() => { setOffModal(false); setSwitchChangeId(null) }} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='p-4'>
                    <p className='text-sm font-normal' >If you want to turn it off, new changes will not affect the Google Merchant Center.</p>
                  </div>
                  <Divider style={{ margin: '10px 0 10px 0' }} />
                  <div className='flex justify-end'>
                    <Button onClick={() => { setOffModal(false); setSwitchChangeId(null) }} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                    <Button onClick={() => { setOffModal(false); handleChangeStatus() }} style={{ background: "#d82c0d", color: "white" }}>Turn Off</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {OnOffModal ? (
        <>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
              className="fixed inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setOnOffModal(false)}
            ></div>
            <div className="flex items-center min-h-screen px-4 py-8">
              <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                <div className="">
                  <div className="flex items-center p-2">
                    {/* <ReportProblemIcon style={{ color: '#d82c0d' }} /> */}
                    <p className="text-lg font-medium ml-2">
                      Delete This Feed ?
                    </p>
                    <CloseIcon
                      onClick={() => setOnOffModal(false)}
                      className="absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer"
                    />
                  </div>
                  <Divider style={{ margin: "10px 0 10px 0" }} />
                  <div className="p-4">
                    <p className="text-sm font-normal">
                      If you delete this feed, you won't be able to restart it.
                    </p>
                  </div>
                  <Divider style={{ margin: "10px 0 10px 0" }} />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setOnOffModal(false)}
                      style={{ marginRight: "10px" }}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    {checked === true &&
                      <Button
                        onClick={() => { setOnOffModal(false); setChecked(false) }}
                        style={{ background: "#d82c0d" }}
                        variant="contained"
                      >
                        Off
                      </Button>
                    }
                    {checked === false &&
                      <Button
                        onClick={() => { setOnOffModal(false); setChecked(true) }}
                        style={{ background: "#008060" }}
                        variant="contained"
                      >
                        On
                      </Button>
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

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
};

export default Inventory;
