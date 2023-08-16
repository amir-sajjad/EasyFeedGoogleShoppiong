import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ReactGA from "react-ga4";
import Button from '@mui/material/Button';



const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .1)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const FAQS = () => {

  const [expanded, setExpanded] = React.useState('');

  const handleChange =
    (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };

  ReactGA.send({ hitType: "pageview", page: "/faqs", title: "FAQS" });
  ////////////////////////////

  return (
    <>
      <div className='flex justify-between items-center' style={{ margin: '3% 10% 0 10%' }}>
        <p className='text-3xl font-semibold text-center mt-2'>FAQ'S</p>
        <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ color: 'white', background: '#008060' }}>Book A Call</Button></a>
      </div>
      <div style={{ margin: '3% 10% 0 10%' }}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>What are the requirements for a Shopify store to start Google Shopping?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Below requirements needs to be approved for Google Merchant Center -
            </Typography>
            <ul>
              <li>An online store with a unique domain - A domain can only have a single merchant center associated; this means you cannot use myshopify.com URL for Google Shopping.</li>
              <li>An active terms of service page.</li>
              <li>An active refund policy page.</li>
              <li>A store that is accessible publically (no password).</li>
              <li>A valid payment provider - will ensure every customer can check out after coming to your site.</li>
              <li>Maintain an easily accessible page containing contact information on your website.</li>
              <li>Sales tax & Shipping rates depend on the country of sale.</li>
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>Can this app automatically claim my website in Google Merchant Center?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              EasyFeedforGoogleShopping will try to automatically claim your website in Google Merchant Center. However, If you have already claimed your website URL in another merchant center, you might have to manually reclaim the website.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How does Easy Feed For Google Shopping Feed App handle Shipping Settings?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We Offer two type of shipping setup by our app. One is Free and 2nd You have to setup it manual in merchant center.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to solve - Limited performance due to missing value error [GTIN] in Google Merchant Center?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              It is always a good idea to have the correct format of GTIN allowed in the sale area.
              <br />
              You can also leave the GTIN field empty if you do not have one. If the GTIN field is empty, Our App will send the GTIN as a null value, ensuring your products are not disapproved because of GTIN.
              <br />
              Some products are only shown in ads by Google if they have accurate GTINs. To solve this error, kindly update the Barcode field of the product in Shopify.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
          <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>Why does Google not allow dropshipping stores for Shopping? </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You must have noticed that your merchant center account gets suspended if you have a dropshipping store. Here are some of the reasons why:
              <ul className='ml-4' style={{ listStyleType: 'number' }}>
                <li>Google does not allow promoting products that are not stocked.</li>
                <li>Google reviews information from multiple sources to determine whether your account is trustworthy.</li>
              </ul>
            </Typography>

          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
          <AccordionSummary aria-controls="panel6d-content" id="panel6d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>Why does my Google Merchant center account get suspended?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              In case you have a dropshipping business and your Google Merchant center account is suspended, you can check for the following things.
              The most common issues faced are:
            </Typography>
            <ul className='ml-4' style={{ listStyleType: 'number' }}>
              <li>Not adding full contact details (email, phone number, address, contact form)</li>
              <li>Not having returns and refund, delivery, privacy policy, and terms of service pages</li>
              <li>Selling products that are not allowed</li>
              <li>Selling a product, you do not stock</li>
              <li>Not adding any added content and simply copy-pasting other sites</li>
              <li>Having multiple websites in the same niche</li>
              <li>Not being honest with what you sell or how you portray the business</li>
            </ul>
            <p>In case you have a dropshipping business, make sure you make the title and description of your products unique. This will ensure when google reviews your account; It will not get suspended.</p>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
          <AccordionSummary aria-controls="panel7d-content" id="panel7d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>Why do I see more products in the Merchant Center than in the Google Shopping Feed app?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Here are some of the reasons why you see a difference in the number of products in the Merchant Center and Google Shopping Feed app
            </Typography>
            <ul className='ml-4' style={{ listStyleType: 'number' }}>
              <li>Google Shopping Feed app pushes your products along with the variants to the Merchant Center. So you notice that the number of products in the Merchant center is always higher than those in the feed app.</li>
              <li>In case you have multiple countries, the products will be higher in number as Google Merchant Center displays all the products, including the different countries.</li>
              <li>In case you notice the product number is lesser in the merchant center, it implies that some of your products have not been pushed to Google Merchant Center. If some of your products have any major data missing, such as title or description, those products are not pushed to the merchant center.</li>
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
          <AccordionSummary aria-controls="panel8d-content" id="panel8d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>What are the common errors with images in Google Merchant Center & how to solve them?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              I am getting multiple errors in Merchant Center due to image issues. How can I solve them?
              The following are common errors in Merchant Center
            </Typography>
            <ul >
              <li>Image too small - Google needs a resolution of at least 100*100 for non-apparel products and 250*250 for apparel products. Any resolution less than this might cause an error</li>
              <li>Low image quality - Images which does not clearly show the product can get disapprovals</li>
              <li>Promotional overlay on image - If you use a logo or brand or promotional offer on the image, there is a high chance that Google will disapprove your product</li>
              <p>To solve these errors, you have to make changes directly into our App. Kindly reupload a new image after you fix the errors & Our app will update Merchant Center with the changes.</p>
            </ul>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
          <AccordionSummary aria-controls="panel9d-content" id="panel9d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>I run an adult store, How can I run Google Shopping campaigns?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Are adult products allowed to run in Google Shopping? What should I do to make it eligible
              Google allows adult products as long as they are marked as adult.
              Select all products from the products list page, click on edit products, select <b>Is adult?</b> field & change the value to yes to change all your products.
              Once you make the changes, Kindly click on the update feed button to publish the changes in Google Merchant Center
              Your products will now be approved by Google.
              If you sell adult products only, you can mark so directly in Merchant Center. go to <b> Shopping ads setup → Then change the settings for adult content ( Enabled)</b>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel10'} onChange={handleChange('panel10')}>
          <AccordionSummary aria-controls="panel10d-content" id="panel10d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to bulk edit products in Google Shopping Feed for Shopify?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Feed App allows you to bulk edit your products in Google Shopping Feed for Shopify
              Follow the steps to bulk edit products in the Google Shopping Feed app:
            </Typography>
            <ul>
              <li>Select the products you want to update on the product page of your Google shopping feed app.</li>
              <li>Click on <b>Edit products</b>, which will take you to the bulk edit options.</li>
              <li>Select either one or multiple fields that you want to edit and fill in the values.</li>
              <li>You can choose to bulk edit only the current country or bulk edit the changes across all the countries. If you are using the Multi-language feature, you can also bulk edit products across all the languages.</li>
              <li>Click on the <b>Submit</b> button.</li>
            </ul>
            <p>After you have bulk edited your products, you have to Click on the <b>Update Feed</b> button so that the changes are pushed to the Google Merchant Center immediately.</p>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel11'} onChange={handleChange('panel11')}>
          <AccordionSummary aria-controls="panel11d-content" id="panel11d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to use metafields to override values in Google Shopping Feed for Shopify?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Metafields mapping is a new feature that has been added to Google Shopping Feed by Easy Feed App
              Using Metafield mapping, you can map any metafield from Shopify to any other attribute in Google Merchant Center. By default SKU in Shopify is used as MPN in Google merchant center. You can override this setting by using Metafield:
              <br />
              <br />
              Step 1: Select Product Click on Sync From Shopify.
              <br />
              <br />
              Step 2: Inside Metafields, you need to enable the metafield
              <br />
              <br />
              Step 3: Then, you can map those metafields created using the app, to the attributes in Google Merchant Center

            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel12'} onChange={handleChange('panel12')}>
          <AccordionSummary aria-controls="panel12d-content" id="panel12d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to prevent policy violation errors in Google Merchant Center for Shopify?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              All you need to know about preventing the policy violation errors in Google Merchant Center for Shopify
              Google wants every website, which is linked to Google Merchant Center, to follow certain checks. A lot of times, new businesses overlook these checks, which leads to the disapproval of products.
            </Typography>
            <ul>
              <li>First, you need to have a contact us page containing the Phone number, email id, and address. If not all at least two of the details must be present.</li>
              <li>Secondly, a very well define refund and return policy must be present. Terms of Service should be well defined.</li>
            </ul>
            <p>You can easily add the policies from Shopify, Click on Settings → Legal.
              It has all the templates which you can use to create the policies.
              After creating the policies, you have to make these accessible by the customers. To do that
              In Shopify, Click on Online store → Navigation → Footer Menu → Add Menu Item.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel13'} onChange={handleChange('panel13')}>
          <AccordionSummary aria-controls="panel13d-content" id="panel13d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to improve product performance in Google Shopping for Shopify?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Here are some of the steps which will help you improve your product performance for Google Shopping for shopify
              You can click on a product and see why you have a bad score. Once you do that you will be able to see the different places where you can improve your score, for example:
            </Typography>
            <ul>
              <li>Title</li>
              <li>Description</li>
              <li>Google Products Category</li>
              <li>Product Type  </li>
              <li>Brand</li>
              <li>GTIN</li>
              <li>Promotion Ids</li>
              <li>Images</li>
            </ul>
            <p>Out of all these attributes, "Title" and "Description" play a significant role in improving the score as well as the performance of shopping ads, so adding a proper title and description is highly recommended.
              Changing the title in the feed app will not change the title provided on the website. So, you have titles optimized for conversions on the website and optimized for keywords in Merchant center.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel14'} onChange={handleChange('panel14')}>
          <AccordionSummary aria-controls="panel14d-content" id="panel14d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to change UTM parameters in Google Shopping Feed for Shopify?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Let us have a look at how you can change UTM parameters in Google Shopping Feed for Shopify
              UTM parameters are used to track marketing campaigns, and we support UTM parameters. In case you want to change UTM parameters, follow the steps below:
            </Typography>
            <p>Step 1: Click on <b>Settings → Select Your Feed</b>.</p>
            <p>Step 2: In the Below of page you can change the UTM parameters.</p>
            <p>Step 3: Click on Save, and you are done</p>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel15'} onChange={handleChange('panel15')}>
          <AccordionSummary aria-controls="panel15d-content" id="panel15d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>What is Difference B/w Shopify Sync and Google Sync ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              First of all we got you covered in every type of change you apply. It will be seamlessly  applied in the feed app and merchant center. Our App supports manual sync inside our application and there are two types of sync inside the app one is Shopify sync and other is Google sync. When you hit the Shopify sync button it will fetch data from your store to our app. When you hit Google sync it will get latest update about your product inside our app.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel16'} onChange={handleChange('panel16')}>
          <AccordionSummary aria-controls="panel16d-content" id="panel16d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>What is Difference b/w including and excluding products ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our app automatically fetches your product inside shopify but there is also an option provided if you want certain products to be included you can do it manually and also if you wish to exclude certain products you can also do it inside our app.
            </Typography>

          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel17'} onChange={handleChange('panel17')}>
          <AccordionSummary aria-controls="panel17d-content" id="panel17d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>What are product_highlights and product_details in Google Shopping? How can I add it ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <b>Product Highlight</b>: This is an attractive feature added by Google to showcase the essential features of a product as bullet points; this makes it easier for the customer to understand the key features.
            </Typography>
            <Typography>
              <b>Product details</b>:  Google has added this new feature to add product-specific details as specific feed attributes that help Google understand the product better. In return, it improves product rankings.
            </Typography>
            <ul>
              Product details [product_detail] had 3 sub-attributes:
              <li>Section name [section_name]               (upto 140 characters)</li>
              <li>Attribute name [attribute_name]          (upto 140 characters)</li>
              <li>Attribute value [attribute_value]           (upto 1000 characters)</li>
            </ul>
            <p>For example, let us assume we are selling batteries for mobile phones; the product details would look like something below:</p>
            <ul>
              <li>Section name: Battery</li>
              <li>Attribute name: Capacity</li>
              <li>Attribute value: 3,000 mAh</li>
            </ul>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel18'} onChange={handleChange('panel18')}>
          <AccordionSummary aria-controls="panel18d-content" id="panel18d-header">
            <QuestionAnswerIcon style={{ margin: '0 10px 0 10px', color: '#008060' }} />
            <Typography>How to add product review in Google shopping feed ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              In the Shopify store there are multiple apps that support reviews for Google shopping feed. Every app has  its own requirements that you have to fulfill to show your review on Google shopping feed . There is a tutorial inside our app  where we have explained about each Shopify review app related to Google Shopping Feed. You can set up accordingly for each app you want.
            </Typography>

          </AccordionDetails>
        </Accordion>

      </div>
    </>
  )
}

export default FAQS