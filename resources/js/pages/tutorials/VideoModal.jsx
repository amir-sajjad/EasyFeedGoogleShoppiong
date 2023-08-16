import React from 'react'
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Button } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

const VideoModal = (props) => {

    const [videoModal, setVideoModal] = React.useState(false)

    return (
        <>

            <div style={{ margin: props.margin }} onClick={() => setVideoModal(!videoModal)} className='flex items-center cursor-pointer w-fit'>
                <YouTubeIcon style={{ color: '#fd0000' }} />
                <span className='flex items-center font-bold text-[#fd0000] text-sm ml-1'>{props.title}</span>
            </div>

            {videoModal ? (
                <>
                    <div className="fixed inset-0 z-40 overflow-y-auto">
                        <div
                            className="fixed inset-0 w-full h-full bg-black opacity-70"
                            onClick={() => setVideoModal(false)}
                        ></div>
                        <div className="flex w-full h-full items-center px-4 py-8">
                            <div className="relative w-[70%] p-4 mx-auto">
                                <div className="">
                                    <div className='flex items-center p-2'>
                                        <CloseIcon style={{ color: 'white', fontSize: '35px' }} onClick={() => setVideoModal(false)} className='absolute top-0 right-0 hover:transition-all transition ease-in-out delay-250 hover:rotate-180 cursor-pointer' />
                                    </div>
                                    <div className='p-4'>
                                        <iframe width="100%" height="490vh" src={props.videoSrc} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}

export default VideoModal