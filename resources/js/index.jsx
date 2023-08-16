import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home';
import NavBar from './NavBar';
import LinearProgress from '@mui/material/LinearProgress';
import ReactGA from "react-ga4";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Welcome from './pages/WelcomePage/Welcome';
const LazyWelcome = React.lazy(() => import('./pages/WelcomePage/Welcome'));
// import Setup from './pages/setup/Setup';
const LazySetup = React.lazy(() => import('./pages/setup/Setup'));
// import SetupPrice from './pages/setupPricing/SetupPrice';
const LazySetupPrice = React.lazy(() => import('./pages/setupPricing/SetupPrice'));
// import Dashboard from './pages/dashboard/Dashboard';
const LazyDashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
// import BookCall from './pages/bookCall/BookCall';
const LazyBookCall = React.lazy(() => import('./pages/bookCall/BookCall'));
// import Conversion from './pages/conversionTracking/Conversion';
const LazyConversion = React.lazy(() => import('./pages/conversionTracking/Conversion'));
// import FAQS from './pages/faqs/FAQS';
const LazyFAQS = React.lazy(() => import('./pages/faqs/FAQS'));
// import Request from './pages/featureRequest/Request';
const LazyRequest = React.lazy(() => import('./pages/featureRequest/Request'));
// import YourSuggestion from './pages/featureRequest/YourSuggestion';
const LazyYourSuggestion = React.lazy(() => import('./pages/featureRequest/YourSuggestion'));
// import Suggestions from './pages/featureRequest/Suggestions';
const LazySuggestions = React.lazy(() => import('./pages/featureRequest/Suggestions'));
// import Rule from './pages/feedRule/Rule'; 
const LazyRule = React.lazy(() => import('./pages/feedRule/Rule'));
// import GeneralSetting from './pages/generalSetting/GeneralSetting'; 
const LazyGeneralSetting = React.lazy(() => import('./pages/generalSetting/GeneralSetting'));
// import HelpCenter from './pages/helpCenter/HelpCenter';
const LazyHelpCenter = React.lazy(() => import('./pages/helpCenter/HelpCenter'));
// import ReplyTickets from './pages/helpCenter/ReplyTickets';
const LazyReplyTickets = React.lazy(() => import('./pages/helpCenter/ReplyTickets'));
// import NewTickets from './pages/helpCenter/NewTickets';
const LazyNewTickets = React.lazy(() => import('./pages/helpCenter/NewTickets'));
// import CloseTickets from './pages/helpCenter/CloseTickets';
const LazyCloseTickets = React.lazy(() => import('./pages/helpCenter/CloseTickets'));
// import Notifications from './pages/notifications/Notifications';
const LazyNotifications = React.lazy(() => import('./pages/notifications/Notifications'));
// import PartnerApps from './pages/partnerApps/PartnerApps';
const LazyPartnerApps = React.lazy(() => import('./pages/partnerApps/PartnerApps'));
// import Pricing from './pages/pricing/Pricing';
const LazyPricing = React.lazy(() => import('./pages/pricing/Pricing'));
// import ProductReview from './pages/productReview/ProductReview';
const LazyProductReview = React.lazy(() => import('./pages/productReview/ProductReview'));
// import Promotion from './pages/promotionFeed/Promotion';
const LazyPromotion = React.lazy(() => import('./pages/promotionFeed/Promotion'));
// import Tutorials from './pages/tutorials/Tutorials';
const LazyTutorials = React.lazy(() => import('./pages/tutorials/Tutorials'));
// import WriteReview from './pages/writeReview/WriteReview';
const LazyWriteReview = React.lazy(() => import('./pages/writeReview/WriteReview'));
// import Products from './pages/products/Products';
const LazyProducts = React.lazy(() => import('./pages/products/Products'));
// import Detail from './pages/detail/Detail';
const LazyDetail = React.lazy(() => import('./pages/detail/Detail'));
const LazyExpert = React.lazy(() => import('./pages/expert/Expert'));
const LazyAudit = React.lazy(() => import('./pages/audit/Audit'));
const LazyLoading = React.lazy(() => import('./pages/loading/Loading'));
const LazyInventory = React.lazy(() => import('./pages/inventory/Inventory'));

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
});

ReactGA.initialize('G-TMF9MDLSFD', {
  gaOptions: {
    cookieFlags: 'max-age=7200;secure;samesite=none',
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyWelcome />
            </React.Suspense>
          } />
          <Route path="setup" element={
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazySetup />
            </React.Suspense>
          } />
          <Route path="setupPrice" element={
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazySetupPrice />
            </React.Suspense>
          } />
          <Route path="dashboard" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyDashboard />
            </React.Suspense>
          </>} />
          <Route path="BookCall" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyBookCall />
            </React.Suspense>
          </>} />
          <Route path="Conversion" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyConversion />
            </React.Suspense>
          </>} />
          <Route path="FAQS" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyFAQS />
            </React.Suspense>
          </>} />
          <Route path="Request" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyRequest />
            </React.Suspense>
          </>} />
          <Route path="Rule" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyRule />
            </React.Suspense>
          </>} />
          <Route path="GeneralSetting/:feedId" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyGeneralSetting />
            </React.Suspense>
          </>} />
          <Route path="HelpCenter" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyHelpCenter />
            </React.Suspense>
          </>} />
          <Route path="Notifications" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyNotifications />
            </React.Suspense>
          </>} />
          <Route path="PartnerApps" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyPartnerApps />
            </React.Suspense>
          </>} />
          <Route path="Pricing" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyPricing />
            </React.Suspense>
          </>} />
          <Route path="ProductReview" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyProductReview />
            </React.Suspense>
          </>} />
          <Route path="Promotion" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyPromotion />
            </React.Suspense>
          </>} />
          <Route path="Tutorials" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyTutorials />
            </React.Suspense>
          </>} />
          <Route path="WriteReview" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyWriteReview />
            </React.Suspense>
          </>} />
          <Route path="Products/:feedId" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyProducts />
            </React.Suspense>
          </>} />
          <Route path="Detail/:ids/:feed_id" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyDetail />
            </React.Suspense>
          </>} />
          <Route path="ReplyTickets/:ticketId" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyReplyTickets />
            </React.Suspense>
          </>} />
          <Route path="NewTickets" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyNewTickets />
            </React.Suspense>
          </>} />
          <Route path="CloseTickets" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyCloseTickets />
            </React.Suspense>
          </>} />
          <Route path="YourSuggestion" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyYourSuggestion />
            </React.Suspense>
          </>} />
          <Route path="Suggestions/:featureId" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazySuggestions />
            </React.Suspense>
          </>} />
          <Route path="Expert" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyExpert />
            </React.Suspense>
          </>} />
          <Route path="inventory" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyInventory />
            </React.Suspense>
          </>} />
          <Route path="Audit" element={<><NavBar />
            <React.Suspense fallback={<LinearProgress color="success" />}>
              <LazyAudit />
            </React.Suspense>
          </>} />
          <Route path="Loading" element={<>
            <React.Suspense>
              <LazyLoading />
            </React.Suspense>
          </>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </>
);

