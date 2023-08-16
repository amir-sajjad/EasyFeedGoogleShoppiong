import React from "react";
import { Link } from "react-router-dom";
import image from "./image.png";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Button } from "@mui/material";
import StyleIcon from '@mui/icons-material/Style';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import NearMeIcon from '@mui/icons-material/NearMe';
import ReactGA from "react-ga4";

export default function Welcome () {

  const navigate = useNavigate();
  const setupOnClick = useCallback(() => navigate('/setup', { replace: true }), [navigate]);

  ReactGA.send({ hitType: "pageview", page: "/welcome", title: "Welcome" });

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-2 m-4 bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
        <div className="mt-20">
          <h1 className="flex justify-center mt-2 md:text-xl sm:text-lg font-medium tracking-tight text-gray-900 lg:text-[25px]">
            Earn your dream revenue by<br /> reaching more customers on Google
          </h1>
          <div className="w-[50%] pt-4 flex flex-col justify-center m-auto">
            <div className="flex items-center">
              <StyleIcon />
              <p className="ml-2">Make your products available to every single person who shop on Google every day</p>
            </div>
            <div className="flex items-center mt-3">
              <ShoppingCartCheckoutIcon />
              <p className="ml-2">Reach more potential customers by promoting your products with Google Shopping Ads</p>
            </div>
            <div className="flex items-center mt-3">
              <NearMeIcon />
              <p className="ml-2">Manage and optimize your products listing directly through Shopify</p>
            </div>
          </div>
          <div className="mt-8 flex gap-x-4 justify-center">
            <Button variant="contained" onClick={setupOnClick} style={{ background: '#008060' }}>Get started<ArrowCircleRightIcon style={{ marginLeft: '10px' }} /></Button>
          </div>
        </div>
        <div className="mr-2">
          <img className="w-[100%] sm:w-[80%] md:w-[80%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%]" src={image} />
        </div>
      </div>
    </>
  );
}
