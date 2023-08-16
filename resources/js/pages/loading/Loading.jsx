import React from 'react'
import { useNavigate } from 'react-router-dom';
import loadingBG from './loadingBG.png'
import CircularProgress from '@mui/material/CircularProgress';
import ReactGA from "react-ga4";


const Loading = () => {

    const navigate = useNavigate();

    React.useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/loading", title: "Loading" });
        setTimeout(() => {
            navigate('/Dashboard');
        }, 20000)
    }, [])

    return (
        <div>
            <img className='w-[36%] m-auto' src={loadingBG} alt='loadingBG' />
            <p className='text-xl font-bold text-center'>Please wait for a few seconds. We are synchronising data from Shopify to the Google Merchant Centre.</p>
            <div className='flex justify-center m-auto mt-8'>
                <CircularProgress style={{ color: '#008060' }} />
            </div>
        </div>
    )
}

export default Loading