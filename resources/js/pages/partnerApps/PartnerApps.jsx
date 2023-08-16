import React from 'react'
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import './PartnerResponsive.css'
import ReactGA from "react-ga4";
import Rating from '@mui/material/Rating';
import { Button } from '@material-ui/core';


const PartnerApps = () => {

  ReactGA.send({ hitType: "pageview", page: "/partnerApps", title: "Partner Apps" });

  return (
    <>
      <div className='mx-[7%] mt-[3%]'>
        <div className='flex justify-between items-center'>
          <p style={{ padding: '0 0 10px 10px', fontSize: '20px', fontWeight: '600' }}>Partner Apps</p>
          <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ color: 'white', background: '#008060' }}>Book A Call</Button></a>
        </div>
        <div className='polaris__card' style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
          <Card style={{ width: "49%" }}>
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
                  View App
                </button>
              </a>
            </div>
          </Card>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/fc98dbd23e8e139349b2426307effd9e/icon/CLnelfCP_fcCEAE=.png'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_essential_free_shipping' target="_blank"><b>Essential Free Shipping Upsell</b></a></p>
                <div className='mb-1'><Rating defaultValue={4.6} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>Free Shipping Bar Upsell & Cross sell - Boost AOV!</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_essential_free_shipping' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
        </div>
        <Divider />
        <div className='polaris__card' style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/02390e57cc10c164770a62f5ff798ec9/icon/CLS1rKf0lu8CEAE=.png'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_reputon_Google_review' target="_blank"><b>Reputon for Google Reviews</b></a></p>
                <div className='mb-1'><Rating defaultValue={2.3} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>Import Google Reviews & Testimonials. Google Review Widget</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_reputon_Google_review' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/030fe401789c6f84cc38805e7965669b/icon/CKee5Kv1yP4CEAE=.jpeg'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_zipifyPage' target="_blank"><b>Zipify Pages Builder & Editor</b></a></p>
                <div className='mb-1'><Rating defaultValue={4.9} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>Build High-Converting Sales Funnels, Product & Landing Pages</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_zipifyPage' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
        </div>
        <div className='polaris__card' style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/d901cd4dbfe8eb94d9ab8c2170c2c477/icon/CILQk_3Hgf0CEAE=.png'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_GtinSync' target="_blank"><b>Easy GTIN/UPC Sync for Google</b></a></p>
                <div className='mb-1'><Rating defaultValue={4.8} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>Fix Limited performance due to missing value [gtin] on GMC</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_GtinSync' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/a6570830ea8be24a54472b4e701c9d1a/icon/CLyg5NaTp_YCEAE=.jpeg?height=60&quality=90&width=60'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_shortly' target="_blank"><b>Shortly: Short Links & Track</b></a></p>
                <div className='mb-1'><Rating defaultValue={4.6} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>Create Influencer link,Short links, Offer Discount,Track Sales</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_shortly' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
        </div>
        <div className='polaris__card' style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/36881f6a4f1818cb5cffe1d6cf5cb302/icon/CNmw6uaeq_0CEAE=.png'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_LangShop' target="_blank"><b>LangShop AI Language Translate</b></a></p>
                <div className='mb-1'><Rating defaultValue={4.6} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>Translate store into multi language, switcher, geolocation</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_LangShop' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
          <Card style={{ width: "49%" }}>
            <div className='Partner_App_Instagram' style={{ padding: '10px', display: 'flex', width: '100%' }}>
              <img className='shadow-xl rounded' style={{ width: '100px', height: '100px' }} src='https://cdn.shopify.com/app-store/listing_images/5a1479e431df4989c4aad0af02604271/icon/CN7o_Kynsf4CEAE=.png'></img>
              <div style={{ margin: '0px 0 0 10px' }}>
                <p className='mb-1' variation="strong"><a className='partner__apps' href='https://cut.live/Easyfeed_to_PushSections' target="_blank"><b>Push Sections</b></a></p>
                <div className='mb-1'><Rating defaultValue={5} precision={0.1} readOnly /></div>
                <p style={{ wordWrap: 'break-all' }}>No docs landing page builder! 120+ pre-design theme sections</p>
              </div>
            </div>
            <div className='ml-2 flex justify-center m-auto'>
              <a className='' href='https://cut.live/Easyfeed_to_PushSections' target='_blank'>
                <button type="button" class="text-center w-[12vw] py-2 px-4 text-sm font-medium shadow-green-600 shadow-2xl rounded-lg border bg-[#008060] hover:bg-[#008060] text-white">
                  View App
                </button>
              </a>
            </div>
          </Card>
        </div>
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Divider style={{ margin: '10px 0 10px 0' }} />
          <p>Our partnership program is running very successfully. We want you to join the club and explore new horizons of success. Contact us</p>
        </div>
      </div>
    </>
  )
}

export default PartnerApps