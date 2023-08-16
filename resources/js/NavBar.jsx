import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
// import Box from '@mui/material/Box';
import axioshttp from './axioshttp';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import HelpIcon from '@mui/icons-material/Help';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import WidgetsIcon from '@mui/icons-material/Widgets';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RuleIcon from '@mui/icons-material/Rule';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import './pages/promotionFeed/style.scss';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Tooltip from '@mui/material/Tooltip';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { Fullscreen } from "@shopify/app-bridge/actions";


const StyledMenu = styled((props) => (


  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


export default function NavBar () {

  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const open1 = Boolean(anchorEl1);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const navigate = useNavigate();
  const fullscreen = Fullscreen.create(app);
  const [billingStatus, setbillingStatus] = React.useState();
  const dashboardOnClick = useCallback(() => navigate('/dashboard', { replace: true }), [navigate]);
  const generalSettingOnClick = useCallback(() => navigate('/GeneralSetting/' + null, { replace: true }), [navigate]);
  const conversionOnClick = () => {
    window.open('https://bit.ly/Efeed2EAds')
  }
  const promotionsOnClick = useCallback(() => navigate('/Promotion', { replace: true }), [navigate]);
  const helpCenterOnClick = useCallback(() => navigate('/HelpCenter', { replace: true }), [navigate]);
  const pricingOnClick = useCallback(() => navigate('/Pricing', { replace: true }), [navigate]);
  const tutorialsOnClick = useCallback(() => navigate('/Tutorials', { replace: true }), [navigate]);
  const notificationsOnClick = useCallback(() => navigate('/Notifications', { replace: true }), [navigate]);
  const productReviewOnClick = useCallback(() => navigate('/ProductReview', { replace: true }), [navigate]);
  const faqsOnClick = useCallback(() => navigate('/FAQS', { replace: true }), [navigate]);
  const featureRequestOnClick = useCallback(() => navigate('/Request', { replace: true }), [navigate]);
  const partnerAppsOnClick = useCallback(() => navigate('/PartnerApps', { replace: true }), [navigate]);
  const bookACallOnClick = useCallback(() => navigate('/BookCall', { replace: true }), [navigate]);
  const writeAReviewOnClick = useCallback(() => navigate('/WriteReview', { replace: true }), [navigate]);
  const feedRuleClick = useCallback(() => navigate('/Rule', { replace: true }), [navigate]);
  const expertClick = useCallback(() => navigate('/Expert', { replace: true }), [navigate]);
  const auditClick = useCallback(() => navigate('/Audit', { replace: true }), [navigate]);
  const inventoryClick = useCallback(() => navigate('/inventory', { replace: true }), [navigate]);


  ////////////////////////////////////////////////////////////

  useEffect(() => {
    if (document.getElementById('billing_status')) {
      setbillingStatus(document.getElementById('billing_status').getAttribute('data'))
    }
  }, [])

  // full screen 

  const [fullScreen, setFullScreen] = React.useState(false);
  const [toolTip, setToolTip] = React.useState('Enter Full Screen');
  const [countNotifi, setCountNotifi] = React.useState('');

  // Call the `ENTER` action to put the app in full-screen mode
  const EnterFullScreen = () => {
    setFullScreen(true);
    console.log("Full Screen");
    setToolTip("Exit Full Screen")
    fullscreen.dispatch(Fullscreen.Action.ENTER);
  };
  // Call the `EXIT` action to take the app out of full-screen mode
  const ExitFullScreen = () => {
    setFullScreen(false);
    console.log("Small Screen");
    setToolTip("Enter Full Screen")
    fullscreen.dispatch(Fullscreen.Action.EXIT);
  };

  ////////////////////////////////////////////////////////////

  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };
  const handleCloseSelected = () => {
    setSelectedIndex(null);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };


  // const options = [
  //   <MenuItem onClick={() => { expertClick() }} disableRipple>
  //     <GppGoodIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Feed Experts
  //   </MenuItem>,
  //   <MenuItem onClick={() => { tutorialsOnClick() }} disableRipple>
  //     <PlayCircleIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Tutorials
  //   </MenuItem>,
  //   <MenuItem onClick={() => { notificationsOnClick() }} disableRipple>
  //     <NotificationsIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Notifications
  //   </MenuItem>,
  //   <MenuItem onClick={() => { productReviewOnClick() }} disableRipple>
  //     <StarIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Product Reviews
  //   </MenuItem>,
  //   <MenuItem onClick={() => { faqsOnClick() }} disableRipple>
  //     <HelpIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     FAQs
  //   </MenuItem>,
  //   <MenuItem onClick={() => { featureRequestOnClick() }} disableRipple>
  //     <VolunteerActivismIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Feature Requests
  //   </MenuItem>,
  //   <MenuItem onClick={() => { partnerAppsOnClick() }} disableRipple>
  //     <WidgetsIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Partner Apps
  //   </MenuItem>,
  //   <MenuItem disableRipple>
  //     <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'>
  //       <CalendarMonthIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //       Book A Call
  //     </a>
  //   </MenuItem>,
  //   <MenuItem disableRipple>
  //     <a target='_blank' href='https://apps.shopify.com/easyfeed-for-google-shopping-feeds#modal-show=WriteReviewModal&st_campaign=rate-app&st_source=admin&utm_campaign=installed'>
  //       <FavoriteIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //       Write A Review
  //     </a>
  //   </MenuItem>,
  //   <MenuItem onClick={() => { feedRuleClick() }} disableRipple>
  //     <RuleIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     Feed Rule
  //   </MenuItem>,
  //   <MenuItem onClick={() => { auditClick() }} disableRipple>
  //     <PlagiarismIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
  //     GMC Suspension Audit
  //   </MenuItem>
  // ];

  const notificationCount = () => {
    axioshttp.get("product/notification/count").then((response) => {
      setCountNotifi(response.data);
    });
  }
  useEffect(() => {
    notificationCount();
  }, []);

  return (
    <div sx={{ width: '100%' }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction onClick={() => { dashboardOnClick(); handleCloseSelected() }} label="Dashboard" icon={<DashboardIcon style={{ color: '#008060' }} />} />
        <BottomNavigationAction onClick={() => { generalSettingOnClick(); handleCloseSelected() }} label="Settings" icon={<SettingsIcon style={{ color: '#008060' }} />} />
        <BottomNavigationAction onClick={() => { conversionOnClick(); handleCloseSelected() }} label="Google Tag" icon={
          <svg fill='#008060' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="23px"><path d="M 25.494141 4.9980469 C 24.185141 4.9980469 22.89 5.3478594 21.75 6.0058594 C 20.015 7.0078594 18.773859 8.6235937 18.255859 10.558594 C 17.736859 12.493594 18.002047 14.514281 18.998047 16.238281 L 33.005859 41.25 C 34.341859 43.563 36.831859 45.001953 39.505859 45.001953 C 40.814859 45.001953 42.11 44.652141 43.25 43.994141 C 44.985 42.992141 46.226141 41.376406 46.744141 39.441406 C 47.263141 37.506406 46.997953 35.485719 46.001953 33.761719 L 31.994141 8.75 C 30.658141 6.437 28.168141 4.9980469 25.494141 4.9980469 z M 16.070312 13.640625 L 7.0703125 28.640625 C 8.1403125 28.230625 9.29 28 10.5 28 C 15.35 28 19.369688 31.659375 19.929688 36.359375 L 24.089844 29.419922 L 17.269531 17.240234 C 16.619531 16.120234 16.220312 14.900625 16.070312 13.640625 z M 10.5 30 A 7.5 7.5 0 0 0 10.5 45 A 7.5 7.5 0 0 0 10.5 30 z" /></svg>} />
        <BottomNavigationAction onClick={() => { promotionsOnClick(); handleCloseSelected() }} label="Promotions" icon={<RssFeedIcon style={{ color: '#008060' }} />} />
        <BottomNavigationAction onClick={() => { helpCenterOnClick(); handleCloseSelected() }} label="Help Center" icon={<SupportAgentIcon style={{ color: '#008060' }} />} />
        {billingStatus && <BottomNavigationAction onClick={() => { pricingOnClick(); handleCloseSelected() }} label="Pricing" icon={<MonetizationOnIcon style={{ color: '#008060' }} />} />}

        <BottomNavigationAction button
          id="basic-button"
          aria-controls={open1 ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open1 ? 'true' : undefined}
          onClick={handleClick1}
          label="More Options" icon={<ArrowDropDownCircleIcon style={{ color: '#008060' }} />} />
        <div className='flex ml-auto items-center pr-2'>
          <div onClick={notificationsOnClick}>
            <div class="box items-start">
              <svg class="bell" width="7%" viewBox="0 0 21 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <title>Bell_SVG</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="Bell_SVG" fill="#008060">
                    <path w d="M10.5,23 C12.4329966,23 14,21.4329966 14,19.5 C14,17.5670034 12.4329966,16 10.5,16 C8.56700338,16 7,17.5670034 7,19.5 C7,21.4329966 8.56700338,23 10.5,23 Z M8.48610111,19.034 C8.62220942,19.034 8.68975947,19.101 8.68975947,19.236 C8.68975947,19.73 8.87022901,20.156 9.2331845,20.493 C9.57194296,20.852 10.0024485,21.032 10.5005041,21.032 C10.6356042,21.032 10.7041625,21.099 10.7041625,21.234 C10.7041625,21.368 10.6356042,21.436 10.5005041,21.436 C9.88952902,21.436 9.3682846,21.211 8.93878727,20.785 C8.50828172,20.358 8.28244275,19.842 8.28244275,19.236 C8.28244275,19.101 8.3499928,19.034 8.48610111,19.034 Z" id="Oval-1"></path>
                    <path d="M1.60607806,19.236 L7.26415094,19.236 C7.2641511,19.2360001 13.7358494,19.2360001 13.7358491,19.236 L19.3939219,19.236 C19.8234193,19.236 20.2085554,19.079 20.5251332,18.765 C20.8417111,18.45 21,18.069 21,17.642 C19.3939219,16.296 18.1941524,14.635 17.3795189,12.659 C16.5648855,10.684 16.1575688,8.597 16.1575688,6.419 C16.1575688,5.028 15.7502521,3.95 14.9577992,3.142 C14.1431658,2.312 13.0341351,1.841 11.6317154,1.661 C11.6992654,1.526 11.7224543,1.369 11.7224543,1.212 C11.7224543,0.875 11.6085266,0.584 11.360507,0.359 C11.1336598,0.112 10.8392626,0 10.5005041,0 C10.1607374,0 9.88952902,0.112 9.66268184,0.359 C9.41365404,0.584 9.30073455,0.875 9.30073455,1.212 C9.30073455,1.369 9.32291517,1.526 9.39147343,1.661 C7.98804551,1.841 6.87901484,2.312 6.06438139,3.142 C5.24974795,3.95 4.84243123,5.028 4.84243123,6.419 C4.84243123,8.597 4.4351145,10.684 3.62048106,12.659 C2.80584762,14.635 1.60607806,16.296 0,17.642 C0,18.069 0.158288924,18.45 0.474866772,18.765 C0.79144462,19.079 1.17658073,19.236 1.60607806,19.236 Z" id="Path"></path>
                  </g>
                </g>
              </svg>
              <span class="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-gray-200 text-gray-700 rounded-full">{countNotifi}</span>
            </div>
          </div>
          <div className='ml-3'>
            <Tooltip title="Enter and Exit full-screen" arrow>
              {fullScreen ? <FullscreenExitIcon onClick={() => { ExitFullScreen() }} style={{ color: '#008060', cursor: 'pointer', fontSize: '30px' }} /> : <FullscreenIcon
                onClick={() => { EnterFullScreen() }} style={{ color: '#008060', cursor: 'pointer', fontSize: '30px' }} />}
            </Tooltip>
          </div>
        </div>
      </BottomNavigation>


      <div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl1}
          open={open1}
          onClose={handleClose1}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <div onClick={() => { inventoryClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <div className='flex items-center'>
              <svg
                className="mr-3"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#008060"
                  d="m22 8.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5c0 1.37-1.12 2.5-2.5 2.5s-2.5-1.13-2.5-2.5l1.39-5.42s.29-1.08 1.31-1.08h14.6c1.02 0 1.31 1.08 1.31 1.08zm-1 3.7v7.8c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2v-7.8c.46.19.97.3 1.5.3.95 0 1.82-.33 2.5-.88.69.55 1.56.88 2.5.88.95 0 1.82-.33 2.5-.88.69.55 1.56.88 2.5.88.95 0 1.82-.33 2.5-.88.68.55 1.56.88 2.5.88.53 0 1.04-.11 1.5-.3m-2 5.13c0-.2 0-.41-.05-.63l-.03-.16h-2.97v1.17h1.81c-.06.22-.14.44-.31.62-.33.33-.78.51-1.26.51-.5 0-.99-.21-1.35-.56-.69-.71-.69-1.86.02-2.58.69-.7 1.83-.7 2.55-.03l.14.13.84-.85-.16-.14c-.56-.52-1.3-.81-2.08-.81h-.01c-.81 0-1.57.31-2.14.87-.59.58-.92 1.34-.92 2.13 0 .8.31 1.54.88 2.09.58.57 1.39.91 2.22.91h.02c.8 0 1.51-.29 2.03-.8.47-.48.77-1.2.77-1.87z"
                />
              </svg>
              <p>Local Inventory <span class="inline-block blink px-1 ml-2 text-center align-baseline font-medium bg-gradient-to-r from-[#fe6447] to-[#f49989] text-white rounded-md text-sm">New</span></p>
              {/* <div className='animate-ping'>
                <Chip label="New" style={{ background: "#d82c0d", color: "white" }} />
              </div> */}
            </div>
          </div>
          <div onClick={() => { expertClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <GppGoodIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Feed Experts
          </div>
          <div onClick={() => { tutorialsOnClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <PlayCircleIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Tutorials
          </div>
          <div onClick={() => { notificationsOnClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <NotificationsIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Notifications
          </div>
          <div onClick={() => { productReviewOnClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <StarIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Product Reviews
          </div>
          <div onClick={() => { faqsOnClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <HelpIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            FAQs
          </div>
          <div onClick={() => { featureRequestOnClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <VolunteerActivismIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Feature Requests
          </div>
          <div onClick={() => { partnerAppsOnClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <WidgetsIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Partner Apps
          </div>
          <div className='py-2 cursor-pointer'>
            <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'>
              <CalendarMonthIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
              Book A Call
            </a>
          </div>
          <div className='py-2 cursor-pointer'>
            <a target='_blank' href='https://apps.shopify.com/easyfeed-for-google-shopping-feeds#modal-show=WriteReviewModal&st_campaign=rate-app&st_source=admin&utm_campaign=installed'>
              <FavoriteIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
              Write A Review
            </a>
          </div>
          <div onClick={() => { feedRuleClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <RuleIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            Feed Rule
          </div>
          <div onClick={() => { auditClick(); handleClose1() }} className='py-2 cursor-pointer'>
            <PlagiarismIcon style={{ color: '#008060', fontSize: '25px', marginRight: '10px' }} />
            GMC Suspension Audit
          </div>
        </Menu>
      </div>


      {/* <div className='flex flex-col '>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              <div className='flex flex-col'>
                {option}
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div> */}
    </div>
  );
}