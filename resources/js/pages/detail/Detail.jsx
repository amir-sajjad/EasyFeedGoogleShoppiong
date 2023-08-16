import * as React from "react";
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
// import Box from '@mui/material/Box';
import upgradeImg from '../products/upgradeImg.png';
import Skeleton from '@mui/material/Skeleton';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SyncIcon from '@mui/icons-material/Sync';
import Button from '@mui/material/Button';
import ConstructionIcon from '@mui/icons-material/Construction';
import { Divider } from '@mui/material';
// import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TitleIcon from '@mui/icons-material/Title';
import ErrorIcon from '@mui/icons-material/Error';
import DescriptionIcon from '@mui/icons-material/Description';
import GoogleIcon from '@mui/icons-material/Google';
import InventoryIcon from '@mui/icons-material/Inventory';
// import StyleIcon from '@mui/icons-material/Style';
import DiscountIcon from '@mui/icons-material/Discount';
import PhotoIcon from '@mui/icons-material/Photo';
import GppGoodIcon from '@mui/icons-material/GppGood';
import QrCodeIcon from '@mui/icons-material/QrCode';
import BackupIcon from '@mui/icons-material/Backup';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SortableList, { SortableItem } from "react-easy-sort";
import { makeStyles } from "@material-ui/core";
import arrayMove from "array-move";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoModal from "../tutorials/VideoModal";
import { useParams } from 'react-router-dom';
import axioshttp from '../../axioshttp';
import TextEditor from './TextEditor';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { values } from "lodash";
import ReactGA from "react-ga4";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    userSelect: "none",
    alignItems: "start",
  },
  item: {
    position: "relative",
    height: 'fitContent',
    flexShrink: 0,
    display: "flex",
    margin: 8,
    cursor: "grab",
    userSelect: "none",
    boxShadow: "0px 6px 6px -3px rgba(0, 0, 0, 0.2)",
  },
  image: {
    width: 150,
    height: 150,
    pointerEvents: "none",
  },
  button: {
    position: "absolute",
    top: 0,
    left: 0
  },
  dragged: {
    boxShadow:
      "0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12)",
    "& button": {
      opacity: 0
    }
  }
});


const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            background: "#e0e0e0",
            color: "#b1b1b1"
          }
        }
      }
    }
  }
})

