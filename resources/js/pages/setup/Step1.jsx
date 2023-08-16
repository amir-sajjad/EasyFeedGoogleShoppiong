import * as React from "react";
// import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";

import domainverfiedimage3 from './images/domainverfiedimage3.png';
import domainverfiedimg2 from './images/domainverfiedimg2.png';
import domainveri4 from './images/domainveri4.png';
import domianverifed5 from './images/domianverifed5.png';
import merchantcenterimg1 from './images/merchantcenterimg1.png';

const Step1 = () => {
  // signIn button

  const [query, setQuery] = React.useState("idle");
  const timerRef = React.useRef();

  const handleClickQuery = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query !== "idle") {
      setQuery("idle");
      return;
    }

    setQuery("progress");
    timerRef.current = window.setTimeout(() => {
      setQuery("success");
    }, 2000);
  };

  // Disconnect or change button

  const [query1, setQuery1] = React.useState("idle");
  const timerRef1 = React.useRef();

  const handleClickQuery1 = () => {
    if (timerRef1.current) {
      clearTimeout(timerRef1.current);
    }

    if (query1 !== "idle") {
      setQuery1("idle");
      return;
    }

    setQuery1("progress");
    timerRef1.current = window.setTimeout(() => {
      setQuery1("success");
    }, 2000);
  };

  // Merchant Center button

  const [query2, setQuery2] = React.useState("idle");
  const timerRef2 = React.useRef();

  const handleClickQuery2 = () => {
    if (timerRef2.current) {
      clearTimeout(timerRef2.current);
    }

    if (query2 !== "idle") {
      setQuery2("idle");
      return;
    }

    setQuery2("progress");
    timerRef2.current = window.setTimeout(() => {
      setQuery2("success");
    }, 2000);
  };
  return (
    <div className="m-4">
      <div
        style={{
          boxShadow:
            "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
        }}
        className="bg-white rounded-lg p-4 grid lg:grid-cols-2 gap-2 pb-4"
      >
        <div>
          <h5 className="font-normal text-lg">Google Account</h5>
          <p class="mt-2 text-gray-600 text-sm">Sign in with your account</p>
        </div>
        <div class="flex justify-end mt-1">
          <div sx={{ height: 40 }}>
            {query === "success" ? (
              <div className="text-gray-600">Success!</div>
            ) : (
              <Fade
                in={query === "progress"}
                style={{
                  transitionDelay: query === "progress" ? "800ms" : "0ms",
                }}
                unmountOnExit
              >
                <CircularProgress
                  style={{ color: "#008060", marginRight: "10px" }}
                />
              </Fade>
            )}
          </div>
          <a onClick={handleClickQuery} className="signInGoogleBtn shadow-md cursor-pointer flex items-center inline-block bg-white px-4 py-1.5 text-base font-base leading-7 text-black">
            <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="29px" height="40px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            {query !== "idle" ? "Signing in to Google" : "Sign in with Google"}
          </a>
        </div>
      </div>
      <div
        style={{
          boxShadow:
            "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
        }}
        className="bg-white mt-4 rounded-lg p-4 grid lg:grid-cols-2 gap-2 pb-4"
      >
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
                src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
              />
            </div>
            <div>
              <p className="text-gray-900 self-center">Kamal Ud Din</p>
              <p className="text-gray-900 self-center text-sm">
                muhammadkamaluddin603@gmail.com
              </p>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <div sx={{ height: 40 }}>
              {query1 === "success" ? (
                <div className="text-gray-600">Success!</div>
              ) : (
                <Fade
                  in={query1 === "progress"}
                  style={{
                    transitionDelay: query1 === "progress" ? "800ms" : "0ms",
                  }}
                  unmountOnExit
                >
                  <CircularProgress
                    style={{ color: "#157b3d", marginRight: "10px" }}
                  />
                </Fade>
              )}
            </div>
            <a onClick={handleClickQuery1} className="signInGoogleBtn shadow-md cursor-pointer flex items-center inline-block bg-white px-4 py-1.5 text-base font-base leading-7 text-black">
              <svg className='mr-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="29px" height="40px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
              {query1 !== "idle" ? "Changing Account" : "Change Account"}
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          boxShadow:
            "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
        }}
        className="bg-white mt-4 rounded-lg p-4 grid lg:grid-cols-2 gap-2"
      >
        <div>
          <h5 className="font-normal text-lg">Merchant Center Account</h5>
          <p class="mt-2 text-gray-600 text-sm">
            Make a right selection of your Merchant Center account because this will be used to sync your store product data and also we will claim and verify the domain using the selected Merchant Center
          </p>
        </div>
        <div>
          <div class="flex justify-end">
            <div>
              <select
                id="countries"
                class="border-2 border-[#008060] text-gray-900 text-sm rounded-lg focus:ring-green-800 focus:border-green-800 block w-full p-2.5  dark:border-green-800 dark:placeholder-gray-400 active:ring-green-800  dark:focus:ring-green-800 dark:focus:border-green-800"
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
          </div>
          <div className="flex justify-end mt-4">
            <div sx={{ height: 10 }}>
              {query2 === "success" ? (
                <div className="text-gray-600">Success!</div>
              ) : (
                <Fade
                  in={query2 === "progress"}
                  style={{
                    transitionDelay: query2 === "progress" ? "800ms" : "0ms",
                  }}
                  unmountOnExit
                >
                  <CircularProgress
                    style={{ color: "#157b3d", marginRight: "10px" }}
                  />
                </Fade>
              )}
            </div>

            <a
              className="cursor-pointer flex items-center inline-block bg-[#008060] px-4 py-1.5 text-base font-base leading-7 text-white shadow-sm  hover:bg-green-800"
              onClick={handleClickQuery2}
              sx={{ m: 2 }}
            >
              <img
                className="w-8 mr-2"
                src="https://cdn.cdnlogo.com/logos/g/38/google-merchant-center.svg"
              />
              {query2 !== "idle" ? "Connecting" : "Connect Merchant Center"}
            </a>
          </div>
        </div>
      </div>
      <>
        <div className="bg-white mt-4 rounded-lg p-4" style={{
          boxShadow:
            "0 0 0.3125rem rgba(23,24,24,.05),0 0.0625rem 0.125rem rgba(0,0,0,.15)",
        }}>
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

          <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
            <Button style={{ backgroundColor: '#008060' }} variant="contained">Test Your Domain</Button>
          </div>
        </div>
      </>
    </div>
  );
};

export default Step1;
