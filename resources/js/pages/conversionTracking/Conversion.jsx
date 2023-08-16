import React from 'react'
import Screenshot_1 from './Images/Screenshot_1.png';
import Screenshot_2 from './Images/Screenshot_2.png';
import Screenshot_3 from './Images/Screenshot_3.png';
import Screenshot_4 from './Images/Screenshot_4.png';
import Screenshot_5 from './Images/Screenshot_5.png';
import Screenshot_6 from './Images/Screenshot_6.png';
import Screenshot_7 from './Images/Screenshot_7.png';
import Screenshot_8 from './Images/Screenshot_8.png';
import Screenshot_9 from './Images/Screenshot_9.png';
import Screenshot_10 from './Images/Screenshot_10.png';
import Screenshot_11 from './Images/Screenshot_11.png';
import Screenshot_12 from './Images/Screenshot_12.png';
import Screenshot_13 from './Images/Screenshot_13.png';
import Screenshot_14 from './Images/Screenshot_14.png';
import Screenshot_15 from './Images/Screenshot_15.png';
import Screenshot_16 from './Images/Screenshot_16.png';
import Screenshot_17 from './Images/Screenshot_17.png';
import Screenshot_18 from './Images/Screenshot_18.png';
import Screenshot_19 from './Images/Screenshot_19.png';
import Screenshot_20 from './Images/Screenshot_20.png';
import Screenshot_21 from './Images/Screenshot_21.png';
import Screenshot_22 from './Images/Screenshot_22.png';
import Screenshot_23 from './Images/Screenshot_23.png';
import Screenshot_40 from './Images/Screenshot_40.png';
import abc from './Images/abc.png';
import adcd from './Images/adcd.png';
import gasdfasf from './Images/gasdfasf.png';
import ReactGA from "react-ga4";


