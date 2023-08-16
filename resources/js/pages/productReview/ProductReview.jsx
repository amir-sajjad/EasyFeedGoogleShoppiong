import React from 'react'
import image1 from './images/image1.png';
import image2 from './images/image2.png';
import image3 from './images/image3.png';
import image4 from './images/image4.png';
import image5 from './images/image5.png';
import ReactGA from "react-ga4";


const ProductReview = () => {

  ReactGA.send({ hitType: "pageview", page: "/productReviews", title: "Product Reviews" });

  return (
    <>
      <div style={{ margin: '3% 10% 0 10%' }}>
        <div>
          <p>Shoppers rely on ratings when deciding where and how to spend their money online. In fact, most consumers read online reviews before visiting a business. And 88% of consumers trust online reviews as much as they trust personal recommendations. Why are they so important and what can you do to get them?</p>
          <br />
          <p>Product ratings appear on products listed in Google Shopping, and they are featured prominently. Listings without them look incomplete and less compelling when displayed beside listings with a rating.</p>
          <br />
          <p>let's take a closer look at how to add Product Ratings to your Google Shopping listings and what benefits they will have for you.</p>
          <br />
          <img style={{ width: '100%', height: '50%' }} src={image1} />
          <br />
          <br />
          <p><b>Requirements</b></p>
          <p>These are the Product Rating requirements you’ll need to meet:</p>
          <ul>
            <li>Have a Google Merchant Center Account with running Shopping ads.</li>
            <li>Product ratings are eligible to show anywhere in the world where Google Shopping and free listings are currently available. There are currently <a target='_blank' href='https://support.google.com/merchants/answer/160637#countrytable'> 104 supported countries.</a> Some of those are in beta and some require a business registration number (BRN) in order to sell there so it’s a good idea to just check this before.</li>
            <li>
              You must have 50 reviews at a minimum for all your products in total for ratings to show on the products you list on Google Shopping.
            </li>
            <li>Every individual product must have at least 3 reviews for the Product Rating to show on Shopping Ads.</li>
          </ul>
          <p><b>Policies</b></p>
          <br />
          <p>You’ll also need to make sure that you comply with the Product Ratings policies. They are:</p>
          <ul>
            <li>Giving Google monthly updates of all of your reviews. This also includes any negative reviews you receive. While monthly updates are required, Google suggests giving them more frequently so that shoppers are getting the most up-to-date information.</li>
            <li>The reviews themselves need to comply with the content policies like not being spam, no hate speech, no duplicated reviews, and <a target="_blank" href='https://support.google.com/merchants/answer/6098512#zippy=%2Creview-feeds-must-adhere-to-content-policies'>more</a>.</li>
            <li>Your review feeds should be high-quality and the reviews should add value to shoppers who are considering buying your products.</li>
            <li>Retailers should collect and own their own reviews.</li>
            <li>Customers can add their own photos to their reviews, but they need to follow these guidelines.</li>
          </ul>
          <p>Once you’re sure you’ve met all of these, you’re free to move on to the next step of requesting to participate in the program.</p>
          <br />
          <p>Open Your Merchant Center In the left-hand menu, click Growth, then choose <b>Manage programs</b>.</p>
          <br />
          <img style={{ width: '100%', height: '50%' }} src={image2} />
          <br />
          <br />
          <p>Then Enable <b>“Product Ratings”</b>. You will be able to submit your application and indicate your reviews count. Google will ask you how many 1, 2, 3, 4, 5 star reviews you have. Approval by Google usually takes less than a week, but times may vary depending on your particular scenario</p>
          <br />
          <p>Once you are approved, go to Marketing → Product Reviews in your Merchant Centre side menu and Add Feed(Product Reviews Feeds).</p>
          <br />
          <img style={{ width: '100%', height: '50%' }} src={image3} />
          <br />
          <br />
          <p><b>Name your feed and select “Scheduled Fetch”</b></p>
          <br />
          <img style={{ width: '100%', height: '50%' }} src={image4} />
          <br />
          <br />
          <p>Select the frequency of your feed, we recommend “Daily”, indicate your Fetch time and select your Time Zone. Then paste your Reviews Feed URL which can be found on your 3rd party app  and file name.</p>
          <br />
          <img style={{ width: '100%', height: '50%' }} src={image5} />
        </div>
      </div>
    </>
  )
}

export default ProductReview