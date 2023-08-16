import { Button } from '@material-ui/core'
import React from 'react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import faq from '../expert/faq.gif';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ReactGA from "react-ga4";






const Audit = () => {

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  ReactGA.send({ hitType: "pageview", page: "/gmcAudit", title: "GMC Audit" });

  return (
    <>
      <div className='p-8'>
        <div className='p-8 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
          <div className='flex flex-wrap justify-between mb-8'>
            <div className='w-full lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
              <h1 className='text-4xl font-bold'>GMC Suspension Audit</h1>
              <p className='text-lg font-medium mt-2'>Find out what is causing your GMC suspension and get your Google Shopping Campaigns running again</p>
              <p className='text-sm font-medium mt-2'><KeyboardDoubleArrowRightIcon style={{ color: '#ed9714', fontSize: '35px' }} />We'll audit your website, product feed and GMC Account</p>
              <p className='text-sm font-medium mt-2'><KeyboardDoubleArrowRightIcon style={{ color: '#ed9714', fontSize: '35px' }} />You’ll receive a comprehensive report outlining the likely causes of your suspension and what you need to fix</p>
              <div className='flex items-center mt-4'>
                {/* <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ background: '#008060', color: 'white', marginRight: '10px' }} className='bg-[#008060]'>Get Your Audit Now $299</Button></a> */}
                <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='outlined'><HeadsetMicIcon />Talk to an expert</Button></a>
              </div>
            </div>
            <div className='w-[70%] lg:w-[50%] xl:w-[50%] 2xl:w-[50%] flex justify-end'>
              <img className='w-[60%]' src='https://keycommerce.com/wp-content/uploads/Merchant-Center-Suspension-Hero-2-1.webp' />
            </div>
          </div>
        </div>
        <>
          <div className='mt-8'>
            <h1 className='text-4xl font-bold text-center'>Is your Google Merchant Center Account Suspended?</h1>
            <img className='m-auto mt-8' src='https://keycommerce.com/wp-content/uploads/Google-Merchant-Center-Suspension-Misrepresentation-of-Self-and-Products-Unacceptable-Business-Practices2-1-1024x146.png' />
            <p className='text-base font-medium mt-8 text-center'>Google has been banning Google Merchant Center accounts like crazy and it’s very hard to understand why it’s happening to your own store.</p>
            <h1 className='text-4xl font-bold mt-8 text-center'>We have found that there are 3 main areas causing GMC Suspensions:</h1>
          </div>
        </>
        <>
          <div className='mt-8'>
            <div className='p-8 bg-white rounded-md w-[100%] border-2 border-[black]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
              <div className='flex flex-wrap items-center'>
                <div className='w-full lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                  <img src='https://keycommerce.com/wp-content/uploads/issue1.png' />
                </div>
                <div className='w-full lg:w-[70%] xl:w-[70%] 2xl:w-[70%]'>
                  <h1 className='text-xl font-medium'>1. Issues within your Google Merchant Center Account</h1>
                  <p className='text-sm font-medium mt-2'>We regularly find issues within Google Merchant Center. Such as incorrect  or poorly added Business Information Settings, problems with Shipping Information, or more.</p>
                </div>
              </div>
            </div>
            <div className='p-8 mt-4 bg-white rounded-md w-[100%] border-2 border-[black]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
              <div className='flex flex-wrap items-center'>
                <div className='w-full lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                  <img src='https://keycommerce.com/wp-content/uploads/issue2.png' />
                </div>
                <div className='w-full lg:w-[70%] xl:w-[70%] 2xl:w-[70%]'>
                  <h1 className='text-xl font-medium'>2. Issues within your Product Feed</h1>
                  <p className='text-sm font-medium mt-2'>There are often problems with product feeds causing suspensions such as product disapprovals, errors, warnings or problematic fields within your feed.</p>
                </div>
              </div>
            </div>
            <div className='p-8 mt-4 bg-white rounded-md w-[100%] border-2 border-[black]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
              <div className='flex flex-wrap items-center'>
                <div className='w-full lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                  <img src='https://keycommerce.com/wp-content/uploads/Vector-Smart-Object-2.png' />
                </div>
                <div className='w-full lg:w-[70%] xl:w-[70%] 2xl:w-[70%]'>
                  <h1 className='text-xl font-medium'>3. Issues on Your Website</h1>
                  <p className='text-sm font-medium mt-2'>A large amount of issues occur on your website. Missing (or poorly written) policy pages, misleading information, copied product details and reviews, among a multitude of other factors that can lead to a poor user experience.</p>
                </div>
              </div>
            </div>
          </div>
        </>
        <>
          <div className='my-8'>
            <p className='text-sm font-medium mt-2 text-center'>When you sign up for our GMC Suspension Audit, our expert GMC team will go over these 3 areas to identify the likely cause of your suspension.</p>
            <p className='text-sm font-medium mt-2 text-center'>You will receive a PDF report that outlines what we recommend you fix before you request a review of your account with Google</p>
            <div className='flex justify-center my-8'>
              {/* <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ background: '#008060', color: 'white', marginRight: '10px' }} className='bg-[#008060]'>Get Your Audit Now $299</Button></a> */}
              <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='outlined'><HeadsetMicIcon />Talk to an expert</Button></a>
            </div>
          </div>
        </>

        <>
          <div className='p-8 mt-8 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
            <h1 className='text-3xl font-bold'>More Information about out Audit Service</h1>
            <p className='text-xl font-bold mt-8'>What's included in our audit service?</p>
            <div className='mt-8 m-auto'>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>We’ll gain access to your platforms and our Expert GMC team will follow our process to identify the likely issue</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>Full audit of your website</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>Full audit of your Google Merchant Center account</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>Full audit of your product feed</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>We’ll contact Google on your behalf. In some cases, Google will provide us with extra information to assist in finding the issue causing your suspension.</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>We'll fix and adjust your feed and Google Merchant Center account if we find any issues.</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>We'll provide a list of recommendations for you to change on your website to have the best chance at getting unsuspended.</p>
              </div>
              <div className='mt-4 flex items-center'>
                <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                <p className='text-lg font-medium text-center'>We’ll compile our findings, recommendations and what we fixed into a PDF report and deliver this to your email</p>
              </div>
            </div>
            <div className='mt-8'>
              <p className='text-xl font-bold mt-8'>What will you still need to do?</p>
              <div className='mt-8'>
                <div className='mt-4 flex items-center'>
                  <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                  <p className='text-lg font-medium text-center'>We’ll gain access to your platforms and our Expert GMC team will follow our process to identify the likely issue</p>
                </div>
                <div className='mt-4 flex items-center'>
                  <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                  <p className='text-lg font-medium text-center'>Full audit of your website</p>
                </div>
                <div className='mt-4 flex items-center'>
                  <TaskAltIcon style={{ fontSize: '35px', marginRight: '10px' }} />
                  <p className='text-lg font-medium text-center'>Full audit of your Google Merchant Center account</p>
                </div>
              </div>
            </div>
          </div>
        </>
        <>
          <div className='p-8 mt-8 rounded-md w-[100%]'>
            <h1 className='text-4xl font-bold'>Why so many suspended stores in 2020?​</h1>
            <div className='flex flex-wrap justify-between'>
              <div className='mt-4 w-full lg:w-[70%] xl:w-[70%] 2xl:w-[70%]'>
                <p className='text-2xl font-bold'>Google's updated algorithm</p>
                <p className='text-sm font-medium mt-4'>While many store owners have been violating Google's Shopping policies for years, in July of 2020 Google began a huge crackdown on these stores, particularly dropshippers.</p>
                <p className='text-sm font-medium mt-4'>Google wants to create the best experience for customers and with a huge flood of new store owners that were flaunting the rules, Google had to do something about it. They have now made it very hard for beginners who actually are doing the right thing. It's now much harder to get a new account live on Google Merchant Center without being suspended.</p>
              </div>
              <div className='w-full lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                <img src='https://keycommerce.com/wp-content/uploads/Layer-20.png' />
              </div>
            </div>
          </div>
        </>
        <>
          <div className='p-8 mt-8 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
            <div className='flex flex-wrap justify-between'>
              <div className='w-full lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                <img src='https://keycommerce.com/wp-content/uploads/Layer-20-copy.png' />
              </div>
              <div className='mt-4 w-full lg:w-[70%] xl:w-[70%] 2xl:w-[70%]'>
                <p className='text-2xl font-bold'>Google's Policies are NOT enough</p>
                <p className='text-sm font-medium mt-4'>Google rarely tells you the exact cause of your suspension.
                  They usually tell you to check their policies and fix your store. That's it. The problem is that <b> the cause of your suspension is often not directly mentioned in their policies.</b></p>
                <p className='text-sm font-medium mt-4'>Google now relies on finding patterns between stores. This allows them to quickly spot stores that COULD be a potential scammer. Once you learn these patterns you can fix your store, appeal the suspension and get your Shopping Ads running again.</p>
              </div>
            </div>
          </div>
        </>
        <>
          <div className='p-8 mt-8 rounded-md w-[100%]'>
            <div className='flex flex-wrap justify-between'>
              <div className='mt-4 w-full lg:w-[70%] xl:w-[70%] 2xl:w-[70%]'>
                <p className='text-2xl font-bold'>Google thinks you're a scammer (you're not)</p>
                <p className='text-sm font-medium mt-4'>It is very hard to know that a store is scamming people until someone actually reports it. Because of this, Google needed a way to identify scammers before they even scam.</p>
                <p className='text-sm font-medium mt-4'>Like with many of the suspended stores we help, only an extremely small percentage are actually doing something bad. Most have just been innocently caught up in Google's algorithm by accident.</p>
                <p className='text-sm font-medium mt-4'>Let us take a look at your website, Google Merchant Center Account and Product feed and we'll tell you the likely cause of your suspension. Get these areas fixed and you can appeal your suspension in order get back advertising on Google Shopping.</p>
              </div>
              <div className='w-full lg:w-[30%] xl:w-[30%] 2xl:w-[30%]'>
                <img src='https://keycommerce.com/wp-content/uploads/GMC-Audit-2.jpg' />
              </div>
            </div>
          </div>
        </>
        <>
          {/* <div className='p-8 mt-4 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
            <h1 className='text-4xl font-bold text-center'>Frequently Asked Questions</h1>
            <div className='mt-4'>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      What are the steps to getting an audit for my GMC Suspension from you guys?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    Go to the checkout and pay here. You will then be taken to a new form that takes you through the steps of giving us access to the right platforms (Google Analytics, Google Merchant Center). The form will also ask you more questions about your suspension that will help us find the likely cause of your suspension. Please answer these questions the best you can. It gives us a big head start and we’ll have a much better chance of finding the cause if you fill them out well. Once complete, we’ll start the audit which generally takes 7 days (but we’ll do what we can to get it done before then). Keep in mind that there’s a lot of things that we check in our audit. We’re basically checking your entire website, GMC account and feed! You will receive an email from our team once the audit is complete. You will receive the audit as a PDF report attached to that email.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      Can you guarantee that I will get unsuspended?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    We can't provide a guarantee or promise that you will get unsuspended as this is entirely up to Google and their team. Our audit covers all the best practices and what we've seen to cause suspensions in the past. We've helped other stores get unsuspended but we can't guarantee that we'll find the exact cause of your suspension. Suspensions are entirely up to Google's discretion and you will still need to put in the work to communicate with Google which involves emails and potentially, calls.
                  </p>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      How long does the audit take?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    Our audits will currently take 7 days to complete. We spend a lot of time on our audits as there’s a lot of things to check on all platforms. We’ll do our best to deliver it as soon as possible.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      Are you going to contact Google for me?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    Yes, we contact them via email as well as the support chat. We’ll include our findings in the audit. Sometimes Google will provide us with valuable information to assist but in many cases we’ll also receive canned responses.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      Are you going to help me until I get my account unsuspended?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    This is not a service with ongoing support but you are free to email us after making our recommended changes and we’ll double check that they’re made properly. Because this is a one-time audit service, we can provide you with support for 30 days after we deliver your audit.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      Will you edit my website for me?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    No. To keep the cost of this audit service low, you will need to make the changes to your site on your own. We will provide the recommendations but you will need to adjust your pages depending on how you sell your own products. For example, we will advise what changes or extra information you will need to add to your Returns & Refunds page but the exact words you add will vary depending on your actual policy. Every store will have their own Returns & Refunds policy so you will just add the specific information that’s relevant for your own store. We will tell you what you will need to adjust to be in line with Google’s policies and best practices.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      My account is now permanently suspended. Can you still audit it?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    Yes. We've had some clients receive those ‘permanently suspended' emails before and still been able to lift the suspension. You'll need to fix every problem on your site and in your GMC account first. You will then need to contact Google to proceed with the review but make sure your site is spotless and everything is fixed.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      $299 is outside of my budget, can you provide a discount?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    No, we don't provide special discounts on our products or services. This audit service takes a considerable amount of our team's time to conduct. If it's outside your budget then we recommend you check out our GMC Suspension Guide here. This includes a full walkthrough and checklist you can apply to your own store to find the likely cause of the suspension and get it lifted.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div className='flex items-center'>
                    <img className='w-8' src={faq} />
                    <p className='font-medium ml-2'>
                      I have another question about the audit or your other services?
                    </p>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <p className='font-normal text-sm'>
                    Send our team an email at support@easyfeedforgoogleshopping.com and we’ll get back to you when we can.
                  </p>
                </AccordionDetails>
              </Accordion>
            </div>
          </div> */}
        </>
        <>
          {/* <div className='mt-8 flex justify-between flex-wrap items-center'>

            <div class="max-w-md px-8 py-4 mx-auto mt-16 bg-white rounded-lg shadow-lg ">
              <div class="flex justify-center -mt-16 md:justify-end">
                <img class="object-cover w-[50%]" alt="Testimonial avatar" src="https://keycommerce.com/wp-content/uploads/1-details.png" />
              </div>
              <h2 class="mt-4 text-2xl font-semibold text-gray-800 md:mt-0 md:text-3xl">Purchase your audit</h2>
              <p class="mt-4 mb-4 text-gray-600 ">Purchase the audit on our checkout page here.</p>
            </div>
            <div class="max-w-md px-8 py-4 mx-auto mt-16 bg-white rounded-lg shadow-lg ">
              <div class="flex justify-center -mt-16 md:justify-end">
                <img class="object-cover w-[50%]" alt="Testimonial avatar" src="https://keycommerce.com/wp-content/uploads/2-access.png" />
              </div>
              <h2 class="mt-4 text-2xl font-semibold text-gray-800 md:mt-0 md:text-3xl">Provide us access to your platforms</h2>
              <p class="mt-4 mb-4 text-gray-600 ">You will then be redirected to the onboarding form which shows you how to give us all the right access to your platforms. It will also ask you more about your suspension which helps us find the likely cause.</p>
            </div>
            <div class="max-w-md px-8 py-4 mx-auto mt-16 bg-white rounded-lg shadow-lg ">
              <div class="flex justify-center -mt-16 md:justify-end">
                <img class="object-cover w-[50%]" alt="Testimonial avatar" src="https://keycommerce.com/wp-content/uploads/3-receive-audit.png" />
              </div>
              <h2 class="mt-4 text-2xl font-semibold text-gray-800 md:mt-0 md:text-3xl">Receive your audit within 7 business days</h2>
              <p class="mt-4 mb-4 text-gray-600">Sent to your email</p>
            </div>
          </div> */}
          <div className='flex justify-center mt-4'>
            {/* <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ background: '#008060', color: 'white', marginRight: '10px' }} className='bg-[#008060]'>Get Your Audit Now $299</Button></a> */}
            <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='outlined'><HeadsetMicIcon />Talk to an expert</Button></a>
          </div>
        </>
      </div>
    </>
  )
}

export default Audit