const Conversion = () => {

  ReactGA.send({ hitType: "pageview", page: "/conversion", title: "Conversion" });

  return (
    <>
      <div style={{ margin: '3% 7% 0 7%' }}>
        <div>
          <p style={{ fontSize: '16px' }}>Hello Welcome to <b>Easy Feed for Google Shopping</b>. Here is Guide that will guide you to setup conversion tracking<br /><br />
            To see which Google Ads Advertising is generating most sales you need to setup Google Ads Conversion Tracking, it will help you to track the actions visitors perform on your site and that will keep you in full control of your traffic. You can change your strategies accordingly.<br /><br />
            Before setting up your Google conversion tracking make sure not to duplicate conversion tracking for your store. Duplicating conversion will not give you accurate data and things will be messed up.<br /><br />
          </p>
          <p style={{ fontSize: '16px' }}><b>Let’s Begin</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>Make sure you have the following</p>
          <br />
          <p style={{ fontSize: '16px' }}>1. Google Ads Account</p>
          <br />
          <p style={{ fontSize: '16px' }}>2. Running or you plan to run ads through Google Ads.</p>
          <br />
          <p style={{ fontSize: '16px' }}><b>Setting Up Google Ads Conversion Tracking</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>These things you will be doing to setup correctly your conversion tracking</p>
          <br />
          <p style={{ fontSize: '16px' }}><b>Installation of Global Site Tag</b></p>
          <br />
          <p style={{ fontSize: '16px' }}><b>Adding the Event Snippet</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>Little edit to the Event Snippet to adjust Value of conversion based on Purchase amount.</p>
          <br />
          <p style={{ fontSize: '16px' }}>Go to Google Ads and open Tools and Settings then click on Conversions → <b>Choose Website option</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_21} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>After that you need to enter the domain name of your site then click scan and then click <b>Save and Continue</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_22} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>After that this type of screen will open and here you need to scroll down and click on <b> + Add Conversion Action Manually</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_23} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>On your next screen enter the conversion name Purchase and then select Use <b>Different Value For Each Conversion</b> and leave the rest as it is, it will be changed through a short code in next step.</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_7} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>Down on the same screen select <b>Every</b> and then click <b>Save</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_8} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>This is how it will look inside Google Ads it shows unverified it will take a couple of hours to get verified.</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_17} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>After this click on install The Tag Yourself</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_18} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>Step 1.  Install The Global Site Tag</p>
          <br />
          <p style={{ fontSize: '16px' }}> In side Google Ads open <b>Set Up Tag</b> and click Install <b>The Tag Yourself</b></p>
          <br />
          <p style={{ fontSize: '16px' }}> Copy your global site tag</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_40} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>Go To Sales Channel → Themes → Actions and then <b>Edit Code</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_10} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>Now paste that copied global site tag between <b>{'<head> </head>'} in theme.liquid file</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_1} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}><b>Note:</b> Make sure if you change your theme please reconsider the code into a new theme file as well.</p>
          <br />
          <p style={{ fontSize: '16px' }}>Step 2</p>
          <br />
          <p style={{ fontSize: '16px' }}>If a person clicks on your Ads and then it goes to the checkout page this action will be tracked using Event Snippet. Therefore you need to add the snippet to your checkout page after the installation of global site tag</p>
          <br />
          <p>Go to Google Ads and in the Event Snippet section select <b>Page Load → Copy the Event Snippet code.</b></p>
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_12} />
          <br />
          <br />

          <p style={{ fontSize: '16px' }}>Open your Shopify admin and click <b>settings</b> and go to checkout.</p>
          <br />
          <p style={{ fontSize: '16px' }}>In the Additional scripts text box paste the Event Snippet.</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_13} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>If a customer reloads the checkout page, then Google Ads might record a duplicate conversion. To prevent duplicate conversions, add tags before and after the event snippet so that it triggers once per customer:</p>
          <p style={{ fontSize: '16px' }}>On the line before the snippet, paste <b>{"% if first_time_accessed %"}</b>.</p>
          <p style={{ fontSize: '16px' }}>On the line after the snippet, paste <b>{'% endif %'}</b>.</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_14} />
          <br />
          <br />

          <p style={{ fontSize: '16px' }}>The default currency is USD. If you don't sell in US dollars, then replace 'USD' in the event snippet with <b>{'{{ currency }}'}</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>The default transaction ID is blank. To prevent Google Ads from recording duplicate conversions, next to 'transaction_id': replace '' with <b>{'{{ order_number  }}'}</b>, Click <b>Save</b>.</p>
          <p style={{ fontSize: '16px' }}><b>Make the Conversion Value Dynamic</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>To track a different value for each conversion, you need to edit your event snippet to use values that are specific to each transaction.</p>
          <br />
          <p style={{ fontSize: '16px' }}>Replace the line beginning with 'value': with one of the following snippets:</p>
          <br />
          <p style={{ fontSize: '16px' }}>To exclude taxes and shipping from the conversion amount, replace it with this snippet: <b>{"'value': {{ checkout.subtotal_price | divided_by: 100.0 }}"},</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>To include taxes and shipping in the conversion amount, replace it with this snippet: <b>{"'value': {{ checkout.total_price | divided_by: 100.0 }}"},</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_15} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>Click <b>Save.</b></p>
          <br />
          <p style={{ fontSize: '16px' }}>In order to the working of your Google Conversion Tracking on your Store install chrome extension of <b>Tag Assistant</b></p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_16} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>This will show the working of your google site tag as you can see.</p>
          <br />
          <p style={{ fontSize: '16px' }}>As you can see in the picture your Conversion Tracking will be shown like this.</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_20} />
          <br />
          <br />


          <p style={{ fontSize: '16px' }}>On Thankyou Page this type of data will be recorded and it will be fetched automatically</p>
          <br />
          <img style={{ width: '100%', height: '70%' }} src={Screenshot_19} />
          <br />
          <br />
          <p style={{ fontSize: '16px', paddingBottom: '40px' }}>We hope you found this article helpful. Thankyou</p>

        </div>
      </div>
    </>
  )
}

export default Conversion