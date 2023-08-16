import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Button, Divider } from '@material-ui/core';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';





const CloseTickets = () => {



    const navigate = useNavigate();
    const HelpCenterOnClick = useCallback(() => navigate('/HelpCenter', { replace: true }), [navigate]);

    return (
        <div>
            <>
                <div className='p-12'>
                    <Button onClick={HelpCenterOnClick} variant='outlined' style={{ marginBottom: '10px' }} ><ArrowBackIcon /></Button>
                    <div className='bg-white p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                        <p className='font-medium text-base'>[#3453452] - My order is not delivered</p>
                        <div className='pt-2'>
                            <div className='flex justify-between items-baseline'>
                                <div className='w-[75%] p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                    <div className='flex justify-between'>
                                        <div className='flex items-center'>
                                            <AccountCircleIcon style={{ color: '#008060', fontSize: '40px' }} />
                                            <p className='ml-2 font-medium'>@User</p>
                                        </div>
                                        <p className='text-sm'>September 3, 2022 at 12:30 Pm</p>
                                    </div>
                                    <p className='p-2 text-sm'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    <div className='p-4 overflow-x-scroll flex justify-between'>
                                        <div className='w-full'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div>
                                        <div className='w-full mr-2'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div>
                                        <div className='w-full mr-2'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div>
                                        <div className='w-full mr-2'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-[20%] rounded-md p-4' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                    <div className='p-2'>
                                        <p className='pt-4 font-medium'>Status</p>
                                        <p className='pt-4'>Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-[75%] mt-4 p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                            <div className='flex justify-between'>
                                <div className='flex items-center'>
                                    <SupportAgentIcon style={{ color: '#008060', fontSize: '40px' }} />
                                    <p className='ml-2 font-medium'>@Support</p>
                                </div>
                                <p className='text-sm'>September 3, 2022 at 12:30 Pm</p>
                            </div>
                            <p className='p-2 text-sm'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            <div className='p-4 overflow-x-scroll flex justify-between'>
                                <div className='w-full'>
                                    <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                </div>
                                <div className='w-full mr-2'>
                                    <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                </div>
                                <div className='w-full mr-2'>
                                    <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                </div>
                                <div className='w-full mr-2'>
                                    <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        </div>
    )

}


export default CloseTickets