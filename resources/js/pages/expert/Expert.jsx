import React from 'react'
import { useState } from 'react';
import { Button } from '@mui/material'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ExpertImg from './ExpertImg.png';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MapIcon from '@mui/icons-material/Map';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SegmentIcon from '@mui/icons-material/Segment';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import img from './img.png';
import img1 from './img1.png';
import img2 from './img2.png';
import img3 from './img3.png';
import img4 from './img4.png';
import img5 from './img5.png';
import img6 from './img6.png';
import faq from './faq.gif';
import Calling from './Calling.png';
import './expert.css'
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from '@mui/material/Slider';
import ReactGA from "react-ga4";


const Expert = () => {

    const [showModal, setShowModal] = useState(false);

    const [amount, setAmount] = useState(99.99);
    const [feed, setFeed] = useState(1);
    const [products, setProducts] = useState(500);

    const amountHandler = (e) => {
        // e.target.value cannot get negative value



        // amunt multiply with e.target.value

        setAmount(99.99 * e.target.value);
        setFeed(e.target.value);
        setProducts(500 * e.target.value);


    }

    const [inputVal, setInputVal] = useState(false);
    const [inputVal1, setInputVal1] = useState(false);


    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    ReactGA.send({ hitType: "pageview", page: "/expert", title: "Feed Expert" });

    return (
        <>
            <div className='p-8'>
                <div className='py-8 px-[10%] bg-white rounded-md flex justify-between flex-wrap w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <div className='w-full lg:w-[50%] xl:w-[50%] 2xl:w-[50%]'>
                        <div className='flex items-center'>
                            <p className='text-3xl font-bold'>Unlock Profit in Your Google Shopping Feed</p>
                        </div>

                        <p className='mt-4 text-md font-normal'>When was the last time you cleaned up your Google Shopping product feed?</p>
                        <p className='mt-4 text-md font-normal'>If your answer is “never,” you’re not alone. Most merchants skip this crucial step—letting your valuable ad dollars slip through the cracks.</p>
                        <p className='mt-4 text-md font-normal'>It’s more than just pocket change. A disorganized product feed leads to lost conversions, missing data, and worst of all—wasted profit. But you can avoid the headache. When we clean up your feed with our six-step product feed management process, you’ll be shocked by how much money you’ve been sitting on this whole time.</p>
                        <div className='mt-4'>
                            {/* <Button onClick={() => setShowModal(!showModal)} variant="outlined" className='mt-4'>Hire Expert</Button> */}
                            <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant="contained" className='mt-4' style={{ backgroundColor: '#008060', color: 'white', marginLeft: '10px' }}><HeadsetMicIcon />Talk to an expert</Button></a>
                        </div>
                    </div>
                    <div className='w-full lg:w-[50%] xl:w-[50%] 2xl:w-[50%] flex justify-end'>
                        <img className='w-[80%] sm:w-full md:w-full' src={img} />
                    </div>
                </div>
                <div className='p-8 mt-4 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <div className=''>
                        <h1 className='text-3xl font-bold text-center'>Our 6-step process</h1>
                        <p className='mt-4 text-md font-normal text-center'>With over 21,000,000 products optimized, EasyFeed product management minimizes errors and maximizes your profit in just 6 Steps:</p>
                    </div>
                    <div className='flex justify-between flex-wrap mt-12'>
                        <div className='w-full sm:w-full md:w-full lg:w-[50%] xl:w-[30%] 2xl:w-[20%] mt-8'>
                            <h1 className='text-3xl font-bold text-center text-[#09d19f]'><VerifiedUserIcon style={{ fontSize: '35px' }} /> Audit</h1>
                            <p className='text-md font-normal text-center'>Every new client’s feed is audited according to a rigorous set of standards before being rebuilt, to make sure no potential profit slips through the cracks.</p>
                        </div>
                        <div className='w-full sm:w-full md:w-full lg:w-[50%] xl:w-[30%] 2xl:w-[20%] mt-8'>
                            <h1 className='text-3xl font-bold text-center text-[#09d19f]'><MapIcon style={{ fontSize: '35px' }} /> Map</h1>
                            <p className='text-md font-normal text-center'>Once the data has been validated, we map the relevant source fields to fields in the new feed. This mapping is validated again to make sure your data is in the right place.</p>
                        </div>
                        <div className='w-full sm:w-full md:w-full lg:w-[50%] xl:w-[30%] 2xl:w-[20%] mt-8'>
                            <h1 className='text-3xl font-bold text-center text-[#09d19f]'><SyncAltIcon style={{ fontSize: '35px' }} /> Revise</h1>
                            <p className='text-md font-normal text-center'>After mapping the data, our analysts solve for missing or inaccurate data. We also fix any errors resulting from disallowed terms or special characters.</p>
                        </div>
                    </div>
                    <div className='flex justify-between flex-wrap mt-12'>
                        <div className='w-full sm:w-full md:w-full lg:w-[50%] xl:w-[30%] 2xl:w-[20%] mt-8'>
                            <h1 className='text-3xl font-bold text-center text-[#09d19f]'><BuildCircleIcon style={{ fontSize: '35px' }} /> Build</h1>
                            <p className='text-md font-normal text-center'>We create logical product segments in the feed which are unique to every client and can include important factors like brand, vendor, and seasonality.</p>
                        </div>
                        <div className='w-full sm:w-full md:w-full lg:w-[50%] xl:w-[30%] 2xl:w-[20%] mt-8'>
                            <h1 className='text-3xl font-bold text-center text-[#09d19f]'><SegmentIcon style={{ fontSize: '35px' }} /> Segment</h1>
                            <p className='text-md font-normal text-center'>We segment your products by available margin, in addition to key product attributes such as seasonality. We also segment out top-selling products to direct ad spend more precisely.</p>
                        </div>
                        <div className='w-full sm:w-full md:w-full lg:w-[50%] xl:w-[30%] 2xl:w-[20%] mt-8'>
                            <h1 className='text-3xl font-bold text-center text-[#09d19f]'><SyncIcon style={{ fontSize: '35px' }} /> Sync</h1>
                            <p className='text-md font-normal text-center'>Finally, your feed is synced at least daily, to ensure the information present in GMC is up-to-date. This process also ensures products can serve as quickly as possible.</p>
                        </div>
                    </div>
                </div>
                <div className='p-8 mt-4 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <Swiper style={{ width: '100%' }}
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        spaceBetween={50}
                        slidesPerView={3}
                        scrollbar={{ draggable: true }}
                        onSwiper={(swiper) => console.log(swiper)}
                        onSlideChange={() => console.log('slide change')}
                        autoplay={{
                            delay: 1500,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            400: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 40,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 50,
                            },
                            2000: {
                                slidesPerView: 4,
                                spaceBetween: 50,
                            },
                            2500: {
                                slidesPerView: 5,
                                spaceBetween: 50,
                            },
                            3000: {
                                slidesPerView: 6,
                                spaceBetween: 50,
                            },
                        }}

                    >
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>Jewelry by johan</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>By far our most effective marketing partner! Incredibly knowledgeabe in search marketing across multiple channels</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>IndustrialSafetyGear</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>Dealing with EasyFeed has been a breath of fresh air. We are more than happy to call them a true partner in success.</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>Curbside Gourmet</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>I can't say enough about EasyFeed. They have managed ads for two companies that i run. Both companies saw a noticeable increase once EasyFeed took over managing our ad campaigns</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>SpaCare</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>EasyFeed miraculously planted a money tree i harvest every day!</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>PositivePromotions</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>They apply deeply analytical approach to their efforts that not only helps to maximize revenue growth, but does so profitably. I highly recommend their service.</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>eManualOnline</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>What EasyFeed has achieved with my account is stunning. By far the best agency i've ever worked with!</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div class="containerDiv bg-white rounded-md" style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div class="contentDiv">
                                    <div className='flex items-center'>
                                        <img className='w-8' src='https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png' />
                                        <p className='ml-2 font-medium'>DecoratorsBest</p>
                                    </div>
                                    <div>
                                        <p className='mt-4 text-sm font-normal'>In our first year, our revenue nearly doubled. They are knowledgeable, a pleasure to work with, and responsive for any of my questions.</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className='p-8 mt-4 bg-white rounded-md w-[100%] border-2 border-[#09d19f]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <div className='flex items-center'>
                        <div className='w-[10%] sm:w-[20%]'>
                            <img className='w-[100%]' src={Calling} />
                        </div>
                        <div className='w-[100%]'>
                            <div className='flex items-center ml-8'>
                                <p className='text-xl font-normal mr-1'>Supercharge Your Sales with Feed Optimization - Unleash the Full Potential of Your Product Listings</p>
                            </div>
                            <div className='mt-4 ml-8'>
                                {/* <Button onClick={() => setShowModal(!showModal)} variant="outlined" className='mt-4'>Hire Expert</Button> */}
                                <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant="contained" className='mt-4' style={{ backgroundColor: '#008060', color: 'white', marginLeft: '10px' }}><HeadsetMicIcon />Talk to an expert</Button></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-8 mt-4 bg-white flex justify-between flex-wrap rounded-md w-[100%]'>
                    <div className='w-[50%]'>
                        <h1 className='text-3xl font-bold flex'>1. Audit data</h1>
                        <p className='mt-4 text-md font-normal'>In the first step of our feed optimization process we audit your account, starting by checking that all required fields are present. Then we create parent-child SKUs to ensure variants are properly advertised. Finally, we merge all other relevant data sources such as updated descriptions or alternate currencies.</p>
                    </div>
                    <div className='w-[50%] flex justify-end'>
                        <img className='w-[50%]' src={img1} />
                    </div>
                </div>
                <div className='p-8 mt-4 flex justify-between flex-wrap rounded-md w-[100%]'>
                    <div className='w-[50%]'>
                        <img className='w-[50%]' src={img2} />
                    </div>
                    <div className='w-[50%]'>
                        <h1 className='text-3xl font-bold flex'>2. Map fields</h1>
                        <p className='mt-4 text-md font-normal'>Once the data has been validated, we map source fields from your old feed to the new Google Shopping product feed. This mapping is validated again to ensure the data ends up in the right place. Fields we map include:</p>
                        <div className='mt-4 flex justify-around items-center'>
                            <div>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> product_title</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> description</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> sale_price</p>
                            </div>
                            <div>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} />
                                    image</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> gtin</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> mpn</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-8 mt-4 bg-white flex justify-between flex-wrap rounded-md w-[100%]'>
                    <div className='w-[50%]'>
                        <h1 className='text-3xl font-bold flex'>3. Revise fields</h1>
                        <p className='mt-4 text-md font-normal'>After mapping the data, we solve for inaccurate data, and fix errors such as:</p>
                        <div className='mt-4 flex justify-around items-center'>
                            <div>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Invalid GTINS</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Disallowed words or phrases</p>
                            </div>
                            <div>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Invalid special characters</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Missing or incorrect images</p>
                            </div>
                        </div>
                        <p className='mt-4 text-md font-normal'>Once we revise everything, we double-check the feed to make sure every missing or inaccurate field is updated and optimized. This process ensures that your campaigns are built with the best possible data.</p>
                    </div>
                    <div className='w-[50%] flex justify-end'>
                        <img className='w-[50%]' src={img3} />
                    </div>
                </div>
                <div className='p-8 mt-4 flex justify-between flex-wrap rounded-md w-[100%]'>
                    <div className='w-[50%]'>
                        <img className='w-[50%]' src={img4} />
                    </div>
                    <div className='w-[50%]'>
                        <h1 className='text-3xl font-bold flex'>4. Build Campaigns</h1>
                        <p className='mt-4 text-md font-normal'>Your dedicated analyst will create a campaign structure tailored to your business. Your product feed management can include variety of product attributes such as:</p>
                        <div className='mt-4 flex justify-around items-center'>
                            <div>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Brand</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Product</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Seasonality</p>
                            </div>
                            <div>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Category</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Cost-of-Goods</p>
                                <p className='font-normal text-lg mt-2'><CheckCircleIcon style={{ fontSize: '35px', color: '#8DC63F' }} /> Product Performance</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-8 mt-4 bg-white flex justify-between flex-wrap rounded-md w-[100%]'>
                    <div className='w-[50%]'>
                        <h1 className='text-3xl font-bold flex'>5. Find top sellers</h1>
                        <p className='mt-4 text-md font-normal'>Next, we identify top performers and separate them from products that don’t sell as well. This also allows us to assign appropriate bids to products based on performance. A large percentage of spend can be directed to your top selling products that will grow your revenue and increase profit. At the same time products that sell less frequently are still able to be advertised as a spend level that’s profitable.</p>
                        <p className='mt-4 text-md font-normal'>Your top products might override other products in an ad group—that’s why we segment them out in our campaign structure.</p>
                    </div>
                    <div className='w-[50%] flex justify-end'>
                        <img className='w-[50%]' src={img5} />
                    </div>
                </div>
                <div className='p-8 mt-4 flex justify-between flex-wrap rounded-md w-[100%]'>
                    <div className='w-[50%]'>
                        <img className='w-[50%]' src={img6} />
                    </div>
                    <div className='w-[50%]'>
                        <h1 className='text-3xl font-bold flex'>6. Sync Your feed daily</h1>
                        <p className='mt-4 text-md font-normal'>Even if your feed is optimized, it won’t do any good if your feed isn’t routinely synced. But you don’t need to worry about that!</p>
                        <p className='mt-4 text-md font-normal'>Our product feed management includes at least daily syncs, to ensure the information present in Google Merchant Center is as up-to-date as possible. This process also ensures any needed campaigns or ad groups are promptly built, so products can serve as quickly as possible.</p>
                    </div>
                </div>

                {/* <div className='background-img p-8 mt-4 flex justify-between flex-wrap rounded-md w-[100%] h-[100vh]' style={{ backgroundImage: `url(${bg3})`, backgroundSize: '100% 100vh', backgroundRepeat: 'no-repeat', }}>
                    sdfsd
                </div> */}

                <div className='p-12 mt-4 bg-white rounded-md w-[100%]'>

                    <h1 className='text-3xl font-bold  text-center'>The Final Piece of The Puzzle</h1>
                    <p className='mt-8 text-md font-normal text-center'>Product feed management is an ongoing process.
                        You can rest easy knowing our analysts run regular checks on your product feed, to ensure any errors or disapprovals are found and fixed before they can become major problems!
                        We also look for opportunities to continually improve the quality of your feed—by performing in-depth title optimization analyses and other reviews regularly.</p>
                    <p className='mt-8 text-md font-normal text-center'>Want to see just how much money you could be missing out on? Set up a free strategy call today to unlock the profit hidden in your Google Shopping product feed today!</p>
                    <div className='mt-8 flex justify-center items-center'>
                        {/* <Button variant="outlined" className='mt-4'>Hire Expert</Button> */}
                        <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant="contained" className='mt-4' style={{ backgroundColor: '#008060', color: 'white', marginLeft: '10px' }}><HeadsetMicIcon />Talk to an expert</Button></a>
                    </div>
                </div>
                <div className='p-8 mt-4 bg-white rounded-md w-[100%] border-2 border-[#09d19f]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <div className='flex items-center'>
                        <div className='w-[10%] sm:w-[20%]'>
                            <img className='w-[100%]' src={Calling} />
                        </div>
                        <div className='w-[100%]'>
                            <div className='flex items-center ml-8'>
                                <p className='text-xl font-normal mr-1'>Supercharge Your Sales with Feed Optimization - Unleash the Full Potential of Your Product Listings</p>
                            </div>
                            <div className='mt-4 ml-8'>
                                {/* <Button onClick={() => setShowModal(!showModal)} variant="outlined" className='mt-4'>Hire Expert</Button> */}
                                <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant="contained" className='mt-4' style={{ backgroundColor: '#008060', color: 'white', marginLeft: '10px' }}><HeadsetMicIcon />Talk to an expert</Button></a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='p-8 mt-4 bg-white rounded-md w-[100%]' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <div>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <div className='flex items-center'>
                                    <img className='w-8' src={faq} />
                                    <p className='font-medium ml-2'>
                                        Do I need to provide store permission for the process to start?
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className='font-normal text-sm'>
                                    Yes, we need to access apps, products and categories to evaluate your situation. Therefore please help provide us with either a Staff or Collaborator account to access merchant stores for further process. Please be ensured that we have a data consent to prevent any leakage of your data
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
                                        How can Feed Experts optimize products that violate platform policies?
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className='font-normal text-sm'>
                                    As Feed Experts, we do not recommend any manual tricks. Instead, we help you review carefully whether your products correspond to policy compliance in your target sales channel and market. Should your products have some points that do not match data quality or policy compliance, we recommend that those products should be removed temporarily from your feed for a considerate review.
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
                                        What should I do if I provide low-quality product images?
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className='font-normal text-sm'>
                                    If low-quality images are detected, we will help propose solutions to optimize image quality based on guidelines of the corresponding platform.
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
                                        Can you offer optimization to multiple feeds?
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className='font-normal text-sm'>
                                    Yes, we ensure an optimization to the number of feeds upon your request. In case of multiple-feed requests, your situation would be reviewed based on the priority of each single feed. A report will be generated integrally to keep you updated of all-feed issues. Each ticket is equal to 1 feed. Multiple feeds means more added tickets.
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
                                        What are the main issues that cause disruption to my product feed?
                                    </p>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p className='font-normal text-sm'>
                                    There are two main issues. The first one include account-level issues that correspond to data quality and policy violations. The second one relate to item-level details (e.g: text, image or category)
                                </p>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div> */}
            </div>









            {/* -----------Review Modal--------------- */}
            <>
                {showModal ? (
                    <>
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div
                                className="fixed inset-0 w-full h-full bg-black opacity-40"
                                onClick={() => setShowModal(false)}
                            ></div>
                            <div className="flex items-center min-h-screen px-4 py-8">
                                <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                                    <div className="">
                                        <div className='flex items-center p-2 mb-4'>
                                            {/* <p className='text-lg font-medium ml-2'>Tell us about your experience</p> */}
                                            <CloseIcon onClick={() => setShowModal(false)} className='absolute right-3 hover:bg-gray-100 hover:transition-all transition ease-in-out delay-250 hover:rotate-180  cursor-pointer' />
                                        </div>
                                        {/* <Divider style={{ margin: '10px 0 10px 0' }} /> */}
                                        <div className=''>
                                            <div className='p-8 rounded-md bg-white' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                                <h1 className='text-xl font-medium text-gray-800'>Get your Product Data Feeds in Shape.</h1>
                                                <p className='text-sm font-normal text-gray-800'>We help online shops manage and optimise their product data feeds performance in real-time</p>
                                            </div>
                                            <div className='p-8'>
                                                <p className='text-center text-lg font-bold'>Estimate Your Price</p>
                                                <div className='flex justify-center w-[70%] m-auto'>
                                                    <Slider onChange={amountHandler} defaultValue={1} step={1} min={1} max={100} aria-label="Default" valueLabelDisplay="auto" style={{ color: '#008060' }} />
                                                </div>
                                                <div className='flex justify-around pt-4'>
                                                    <p>Total</p>
                                                    <div class="flex">
                                                        <p class="font-medium text-xl text-center mt-4">
                                                            <sup class="flex"><p class="text-gray-500">USD</p><b>$</b></sup>
                                                        </p>
                                                        <p class="text-2xl font-bold text-center">{amount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className='p-4 w-[80%] rounded-lg bg-white m-auto' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                                    <p class="font-bold text-lg text-black">All services:</p>
                                                    <ul>
                                                        <li className='text-xs font-normal mt-2 text-black'><CheckIcon style={{ color: '#8DC63F', marginRight: '10px' }} />Manage {feed} feed</li>
                                                        <li className='text-xs font-normal mt-2 text-black'><CheckIcon style={{ color: '#8DC63F', marginRight: '10px' }} /> Optimized {products} Product Title and Description </li>
                                                        <li className='text-xs font-normal mt-2 text-black'><CheckIcon style={{ color: '#8DC63F', marginRight: '10px' }} /> Improve Product Quality Score</li>
                                                        <li className='text-xs font-normal mt-2 text-black'><CheckIcon style={{ color: '#8DC63F', marginRight: '10px' }} /> Accurate Product Categorization</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className='px-8'>
                                                <Divider style={{ margin: '0 0 10px 0' }} />
                                                <FormGroup>
                                                    <FormControlLabel value={inputVal} onChange={e => setInputVal(!inputVal)} control={<Checkbox style={{ color: "#008060" }} />} label="I agree to provide EasyFeed access to my store, theme, and product." />
                                                    <FormControlLabel value={inputVal1} onChange={e => setInputVal1(!inputVal1)} control={<Checkbox style={{ color: "#008060" }} />}
                                                        label={<div><p> I have read and agree to <a className='text-blue-700' target='_blank' href='https://easyfeedforgoogleshopping.com/terms-of-service'>Terms of Service</a> and<a className='text-blue-700 ml-1' target='_blank' href='https://easyfeedforgoogleshopping.com/privacy-policy'>Privacy Policy.</a></p></div>}
                                                    />

                                                    {/* label="I have read and agree to Terms of Service and Privacy Policy." */}
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <Divider style={{ margin: '10px 0 10px 0' }} />
                                        <div className='flex justify-center'>
                                            {/* <Button disabled={!inputVal || !inputVal1} onClick={() => { setShowModal(false); }} style={{ background: "#008060" }} variant="contained">Hire Expert</Button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </>

        </>
    )
}

export default Expert