const Detail = (props) => {

  ///////////////////////////////////////////////////////////////////////////////////
  // tabs 
  const navigate = useNavigate();
  var productId = useParams();
  console.log(productId);
  const photoData = [];
  const [featuresStatus, setFeaturesStatus] = useState({});
  const [editShopifyLink, setEditShopifyLink] = useState('');
  const [viewProductLink, setViewProductLink] = useState('');
  const [feed, setFeed] = useState();
  const [shippingValuePriceError, setShippingValuePriceError] = useState(false);
  const [value, setValue] = React.useState('1');
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [productsById, setProductsById] = useState('');
  const [productDetails, setProductDetails] = useState([]);
  const [setting, setSetting] = useState(false)
  const [score, setScore] = useState(false)
  const [items, setItems] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [limitToast, setLimitToast] = React.useState(false);
  const [p_inputs, setP_inputs] = useState({
    isBundle: "no",
    products: productId.ids,
    feed_id: productId.feed_id,
  });
  const handleChange = (event, newValue) => {
    if (newValue == 2 || newValue == 3) {
      setShowBanner(false);
    }
    setValue(newValue);
  };
  const [showUpgradeModel, setShowUpgradeModel] = useState(false);

  const handleUpgradeModelCancel = () => {
    setShowUpgradeModel(false);
  }
  const handleUpgradeNow = useCallback(() => navigate(`/pricing`, { replace: true }), [navigate]);

  const handleUploadFromUrlClick = () => {
    if (featuresStatus.customImage) {
      setShowUploadModal(true);
    } else {
      setShowUpgradeModel(true);
    }
  }

  const fetchFeedData = (id) => {
    const data = { feedId: id }
    axioshttp.post('feed/details', data).then(res => {
      if (res.data.status == true) {
        setFeed(res.data.feed);
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const fileInputRef = React.useRef(null);
  const handleUploadImageClick = () => {
    if (featuresStatus.customImage) {
      fileInputRef.current.click();
    } else {
      setShowUpgradeModel(true);
    }
  }

  // active tab on button click

  const handleScoreTab = () => {
    setValue('2');
  }
  const handleDetailTab = () => {
    setValue('1');
  }




  ///////////////////////////////////////////////////////////////////////////////////



  ///////////////////////////////////////////////////////////////////////////////////

  // 1st input character count / score / color / persentage / banner

  const [scoreData, setScoreData] = React.useState({
    count: 0,
    color: '#ffd79d',
    score: 'Poor',
    persent: 10
  })
  const handelScoreData = (e) => {
    // set Value in input State
    setP_inputs(values => ({ ...values, ['title']: e.target.value }));
    //  banner show hide
    if (e.target.value.length > 0 && !showBanner) {
      setShowBanner(true)
    } else if (e.target.value.length === 0) {
      setShowBanner(false)
    }
    //  score data change on condition
    setScoreData({
      count: e.target.value.length,
      color: '#ffd79d',
      score: 'Poor',
      persent: 10
    })
    if (scoreData.count >= 30 && scoreData.count < 50) {
      setScoreData({
        count: e.target.value.length,
        color: '#fed3d1',
        score: 'Okay',
        persent: 30
      })
    } else if (scoreData.count >= 50 && scoreData.count < 70) {
      setScoreData({
        count: e.target.value.length,
        color: '#aee9d1',
        score: 'Good',
        persent: 70
      })
    } else if (scoreData.count > 70) {
      setScoreData({
        count: e.target.value.length,
        color: '#a4e8f2',
        score: 'Excellent',
        persent: 100
      })
    } else if (scoreData.count < 30) {
      setScoreData({
        count: e.target.value.length,
        color: '#ffd79d',
        score: 'Poor',
        persent: 10
      })
    }
  }
  //  input chracter counter state

  const [count1, setCount1] = React.useState(0);
  ////////////////////////////////////////////////////////////////////////////
  //input field with tags  //    promotion id field

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };
  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (e.key == 'Enter' && trimmedInput.length && !tags.includes(trimmedInput)) {
      setShowBanner(true);
      e.preventDefault();
      setTags(prevState => [...prevState, trimmedInput]);
      setP_inputs(values => ({ ...values, ["promotionIds"]: tags.concat([trimmedInput]) }));

      setInput('');
    }

    if (e.key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
      setP_inputs(values => ({ ...values, ["promotionIds"]: tags }));
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  }

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
    setP_inputs(values => ({ ...values, ["promotionIds"]: p_inputs.promotionIds.filter((tag, i) => i !== index) }));
  }

  ///////////////////////////////////////////////////////////////////////////////////////

  // duplicate product highlights component
  const [productHighlights, setProductHighlights] = useState([]);
  //  add new highlights 
  const addNewHighlights = () => {
    setProductHighlights(values => ([...values, '']));
  }
  //  delete highlights
  const deleteHighlights = (index) => {
    setShowBanner(true);
    const highlights = [...productHighlights];
    // setProductHighlights(highlights.filter((tag, i) => i !== index));
    highlights.splice(index, 1);
    setProductHighlights(highlights);
    if (p_inputs.hasOwnProperty('productHighlights') && p_inputs.productHighlights.length > 0) {
      setP_inputs(values => ({ ...values, ["productHighlights"]: p_inputs.productHighlights.filter((tag, i) => i !== index) }));
    }
    // setProductHighlights(values);
  }

  ////////////////////////////////////////////////////////////////////////////
  //  duplicate section component
  const [productSection, setProductSection] = useState([]);
  //  add new section 
  const addSection = () => {
    // setProductSection(values => ([...values, '']));
    setProductDetails(values => ([...values, {
      sectionName: '',
      attributeName: '',
      attributeValue: ''
    }]));
  }

  //  delete section
  const deleteSection = (index) => {
    const values = [...productDetails];
    console.log(index);
    values.splice(index, 1);
    setProductDetails(values);
    setP_inputs(values => ({ ...values, ["productDetails"]: p_inputs.productDetails.filter((tag, i) => i !== index) }));
  }

  ////////////////////////////////////////////////////////////////////////

  // save and discard banner
  const [showBanner, setShowBanner] = useState(false);
  const handelBanner = (event) => {
    setCount1(event.length)
    if (event.length > 0 && !showBanner) {
      setShowBanner(true)
      setP_inputs(values => ({ ...values, ["description"]: event }));
    } else if (event.length === 0) {
      setShowBanner(false)
    }
  }

  ///////////////////////////////////////////////////////////////////////////

  // delete modal
  const [DiscardModal, setDiscardModal] = useState(false);
  // upolad modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  // sycn from shopify modal
  const [showSyncShopifyModal, setshowSyncShopifyModal] = useState(false);
  // active/deactive button in sycn from shopify modal
  const [active, setActive] = useState(false);
  const handleToggle = useCallback(() => setActive((active) => !active), []);
  const contentStatus = active ? 'Deactivate' : 'Activate';
  const textStatus = active ? 'activated' : 'deactivated';
  ///////////////////////////////////////////////////////////////////////////////
  // duplicate select input in sync from shopify modal
  const [persons, setPerson] = useState([<div key={0} className="flex mt-2 justify-between items-center">
    <div className='mr-2 w-[40%]'>
      <select
        id="countries"
        class="border-2 border-[#008060] text-gray-900 text-sm rounded-md focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
      >
        <option disabled selected value>
          - - select - -
        </option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
      </select>
    </div>
    <div className='w-[40%]'>
      <select
        id="countries"
        class="border-2 border-[#008060] text-gray-900 text-sm rounded-md focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
      >
        <option disabled selected value>
          - - select - -
        </option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
      </select>
    </div>
  </div>]);
  let handleAddPerson = (e) => {
    e.preventDefault()
    setPerson([...persons, <div key={persons.length} className="flex mt-2 justify-between items-center">
      <div className='mr-2 w-[40%]'>
        <select
          id="countries"
          class="border-2 border-[#008060] text-gray-900 text-sm rounded-md focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
        >
          <option disabled selected value>
            - - select - -
          </option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </select>
      </div>
      <div className='w-[40%]'>
        <select
          id="countries"
          class="border-2 border-[#008060] text-gray-900 text-sm rounded-md focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
        >
          <option disabled selected value>
            - - select - -
          </option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </select>
      </div>
    </div>]);
  }
  let handleRemovePerson = (e) => {
    e.preventDefault()
    setPerson(persons.slice(0, persons.length - 1));
  }
  //////////////////////////////////////////////////////////////////////////////
  // show and hide Toast
  const [showToast, setShowToast] = useState(false);
  setTimeout(function () {
    setShowToast(false);
  }, 5000)
  //////////////////////////////////////////////////////////////////////////////

  // upolad image form ulr

  const [valueInput, setValueInput] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const handelUpolad = () => {
    setShowUploadModal(false);
    setItems(current => [...current, {
      name: "url Image",
      image: valueInput,
    }]);
    setImgUrl(valueInput)

  }

  ///////////////////////////////////////////////////////////////////////////////
  const classes = useStyles();


  // slice in arry
  const [items2, setItems2] = React.useState(items.slice(0, 12));
  // console.log('items', items)

  const onSortEnd = (oldIndex, newIndex) => {
    setItems((array) => arrayMove(array, oldIndex, newIndex));
  };

  ///////////////////////////////////////////////////////////////////////////////
  // upolad image  from computer
  const onChangePicture = e => {
    if (e.target.files) {
      //  if image length is greater than 11 than show a alert
      if (items.length > 11 || e.target.files.length > 11 || items.length + e.target.files.length > 11) {
        // alert("you can't add more than 11 images")
        setLimitToast(true);
        return;
      }
      var count = 0;
      for (var i = 0; i < e.target.files.length; i++) {
        //only add png and jpg files
        if (e.target.files[i].type !== "image/png" && e.target.files[i].type !== "image/jpeg" && e.target.files[i].type !== "image/webp" && e.target.files[i].type !== "image/gif" && e.target.files[i].type !== "image/bmp" && e.target.files[i].type !== "image/tiff") {
          alert("you can only upload JPEG,WebP,PNG,GIF,BMP,and TIFF files")
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.addEventListener("load", () => {
          let newName = e.target.files[count].name;
          setItems(items => [...items, { name: newName, image: reader.result }]);
          count++;
        });
      }
      const chosenFiles = Array.prototype.slice.call(e.target.files);
      handleUploadFiles(chosenFiles);
    }

  };

  const handleUploadFiles = files => {
    const uploaded = [...imageFiles];
    files.some((file) => {
      uploaded.push(file);
    })
    setImageFiles(uploaded);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // delete the checked item

  const [checkedItem, setCheckedItem] = useState([])
  const handleChecked = (index) => {
    setCheckedItem([...checkedItem, index])

  }
  // delete the checked item from the array

  const deleteItem = () => {
    setItems(items.filter((item, index) => !checkedItem.includes(index)))
    setCheckedItem([]);
  }
  ///////////////////////////////////////////////////////////////////////////////
  const dashboardOnClick = useCallback(() => navigate('/Products/' + productId.feed_id, { replace: true }), [navigate]);
  ///////////////////////////////////////////////////////////////////////////////
  // additionl setting

  ///////////////////////////////////////////////////////////////////////////

  // Get all product Categories
  if (document.getElementById('productCategories')) {
    var product_catgry = document.getElementById('productCategories').getAttribute('data');
    var product_category = JSON.parse(product_catgry);
  }

  //Products Fetch By its Id
  function getProductsById () {
    axioshttp.post('product/fetch/byId', productId).then(res => {
      setProductsById(res.data);
      if (document.getElementById("shopName")) {
        var shopName = document.getElementById("shopName").getAttribute("data");
        var storeSuffix = shopName.replace(".myshopify.com", "");
        if (res.data.hasOwnProperty('productId')) {
          var editLink = "https://admin.shopify.com/store/" + storeSuffix + "/products/" + res.data.productId + "";
          setEditShopifyLink(editLink);
        }
        if (res.data.hasOwnProperty('handle')) {
          var viewLink = "https://" + shopName + "/products/" + res.data.handle + "";
          setViewProductLink(viewLink);
        }
      }
      console.log("response ProductById", res.data);
    }).catch(error => {
      console.log(error);
    })
  }

  //Handle InputChanges
  const handleInputChanges = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setP_inputs(values => ({ ...values, [name]: value }))
    if (value.length > 0 && !showBanner) {
      setShowBanner(true)
    } else if (value.length === 0) {
      setShowBanner(false)
    }
  }
  //chackBox change
  const handleCheckboxChanges = (event) => {
    const name = event.target.name;
    const value = event.target.checked;
    setP_inputs(values => ({ ...values, [name]: value }));
    setShowBanner(true);
  }
  // handle UnitPrice Value
  const handleUnitPrice = (event) => {
    var name = event.target.name;
    var value = event.target.value
    if (name == 'unitPriceValue') {
      setP_inputs(values => ({ ...values, ['unitPricingMeasure']: { ...values.unitPricingMeasure, 'value': value } }));
    }
    if (name == 'unitPriceUnit') {
      setP_inputs(values => ({ ...values, ['unitPricingMeasure']: { ...values.unitPricingMeasure, 'unit': value } }));
    }
    setShowBanner(true);
  }
  // handleUnitBaseValue
  const handleUnitBase = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    if (name == 'unitBaseValue') {
      setP_inputs(values => ({ ...values, ['unitPricingBaseMeasure']: { ...values.unitPricingBaseMeasure, 'value': value } }));
    }
    if (name == 'unitBaseUnit') {
      setP_inputs(values => ({ ...values, ['unitPricingBaseMeasure']: { ...values.unitPricingBaseMeasure, 'unit': value } }));
    }
    setShowBanner(true);
  }
  //////////////////////////////////////////////////////
  // handleHighLights
  const handleHighlights = (event) => {
    setShowBanner(true);
    let highlightsArray = [...productHighlights];
    if (event.target.value != "") {
      highlightsArray[event.target.name] = event.target.value;
      setProductHighlights(highlightsArray);
    }

  }
  useEffect(() => {
    if (productHighlights != '') {
      setP_inputs(values => ({ ...values, ['productHighlights']: productHighlights }));
    }
  }, [productHighlights]);

  useEffect(() => {
    scores();
    if (productsById != '' && productsById.edited_product != null) {
      if (productsById.edited_product.productDetails != null) {
        setProductDetails(JSON.parse(productsById.edited_product.productDetails));
      }
      if (productsById.edited_product.productHighlights != null) {
        setProductHighlights(JSON.parse(productsById.edited_product.productHighlights));
      }
      if (productsById.edited_product.promotionIds != null) {
        setTags(JSON.parse(productsById.edited_product.promotionIds));
        setP_inputs(values => ({ ...values, ["promotionIds"]: JSON.parse(productsById.edited_product.promotionIds) }));
      }
      if (productsById.edited_product.isBundle != null) {
        setP_inputs(values => ({ ...values, ["isBundle"]: (productsById.edited_product.isBundle == true ? "yes" : productsById.edited_product.isBundle == false ? "no" : null) }))
      }
      if (productsById.edited_product.unitPricingMeasure != null) {
        setP_inputs(values => ({ ...values, ['unitPricingMeasure']: { ...values.unitPricingMeasure, 'value': JSON.parse(productsById.edited_product.unitPricingMeasure).value } }));

        setP_inputs(values => ({ ...values, ['unitPricingMeasure']: { ...values.unitPricingMeasure, 'unit': JSON.parse(productsById.edited_product.unitPricingMeasure).unit } }));
      }
      if (productsById.edited_product.unitPricingBaseMeasure != null) {
        setP_inputs(values => ({ ...values, ['unitPricingBaseMeasure']: { ...values.unitPricingBaseMeasure, 'value': JSON.parse(productsById.edited_product.unitPricingBaseMeasure).value } }));

        setP_inputs(values => ({ ...values, ['unitPricingBaseMeasure']: { ...values.unitPricingBaseMeasure, 'unit': JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit } }));
      }
      if (productsById.edited_product.subscriptionCost != null) {
        setP_inputs(values => ({ ...values, ['subscriptionCostPeriod']: JSON.parse(productsById.edited_product.subscriptionCost).period ? JSON.parse(productsById.edited_product.subscriptionCost).period : '' }));
        setP_inputs(values => ({ ...values, ['subscriptionCostPeriodLength']: JSON.parse(productsById.edited_product.subscriptionCost).periodLength ? JSON.parse(productsById.edited_product.subscriptionCost).periodLength : '' }));
        setP_inputs(values => ({ ...values, ['subscriptionCostAmount']: JSON.parse(productsById.edited_product.subscriptionCost).amount && JSON.parse(productsById.edited_product.subscriptionCost).amount.value ? JSON.parse(productsById.edited_product.subscriptionCost).amount.value : '' }));

      }
      if (productsById.edited_product.loyaltyPoints != null) {
        setP_inputs(values => ({ ...values, ['loyaltyPoints']: { ...values.loyaltyPoints, 'name': JSON.parse(productsById.edited_product.loyaltyPoints).name } }));
        setP_inputs(values => ({ ...values, ['loyaltyPoints']: { ...values.loyaltyPoints, 'pointsValue': JSON.parse(productsById.edited_product.loyaltyPoints).pointsValue } }));
        setP_inputs(values => ({ ...values, ['loyaltyPoints']: { ...values.loyaltyPoints, 'ratio': JSON.parse(productsById.edited_product.loyaltyPoints).ratio } }));
      }
      if (productsById.edited_product.installment != null) {
        setP_inputs(values => ({ ...values, ['installmentMonths']: JSON.parse(productsById.edited_product.installment).months }));
        setP_inputs(values => ({ ...values, ['installmentAmount']: JSON.parse(productsById.edited_product.installment).amount.value }));
      }
      if (productsById.edited_product.productHeight != null) {
        setP_inputs(values => ({ ...values, ['productHeight']: { ...values.productHeight, 'unit': JSON.parse(productsById.edited_product.productHeight).unit } }));
        setP_inputs(values => ({ ...values, ['productHeight']: { ...values.productHeight, 'value': JSON.parse(productsById.edited_product.productHeight).value } }));
      }
      if (productsById.edited_product.productWidth != null) {
        setP_inputs(values => ({ ...values, ['productWidth']: { ...values.productWidth, 'unit': JSON.parse(productsById.edited_product.productWidth).unit } }));
        setP_inputs(values => ({ ...values, ['productWidth']: { ...values.productWidth, 'value': JSON.parse(productsById.edited_product.productWidth).value } }));
      }
      if (productsById.edited_product.productLength != null) {
        setP_inputs(values => ({ ...values, ['productLength']: { ...values.productLength, 'unit': JSON.parse(productsById.edited_product.productLength).unit } }));
        setP_inputs(values => ({ ...values, ['productLength']: { ...values.productLength, 'value': JSON.parse(productsById.edited_product.productLength).value } }));
      }
      if (productsById.edited_product.productWeight != null) {
        setP_inputs(values => ({ ...values, ['productWeight']: { ...values.productWeight, 'unit': JSON.parse(productsById.edited_product.productWeight).unit } }));
        setP_inputs(values => ({ ...values, ['productWeight']: { ...values.productWeight, 'value': JSON.parse(productsById.edited_product.productWeight).value } }));
      }
      if (productsById.edited_product.shippingHeight != null) {
        setP_inputs(values => ({ ...values, ['shippingHeight']: { ...values.shippingHeight, 'unit': JSON.parse(productsById.edited_product.shippingHeight).unit } }));
        setP_inputs(values => ({ ...values, ['shippingHeight']: { ...values.shippingHeight, 'value': JSON.parse(productsById.edited_product.shippingHeight).value } }));
      }
      if (productsById.edited_product.shippingWeight != null) {
        setP_inputs(values => ({ ...values, ['shippingWeight']: { ...values.shippingWeight, 'unit': JSON.parse(productsById.edited_product.shippingWeight).unit } }));
        setP_inputs(values => ({ ...values, ['shippingWeight']: { ...values.shippingWeight, 'value': JSON.parse(productsById.edited_product.shippingWeight).value } }));
      }
      if (productsById.edited_product.shippingLength != null) {
        setP_inputs(values => ({ ...values, ['shippingLength']: { ...values.shippingLength, 'unit': JSON.parse(productsById.edited_product.shippingLength).unit } }));
        setP_inputs(values => ({ ...values, ['shippingLength']: { ...values.shippingLength, 'value': JSON.parse(productsById.edited_product.shippingLength).value } }));
      }
      if (productsById.edited_product.shippingWidth != null) {
        setP_inputs(values => ({ ...values, ['shippingWidth']: { ...values.shippingWidth, 'unit': JSON.parse(productsById.edited_product.shippingWidth).unit } }));
        setP_inputs(values => ({ ...values, ['shippingWidth']: { ...values.shippingWidth, 'value': JSON.parse(productsById.edited_product.shippingWidth).value } }));
      }
      if (productsById.edited_product.salePriceEffectiveDate != null) {
        setP_inputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'start': productsById.edited_product.salePriceEffectiveDate.split("/")[0] } }));
        setP_inputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'end': productsById.edited_product.salePriceEffectiveDate.split("/")[0] } }));
      }
      if (productsById.edited_product.shipping != null) {
        setP_inputs(values => ({ ...values, ['shipping']: JSON.parse(productsById.edited_product.shipping) }))
      }
    }
    if (productsById != '' && productsById.product_image != null) {
      var count = 0;
      const map = new Map(Object.entries(productsById.product_image));
      const arr = Array.from(map);
      console.log("images", arr);
      if (productsById.image != null) {
        photoData[0] = {
          name: "featureImage",
          image: `${productsById.image}`,
          // index : 0
        }
        arr.map((img, index) => {
          if (img[1] != null && index > 3 && index < 14) {
            photoData[+count + +1] = {
              name: img[0],
              image: img[1],
              // index: +count + +1,
            }
            count++;
          }
        });
      } else {
        arr.map((img, index) => {
          if (img[1] != null && index > 3 && index < 14) {
            photoData[count] = {
              name: img[0],
              image: img[1],
              // index : count
            }
            count++;
          }
        });
      }
      setItems(photoData);
    }
    setShowBanner(false);
  }, [productsById]);

  ////////////////////////////////////////////////////////////////
  // Product Details handle
  const handleProductDetailsChange = (event) => {
    setShowBanner(true);
    let index = event.target.name.replace(/\D/g, '');
    let name = event.target.name.replace(/[0-9]/g, '');
    let DetailsArray = [...productDetails];
    if (name == 'sectionName') {
      DetailsArray[index].sectionName = event.target.value
    }
    if (name == 'attributeName') {
      DetailsArray[index].attributeName = event.target.value
    }
    if (name == 'attributeValue') {
      DetailsArray[index].attributeValue = event.target.value
    }
    setProductDetails(DetailsArray);
  }
  useEffect(() => {
    setP_inputs(values => ({ ...values, ['productDetails']: productDetails }));
  }, [productDetails]);

  // *********************************************************************************************
  // Sync From Shopify Start
  // *********************************************************************************************

  const [showSyncFromShopifyModel, setShowSyncFromShopifyModel] = useState(false);
  const [showMetafieldUpgradeMessage, setShowMetafieldUpgradeMessage] = useState(false);
  const [syncFromShopifyInputs, setSyncFromShopifyInputs] = useState({
    metafieldResource: 'none',
    metafields: []
  });
  const [metafieldsActive, setMetafieldsActive] = useState(false);
  const [metafieldsResourceValue, setMetafieldsResourceValue] = useState('none');
  const [metafieldsValues, setMetafieldsValues] = useState(['']);
  const [loadingMetafields, setLoadingMetafields] = useState(true);
  const [selectedResourceMetafields, setSelectedResourceMetafields] = useState([]);
  const [syncFromShopifyErrors, setSyncFromShopifyErrors] = useState([]);
  const [syncRequestProcessing, setSyncRequestProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const bulkEditOptionsArray = [
    { label: 'Ads Grouping', value: 'adsGrouping' },
    { label: 'Ads Labels', value: 'adsLabels' },
    { label: 'Adult-Orianted Products', value: 'adult' },
    { label: 'Age Group', value: 'ageGroup' },
    { label: 'Condition', value: 'condition' },
    { label: 'Color - Assigned For Feed', value: 'color' },
    { label: 'Custom Cost Of Goods Sold', value: 'costOfGoodsSold' },
    { label: 'Custom Label 0', value: 'customLabel0' },
    { label: 'Custom Label 1', value: 'customLabel1' },
    { label: 'Custom Label 2', value: 'customLabel2' },
    { label: 'Custom Label 3', value: 'customLabel3' },
    { label: 'Custom Label 4', value: 'customLabel4' },
    { label: 'Gender', value: 'gender' },
    { label: 'Google Product Categories', value: 'product_category_id' },
    { label: 'Material - Assigned For Feed', value: 'material' },
    { label: 'Pattern - Assigned For Feed', value: 'pattern' },
    { label: 'Product Identifiers Control', value: 'identifierExists' },
    { label: 'Product Type', value: 'productTypes' },
    { label: 'Promotion Id', value: 'promotionIds' },
    { label: 'Return Policy Label', value: 'return_policy_label' },
    { label: 'Shipping Label', value: 'shippingLabel' },
    { label: 'Size - Assigned For Feed', value: 'sizes' },
    { label: 'Size System', value: 'sizeSystem' },
    { label: 'Size Type', value: 'sizeType' },
    { label: 'Tax Category', value: 'taxCategory' },
    { label: 'Unit Pricing Measure', value: 'unitPricingMeasure' },
    { label: 'Unit Pricing Base Measure', value: 'unitPricingBaseMeasure' },
    { label: 'Vendor (Brand)', value: 'brand' },
    { label: 'Availability Date', value: 'availabilityDate' },
    { label: 'Availability', value: 'availability' },
    { label: 'Energy Efficiency Class', value: 'energyEfficiencyClass' },
    { label: 'Expiration Date', value: 'expirationDate' },
    { label: 'Installment', value: 'installment' },
    { label: 'Is Bundle?', value: 'isBundle' },
    { label: 'Loyalty Points', value: 'loyaltyPoints' },
    { label: 'Max Energy Efficiency Class', value: 'maxEnergyEfficiencyClass' },
    { label: 'Max Handling Time', value: 'maxHandlingTime' },
    { label: 'Min Energy Efficiency Class', value: 'minEnergyEfficiencyClass' },
    { label: 'Min Handling Time', value: 'minHandlingTime' },
    { label: 'Multipack', value: 'multipack' },
    { label: 'Shipping Height', value: 'shippingHeight' },
    { label: 'Shipping Length', value: 'shippingLength' },
    { label: 'Shipping Weight', value: 'shippingWeight' },
    { label: 'Shipping Width', value: 'shippingWidth' },
    { label: 'Product Height', value: 'productHeight' },
    { label: 'Product Length', value: 'productLength' },
    { label: 'Product Weight', value: 'productWeight' },
    { label: 'Product Width', value: 'productWidth' },
    { label: 'Transit Time Label', value: 'transitTimeLabel' },
    { label: 'Pause', value: 'pause' },
    { label: 'Sale Price Effective Date', value: 'salePriceEffectiveDate' },
    { label: 'Subscription Cost', value: 'subscriptionCost' }
  ];

  const handleShopifySyncInputs = (e) => {
    setSyncFromShopifyInputs(values => ({ ...values, [e.target.name]: e.target.checked }))
  }

  const handleMetafieldsResourceChange = (event, value) => {
    setLoadingMetafields(true);
    setMetafieldsValues([''])
    setMetafieldsResourceValue(value)
    setSyncFromShopifyInputs(values => ({ ...values, ['metafieldResource']: value }))
    setSyncFromShopifyInputs(values => ({ ...values, ['metafields']: [] }))
    if (metafieldsActive) {
      if (value != 'none') {
        const metafieldsData = { resourceType: value }
        axioshttp.post('get/metafields', metafieldsData).then(response => {
          if (response.data.status) {
            setSelectedResourceMetafields(response.data.metafields)
            setLoadingMetafields(false);
          }
          else {
            setLoadingMetafields(false)
          }
        }).catch(error => {
          setLoadingMetafields(false)
          console.log(error);
        })
      }
    }
  }

  const handleMetafieldsInput = (e) => {
    console.log(e.target.id, e.target.name, e.target.value)
    const newIndex = parseInt(e.target.name)
    if (e.target.id == 'metafields') {
      setSyncFromShopifyInputs(values => ({
        ...values,
        ['metafields']: [
          ...values.metafields.slice(0, newIndex),
          { ...values.metafields[newIndex], key: e.target.value },
          ...values.metafields.slice(newIndex + 1)
        ]
      }))
    }
    else {
      setSyncFromShopifyInputs(values => ({
        ...values,
        ['metafields']: [
          ...values.metafields.slice(0, newIndex),
          { ...values.metafields[newIndex], target: e.target.value },
          ...values.metafields.slice(newIndex + 1)
        ]
      }))
    }
  }

  const handleSyncShopifyCancel = () => {
    setShowSyncFromShopifyModel(false);
    setSyncFromShopifyInputs({
      metafieldResource: 'none',
      metafields: []
    });
    setMetafieldsActive(false);
    setMetafieldsResourceValue('none');
    setMetafieldsValues(['']);
    setShowMetafieldUpgradeMessage(false);
    // clearAllSelections();
  }

  const syncDataFromShopify = () => {
    const { title, description, productImages, productPrice, seoTitle, seoDescription, variantImage, pAdditionalImages, metafields } = syncFromShopifyInputs;
    if (title || description || productImages || productPrice || seoTitle || seoDescription || variantImage || pAdditionalImages || metafields.length > 0) {
      setSyncFromShopifyErrors([]);
      const data = { ids: [productId.ids], feedId: productId.feed_id, inputData: syncFromShopifyInputs }
      axioshttp.post('sync/shopify', data).then(response => {
        if (response.data.status) {
          setToastMessage(response.data.message);
          setShowToast(true);
          handleSyncShopifyCancel();
        }
        else {
          setSyncFromShopifyErrors([response.data.message])
        }
      }).catch(error => {
        console.log(error);
        setSyncFromShopifyErrors(['Something Went Wrong.Please try again later']);
        // if (error.response.data.hasOwnProperty('errors')) {
        //   var allErrors = error.response.data.errors;
        //   for (const error in allErrors) {
        //     setSyncFromShopifyErrors(values => ([...values, allErrors[error][0]]))
        //   }
        // }
      })
    }
    else {
      setSyncFromShopifyErrors(['Please Select A Field To Sync']);
    }
  }

  const handleMetafieldsClick = () => {
    if (featuresStatus.metafieldsMapping) {
      setMetafieldsActive(!metafieldsActive);
    } else {
      setShowMetafieldUpgradeMessage(!showMetafieldUpgradeMessage);
    }
  }


  // *********************************************************************************************
  // Sync From Shopify End
  // *********************************************************************************************

  ///////////////////////////////////////////////////////////////////////////
  // loayality Points
  const loyaltyPointsHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true)
    if (name == 'loyaltyPointsName') {
      setP_inputs(values => ({ ...values, ['loyaltyPoints']: { ...values.loyaltyPoints, 'name': value } }));
    }
    if (name == 'loyaltyPointsValue') {
      setP_inputs(values => ({ ...values, ['loyaltyPoints']: { ...values.loyaltyPoints, 'pointsValue': value } }));
    }
    if (name == 'loyaltyPointsRatio') {
      setP_inputs(values => ({ ...values, ['loyaltyPoints']: { ...values.loyaltyPoints, 'ratio': value } }));
    }
  }
  // Product height handle 
  const handleProductHeight = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'productHeightUnit') {
      setP_inputs(values => ({ ...values, ['productHeight']: { ...values.productHeight, 'unit': value } }));
    }
    if (name == 'productHeightValue') {
      setP_inputs(values => ({ ...values, ['productHeight']: { ...values.productHeight, 'value': value } }));
    }
  }

  const productWeightHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'productWeightUnit') {
      setP_inputs(values => ({ ...values, ['productWeight']: { ...values.productWeight, 'unit': value } }));
    }
    if (name == 'productWeightValue') {
      setP_inputs(values => ({ ...values, ['productWeight']: { ...values.productWeight, 'value': value } }));
    }
  }

  const productLengthHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'productLengthUnit') {
      setP_inputs(values => ({ ...values, ['productLength']: { ...values.productLength, 'unit': value } }));
    }
    if (name == 'productLengthValue') {
      setP_inputs(values => ({ ...values, ['productLength']: { ...values.productLength, 'value': value } }));
    }
  }

  const productWidthHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'productWidthUnit') {
      setP_inputs(values => ({ ...values, ['productWidth']: { ...values.productWidth, 'unit': value } }));
    }
    if (name == 'productWidthValue') {
      setP_inputs(values => ({ ...values, ['productWidth']: { ...values.productWidth, 'value': value } }));
    }
  }

  const shippingHeightHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'shippingHeightUnit') {
      setP_inputs(values => ({ ...values, ['shippingHeight']: { ...values.shippingHeight, 'unit': value } }));
    }
    if (name == 'shippingHeightValue') {
      setP_inputs(values => ({ ...values, ['shippingHeight']: { ...values.shippingHeight, 'value': value } }));
    }
  }

  const shippingWeightHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'shippingWeightUnit') {
      setP_inputs(values => ({ ...values, ['shippingWeight']: { ...values.shippingWeight, 'unit': value } }));
    }
    if (name == 'shippingWeightValue') {
      setP_inputs(values => ({ ...values, ['shippingWeight']: { ...values.shippingWeight, 'value': value } }));
    }
  }

  const shippingLengthHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'shippingLengthUnit') {
      setP_inputs(values => ({ ...values, ['shippingLength']: { ...values.shippingLength, 'unit': value } }));
    }
    if (name == 'shippingLengthValue') {
      setP_inputs(values => ({ ...values, ['shippingLength']: { ...values.shippingLength, 'value': value } }));
    }
  }

  const shippingWidthHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    if (name == 'shippingWidthUnit') {
      setP_inputs(values => ({ ...values, ['shippingWidth']: { ...values.shippingWidth, 'unit': value } }));
    }
    if (name == 'shippingWidthValue') {
      setP_inputs(values => ({ ...values, ['shippingWidth']: { ...values.shippingWidth, 'value': value } }));
    }
  }

  const availabilityDateHandle = (event) => {
    var value = event.target.value;
    const date = new Date(value);
    setShowBanner(true);
    setP_inputs(values => ({ ...values, ['availabilityDate']: date.toISOString() }));
  }

  const expirationDateHandle = (event) => {
    var value = event.target.value;
    setShowBanner(true);
    const date = new Date(value)
    setP_inputs(values => ({ ...values, ['expirationDate']: date.toISOString() }));
  }

  const salePriceEffectiveDateHandle = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    setShowBanner(true);
    const date = new Date(value)
    if (name == "start") {
      setP_inputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'start': value } }));
    }
    if (name == "end") {
      setP_inputs(values => ({ ...values, ['salePriceEffectiveDate']: { ...values.salePriceEffectiveDate, 'end': value } }));
    }

  }
  //////////////////////////////////////////////////////////////

  console.log(p_inputs);

  // Set Score in parent State
  const scores = () => {
    if (productsById != '') {
      setScore(values => ({
        ...values, ['title']:
          p_inputs.title ? p_inputs.title.length < 30 ? 5 : p_inputs.title.length >= 30 && p_inputs.title.length < 50 ? 10 : p_inputs.title.length >= 50 && p_inputs.title.length < 70 ? 15 : 20 : productsById.title.length < 30 ? 5 : productsById.title.length >= 30 && productsById.title.length < 50 ? 10 : productsById.title.length >= 50 && productsById.title.length < 70 ? 15 : 20,

        ['description']: p_inputs.description ? p_inputs.description.length < 300 ? 5 : p_inputs.description.length >= 300 && p_inputs.description.length < 500 ? 10 : p_inputs.description.length >= 500 && p_inputs.description.length < 750 ? 15 : 20
          : productsById.description.length < 300 ? 5 :
            productsById.description.length >= 300 && productsById.description.length < 500 ? 10 : productsById.description.length >= 500 && productsById.description.length < 750 ? 15 : 20,
        ['productTypes']: productsById.productTypes || p_inputs.productTypes ? 10 : 0,
        ['brand']: productsById.brand || p_inputs.brand ? 10 : 0,
        ['Category_id']: p_inputs.product_category_id || productsById.product_category_id ? 10 : 0,
        ['promotionIds']: (!p_inputs.promotionIds && productsById.edited_product != null && productsById.edited_product.promotionIds != null) ? 10 : p_inputs.promotionIds && p_inputs.promotionIds.length != 0 ? 10 : 0,
        ['barcode']: productsById.barcode ? 10 : 0,
        ['image']: productsById.image ? 10 : 0
      }))
    }
  }
  // Request For sending updated products
  const requestForUpdate = () => {
    setLoading(true);
    scores();
    if (p_inputs.hasOwnProperty('shipping')) {
      if (Object.keys(p_inputs.shipping).length > 0) {
        if (!p_inputs.shipping.hasOwnProperty('price')) {
          setShippingValuePriceError(true);
          setLoading(false);
          return
        } else {
          setLoading(true);
          setShippingValuePriceError(false);
        }
      } else {
        setLoading(true);
        setShippingValuePriceError(false);
      }
    }
    axioshttp.post('editProduct/sync', p_inputs).then(res => {
      console.log(res.data);
      if (res.data.errors) {
        alert(res.data.errors.description);
        setLoading(false);
      } else {
        getProductsById();
        setOpen(true);
        setLoading(false);
        setShowBanner(false);
      }
    }).catch(error => {
      console.log(error);
    })
  }
  // for toaster close function 
  const handleClose = () => {
    setOpen(false);
    setLimitToast(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  // create functions for update images
  // const uploadImagesOnDb = async () => {
  //   var imageArr = []; 
  //   var countImg = 0;
  //   setLoading(true);
  //   const formData = new FormData();
  //   formData.append("fileCount", JSON.stringify(imageFiles.length));
  //   formData.append("id", JSON.stringify(productId.ids)); // ids as string  with form
  //   for(let j = 0; j < items.length ; j++){
  //     // loop for append all file that selected
  //     for (let i = 0 ; i < imageFiles.length ; i++) {
  //       if(imageFiles[i].name == items[j]['name']){
  //         formData.append("file"+countImg, imageFiles[i]);
  //         countImg++ ;
  //         break;
  //       }
  //     }
  //     if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(items[j]['image'])) {
  //       imageArr[j]={
  //         name : items[j]['name'],
  //         image : items[j]['image']
  //       } 
  //     }
  //     else{
  //       imageArr[j]={
  //         name : items[j]['name'],
  //         image : "file"
  //       } 
  //     }
  //   }
  //   formData.append("images", JSON.stringify(imageArr)); // images Links as string  with form
  //   // Request for upload files...
  //   axioshttp.post('upload/image/file', formData, {
  //     headers:{
  //       "Content-Type" : "multipart/form-data",
  //     },
  //   }).then((res) => {
  //     console.log("post request", res.data);
  //     setLoading(false);
  //     setOpen(true);
  //     }).catch(error => {
  //       console.log(error);
  //       if(error.message == "Request failed with status code 403"){
  //         uploadImagesOnDb();
  //       }

  //     })
  // } 

  const fetchFeaturesStatus = () => {
    axioshttp.get('get/features/status').then(response => {
      if (response.data.status == true) {
        setFeaturesStatus(response.data.features)
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const uploadFinalImages = (FileImages) => {
    var selectedImages = [];
    for (let j = 0; j < items.length; j++) {
      if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(items[j]['image'])) {
        selectedImages[j] = {
          name: items[j]['name'],
          image: items[j]['image']
        }
      }
      else {
        selectedImages[j] = {
          name: items[j]['name'],
          image: "file"
        }
      }
    }
    let Finalimages = {
      id: productId.ids,
      fileImages: FileImages,
      images: selectedImages
    };
    // Request for upload files...
    axioshttp.post('upload/images', Finalimages).then((res) => {
      setImageFiles([]);
      setTimeout(() => {
        getProductsById();
      }, 2500);
      setLoading(false);
      setOpen(true);
    }).catch(error => {
      console.log(error);
      if (error.message == "Request failed with status code 403") {
        uploadImagesOnDb();
      }
    })
  }

  async function uploadImagesOnDb () {
    setLoading(true);
    var imageArr = [];
    var countImg = 0;
    if (imageFiles.length != 0) {
      for (let j = 0; j < items.length; j++) {
        // loop for append all file that selected
        for (let i = 0; i < imageFiles.length; i++) {
          if (imageFiles[i].name == items[j]['name']) {
            const formData = new FormData();
            formData.append("id", JSON.stringify(productId.ids)); // ids as string  with 
            formData.append("file", imageFiles[i]);
            await axioshttp.post('upload/image/file', formData).then((res) => {
              imageArr[countImg] = {
                name: items[j]['name'],
                image: res.data
              }
            }).catch(async (error) => {
              if (error.message == "Request failed with status code 403") {
                await axioshttp.post('upload/image/file', formData).then((res) => {
                  imageArr[countImg] = {
                    name: items[j]['name'],
                    image: res.data
                  }
                })
              }
            })
            countImg++;
            break;
          }

        }
      }
    }
    uploadFinalImages(imageArr);
  }
  const refreshPage = () => {
    window.location.reload();
  }
  console.log("pinputs", p_inputs);
  // console.log("produtById", productsById);
  // console.log("photos",items);
  // console.log("files",imageFiles);
  // const chek = new Map(Object.entries(checkedItem));
  // const chekted = Array.from(chek);
  // console.log("checked",checkedItem);
  //useEffect functions Call
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/detail", title: "Product Detail" });
    fetchFeaturesStatus();
    getProductsById();
    fetchFeedData(productId.feed_id)
    setShowBanner(false);
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        {/*    save and discard banner    */}
        <>
          {showBanner ? (
            <div className='fixed top-0 bg-[#202123] w-full p-4 z-10'>
              <div className='flex justify-end'>
                <Button onClick={() => setDiscardModal(!DiscardModal)} style={{ marginRight: '10px' }} variant="outlined"><span className=' text-white '>Discard</span></Button>
                {loading == false ?
                  <Button onClick={requestForUpdate} style={{ background: '#008060' }} variant="contained" color="primary">Save Changes</Button>
                  :
                  <LoadingButton loading={true} variant="string" className="text-white" disabled style={{ background: '#ffffff', }} color="inherit" > <span>Save Changes</span> </LoadingButton>
                }
              </div>
            </div>
          ) : null}
        </>

        <div className='p-3'>
          <div className='pt-2 pb-2'>
            {productsById != '' ? <Button onClick={dashboardOnClick} variant='outlined'><ArrowBackIcon /></Button> : <Skeleton variant="rounded" style={{ width: '5vw', height: '6vh' }} />}
          </div>
          <>
            <div sx={{ width: '100%' }}>
              <TabContext value={value}>
                <div sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    {productsById != '' ? <Tab icon={<DisplaySettingsIcon />} iconPosition="start" label="Detail" value="1" /> : <Tab label={<Skeleton variant="rounded" style={{ width: '100%', height: '6vh' }} />} iconPosition="start" value="1" />}
                    {productsById != '' ? <Tab icon={<ScoreboardIcon />} iconPosition="start" label="Score" value="2" /> : <Tab label={<Skeleton variant="rounded" style={{ width: '100%', height: '6vh' }} />} iconPosition="start" disabled value="2" />}
                    {productsById != '' ? <Tab icon={<CollectionsIcon />} iconPosition="start" label={<div>
                      Gallery
                      <span class="inline-block blink px-1 ml-2 text-center align-baseline font-medium bg-gradient-to-r from-[#fe6447] to-[#f49989] text-white rounded-md text-sm">New</span>
                    </div>}
                      value="3" /> : <Tab label={<Skeleton variant="rounded" style={{ width: '100%', height: '6vh' }} />} iconPosition="start" disabled value="3" />}
                  </TabList>
                </div>
                <TabPanel style={{ margin: '10px' }} value="1">
                  {productsById != '' ?
                    <>
                      <div className='flex flex-wrap items-center justify-between mt-4'>
                        <div className='flex items-center'>
                          <div>
                            <img className='w-[5rem]' src={`${productsById.image}`} />
                          </div>
                          <div className='flex flex-col items-start ml-2'>
                            <h1 class='text-lg font-semibold p-1'>{productsById.title}</h1>
                            <div className='flex items-center p-1'>Product Score: {productsById.score} / 100 {productsById.score < 50 ? <span class="bg-[#ffd79d] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : productsById.score > 50 && productsById.score <= 70 ? <span class="bg-[#fed3d1] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : productsById.score > 70 && productsById.score <= 90 ? <span class="bg-[#aee9d1] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : <span class="bg-[#a4e8f2] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>} </div>
                            <VideoModal margin='0 0 10px 0' title='Do You Want To Improve Score?' videoSrc='https://www.youtube.com/embed/E1iTMSwOjo8' />
                          </div>
                        </div>
                        <div class="rounded-md" role="group">
                          <button onClick={handleScoreTab} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-l-lg border hover:bg-white text-black">
                            <SummarizeIcon style={{ fontSize: '20px', marginRight: '2px', color: '#5c5f62' }} />
                            View Summary
                          </button>
                          <a href={editShopifyLink} target="_blank"><button
                            type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent border hover:bg-white text-black">
                            <EditIcon style={{ fontSize: '20px', marginRight: '5px', color: '#5c5f62' }} />
                            Edit In Shopify
                          </button></a>
                          <a href={viewProductLink} target="_blank"><button
                            type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent border hover:bg-white text-black">
                            <RemoveRedEyeIcon style={{ fontSize: '20px', marginRight: '5px', color: '#5c5f62' }} />
                            View Product
                          </button></a>
                          <button onClick={() => setShowSyncFromShopifyModel(!showSyncFromShopifyModel)}
                            type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-r-md border hover:bg-white text-black">
                            <SyncIcon style={{ fontSize: '20px', marginRight: '5px', color: '#5c5f62' }} />
                            Sync From Shopify
                          </button>
                        </div>
                      </div>
                      <>
                        <div className='mt-4'>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] '>
                              <p class='text-md font-medium'>Title</p>
                              <span className='text-sm'>Use between 80 and 100 characters to describe your product. The title is shown prominently in Google Shopping ads.</span>
                            </div>
                            <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                              {productsById != '' ?
                                <div>
                                  <div class="flex items-center">
                                    <div class="flex rounded-md w-[100%]">
                                      <input maxLength='100' onChange={handelScoreData} type="text" defaultValue={productsById.title} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                      <div class="flex items-center justify-center px-4 mt-1">
                                        <span class="w-10 h-6 text-black text-sm">
                                          {!scoreData.count ? productsById.title.length : scoreData.count}/100
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                  <div className='flex items-center'>
                                    <p>{scoreData.persent == 10 ? productsById.title.length >= 30 && productsById.title.length < 50 ? 30 : productsById.title.length >= 50 && productsById.title.length < 70 ? 70 : productsById.title.length > 70 ? 100 : 10 : scoreData.persent} / 100</p>
                                    {scoreData.persent == 10 ? productsById.title.length < 30 ?
                                      <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> :
                                      productsById.title.length >= 30 && productsById.title.length < 50 ? <span style={{ background: '#fed3d1' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : productsById.title.length >= 50 && productsById.title.length < 70 ? <span style={{ background: '#aee9d1' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : productsById.title.length >= 70 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span style={{ background: scoreData.color }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{scoreData.score}</span>
                                    }

                                  </div>
                                </div>
                                : " "}
                            </div>
                          </div>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                              <p class='text-md font-medium'>Description</p>
                              <span className='text-sm'>Describe your product in detail. Try to be as descriptive as possible and have a character length between 2000-5000. Minimum of 750 characters.</span>
                            </div>
                            <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                              {productsById != '' ?
                                <div>
                                  <div class="">
                                    {/* <ReactQuill onChange={handelBanner} width='100%' theme="snow" 
                              value={productsById.description}  /> */}
                                    <TextEditor defalt={productsById.description} handleVali={handelBanner} />
                                    <div class="flex items-center pt-2 mt-1">
                                      <span class="text-black text-sm">
                                        {!p_inputs.description ? productsById.description.length : p_inputs.description.length} out of 5000 characters used
                                      </span>
                                    </div>
                                  </div>
                                  <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                  <div className='flex items-center'>
                                    <p>{!p_inputs.description ? productsById.description.length < 300 ? 20 : productsById.description.length >= 300 && productsById.description.length < 500 ? 50 : productsById.description.length >= 500 && productsById.description.length <= 600 ? 70 : productsById.description.length > 600 && productsById.description.length < 750 ? 80 : productsById.description.length >= 750 ? 100 : 10 : p_inputs.description.length < 300 ? 20 : p_inputs.description.length >= 300 && p_inputs.description.length < 500 ? 50 : p_inputs.description.length >= 500 && p_inputs.description.length <= 600 ? 70 : p_inputs.description.length > 600 && p_inputs.description.length < 750 ? 80 : p_inputs.description.length >= 750 && p_inputs.description.length <= 5000 ? 100 : 10} / 100</p>
                                    {!p_inputs.description ? productsById.description.length < 300 ? <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : productsById.description.length > 300 && productsById.description.length <= 500 ? <span style={{ background: '#fed3d1' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : productsById.description.length > 500 && productsById.description.length <= 750 ? <span style={{ background: '#aee9d1' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : productsById.description.length > 750 && productsById.description.length <= 5000 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : p_inputs.description.length < 300 ? <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : p_inputs.description.length > 300 && p_inputs.description.length <= 500 ? <span style={{ background: '#fed3d1' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : p_inputs.description.length > 500 && p_inputs.description.length <= 750 ? <span style={{ background: '#aee9d1' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : p_inputs.description.length > 750 && p_inputs.description.length <= 5000 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span>}
                                  </div>
                                </div>
                                : " "}
                            </div>
                          </div>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                              <p class='text-md font-medium'>Compulsory Details</p>
                              <span className='text-sm'>These fields help Google identify your product type, brand, and associated category. Accurate data here will help you get more clicks on Google Shopping ads.</span>
                            </div>
                            <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                              <div>
                                {productsById != '' ?
                                  <>
                                    <div>
                                      <p className='py-1 text-sm'>Product Type</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input maxLength='120' onChange={handleInputChanges} type="text" defaultValue={productsById.productTypes} name="productTypes" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {p_inputs.productTypes && productsById.productTypes != null ? (productsById.productTypes ? productsById.productTypes.length : 0) : (p_inputs.productTypes ? p_inputs.productTypes.length : 0)}/120
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='flex items-center mt-2'>
                                      <p> {!p_inputs.productTypes ? productsById.productTypes && productsById.productTypes.length != 0 ? 100 : 0 : p_inputs.productTypes.length != 0 ? 100 : 0} / 100</p>
                                      {!p_inputs.productTypes ? productsById.productTypes && productsById.productTypes.length != 0 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : p_inputs.productTypes.length != 0 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span>}
                                    </div>
                                  </>
                                  : " "}
                                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                {productsById != '' ?
                                  <>
                                    <div>
                                      <p className='py-1 text-sm'>Brand</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input maxLength='120' onChange={handleInputChanges} defaultValue={productsById.brand} name="brand" type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.brand ? (productsById.brand ? productsById.brand.length : 0) : p_inputs.brand.length}/120
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='flex items-center mt-2'>
                                      <p>{!p_inputs.brand ? productsById.brand && productsById.brand.length != 0 ? 100 : 0 : p_inputs.brand.length != 0 ? 100 : 0} / 100</p>
                                      {!p_inputs.brand ? productsById.brand && productsById.brand.length != 0 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : p_inputs.brand.length != 0 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span>}
                                    </div>
                                  </>
                                  : " "}
                                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                {productsById != '' ?
                                  <div>
                                    <Autocomplete
                                      className="Product_Category_SelectDropdoen_1"
                                      disablePortal
                                      id="combo-box-demo"
                                      size="small"
                                      defaultValue={productsById.category}
                                      options={product_category}
                                      getOptionLabel={(option) => option.name}
                                      onChange={(event, value) => {
                                        if (value != null) {
                                          setP_inputs(values => ({ ...values, ['product_category_id']: value.id }));
                                          setShowBanner(true);
                                        }
                                      }}
                                      renderInput={(params) => (
                                        <TextField {...params} label="Select Product Category" defaultValue={productsById.category ? productsById.category.name : null} />
                                      )}
                                    />
                                  </div>
                                  : " "}
                                <div className='flex items-center mt-2'>
                                  <p>{!productsById.product_category_id ? 0 : 100} / 100</p>
                                  {!p_inputs.product_category_id ? !productsById.product_category_id ? <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : !p_inputs.product_category_id ? <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}
                                </div>
                                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                              </div>
                            </div>
                          </div>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                              <p class='text-md font-medium'>Custom Attributes</p>
                              <span className='text-sm'>You can define custom colors, sizes, materials, patterns, and COGS. It will not write back to Shopify, but it will be submitted to the connected feed. Also, these attributes will be considered only if a particular attribute is not defined in Shopify.</span>
                            </div>
                            {productsById != '' ?
                              <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                <div className='flex justify-between flex-wrap w-full'>

                                  <div className='w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]'>
                                    <p className='py-1 text-sm'>Color</p>
                                    <div className='flex items-center'>
                                      <div class="flex rounded-md w-[100%]">
                                        <input maxLength='100' name="color" onChange={handleInputChanges} type="text" defaultValue={productsById.edited_product != null ? !productsById.edited_product.color ? " " : productsById.edited_product.color : " "} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.color ? productsById.edited_product != null ? !productsById.edited_product.color ? 0 : productsById.edited_product.color.length : 0 : p_inputs.color.length}/100
                                          </span>
                                        </div>
                                      </div>
                                      <Tooltip title="Assignment of 'Color' attribute will be limited to feed only. This modification will not be sent back to Shopify. Product data in your Shopify store will not be changed by this assignment." arrow>
                                        <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className='w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]'>
                                    <p className='py-1 text-sm'>Size</p>
                                    <div className='flex items-center'>
                                      <div class="flex rounded-md w-[100%]">
                                        <input maxLength='100' name="sizes" onChange={handleInputChanges} type="text" defaultValue={productsById.edited_product != null ? !productsById.edited_product.sizes ? " " : productsById.edited_product.sizes : " "} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.sizes ? productsById.edited_product != null ? !productsById.edited_product.sizes ? 0 : productsById.edited_product.sizes.length : 0 : p_inputs.sizes.length}/100
                                          </span>
                                        </div>
                                      </div>
                                      <Tooltip title="Assignment of 'Size' attribute will be limited to feed only. This modification will not be sent back to Shopify. Product data in your Shopify store will not be changed by this assignment." arrow>
                                        <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                                <div className='flex justify-between flex-wrap w-full'>
                                  <div className='w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]'>
                                    <p className='py-1 text-sm'>Material</p>
                                    <div className='flex items-center'>
                                      <div class="flex rounded-md w-[100%]">
                                        <input maxLength='100' name='material' onChange={handleInputChanges} type="text" defaultValue={productsById.edited_product != null ? !productsById.edited_product.material ? " " : productsById.edited_product.material : " "} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.material ? productsById.edited_product != null ? !productsById.edited_product.material ? 0 : productsById.edited_product.material.length : 0 : p_inputs.material.length}/100
                                          </span>
                                        </div>
                                      </div>
                                      <Tooltip title="The assignment of the 'Material' attribute will be limited to feed only. This modification will not be sent back to Shopify. Product data in your Shopify store will not be changed by this assignment." arrow>
                                        <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className='w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]'>
                                    <p className='py-1 text-sm'>Pattern</p>
                                    <div className='flex items-center'>
                                      <div class="flex rounded-md w-[100%]">
                                        <input maxLength='100' onChange={handleInputChanges} name="pattern" type="text" defaultValue={productsById.edited_product != null ? !productsById.edited_product.pattern ? " " : productsById.edited_product.pattern : " "} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.pattern ? productsById.edited_product != null ? !productsById.edited_product.pattern ? 0 : productsById.edited_product.pattern.length : 0 : p_inputs.pattern.length}/100
                                          </span>
                                        </div>
                                      </div>
                                      <Tooltip title="Assignment of the 'Pattern' attribute will be limited to Feed only. This modification will not be sent back to Shopify. Product data in your Shopify store will not be changed by this assignment." arrow>
                                        <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                                <div className='flex items-center justify-between flex-wrap w-full'>
                                  <div className='w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]'>
                                    <p className='py-1 text-sm'>Cost of Goods Sold (COGS)</p>
                                    <div class="flex rounded-md w-[100%]">
                                      <input type="number" onChange={handleInputChanges} name="costOfGoodsSold" defaultValue={productsById.edited_product != null && productsById.edited_product.costOfGoodsSold != null && productsById.edited_product.costOfGoodsSold != " " && JSON.parse(productsById.edited_product.costOfGoodsSold).value ? JSON.parse(productsById.edited_product.costOfGoodsSold).value : ""} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                    </div>
                                  </div>
                                  <div className='w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%] flex items-center'>
                                    <FormControlLabel style={{ display: 'flex', justifyContent: 'end' }} control={<Checkbox style={{ color: '#008060' }} onChange={handleCheckboxChanges} name="adult" value="yes" defaultChecked={productsById.edited_product != null ? !productsById.edited_product.adult ? false : true : false} />} label="Check this if the product is adult-oriented." />
                                    <Tooltip title="Use this to indicate that this product is adult-oriented because it contains adult merchandise or sexually explicit content such as nudity, sexually suggestive content, or is intended to enhance sexual activity." arrow>
                                      <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                    </Tooltip>
                                  </div>
                                </div>

                              </div>
                              : " "}
                          </div>
                          {productsById != '' ?
                            <>
                              <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                  <p class='text-md font-medium'>Detailed Product Characteristics</p>
                                  <span className='text-sm'>These attributes are used to submit particular product characteristics that users commonly search for. The attributes can help you control your ads appearance when you advertise products. These attributes are also used to help potential customers filter by attributes.</span>
                                  <VideoModal margin='0 0 10px 0' title='Product Characteristics - Must Watch' videoSrc='https://www.youtube.com/embed/0u0JIlsbNAI' />
                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                  <div>
                                    <div class="flex items-center justify-between mb-4">
                                      <div className='w-[30%]'>
                                        <p className='text-sm py-1'>Condition</p>
                                        <select
                                          id="countries"
                                          class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                                          onChange={handleInputChanges}
                                          name="productCondition"
                                        >
                                          <option disabled selected value>

                                            - - select - -
                                          </option>
                                          <option value="new" selected={productsById.productCondition == "new" ? true : false}>New</option>
                                          <option value="refurbished" selected={productsById.productCondition == "refurbished" ? true : false}>Refurbished</option>
                                          <option value="used" selected={productsById.productCondition == "used" ? true : false}>Used</option>
                                        </select>
                                      </div>
                                      <div className='w-[30%]'>
                                        <p className='text-sm py-1'>Age</p>
                                        <select
                                          id="countries"
                                          class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                                          onChange={handleInputChanges}
                                          name="ageGroup"
                                        >
                                          <option disabled selected value>
                                            - - select - -
                                          </option>
                                          <option value="adult" selected={productsById.ageGroup == "adult" ? true : false}>Adult</option>
                                          <option value="infant" selected={productsById.ageGroup == "infant" ? true : false}>Infant</option>
                                          <option value="newborn" selected={productsById.ageGroup == "newborn" ? true : false}>NewBorn</option>
                                          <option value="toddler" selected={productsById.ageGroup == "toddler" ? true : false}>toddler</option>
                                          <option value="kids" selected={productsById.ageGroup == "kids" ? true : false}>Kids</option>
                                        </select>
                                      </div>
                                      <div className='w-[30%]'>
                                        <p className='text-sm py-1'>Gender</p>
                                        <select
                                          id="countries"
                                          class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                                          onChange={handleInputChanges}
                                          name="gender"
                                        >
                                          <option disabled selected value>
                                            - - select - -
                                          </option>
                                          <option value="male" selected={productsById.gender == "male" ? true : false}>Male</option>
                                          <option value="female" selected={productsById.gender == "female" ? true : false}>Female</option>
                                          <option value="unisex" selected={productsById.gender == "unisex" ? true : false}>Unisex</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                  <div className='flex justify-between'>
                                    <div className='w-[45%]'>
                                      <p className='text-sm py-1'>Size System</p>
                                      <select
                                        id="countries"
                                        class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                                        onChange={handleInputChanges}
                                        name="sizeSystem"

                                      >
                                        <option disabled selected value>
                                          - - select - -
                                        </option>
                                        <option value="AU" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "AU" ? true : false : false}>AU</option>
                                        <option value="BR" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "BR" ? true : false : false} >BR</option>
                                        <option value="CN" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "CN" ? true : false : false}>CN</option>
                                        <option value="DE" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "DE" ? true : false : false}>DE</option>
                                        <option value="EU" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "EU" ? true : false : false}>EU</option>
                                        <option value="FR" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "AU" ? true : false : false}>FR</option>
                                        <option value="IT" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "IT" ? true : false : false}>IT</option>
                                        <option value="JP" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "JP" ? true : false : false}>JP</option>
                                        <option value="MEX" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "MEX" ? true : false : false}>MEX</option>
                                        <option value="UK" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "UK" ? true : false : false}>UK</option>
                                        <option value="US" selected={productsById.edited_product != null ? productsById.edited_product.sizeSystem == "US" ? true : false : false}>US</option>
                                      </select>
                                    </div>
                                    <div className='w-[45%]'>
                                      <p className='text-sm py-1'>Size Type</p>
                                      <select
                                        id="countries"
                                        class="text-gray-900 text-sm rounded-md w-[100%] p-2.5"
                                        onChange={handleInputChanges}
                                        name="sizeType"
                                      >
                                        <option disabled selected value>
                                          - - select - -
                                        </option>
                                        <option value="Regular" selected={productsById.edited_product != null ? productsById.edited_product.sizeType == "regular" ? true : false : false}>Regular</option>
                                        <option value="Petite" selected={productsById.edited_product != null ? productsById.edited_product.sizeType == "petite" ? true : false : false}>Petite</option>
                                        <option value="Plus" selected={productsById.edited_product != null ? productsById.edited_product.sizeType == "plus" ? true : false : false}>Plus</option>
                                        <option value="Tall" selected={productsById.edited_product != null ? productsById.edited_product.sizeType == "tall" ? true : false : false}>Tall</option>
                                        <option value="Big" selected={productsById.edited_product != null ? productsById.edited_product.sizeType == "big" ? true : false : false}>Big</option>
                                        <option value="Maternity" selected={productsById.edited_product != null ? productsById.edited_product.sizeType == "maternity" ? true : false : false}>Maternity</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className='flex flex-wrap items-center justify-between mb-4 mt-1.5'>
                                    <div className='flex items-center'>
                                      <div>
                                        <p className='text-sm py-1'>Unit Pricing Measure</p>
                                        <input type="number" name="unitPriceValue" defaultValue={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).value : " "}
                                          onChange={handleUnitPrice}
                                          class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" />
                                      </div>
                                      <div>
                                        <p className='text-sm py-1'>Value</p>
                                        <select
                                          id="countries"
                                          class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]"
                                          name="unitPriceUnit"
                                          onChange={handleUnitPrice}
                                        >
                                          <option disabled selected value>
                                            - - select - -
                                          </option>
                                          <option value="oz" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "oz" ? true : false : false} >oz</option>
                                          <option value="lb" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "lb" ? true : false : false} >lb</option>
                                          <option value="mg" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "mg" ? true : false : false}>mg</option>
                                          <option value="g" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "g" ? true : false : false}>g</option>
                                          <option value="kg" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "kg" ? true : false : false}>kg</option>
                                          <option value="floz" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "floz" ? true : false : false}>floz</option>
                                          <option value="pt" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "pt" ? true : false : false}>pt</option>
                                          <option value="qt" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "qt" ? true : false : false}>qt</option>
                                          <option value="gal" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "gal" ? true : false : false}>gal</option>
                                          <option value="ml" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "ml" ? true : false : false}>ml</option>
                                          <option value="cl" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "cl" ? true : false : false}>cl</option>
                                          <option value="l" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "l" ? true : false : false}>l</option>
                                          <option value="cbm" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "cbm" ? true : false : false}>cbm</option>
                                          <option value="in" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "in" ? true : false : false}>in</option>
                                          <option value="ft" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "ft" ? true : false : false}>ft</option>
                                          <option value="yd" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "yd" ? true : false : false}>yd</option>
                                          <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "cm" ? true : false : false}>cm</option>
                                          <option value="m" selected={productsById.edited_product != null && productsById.edited_product.unitPricingMeasure != null ? JSON.parse(productsById.edited_product.unitPricingMeasure).unit == "m" ? true : false : false}>m</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className='flex items-center'>
                                      <div>
                                        <p className='text-sm py-1'>Unit Pricing Base Measure</p>
                                        <input type="number" onChange={handleUnitBase} defaultValue={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).value : " "} class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" name="unitBaseValue" />
                                      </div>
                                      <div>
                                        <p className='text-sm py-1'>Value</p>
                                        <select
                                          id="countries"
                                          name="unitBaseUnit"
                                          class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]"
                                          onChange={handleUnitBase}
                                        >
                                          <option disabled selected value>
                                            - - select - -
                                          </option>
                                          <option value="oz" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "oz" ? true : false : false} >oz</option>
                                          <option value="lb" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "lb" ? true : false : false} >lb</option>
                                          <option value="mg" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "mg" ? true : false : false}>mg</option>
                                          <option value="g" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "g" ? true : false : false}>g</option>
                                          <option value="kg" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "kg" ? true : false : false}>kg</option>
                                          <option value="floz" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "floz" ? true : false : false}>floz</option>
                                          <option value="pt" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "pt" ? true : false : false}>pt</option>
                                          <option value="qt" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "qt" ? true : false : false}>qt</option>
                                          <option value="gal" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "gal" ? true : false : false}>gal</option>
                                          <option value="ml" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "ml" ? true : false : false}>ml</option>
                                          <option value="cl" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "cl" ? true : false : false}>cl</option>
                                          <option value="l" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "l" ? true : false : false}>l</option>
                                          <option value="cbm" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "cbm" ? true : false : false}>cbm</option>
                                          <option value="in" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "in" ? true : false : false}>in</option>
                                          <option value="ft" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "ft" ? true : false : false}>ft</option>
                                          <option value="yd" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "yd" ? true : false : false}>yd</option>
                                          <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "cm" ? true : false : false}>cm</option>
                                          <option value="m" selected={productsById.edited_product != null && productsById.edited_product.unitPricingBaseMeasure != null ? JSON.parse(productsById.edited_product.unitPricingBaseMeasure).unit == "m" ? true : false : false}>m</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                  <div className='flex flex-wrap justify-between items-center mb-4'>
                                    <div className='w-full sm:w-full md:w-[45%] lg:w-[45%] xl:w-[45%] 2xl:w-[45%]'>
                                      <p className='text-sm py-1'>Multipack</p>
                                      <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name='multipack' defaultValue={productsById.edited_product != null ? productsById.edited_product.multipack != null ? productsById.edited_product.multipack : " " : " "} onChange={handleInputChanges} />
                                    </div>
                                    <div className='flex items-center'>
                                      <p className='mr-2'>Is it bundle?</p>
                                      <RadioGroup
                                        name="isBundle"
                                        defaultValue={productsById.edited_product != null && productsById.edited_product.isBundle != null ? (productsById.edited_product.isBundle == true ? "yes" : (productsById.edited_product.isBundle == false ? "no" : null)) : null}
                                        row
                                        onChange={handleInputChanges}
                                      >
                                        <FormControlLabel value="yes" control={<Radio style={{ color: '#008060' }} />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio style={{ color: '#008060' }} />} label="No" />
                                      </RadioGroup>
                                    </div>
                                  </div>
                                  <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                  <div>
                                    <div className='flex justify-between items-center'>
                                      <div className='flex items-center'>
                                        <p className='text-sm py-1'>Product Identifier Exists</p>
                                        <Tooltip title="This option will submit all the required product identifiers in the feed. If any identifier value is missing, it will not be submitted. Use this option when your products are updated with all the correct unique product identifiers (UPI) as other merchants for the same product or variant. UPI defines exactly which product you're selling." arrow>
                                          <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                        </Tooltip>
                                      </div>
                                      <RadioGroup
                                        row
                                        defaultValue={productsById.edited_product != null && productsById.edited_product.identifierExists != null ? (productsById.edited_product.identifierExists == true ? "yes" : (productsById.edited_product.identifierExists == false ? "no" : null)) : null}
                                        name="identifierExists"
                                        onChange={handleInputChanges}
                                      >
                                        <FormControlLabel value="yes" control={<Radio style={{ color: '#008060' }} />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio style={{ color: '#008060' }} />} label="No" />
                                      </RadioGroup>
                                    </div>
                                  </div>

                                </div>

                              </div>

                              <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                  <p class='text-md font-medium'>Product Labels</p>
                                  <span className='text-sm'>Custom labels are used to structure your campaigns. Shipping labels are used to set different shipping costs in the merchant centre for different products. Ad labels are used to create dynamic remarketing ads for a particular group of products.</span>
                                  <VideoModal margin='0 0 10px 0' title='Custom Label - Must Watch' videoSrc='https://www.youtube.com/embed/ej308o3HUVU' />
                                  <VideoModal margin='0 0 10px 0' title='Ads Labels - Must Watch' videoSrc='https://www.youtube.com/embed/drjfgEwK68Y' />
                                  <VideoModal margin='0 0 10px 0' title='Shipping Label - Must Watch' videoSrc='https://www.youtube.com/embed/F9b1xwlywjk' />
                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                  <div className='flex items-center justify-between flex-wrap'>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Custom Label 0</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="customLabel0" defaultValue={productsById.product_label != null ? productsById.product_label.customLabel0 : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.customLabel0 ? productsById.product_label != null && productsById.product_label.customLabel0 != null ? productsById.product_label.customLabel0.length : 0 : p_inputs.customLabel0.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Custom Label 1</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="customLabel1" defaultValue={productsById.product_label != null ? productsById.product_label.customLabel1 : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.customLabel1 ? productsById.product_label != null && productsById.product_label.customLabel1 != null ? productsById.product_label.customLabel1.length : 0 : p_inputs.customLabel1.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center justify-between flex-wrap'>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Custom Label 2</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="customLabel2" defaultValue={productsById.product_label != null ? productsById.product_label.customLabel2 : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.customLabel2 ? productsById.product_label != null && productsById.product_label.customLabel2 != null ? productsById.product_label.customLabel2.length : 0 : p_inputs.customLabel2.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Custom Label 3</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="customLabel3" defaultValue={productsById.product_label != null ? productsById.product_label.customLabel3 : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.customLabel3 ? productsById.product_label != null && productsById.product_label.customLabel3 != null ? productsById.product_label.customLabel3.length : 0 : p_inputs.customLabel3.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center justify-between flex-wrap'>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Custom Label 4</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="customLabel4" defaultValue={productsById.product_label != null ? productsById.product_label.customLabel4 : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.customLabel4 ? productsById.product_label != null && productsById.product_label.customLabel4 != null ? productsById.product_label.customLabel4.length : 0 : p_inputs.customLabel4.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Ads Labels</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="adsLabels" defaultValue={productsById.product_label != null ? productsById.product_label.adsLabels : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.adsLabels ? productsById.product_label != null && productsById.product_label.adsLabels != null ? productsById.product_label.adsLabels.length : 0 : p_inputs.adsLabels.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center justify-between flex-wrap'>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Ads Grouping</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="adsGrouping" defaultValue={productsById.product_label != null ? productsById.product_label.adsGrouping : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.adsGrouping ? productsById.product_label != null && productsById.product_label.adsGrouping != null ? productsById.product_label.adsGrouping.length : 0 : p_inputs.adsGrouping.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Shipping Label</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="shippingLabel" defaultValue={productsById.product_label != null ? productsById.product_label.shippingLabel : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.shippingLabel ? productsById.product_label != null && productsById.product_label.shippingLabel != null ? productsById.product_label.shippingLabel.length : 0 : p_inputs.shippingLabel.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flex items-center justify-between flex-wrap'>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Tax Category</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="taxCategory" defaultValue={productsById.product_label != null ? productsById.product_label.taxCategory : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.taxCategory ? productsById.product_label != null && productsById.product_label.taxCategory != null ? productsById.product_label.taxCategory.length : 0 : p_inputs.taxCategory.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                      <p className='text-sm py-1'>Return Policy</p>
                                      <div class="flex rounded-md w-[100%]">
                                        <input onChange={handleInputChanges} name="return_policy_label" defaultValue={productsById.edited_product != null ? productsById.edited_product.return_policy_label : " "} maxLength='100' type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div class="flex items-center justify-center px-4 mt-1">
                                          <span class="w-10 h-6 text-black text-sm">
                                            {!p_inputs.return_policy_label ? productsById.edited_product != null && productsById.edited_product.return_policy_label != null ? productsById.edited_product.return_policy_label.length : 0 : p_inputs.return_policy_label.length}/100
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                  <p class='text-md font-medium'>Merchant Promotions</p>
                                  <span className='text-sm'>The Promotion ID field will only include Promotion IDs that are created for specific products. You can assign multiple promotion IDs to the same product.</span>
                                  <VideoModal margin='0 0 10px 0' title='How to setup Promotions' videoSrc='https://www.youtube.com/embed/Cid-DOFiDl4' />
                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                  <div>
                                    <div class="flex items-center">
                                      <div class="rounded-md w-[100%]">
                                        {tags.map((tag, index) => (
                                          <span id="badge-dismiss-dark" class="inline-flex items-center mb-2 py-1 px-2 mr-2 text-sm font-medium text-gray-800 bg-gray-100 rounded">
                                            {tag}
                                            <button onClick={() => deleteTag(index)} type="button" class="inline-flex items-center p-0.5 ml-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 " data-dismiss-target="#badge-dismiss-dark" aria-label="Remove">
                                              <svg aria-hidden="true" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                              <span class="sr-only">Remove badge</span>
                                            </button>
                                          </span>
                                        ))}
                                        <input class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          value={input.slice(0, 50)}
                                          placeholder="Paste your promotion IDs here and apply enter."
                                          onKeyDown={onKeyDown}
                                          onChange={onChange}
                                          name="promotionIds"
                                          disabled={tags.length >= 10 ? true : false}
                                        />
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <div className='flex items-center'>
                                      <p>{tags.length > 0 ? 100 : 0} / 100</p>

                                      {tags.length > 0 ? <span style={{ background: '#a4e8f2' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span style={{ background: '#ffd79d' }} class="ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                  <p class='text-md font-medium'>Recommended Details</p>
                                  <span className='text-sm'>Adding data in these fields is recommended but not compulsory. Any addition will help Google increase your ads in Google Shopping.</span>
                                  <VideoModal margin='0 0 10px 0' title='Product highlights - Must Watch' videoSrc='https://www.youtube.com/embed/RRcJQ0FmZA4' />
                                  <VideoModal margin='0 0 10px 0' title='Product Details - Must Watch' videoSrc='https://www.youtube.com/embed/yOce0abt2ic' />
                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                  <p>Product Highlights</p>
                                  {
                                    productHighlights.map((val, index) => (
                                      <div value={val} id={"productHighlight" + index} className='flex items-center mt-2'>
                                        <div class="flex rounded-md w-[100%]">
                                          <input onChange={handleHighlights} name={index} maxLength='150' defaultValue={productHighlights[index] ? productHighlights[index] : " "} type="text" value={productHighlights[index]} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                          <div class="flex items-center justify-center px-4 mt-1">
                                            <span class="w-10 h-6 text-black text-sm">
                                              {p_inputs.productHighlights ? p_inputs.productHighlights[index] ? p_inputs.productHighlights[index].length : 0 : 0}/150
                                            </span>
                                          </div>
                                        </div>
                                        <div>
                                          <DeleteIcon onClick={() => deleteHighlights(index)} style={{ color: '#d82c0d', cursor: 'pointer' }} />
                                        </div>
                                      </div>
                                    ))}
                                  <Button disabled={productHighlights.length >= 6} onClick={addNewHighlights} style={{ marginTop: '10px' }} startIcon={<AddCircleIcon style={{ color: '#008060' }} />} variant="outlined" color="primary">
                                    Add Highlights
                                  </Button>
                                </div>
                              </div>
                              <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>

                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                  <p>Product Details</p>
                                  {productDetails.slice(0, 100).map((val, index) => (
                                    <>
                                      <div className='p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                        <div className='flex justify-end'>
                                          <DeleteIcon onClick={() => deleteSection(index)} style={{ color: '#d82c0d', cursor: 'pointer' }} />
                                        </div>
                                        <div value={val} id={"productHighlight" + index} className='mt-2'>
                                          <>
                                            <div class="flex rounded-md w-[100%]">
                                              <input onChange={handleProductDetailsChange} maxLength='140' type="text" name={'sectionName' + index} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" placeholder='Section Name' defaultValue={productDetails[index] ? productDetails[index]['sectionName'] : " "} value={productDetails[index]['sectionName']} />
                                              <div class="flex items-center justify-center px-4 mt-1">
                                                <span class="w-10 h-6 text-black text-sm">
                                                  {p_inputs.productDetails[index] ? p_inputs.productDetails[index]['sectionName'] ? p_inputs.productDetails[index]['sectionName'].length : 0 : 0}/140
                                                </span>
                                              </div>
                                            </div>
                                          </>
                                          <div className='flex flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap justify-between mt-2'>
                                            <>
                                              <div class="flex rounded-md w-[100%]">
                                                <input onChange={handleProductDetailsChange} maxLength='140' type="text" name={'attributeName' + index} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" placeholder='Attribute Name' defaultValue={productDetails[index] ? productDetails[index]['attributeName'] : " "} value={productDetails[index]['attributeName']} />
                                                <div class="flex items-center justify-center px-4 mt-1">
                                                  <span class="w-10 h-6 text-black text-sm">
                                                    {p_inputs.productDetails[index] ? p_inputs.productDetails[index]['attributeName'] ? p_inputs.productDetails[index]['attributeName'].length : 0 : 0}/140
                                                  </span>
                                                </div>
                                              </div>
                                            </>
                                            <>
                                              <div class="flex rounded-md w-[100%]">
                                                <input onChange={handleProductDetailsChange} maxLength='1000' type="text" name={'attributeValue' + index} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" placeholder='Attribute Value' defaultValue={productDetails[index] ? productDetails[index]['attributeValue'] : " "} value={productDetails[index]['attributeValue']} />
                                                <div class="flex items-center justify-center px-4 mt-1">
                                                  <span class="w-10 h-6 text-black text-sm">
                                                    {p_inputs.productDetails[index] ? p_inputs.productDetails[index]['attributeValue'] ? p_inputs.productDetails[index]['attributeValue'].length : 0 : 0}/1000
                                                  </span>
                                                </div>
                                              </div>
                                            </>
                                          </div>
                                        </div>
                                      </div>
                                      <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    </>
                                  ))}
                                  <Button disabled={productSection.length >= 1000} onClick={addSection} style={{ marginTop: '10px' }} startIcon={<AddCircleIcon style={{ color: '#008060' }} />} variant="outlined" color="primary">
                                    Add Section
                                  </Button>
                                </div>
                              </div>

                              <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>

                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                  <div>
                                    <div class="flex justify-between items-baseline">
                                      <div class="rounded-md w-[45%]">
                                        <p className='text-sm py-1'>GTIN</p>
                                        <input disabled defaultValue={productsById.barcode} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                        <div className='flex items-center mt-2'>
                                          <p>{productsById.barcode != null ? 100 : 0} / 100</p>
                                          {productsById.barcode != null ? <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span> : <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span>}

                                        </div>
                                        <Divider style={{ marginTop: '5px', marginBottom: '10px' }} />
                                      </div>
                                      <div class="rounded-md w-[45%]">
                                        <p className='text-sm py-1'>MPN</p>
                                        <input disabled defaultValue={productsById.sku} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                      </div>
                                    </div>
                                    <div class="flex justify-between items-center">
                                      <div class="rounded-md w-[45%]">
                                        <p className='text-sm py-1'>Price</p>
                                        <input disabled defaultValue={productsById.comparePrice} type="number" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                      </div>
                                      <div class="rounded-md w-[45%]">
                                        <p className='text-sm py-1'>Sale Price</p>
                                        <input disabled defaultValue={productsById.salePrice} type="number" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='mt-4'><Button onClick={() => setSetting(!setting)} style={{ background: '#008060', color: 'white' }} variant='contained'>
                                    {setting ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                                    see additional product data</Button></div>
                                </div>
                              </div>
                            </>
                            : " "}
                          {/* //////////////////////////  start here   ////////////////////////////////////// */}
                          {setting ? productsById != '' ? (
                            <>
                              <div className='flex justify-between mt-3 mb-8 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                  <p class='text-md font-medium'>Additional Details</p>
                                  <span className='text-sm'>These fields contain additional information about the products. Adding this data might not have a huge impact on clicks, but it could be necessary for some categories.</span>
                                  <VideoModal margin='0 0 10px 0' title='Additional Details - Must Watch' videoSrc='https://www.youtube.com/embed/I6Rcgvu6Wno' />
                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%]'>
                                  <div className=' bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                      <div className='w-[30%]'>
                                        <div className='flex items-center'>
                                          <p>Subscription Cost</p>
                                          <Tooltip title={<p> If this product is a mobile phone or tablet that can be bundled with a service contract, use subscription cost to include the details of the monthly or annual payment plan.<Button target='_blank' href='https://support.google.com/merchants/answer/7437904' >Learn More</Button></p>} arrow >
                                            <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                          </Tooltip>
                                        </div>
                                      </div>
                                      <div className='w-[70%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Period</p>
                                          <select id="countries" class="text-gray-900 text-sm rounded-md w-[100%] p-2.5" name="subscriptionCostPeriod" onChange={handleInputChanges} >
                                            <option disabled="" value="true">- - select - -</option>
                                            <option value="month" selected={productsById.edited_product != null && productsById.edited_product.subscriptionCost != null ? JSON.parse(productsById.edited_product.subscriptionCost)['period'] == "month" ? true : false : false} >Month</option>
                                            <option value="year" selected={productsById.edited_product != null && productsById.edited_product.subscriptionCost != null ? JSON.parse(productsById.edited_product.subscriptionCost)['period'] == "year" ? true : false : false}>Year</option>
                                          </select>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Period length</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="subscriptionCostPeriodLength" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.subscriptionCost != null ? JSON.parse(productsById.edited_product.subscriptionCost)['periodLength'] : ""} />
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Amount</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="subscriptionCostAmount" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.subscriptionCost != null ? JSON.parse(productsById.edited_product.subscriptionCost)['amount']['value'] : ""} />
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>

                                      <div className='w-[30%]'>
                                        <div className='flex items-center'>
                                          <p>Loyalty Points</p>
                                          <Tooltip title={<p>If your country of sale is Japan and you offer loyalty points when someone purchases this product, use loyalty points to include the details of your loyalty points program. Loyalty points must have a specific monetary value and must be issued by your business.<Button target='_blank' href='https://support.google.com/merchants/answer/6324456' >Learn More</Button></p>} arrow>
                                            <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                          </Tooltip>
                                        </div>
                                      </div>
                                      <div className='w-[70%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Name</p>
                                          <input maxLength='24' type="text" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" onChange={loyaltyPointsHandle} name='loyaltyPointsName' defaultValue={productsById.edited_product != null && productsById.edited_product.loyaltyPoints != null ? JSON.parse(productsById.edited_product.loyaltyPoints)['name'] : ""} />
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Value</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" onChange={loyaltyPointsHandle} name='loyaltyPointsValue' defaultValue={productsById.edited_product != null && productsById.edited_product.loyaltyPoints != null ? JSON.parse(productsById.edited_product.loyaltyPoints)['pointsValue'] : ""} />
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Ratio</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" onChange={loyaltyPointsHandle} name='loyaltyPointsRatio' defaultValue={productsById.edited_product != null && productsById.edited_product.loyaltyPoints != null ? JSON.parse(productsById.edited_product.loyaltyPoints)['ratio'] : ""} />
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                      <div className='w-[30%]'>
                                        <div className='flex items-center'>
                                          <p>Installment</p>
                                          <Tooltip title={<p>Installment lets you offer your customers a monthly payment plan to pay for this product. The “Price” will be treated as the first payment. In countries outside of Latin America, you can offer installment payments only for mobile phones and tablets.<Button target='_blank' href='https://support.google.com/merchants/answer/6324474' >Learn More</Button></p>} arrow>
                                            <HelpIcon style={{ cursor: 'help', color: '#008060', marginLeft: '10px' }} />
                                          </Tooltip>
                                        </div>
                                      </div>
                                      <div className='w-[70%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]">
                                          <p class="text-sm py-1">Months</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="installmentMonths" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.installment != null ? JSON.parse(productsById.edited_product.installment)['months'] : ""} />
                                        </div>
                                        <div class="w-full sm:w-full md:w-[48%] lg:w-[48%] xl:w-[48%] 2xl:w-[48%]">
                                          <p class="text-sm py-1">Amount</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="installmentAmount" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.installment != null ? JSON.parse(productsById.edited_product.installment)['amount']['value'] : ""} />
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                      <div className='w-[100%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                          <div class="flex items-end">
                                            <div>
                                              <p class="text-sm py-1">Product Height</p>
                                              <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={handleProductHeight} name="productHeightValue" defaultValue={productsById.edited_product != null && productsById.edited_product.productHeight != null ? JSON.parse(productsById.edited_product.productHeight)['value'] : ""} />
                                            </div>
                                            <div>

                                              <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={handleProductHeight} name="productHeightUnit">
                                                <option disabled="" value="true" >- - select - -</option>
                                                <option value="in" selected={productsById.edited_product != null && productsById.edited_product.productHeight != null ? JSON.parse(productsById.edited_product.productHeight)['unit'] == "in" ? true : false : false}>Inch</option>
                                                <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.productHeight != null ? JSON.parse(productsById.edited_product.productHeight)['unit'] == "cm" ? true : false : false} >cm</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                          <div class="flex items-end">
                                            <div>
                                              <p class="text-sm py-1">Product Width</p>
                                              <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={productWidthHandle} name="productWidthValue" defaultValue={productsById.edited_product != null && productsById.edited_product.productWidth != null ? JSON.parse(productsById.edited_product.productWidth)['value'] : ""} />
                                            </div>
                                            <div>

                                              <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={productWidthHandle} name="productWidthUnit" >
                                                <option disabled="" value="true">- - select - -</option>
                                                <option value="in" selected={productsById.edited_product != null && productsById.edited_product.productWidth != null ? JSON.parse(productsById.edited_product.productWidth)['unit'] == "in" ? true : false : false} >Inch</option>
                                                <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.productWidth != null ? JSON.parse(productsById.edited_product.productWidth)['unit'] == "cm" ? true : false : false}>cm</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                          <div class="flex items-end">
                                            <div>
                                              <p class="text-sm py-1">Product Length</p>
                                              <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={productLengthHandle} name="productLengthValue" defaultValue={productsById.edited_product != null && productsById.edited_product.productLength != null ? JSON.parse(productsById.edited_product.productLength)['value'] : ""} />
                                            </div>
                                            <div>

                                              <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={productLengthHandle} name="productLengthUnit" >
                                                <option disabled="" value="true">- - select - -</option>
                                                <option value="in" selected={productsById.edited_product != null && productsById.edited_product.productLength != null ? JSON.parse(productsById.edited_product.productLength)['unit'] == "in" ? true : false : false} >Inch</option>
                                                <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.productLength != null ? JSON.parse(productsById.edited_product.productLength)['unit'] == "cm" ? true : false : false} >cm</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                          <div class="flex items-end">
                                            <div>
                                              <p class="text-sm py-1">Product Weight</p>
                                              <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={productWeightHandle} name="productWeightValue" defaultValue={productsById.edited_product != null && productsById.edited_product.productWeight != null ? JSON.parse(productsById.edited_product.productWeight)['value'] : ""} />
                                            </div>
                                            <div>

                                              <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={productWeightHandle} name="productWeightUnit">
                                                <option disabled="" value="true">- - select - -</option>
                                                <option value="lb" selected={productsById.edited_product != null && productsById.edited_product.productWeight != null ? JSON.parse(productsById.edited_product.productWeight)['unit'] == "lb" ? true : false : false}>lb</option>
                                                <option value="oz" selected={productsById.edited_product != null && productsById.edited_product.productWeight != null ? JSON.parse(productsById.edited_product.productWeight)['unit'] == "oz" ? true : false : false}>oz</option>
                                                <option value="g" selected={productsById.edited_product != null && productsById.edited_product.productWeight != null ? JSON.parse(productsById.edited_product.productWeight)['unit'] == "g" ? true : false : false}>g</option>
                                                <option value="kg" selected={productsById.edited_product != null && productsById.edited_product.productWeight != null ? JSON.parse(productsById.edited_product.productWeight)['unit'] == "kg" ? true : false : false}>kg</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div>
                                      <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div className='w-[100%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                          <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                            <div class="flex items-end">
                                              <div>
                                                <p class="text-sm py-1">Shipping Height</p>
                                                <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={shippingHeightHandle} name="shippingHeightValue" defaultValue={productsById.edited_product != null && productsById.edited_product.shippingHeight != null ? JSON.parse(productsById.edited_product.shippingHeight)['value'] : ""} />
                                              </div>
                                              <div>

                                                <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={shippingHeightHandle} name="shippingHeightUnit">
                                                  <option disabled="" value="true">- - select - -</option>
                                                  <option value="in" selected={productsById.edited_product != null && productsById.edited_product.shippingHeight != null ? JSON.parse(productsById.edited_product.shippingHeight)['unit'] == "in" ? true : false : false} >Inch</option>
                                                  <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.shippingHeight != null ? JSON.parse(productsById.edited_product.shippingHeight)['unit'] == "cm" ? true : false : false}>cm</option>
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                            <div class="flex items-end">
                                              <div>
                                                <p class="text-sm py-1">Shipping Width</p>
                                                <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={shippingWidthHandle} name="shippingWidthValue" defaultValue={productsById.edited_product != null && productsById.edited_product.shippingWidth != null ? JSON.parse(productsById.edited_product.shippingWidth)['value'] : ""} />
                                              </div>
                                              <div>

                                                <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={shippingWidthHandle} name="shippingWidthUnit">
                                                  <option disabled="" value="true">- - select - -</option>
                                                  <option value="in" selected={productsById.edited_product != null && productsById.edited_product.shippingWidth != null ? JSON.parse(productsById.edited_product.shippingWidth)['unit'] == "in" ? true : false : false}>Inch</option>
                                                  <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.shippingWidth != null ? JSON.parse(productsById.edited_product.shippingWidth)['unit'] == "cm" ? true : false : false} >cm</option>
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                            <div class="flex items-end">
                                              <div>
                                                <p class="text-sm py-1">Shipping Length</p>
                                                <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={shippingLengthHandle} name="shippingLengthValue" defaultValue={productsById.edited_product != null && productsById.edited_product.shippingLength != null ? JSON.parse(productsById.edited_product.shippingLength)['value'] : ""} />
                                              </div>
                                              <div>

                                                <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={shippingLengthHandle} name="shippingLengthUnit" >
                                                  <option disabled="" value="true">- - select - -</option>
                                                  <option value="in" selected={productsById.edited_product != null && productsById.edited_product.shippingLength != null ? JSON.parse(productsById.edited_product.shippingLength)['unit'] == "in" ? true : false : false}>Inch</option>
                                                  <option value="cm" selected={productsById.edited_product != null && productsById.edited_product.shippingLength != null ? JSON.parse(productsById.edited_product.shippingLength)['unit'] == "cm" ? true : false : false}>cm</option>
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="w-full sm:w-full md:w-[23%] lg:w-[23%] xl:w-[23%] 2xl:w-[23%]">
                                            <div class="flex items-end">
                                              <div>
                                                <p class="text-sm py-1">Shipping Weight</p>
                                                <input type="number" class="px-4 py-2 w-[100%] border-t border-l border-b border-[#babfc3] rounded-tl-md rounded-bl-md" onChange={shippingWeightHandle} name="shippingWeightValue" defaultValue={productsById.edited_product != null && productsById.edited_product.shippingWeight != null ? JSON.parse(productsById.edited_product.shippingWeight)['value'] : ""} />
                                              </div>
                                              <div>

                                                <select id="countries" class="rounded-tr-md rounded-br-md text-sm w-[100%] p-[0.66rem]" onChange={shippingWeightHandle} name="shippingWeightUnit">
                                                  <option disabled="" value="true">- - select - -</option>
                                                  <option value="lb" selected={productsById.edited_product != null && productsById.edited_product.shippingWeight != null ? JSON.parse(productsById.edited_product.shippingWeight)['unit'] == "lb" ? true : false : false}>lb</option>
                                                  <option value="oz" selected={productsById.edited_product != null && productsById.edited_product.shippingWeight != null ? JSON.parse(productsById.edited_product.shippingWeight)['unit'] == "oz" ? true : false : false}>oz</option>
                                                  <option value="g" selected={productsById.edited_product != null && productsById.edited_product.shippingWeight != null ? JSON.parse(productsById.edited_product.shippingWeight)['unit'] == "g" ? true : false : false}>g</option>
                                                  <option value="kg" selected={productsById.edited_product != null && productsById.edited_product.shippingWeight != null ? JSON.parse(productsById.edited_product.shippingWeight)['unit'] == "kg" ? true : false : false}>kg</option>
                                                </select>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </div>
                                      <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Transit Time Label</p>
                                          <input type="text" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="transitTimeLabel" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.transitTimeLabel != null ? productsById.edited_product.transitTimeLabel : ""} />
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Min Handling Time</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="minHandlingTime" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.minHandlingTime != null ? productsById.edited_product.minHandlingTime : ""} />
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Max Handling Time</p>
                                          <input type="number" class="px-4 py-2 w-[100%] border border-[#babfc3] rounded-md" name="maxHandlingTime" onChange={handleInputChanges} defaultValue={productsById.edited_product != null && productsById.edited_product.maxHandlingTime != null ? productsById.edited_product.maxHandlingTime : ""} />
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                      <div className='w-[100%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Availability</p>
                                          <select id="countries" class="text-gray-900 text-sm rounded-md w-[100%] p-2.5" name="availability" onChange={handleInputChanges}>
                                            <option disabled="" value="true">- - select - -</option>
                                            <option value="in_stock" selected={productsById.edited_product != null && productsById.edited_product.availability != null ? productsById.edited_product.availability == "in_stock" ? true : false : false}>in_stock</option>
                                            <option value="out_of_stock" selected={productsById.edited_product != null && productsById.edited_product.availability != null ? productsById.edited_product.availability == "out_of_stock" ? true : false : false}>out_of_stock</option>
                                            <option value="preorder" selected={productsById.edited_product != null && productsById.edited_product.availability != null ? productsById.edited_product.availability == "preorder" ? true : false : false}>preorder</option>
                                            <option value="backorder" selected={productsById.edited_product != null && productsById.edited_product.availability != null ? productsById.edited_product.availability == "backorder" ? true : false : false}>backorder</option>
                                          </select>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Availability Date</p>
                                          <div class="flex items-center"><input onChange={availabilityDateHandle} className='w-full' type="date" defaultValue={productsById.edited_product != null && productsById.edited_product.availabilityDate != null ? productsById.edited_product.availabilityDate.split("T")[0] : ""} /></div>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Expiration Date</p>
                                          <div class="flex items-center"><input onChange={expirationDateHandle} className='w-full' type="date" defaultValue={productsById.edited_product != null && productsById.edited_product.expirationDate != null ? productsById.edited_product.expirationDate.split("T")[0] : ""} /></div>
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                      <div className='w-[100%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%]">
                                          <p class="text-sm py-1">Sale Price Effective Date Start</p>
                                          <div class="flex items-center"><input onChange={salePriceEffectiveDateHandle} name="start" className='w-full' type="date" defaultValue={productsById.edited_product != null && productsById.edited_product.salePriceEffectiveDate != null ? productsById.edited_product.salePriceEffectiveDate.split("/")[0] : ""} /></div>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[40%] lg:w-[40%] xl:w-[40%] 2xl:w-[40%]">
                                          <p class="text-sm py-1">Sale Price Effective Date End</p>
                                          <div class="flex items-center"><input onChange={salePriceEffectiveDateHandle} name="end" className='w-full' type="date" defaultValue={productsById.edited_product != null && productsById.edited_product.salePriceEffectiveDate != null ? productsById.edited_product.salePriceEffectiveDate.split("/")[1] : ""} /></div>
                                        </div>
                                      </div>
                                    </div>
                                    <Divider style={{ marginTop: '15px', marginBottom: '10px' }} />
                                    <div className='flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                      <div className='w-[100%] flex items-center justify-between flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Energy Efficiency Class</p>
                                          <select id="countries" class="text-gray-900 text-sm rounded-md w-[100%] p-2.5" onChange={handleInputChanges} name="energyEfficiencyClass">
                                            <option disabled="" value="true">- - select - -</option>
                                            <option value="A+++" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "A+++" ? true : false : false}>A+++</option>
                                            <option value="A++" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "A++" ? true : false : false}>A++</option>
                                            <option value="A+" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "A+" ? true : false : false}>A+</option>
                                            <option value="A" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "A" ? true : false : false}>A</option>
                                            <option value="B" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "B" ? true : false : false}>B</option>
                                            <option value="C" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "C" ? true : false : false}>C</option>
                                            <option value="D" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "D" ? true : false : false}>D</option>
                                            <option value="E" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "E" ? true : false : false}>E</option>
                                            <option value="F" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "F" ? true : false : false}>F</option>
                                            <option value="G" selected={productsById.edited_product != null && productsById.edited_product.energyEfficiencyClass != null ? productsById.edited_product.energyEfficiencyClass == "G" ? true : false : false}>G</option>
                                          </select>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Min Energy Efficiency Class</p>
                                          <select id="countries" class="text-gray-900 text-sm rounded-md w-[100%] p-2.5" onChange={handleInputChanges}
                                            name="minEnergyEfficiencyClass">
                                            <option disabled="" value="true">- - select - -</option>
                                            <option value="A+++" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "A+++" ? true : false : false}>A+++</option>
                                            <option value="A++" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "A++" ? true : false : false}>A++</option>
                                            <option value="A+" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "A+" ? true : false : false}>A+</option>
                                            <option value="A" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "A" ? true : false : false}>A</option>
                                            <option value="B" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "B" ? true : false : false}>B</option>
                                            <option value="C" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "C" ? true : false : false}>C</option>
                                            <option value="D" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "D" ? true : false : false}>D</option>
                                            <option value="E" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "E" ? true : false : false}>E</option>
                                            <option value="F" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "F" ? true : false : false}>F</option>
                                            <option value="G" selected={productsById.edited_product != null && productsById.edited_product.minEnergyEfficiencyClass != null ? productsById.edited_product.minEnergyEfficiencyClass == "G" ? true : false : false}>G</option>
                                          </select>
                                        </div>
                                        <div class="w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]">
                                          <p class="text-sm py-1">Max Energy Efficiency Class</p>
                                          <select id="countries" class="text-gray-900 text-sm rounded-md w-[100%] p-2.5" onChange={handleInputChanges}
                                            name="maxEnergyEfficiencyClass">
                                            <option disabled="" value="true">- - select - -</option>
                                            <option value="A+++" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "A+++" ? true : false : false}>A+++</option>
                                            <option value="A++" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "A++" ? true : false : false}>A++</option>
                                            <option value="A+" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "A+" ? true : false : false}>A+</option>
                                            <option value="A" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "A" ? true : false : false}>A</option>
                                            <option value="B" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "B" ? true : false : false}>B</option>
                                            <option value="C" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "C" ? true : false : false}>C</option>
                                            <option value="D" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "D" ? true : false : false}>D</option>
                                            <option value="E" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "E" ? true : false : false}>E</option>
                                            <option value="F" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "F" ? true : false : false}>F</option>
                                            <option value="G" selected={productsById.edited_product != null && productsById.edited_product.maxEnergyEfficiencyClass != null ? productsById.edited_product.maxEnergyEfficiencyClass == "G" ? true : false : false}>G</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* ***************Shipping Tab**************** */}
                              <div className='flex justify-between mt-3 mb-8 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                                <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                                  <p class='text-md font-medium'>Product Shipping</p>
                                  <span className='text-sm'>These attributes let you provide shipping speed and cost for a product. Use these attributes when the account shipping settings for your product are not defined in Merchant Center or when you need to override the shipping settings that you set up in Merchant Center. <a className="text-blue-600" target='_blank' href='https://support.google.com/merchants/answer/6324484?hl=en&ref_topic=6324338&sjid=1831948374862338023-EU'>Learn More</a></span>
                                  <VideoModal margin='0 0 10px 0' title='Product Shipping - Must Watch' videoSrc='https://www.youtube.com/embed/-TqkKIRDtKE' />
                                </div>
                                <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%]'>
                                  <div className=' bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                                    <div className='items-center justify-between'>
                                      {shippingValuePriceError && <div className="flex">
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
                                        <span style={{ color: "rgba(215, 44, 13, 1)" }} class="ml-2 block sm:inline text-base">
                                          Price is required for Shipping
                                        </span>
                                      </div>}
                                    </div>
                                    <div className='items-center justify-between'>
                                      <div className="flex items-center w-full">
                                        <div className="w-full mr-2">
                                          <p class="text-sm py-1">Price</p>
                                          <input
                                            placeholder=''
                                            name="price"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).price ? JSON.parse(productsById.edited_product.shipping).price.value : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.price ? p_inputs.shipping.price.value : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'price': { value: e.target.value, currency: feed.currency } } }));
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'country': feed.country } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { price, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                                setP_inputs(values => {
                                                  const { shipping: { country, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="number"
                                            class="mr-2 input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                        <div className="w-full">
                                          <p class="text-sm py-1">Region</p>
                                          <input
                                            placeholder=''
                                            name="region"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).region ? JSON.parse(productsById.edited_product.shipping).region : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.region ? p_inputs.shipping.region : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'region': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { region, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="text"
                                            class="input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center w-full">
                                        <div className="w-full mr-2">
                                          <p class="text-sm py-1">Service</p>
                                          <input
                                            placeholder=''
                                            name="service"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).service ? JSON.parse(productsById.edited_product.shipping).service : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.service ? p_inputs.shipping.service : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'service': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { service, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="text"
                                            class="mr-2 input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                        <div className="w-full">
                                          <p class="text-sm py-1">Location ID</p>
                                          <input
                                            placeholder=''
                                            name="locationId"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).locationId ? JSON.parse(productsById.edited_product.shipping).locationId : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.locationId ? p_inputs.shipping.locationId : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'locationId': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { locationId, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="text"
                                            class="input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center w-full">
                                        <div className="w-full mr-2">
                                          <p class="text-sm py-1">Location Group Name</p>
                                          <input
                                            placeholder=''
                                            name="locationGroupName"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).locationGroupName ? JSON.parse(productsById.edited_product.shipping).locationGroupName : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.locationGroupName ? p_inputs.shipping.locationGroupName : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'locationGroupName': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { locationGroupName, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="text"
                                            class="mr-2 input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                        <div className="w-full">
                                          <p class="text-sm py-1">Postal Code</p>
                                          <input
                                            placeholder=''
                                            name="postalCode"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).postalCode ? JSON.parse(productsById.edited_product.shipping).postalCode : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.postalCode ? p_inputs.shipping.postalCode : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'postalCode': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { postalCode, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="text"
                                            class="input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center w-full">
                                        <div className="w-full mr-2">
                                          <p class="text-sm py-1">Min Handling Time</p>
                                          <input
                                            placeholder=''
                                            name="minHandlingTime"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).minHandlingTime ? JSON.parse(productsById.edited_product.shipping).minHandlingTime : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.minHandlingTime ? p_inputs.shipping.minHandlingTime : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'minHandlingTime': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { minHandlingTime, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="number"
                                            class="mr-2 input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                        <div className="w-full">
                                          <p class="text-sm py-1">Max Handling Time</p>
                                          <input
                                            placeholder=''
                                            name="maxHandlingTime"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).maxHandlingTime ? JSON.parse(productsById.edited_product.shipping).maxHandlingTime : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.maxHandlingTime ? p_inputs.shipping.maxHandlingTime : null}
                                            onChange={(e) => {
                                              if (e.target.value.length) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'maxHandlingTime': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { maxHandlingTime, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="number"
                                            class="input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex items-center w-full">
                                        <div className="w-full mr-2">
                                          <p class="text-sm py-1">Min Transit Time</p>
                                          <input
                                            placeholder=''
                                            name="minTransitTime"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).minTransitTime ? JSON.parse(productsById.edited_product.shipping).minTransitTime : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.minTransitTime ? p_inputs.shipping.minTransitTime : null}
                                            onChange={(e) => {
                                              if (e.target.value.length > 0) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'minTransitTime': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { minTransitTime, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="number"
                                            class="mr-2 input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                        <div className="w-full">
                                          <p class="text-sm py-1">Max Transit Time</p>
                                          <input
                                            placeholder=''
                                            name="maxTransitTime"
                                            defaultValue={productsById.edited_product && productsById.edited_product.shipping ? JSON.parse(productsById.edited_product.shipping).maxTransitTime ? JSON.parse(productsById.edited_product.shipping).maxTransitTime : null : null}
                                            value={p_inputs.shipping && p_inputs.shipping.maxTransitTime ? p_inputs.shipping.maxTransitTime : null}
                                            onChange={(e) => {
                                              if (e.target.value.length) {
                                                setP_inputs(values => ({ ...values, ['shipping']: { ...values.shipping, 'maxTransitTime': e.target.value } }));
                                              } else {
                                                setP_inputs(values => {
                                                  const { shipping: { maxTransitTime, ...rest }, ...restValues } = values; // Using destructuring to omit the 'price' key
                                                  return { ...restValues, shipping: { ...rest } };
                                                });
                                              }
                                              e.target.value.length > 0 && !showBanner ? setShowBanner(true) : null;
                                            }}
                                            type="number"
                                            class="input-focus-none mb-2 px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </>
                          ) : null : null}
                          <div className='flex justify-between' >
                            <Snackbar
                              open={open}
                              autoHideDuration={3000}
                              onClose={handleClose}
                              message="Product Updated"
                              action={action}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                              }}
                            />
                          </div>
                        </div>
                      </>
                    </>
                    :
                    <>
                      <div className='flex flex-wrap items-center justify-between mt-4'>
                        <div>
                          <div className='flex items-center'>
                            <div className="">
                              <Skeleton variant="rounded" style={{ width: '8vw', height: '12vh' }} />
                            </div>
                            <div className='flex flex-col items-start ml-2'>
                              <div className="mb-2">
                                <Skeleton variant="rounded" style={{ width: '19vw', height: '4vh' }} />
                              </div>
                              <div>
                                <Skeleton variant="rounded" style={{ width: '13vw', height: '4vh' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="rounded-md flex items-center" role="group">
                          <div className="mr-2">
                            <Skeleton variant="rounded" style={{ width: '8vw', height: '6vh' }} />
                          </div>
                          <div className="mr-2">
                            <Skeleton variant="rounded" style={{ width: '8vw', height: '6vh' }} />
                          </div>
                          <div className="mr-2">
                            <Skeleton variant="rounded" style={{ width: '8vw', height: '6vh' }} />
                          </div>
                          <div>
                            <Skeleton variant="rounded" style={{ width: '8vw', height: '6vh' }} />
                          </div>
                        </div>
                      </div>
                      <>
                        <div className='mt-4'>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] '>
                              <p class='mb-2'><Skeleton variant="rounded" style={{ width: '8vw', height: '3vh' }} /></p>
                              <div className='mb-2'><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                              <div className=''><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                            </div>
                            <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                              <Skeleton variant="rounded" style={{ width: '100%', height: '8vh' }} />
                            </div>
                          </div>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                              <p class='mb-2'><Skeleton variant="rounded" style={{ width: '8vw', height: '3vh' }} /></p>
                              <div className='mb-2'><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                              <div className=''><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                            </div>
                            <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                              <Skeleton variant="rounded" style={{ width: '100%', height: '8vh' }} />
                            </div>
                          </div>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                              <p class='mb-2'><Skeleton variant="rounded" style={{ width: '8vw', height: '3vh' }} /></p>
                              <div className='mb-2'><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                              <div className=''><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                            </div>
                            <div className='w-full sm:w-full md:w-[85%] lg:w-[85%] xl:w-[85%] 2xl:w-[85%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                              <Skeleton variant="rounded" style={{ width: '100%', height: '8vh' }} />
                            </div>
                          </div>
                          <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                            <div className='pr-2 w-full sm:w-full md:w-[50%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                              <p class='mb-2'><Skeleton variant="rounded" style={{ width: '8vw', height: '3vh' }} /></p>
                              <div className='mb-2'><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                              <div className=''><Skeleton variant="rounded" style={{ width: '30vw', height: '2vh' }} /></div>
                            </div>
                          </div>
                        </div>
                      </>
                    </>
                  }
                </TabPanel>
                <TabPanel style={{ margin: '10px' }} value="2">
                  {productsById != '' ?
                    <>
                      <div className='flex flex-wrap items-center justify-between mt-4'>
                        <div className='flex items-center'>
                          <div>
                            <img className='w-[5rem]' src={`${productsById.image}`} />
                          </div>
                          <div className='flex flex-col items-start ml-2'>
                            <h1 class='text-lg font-semibold p-1'>{productsById.title}</h1>
                            <div className='flex items-center  p-1'>Product Score: {productsById.score} / 100 {productsById.score < 50 ? <span class="bg-[#ffd79d] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : productsById.score > 50 && productsById.score <= 70 ? <span class="bg-[#fed3d1] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : productsById.score > 70 && productsById.score <= 90 ? <span class="bg-[#aee9d1] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : <span class="bg-[#a4e8f2] ml-2 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>} </div>
                            <VideoModal margin='0 0 10px 0' title='Do You Want To Improve Score?' videoSrc='https://www.youtube.com/embed/E1iTMSwOjo8' />
                          </div>
                        </div>
                        <div class="rounded-md" role="group">
                          <button onClick={handleDetailTab} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-l-lg border hover:bg-white text-black">
                            <ConstructionIcon style={{ fontSize: '20px', marginRight: '2px', color: '#5c5f62' }} />
                            Improve Score
                          </button>
                          <a href={editShopifyLink} target="_blank"><button
                            type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent border hover:bg-white text-black">
                            <EditIcon style={{ fontSize: '20px', marginRight: '5px', color: '#5c5f62' }} />
                            Edit In Shopify
                          </button></a>
                          <a href={viewProductLink} target="_blank"><button
                            type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent border hover:bg-white text-black">
                            <RemoveRedEyeIcon style={{ fontSize: '20px', marginRight: '5px', color: '#5c5f62' }} />
                            View Product
                          </button></a>
                          <button onClick={() => setShowSyncFromShopifyModel(!showSyncFromShopifyModel)}
                            type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-r-md border hover:bg-white text-black">
                            <SyncIcon style={{ fontSize: '20px', marginRight: '5px', color: '#5c5f62' }} />
                            Sync From Shopify
                          </button>
                        </div>
                      </div>

                      <>
                        <h3 className='mt-4 text-2xl font-normal pt-2 pb-2 pl-1'>Scores</h3>
                        <div className='w-[100%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                          <div className='p-2'>
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><TitleIcon style={{ fontSize: '35px', marginRight: '2px', color: '#636363' }} />Title</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />The title should be maxed at 150 chars. The minimum recommended length is 70 chars (Ideal product title length: 75 – 100 characters)</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.title == 5 ? 25 : score.title == 10 ? 50 : score.title == 15 ? 75 : 100}/100</p>
                                {score.title == 5 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : score.title == 10 ? <span class="ml-2 bg-[#fed3d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : score.title == 15 ? <span class="ml-2 bg-[#aee9d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}

                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><DescriptionIcon style={{ fontSize: '30px', marginRight: '8px', color: '#e97b16' }} />Description</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Only a few HTML tags are allowed in the description.</span>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />The description should ideally be between 2000 and 5000 characters. The minimum recommended length is 750 characters.</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.description == 5 ? <span class="ml-2 bg-[#fed3d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"></span> : score.description == 10 ? 50 : score.description == 15 ? 75 : 100}/100</p>
                                {score.description == 5 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : score.description == 10 ? <span class="ml-2 bg-[#fed3d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Okay</span> : score.description == 15 ? <span class="ml-2 bg-[#aee9d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Good</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}

                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><GoogleIcon style={{ fontSize: '30px', marginRight: '8px', color: '#3e6fd4' }} />Google Product Category</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Google Product Category is a recommended field.</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.Category_id == 0 ? 0 : 100}/100</p>
                                {score.Category_id == 0 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}

                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><InventoryIcon style={{ fontSize: '30px', marginRight: '8px', color: '#709109' }} />Product Types</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Product type is a recommended field.</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.productTypes == 0 ? 0 : 100}/100</p>
                                {score.productTypes == 0 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}
                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><DiscountIcon style={{ fontSize: '30px', marginRight: '8px', color: '#f2404e' }} />Promotion Ids</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Promotions are recommended to increase click-through rate.</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.promotionIds == 0 ? 0 : 100}/100</p>
                                {score.promotionIds == 0 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}

                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><PhotoIcon style={{ fontSize: '30px', marginRight: '8px', color: '#eed604' }} />Images</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Both too small and too big images will cause an error on your Google Merchant Center account, and your listing will not go live. Pay the highest attention to the size requirements that Google provides:</span>
                                <div className='flex items-center ml-3 mt-2'>
                                  <p>Learn More for further details</p>
                                  <a className='ml-2' target='_blank' href='https://support.google.com/merchants/answer/6324350?hl=en'>
                                    <OpenInNewIcon style={{ color: '#1a73e8', fontSize: '20px' }} />
                                  </a>
                                </div>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.image == 0 ? 0 : 100}/100</p>
                                {score.image == 0 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}
                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><GppGoodIcon style={{ fontSize: '30px', marginRight: '8px', color: '#20406a' }} />GTIN</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Required (for all new products with a GTIN assigned by the manufacturer) and optional (strongly recommended) for all other products.</span>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />GTIN should not include dashes and spaces.</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.barcode == 0 ? 0 : 100}/100</p>
                                {score.barcode == 0 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}
                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                            <div className='flex justify-between items-center'>
                              <div>
                                <p className='text-xl pb-2 pt-2'><QrCodeIcon style={{ fontSize: '30px', marginRight: '8px', color: '#f29111' }} />Brand</p>
                                <span className='text-[#d72c0d] text-sm flex items-center pl-2'><ErrorIcon style={{ fontSize: '19px', marginRight: '10px' }} />Brand is a recommended field.</span>
                              </div>
                              <div className='flex items-center'>
                                <p>{score.brand == 0 ? 0 : 100}/100</p>
                                {score.brand == 0 ? <span class="ml-2 bg-[#ffd79d] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Poor</span> : <span class="ml-2 bg-[#a4e8f2] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Excellent</span>}
                              </div>
                            </div>
                            <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
                          </div>
                        </div>

                      </>
                    </>
                    : " "}
                </TabPanel>
                <TabPanel style={{ margin: '10px' }} value="3">
                  <div className='flex justify-between mt-3 flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap'>
                    <div className='pr-2 w-full sm:w-full md:w-[30%] lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                      <p class='text-md font-medium'>Upload Custom Images</p>
                      <br />
                      <span className='text-sm'>This is our top-of-the Line feature. Images you upload here will only be updated in Google Merchant Centre, and the images you delete will not be deleted from your store's products.</span>
                      <br />
                      <br />
                      <span className='text-sm'>Google Merchant Centre allows up to 11 images to be uploaded.</span>
                      <br />
                      <br />
                      <div className='flex items-center'>
                        <p>Learn more for further details.</p>
                        <a className='ml-2' target='_blank' href='https://support.google.com/merchants/answer/6324350?hl=en'>
                          <OpenInNewIcon style={{ color: '#1a73e8', fontSize: '20px' }} />
                        </a>
                      </div>
                      <br />
                      <p><strong className='font-medium text-base text-red-600'>Note: </strong> When you opt for this feature, we will host images inside your store using draft products. Remember, don't delete those products.</p>

                    </div>
                    <div className='w-[100%] bg-white rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)' }}>
                      <div>
                        <>
                          <div className='flex flex-wrap justify-end items-end'>
                            <VideoModal margin='0 10px 5px 0' title='Tutorial For Customize Image' videoSrc='https://www.youtube.com/embed/NPXNCmDnPDg' />
                            <label for="dropzone-file" class="inline-flex cursor-pointer items-center py-2 px-2 text-sm font-medium bg-transparent rounded-l-lg border hover:bg-gray-100 text-black">
                              <BackupIcon style={{ fontSize: '20px', marginRight: '2px', color: '#008060' }} />
                              <button onClick={handleUploadImageClick}>Upload an image</button>
                              <input onChange={onChangePicture} multiple id="dropzone-file" type="file" class="hidden" style={{ display: 'none' }} ref={fileInputRef} />
                            </label>
                            <button disabled={items.length === 11} onClick={handleUploadFromUrlClick} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent border hover:bg-gray-100 text-black">
                              <CloudSyncIcon style={{ fontSize: '20px', marginRight: '2px', color: '#047fcb' }} />
                              Enter your image URL.
                            </button>
                            <button onClick={deleteItem} type="button" class="inline-flex items-center py-2 px-2 text-sm font-medium bg-transparent rounded-r-lg border hover:bg-gray-100 text-black">
                              <DeleteIcon style={{ fontSize: '20px', marginRight: '2px', color: '#d82c0d' }} />
                              Delete
                            </button>
                          </div>
                        </>
                        <>
                          <p className='ml-4 font-medium text-lg'>Feature Image</p>
                          <div cl-assName='flex items-center pl-2 pr-2 pb-2'>
                            <div>

                              <SortableList
                                onSortEnd={onSortEnd}
                                className={classes.root}
                                draggedItemClassName={classes.dragged}
                              >
                                {items.slice(0, 11).map(({ image }, index) => (
                                  <SortableItem key={name}>
                                    <div className={index === 0 ? 'classOfFirstEl' : 'otherClass'}>

                                      <div className='relative'>

                                        <img id='img'
                                          // className={classes.image}
                                          alt={"image" + index}
                                          src={image}
                                          imgProps={{ draggable: false }}
                                        />
                                        <Checkbox
                                          onChange={() => handleChecked(index)}
                                          color="primary"
                                          size="small"
                                          checked={checkedItem.indexOf(index) != -1 ? true : false}
                                          value={index}
                                          style={{ position: 'absolute', top: '0', left: '0', color: '#454545' }}
                                        />
                                      </div>
                                    </div>
                                  </SortableItem>
                                ))}
                              </SortableList>
                            </div>
                          </div>
                        </>
                      </div>
                      <div className='flex flex-wrap justify-end items-end mt-4'>
                        <Button variant='outlined' style={{ marginRight: '10px' }} onClick={refreshPage}>Cancel</Button>
                        {loading == false ?
                          <Button variant='contained' onClick={uploadImagesOnDb} style={{ color: 'white', background: '#008060' }} disabled={items.length != 0 ? false : true} >Upload In Merchant Center</Button>
                          :
                          <LoadingButton loading={true} variant="contained" disabled color="success" > <span>Upload In Merchant Center</span> </LoadingButton>
                        }
                      </div>
                    </div>
                  </div>
                  <div>
                    <Snackbar
                      open={open}
                      autoHideDuration={2000}
                      onClose={handleClose}
                      message="Images Updated"
                      action={action}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                    />
                  </div>
                  <div>
                    <Snackbar
                      open={limitToast}
                      autoHideDuration={5000}
                      onClose={handleClose}
                      message="you can't add more than 11 images"
                      action={action}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                    />
                  </div>
                </TabPanel>
              </TabContext>
            </div>
          </>
        </div>
        <>
          {/* save bar discard modal  */}
          {DiscardModal ? (
            <>
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                  className="fixed inset-0 w-full h-full bg-black opacity-40"
                  onClick={() => setDiscardModal(false)}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                  <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                    <div className="">
                      <div className='flex items-center p-2'>
                        <ReportProblemIcon style={{ color: '#d82c0d' }} />
                        <p className='text-lg font-medium ml-2'>Discard all unsaved changes.</p>
                        <CloseIcon onClick={() => setDiscardModal(false)} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                      </div>
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <div className='p-4'>
                        <p className='text-sm font-normal' >If you discard changes, you’ll delete any edits you've made since you last saved.</p>
                      </div>
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <div className='flex justify-end'>
                        <Button onClick={() => setDiscardModal(false)} style={{ marginRight: '10px' }} variant="outlined">Continue</Button>
                        <Button onClick={() => { setDiscardModal(false); setShowBanner(false) }} style={{ background: "#d82c0d", color: "white" }}>Discard</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
        {/* upload image from ulr modal */}

        <>
          {showUploadModal ? (
            <>
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                  className="fixed inset-0 w-full h-full bg-black opacity-40"
                  onClick={() => setShowUploadModal(false)}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                  <div className="relative w-full max-w-2xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                    <div className="">
                      <div className='flex items-center p-2'>
                        <UploadFileIcon style={{ color: '#d82c0d' }} />
                        <p className='text-lg font-medium ml-2'>Upolad an image from url</p>
                        <CloseIcon onClick={() => setShowUploadModal(false)} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                      </div>
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <div className='p-4'>
                        <div class="rounded-md w-[100%]">
                          <p className='text-sm py-1'>Enter Your Image Url</p>
                          <input value={valueInput} onChange={(e) => { setValueInput(e.target.value) }} type="text" class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                        </div>
                      </div>
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <div className='flex justify-end'>
                        <Button onClick={() => setShowUploadModal(false)} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                        <Button disabled={!valueInput} onClick={handelUpolad} style={{ background: "#008060" }} variant="contained">Upload</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>

        {/* sync from shopify modal */}

        <>
          {showSyncFromShopifyModel ? (
            <>
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                  className="fixed inset-0 w-full h-full bg-black opacity-40"
                  onClick={handleSyncShopifyCancel}
                ></div>
                <div className="flex items-center min-h-screen px-4 py-8">
                  <div className="relative w-[66%] p-4 mx-auto bg-white rounded-lg shadow-lg">
                    <div className="">
                      <div className='flex items-center p-2'>
                        <p className='text-lg font-medium ml-2'>Sync From Shopify</p>
                        <VideoModal margin='0 0 0 10px' title='Tutorial For Shopify Sync' videoSrc='https://www.youtube.com/embed/sWALzgmmkYM' />
                        <CloseIcon onClick={handleSyncShopifyCancel} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                      </div>
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <div className='p-4'>
                        <div className='p-2 rounded-md'
                          style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)" }}
                        >
                          <div className='flex justify-between items-center'>
                            <FormControlLabel name="title" onChange={handleShopifySyncInputs} control={<Checkbox checked={syncFromShopifyInputs && syncFromShopifyInputs.title ? syncFromShopifyInputs.title : false} style={{ color: '#008060' }} />} label="Title" />
                            <FormControlLabel name="description" onChange={handleShopifySyncInputs} labelPlacement="start" control={<Checkbox checked={syncFromShopifyInputs && syncFromShopifyInputs.description ? syncFromShopifyInputs.description : false} style={{ color: '#008060' }} />} label="Description" />
                          </div>
                          <div className='flex justify-between items-center'>
                            {/* <FormControlLabel name="seoTitle" onChange={handleShopifySyncInputs} labelPlacement="start" control={<Checkbox checked={syncFromShopifyInputs && syncFromShopifyInputs.seoTitle ? syncFromShopifyInputs.seoTitle : false} style={{ color: '#008060' }} />} label="Seo Title" /> */}
                            {/* <FormControlLabel name="seoDescription" onChange={handleShopifySyncInputs} labelPlacement="start" control={<Checkbox checked={syncFromShopifyInputs && syncFromShopifyInputs.seoDescription ? syncFromShopifyInputs.seoDescription : false} style={{ color: '#008060' }} />} label="Seo Description" /> */}
                          </div>
                          <div className='flex justify-between items-center'>
                            <FormControlLabel name="productImages" onChange={handleShopifySyncInputs} control={<Checkbox checked={syncFromShopifyInputs && syncFromShopifyInputs.productImages ? syncFromShopifyInputs.productImages : false} style={{ color: '#008060' }} />} label="Product Images" />
                            <FormControlLabel name="productPrice" onChange={handleShopifySyncInputs} labelPlacement="start" control={<Checkbox checked={syncFromShopifyInputs && syncFromShopifyInputs.productPrice ? syncFromShopifyInputs.productPrice : false} style={{ color: '#008060' }} />} label="Product Price" />
                          </div>
                        </div>
                        <div className='p-4 rounded-md mt-4'
                          style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)" }}
                        >
                          <div className="flex justify-between items-center">
                            <p>Metafields settings is {metafieldsActive ? 'Activated' : 'Deactivated'}.</p>
                            <Button onClick={handleMetafieldsClick} style={{ background: "#008060", textTransform: 'capitalize' }} variant="contained">{metafieldsActive ? 'Deactivate' : 'Activate'}</Button>
                          </div>
                        </div>
                        {metafieldsActive ? (
                          <div className='p-4 rounded-md mt-4'
                            style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)" }}
                          >

                            <>
                              <p>Please choose which metafields you would like to sync from your store along with product information.</p>
                              <RadioGroup
                                defaultValue="none"
                                value={metafieldsResourceValue}
                                onChange={handleMetafieldsResourceChange}
                                row
                                style={{ justifyContent: 'space-between' }}
                              >
                                <FormControlLabel value="product" control={<Radio style={{ color: '#008060' }} />} label="Product" />
                                <FormControlLabel value="variant" control={<Radio style={{ color: '#008060' }} />} label="Variant" />
                                <FormControlLabel value="none" control={<Radio style={{ color: '#008060' }} />} label="None" />
                              </RadioGroup>
                              {metafieldsResourceValue != 'none' &&
                                <>
                                  {loadingMetafields && <CircularProgress style={{ color: "#008060", marginRight: "10px", marginTop: "10%", marginLeft: "40%" }} size={30} />}
                                  {!loadingMetafields && <div>
                                    {metafieldsValues.map((value, index) => (
                                      <div key={0} className="flex mt-2 justify-between items-center">
                                        <div className='mr-2 w-[40%]'>
                                          <select
                                            id="metafields"
                                            name={index}
                                            onChange={handleMetafieldsInput}
                                            class="border-2 border-[#008060] text-gray-900 text-sm rounded-md focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                                          >
                                            <option disabled selected value>
                                              - - select - -
                                            </option>
                                            {selectedResourceMetafields.map((value, index) => (
                                              <option value={value.value}>{value.label}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className='w-[40%]'>
                                          <select
                                            id="googleFields"
                                            name={index}
                                            onChange={handleMetafieldsInput}
                                            class="border-2 border-[#008060] text-gray-900 text-sm rounded-md focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
                                          >
                                            <option disabled selected value> - - select - - </option>
                                            {bulkEditOptionsArray.map((value, index) => (
                                              <option value={value.value}>{value.label}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    ))}
                                    <div className='flex justify-between items-center mt-2'>
                                      <Button style={{ display: 'flex', alignItems: 'center' }} onClick={() => { setMetafieldsValues(values => ([...values, ''])) }}><AddCircleOutlineIcon style={{ color: '#008060', marginRight: '5px' }} /> ADD </Button>
                                      <Button style={{ display: 'flex', alignItems: 'center' }} disabled={metafieldsValues.length <= 1} onClick={() => {
                                        setMetafieldsValues(metafieldsValues.filter((value, index) => index != metafieldsValues.length - 1));
                                        setSyncFromShopifyInputs(values => ({ ...values, ['metafields']: values.metafields.filter((value, index) => index != values.metafields.length - 1) }));
                                      }}><RemoveCircleOutlineIcon style={{ color: '#d72c0d', marginRight: '5px' }} /> Remove</Button>
                                    </div>
                                  </div>}
                                </>
                              }
                            </>
                          </div>
                        ) : null}
                        {showMetafieldUpgradeMessage &&
                          <div className='p-4 rounded-md mt-4'
                            style={{ boxShadow: "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)" }}>
                            <p>Your Current Plan does not have this feature. Please Upgrade to use this feature.</p>
                            <Button onClick={handleUpgradeNow}>Upgrade</Button>
                          </div>}
                      </div>
                      {syncFromShopifyErrors.length > 0 &&
                        <>
                          {syncFromShopifyErrors.map((value, index) => (
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
                              <span style={{ color: "rgba(215, 44, 13, 1)" }} class="ml-2 block sm:inline text-base">
                                {value}
                              </span>
                            </div>
                          ))}
                        </>
                      }
                      <Divider style={{ margin: '10px 0 10px 0' }} />
                      <div className='flex justify-end'>
                        <Button onClick={handleSyncShopifyCancel} style={{ marginRight: '10px' }} variant="outlined">Cancel</Button>
                        <Button onClick={syncDataFromShopify} disabled={syncFromShopifyInputs.title || syncFromShopifyInputs.description || syncFromShopifyInputs.productImages || syncFromShopifyInputs.productPrice || syncFromShopifyInputs.seoTitle || syncFromShopifyInputs.seoDescription || syncFromShopifyInputs.variantImage || syncFromShopifyInputs.pAdditionalImages || syncFromShopifyInputs.metafields.length > 0 || syncRequestProcessing ? false : true} className='bg-[#008060]' variant="contained">{syncRequestProcessing ? <CircularProgress color="inherit" size={25} /> : "Apply"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>

        <>
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

      </ThemeProvider>
    </>
  )
}

export default Detail
