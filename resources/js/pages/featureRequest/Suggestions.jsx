import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axioshttp from '../../axioshttp';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from "@mui/material/CircularProgress";
import BlockIcon from '@mui/icons-material/Block';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ReactGA from "react-ga4";


const Suggestions = () => {

    const featureId = useParams();
    const navigate = useNavigate();
    const RequestOnClick = useCallback(() => navigate('/Request', { replace: true }), [navigate]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandImageModal, setExpandImageModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [expandedImageSrc, setExpandedImageSrc] = useState(null);
    const [featureData, setFeatureData] = useState([]);
    const [replyData, setReplyData] = useState({
        featureId: featureId.featureId,
        description: '',
        attachments: []
    });
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [defaultErrors, setDefaultErrors] = useState({
        description: false,
        attachments: false,
    });
    const [attachmentErrors, setAttachmentErrors] = useState([]);

    const getSingleFeatureDetails = () => {
        const data = { id: featureId.featureId }
        axioshttp.post('feature/detail', data).then(res => {
            if (res.data.status == true) {
                setFeatureData(res.data.feature)
                setIsLoading(false)
            } else {
                setFeatureData([]);
                setIsLoading(false);
            }
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })
    }

    const expandImage = (e) => {
        console.log(e.target.src)
        setExpandedImageSrc(e.target.src)
        setExpandImageModal(true);
    }

    const handleFileChanges = (e) => {
        console.log(e.target.files)
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.match(/image.*/)) {
                setReplyData(values => ({ ...values, attachments: [...values.attachments, file] }))
                setFilesUploaded(values => ([...values, { name: file.name, valid: true }]))
            } else {
                setFilesUploaded(values => ([...values, { name: file.name, valid: false }]))
            }
        }
    };

    const createReply = () => {
        setAttachmentErrors([]);
        setIsSubmitting(true)
        axioshttp.post('feature/reply', replyData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            if (response.data.status) {
                setReplyData({
                    featureId: featureId.featureId,
                    description: '',
                    attachments: []
                });
                setFilesUploaded([]);
                setDefaultErrors({ description: false, attachments: false })
                setAttachmentErrors([])
                setIsSubmitting(false)
                setToastMessage(response.data.message)
                setShowToast(true)
                getSingleFeatureDetails()
            } else {
                setToastMessage(response.data.erorr)
                setShowToast(true);
            }
        }).catch(error => {
            console.log(error)
            if (error.response.data.hasOwnProperty('errors')) {
                var allErrors = error.response.data.errors;
                for (const error in allErrors) {
                    if (error.includes('attachments')) {
                        setAttachmentErrors(values => ([...values, allErrors[error][0]]))
                        setDefaultErrors(values => ({ ...values, ["attachments"]: true }))
                    }
                    else {
                        setDefaultErrors(values => ({ ...values, [error]: true }))
                    }
                }
            }
            setIsSubmitting(false)
        })
    }

    console.log(replyData)

    useEffect(() => {
        setTimeout(function () {
            setShowToast(false);
            setToastMessage('');
        }, 5000)
    }, [showToast])

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/requestReply", title: "Feature Request Reply" });
        getSingleFeatureDetails();
    }, [])

    return (
        <>
            <div className='p-2 sm:p-4 md:p-12 lg:p-12 xl:p-12 2xl:p-12'>
                {!isLoading && <Button onClick={RequestOnClick} variant='outlined' style={{ marginBottom: '10px' }} ><ArrowBackIcon /></Button>}
                {isLoading && <CircularProgress style={{ color: "#008060", marginRight: "10px", marginTop: "10%", marginLeft: "40%" }} size={30} />}
                {!isLoading && <div className='bg-white p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    {featureData && featureData.subject ? <div>
                        <p className='font-medium text-base'>[{featureData && featureData.feature_id ? '#' + featureData.feature_id : ''}] {featureData && featureData.subject ? ' - ' + featureData.subject : ''}</p>
                        <div className='pt-2'>
                            <div className='flex justify-between items-baseline'>
                                <div className=' p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                    <div className='flex items-center flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap justify-between'>
                                        <div className='flex items-center'>
                                            <AccountCircleIcon style={{ color: '#008060', fontSize: '40px' }} />
                                            <p className='ml-2 font-medium'>{featureData && featureData.displayName ? featureData.displayName : "johnDoe@gmail.com"}</p>
                                        </div>
                                        <p className='text-sm'>{featureData && featureData.created_at ? featureData.created_at : ''}</p>
                                    </div>
                                    <p className='p-2 text-sm'>{featureData && featureData.description ? featureData.description : ''}</p>
                                    <div className='p-4 overflow-x-scroll flex justify-between'>
                                        {featureData && featureData.attachments ? featureData.attachments.map((value, index) => (
                                            <div className='w-full mr-2'>
                                                <img className='w-[100%] cursor-pointer' onClick={expandImage} src={'/storage/images/' + value.attachment} />
                                            </div>
                                        )) : null}
                                        {/* <div className='w-full mr-2'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div>
                                        <div className='w-full mr-2'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div>
                                        <div className='w-full mr-2'>
                                            <img className='w-[70%]' src='https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png' />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {featureData && featureData.replies ? featureData.replies.map((element, index) => (
                            <div className=' mt-4 p-4 rounded-md' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                                <div className='flex items-center flex-wrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap justify-between'>
                                    {element.role == 'admin' && <div>
                                        <SupportAgentIcon style={{ color: '#008060', fontSize: '40px' }} />
                                        <p className='ml-2 font-medium'>@Support</p>
                                    </div>}
                                    {element.role == 'user' && <div>
                                        <AccountCircleIcon style={{ color: '#008060', fontSize: '40px' }} />
                                        <span className='ml-2 font-medium'>{element.displayName ? element.displayName : "johnDoe@gmail.com"}</span>
                                    </div>}
                                    <p className='text-sm'>{element.created_at}</p>
                                </div>
                                <p className='p-2 text-sm'>{element.description}</p>
                                <div className='p-4 overflow-x-scroll flex justify-between'>
                                    {element.attachments ? element.attachments.map((att) => (
                                        <div className='w-full mr-2'>
                                            <img className='w-[100%] cursor-pointer' onClick={expandImage} src={element.role == 'user' ? (att ? '/storage/images/' + att.attachment : '') : (att ? 'https://adminpanel.easyfeedforgoogleshopping.com/storage/images/' + att.attachment : '')} />
                                        </div>
                                    )) : null}
                                </div>
                            </div>
                        )) : null}
                    </div> : <div className="bg-gray-200 text-black p-4 rounded-md">
                        <span className="text-xl">Oops, this record doesn't exist anymore.</span>
                    </div>}

                    {featureData && featureData.subject ? <>
                        <div className='mt-4'>
                            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 ">Description</label>
                            <textarea id="message" value={replyData.description} name="description" onChange={(e) => { setReplyData(values => ({ ...values, [e.target.name]: e.target.value })) }} rows="4" class="block p-2.5 w-full text-sm text-gray-900 rounded-lg border" placeholder="Write your thoughts here..."></textarea>
                            {defaultErrors.description && (
                                <div className="flex">
                                    <span>
                                        <svg
                                            fill="rgba(215, 44, 13, 1)"
                                            width="20px"
                                            viewBox="0 0 20 20"
                                            class="Polaris-Icon__Svg"
                                            focusable="false"
                                            aria-hidden="true"
                                        >
                                            <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                                        </svg>
                                    </span>
                                    <span
                                        style={{ color: "rgba(215, 44, 13, 1)" }}
                                        class="ml-2 block sm:inline text-base"
                                    >
                                        Please Enter Some Description
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div class="w-full mt-4">
                                <p className='text-sm font-medium text-gray-900'>Add an attachment</p>
                                <label
                                    class="flex flex-col justify-center py-8 items-center w-full h-fit px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                    <span class="flex items-center space-x-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span class="font-medium text-gray-600">
                                            <span class="text-blue-600 underline ml-1">Browse </span>
                                            To Attach Files
                                        </span>
                                    </span>
                                    <div class="flex flex-col mt-4">
                                        {filesUploaded.map((value, index) => (
                                            <span class="font-medium text-gray-600">
                                                {value.name}
                                                {value.valid && <DoneIcon color='success' />}
                                                {!value.valid && <ClearIcon color='warning' />}
                                            </span>
                                        ))}
                                    </div>
                                    <input type="file" multiple name="file_upload" class="hidden" onChange={handleFileChanges} />
                                </label>
                                {defaultErrors.attachments && (
                                    <div>
                                        {attachmentErrors.map((value, index) => (
                                            <div className="flex">
                                                <span>
                                                    <svg
                                                        fill="rgba(215, 44, 13, 1)"
                                                        width="20px"
                                                        viewBox="0 0 20 20"
                                                        class="Polaris-Icon__Svg"
                                                        focusable="false"
                                                        aria-hidden="true"
                                                    >
                                                        <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-9a1 1 0 0 0 2 0v-2a1 1 0 1 0-2 0v2zm0 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
                                                    </svg>
                                                </span>
                                                <span
                                                    style={{ color: "rgba(215, 44, 13, 1)" }}
                                                    class="ml-2 block sm:inline text-base"
                                                >
                                                    {value.replace(/\d+/, function (match) {
                                                        return parseInt(match) + 1;
                                                    })}
                                                </span>
                                            </div>
                                        ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-end pt-4 pb-4'>
                            <Button disabled={isSubmitting} onClick={createReply} style={{ color: 'white', background: !isSubmitting ? "#008060" : "rgb(184 178 178 / 87%)" }} >Relpy</Button>
                        </div>
                    </> : null}

                </div>}
            </div>

            <>
                {/* save button  modal  */}
                {expandImageModal ? (
                    <>
                        <div className="fixed inset-0 z-10 overflow-y-auto">
                            <div
                                className="fixed inset-0 w-full h-full bg-black opacity-40"
                                onClick={() => setExpandImageModal(false)}
                            ></div>
                            <div className="flex items-center min-h-screen px-4 py-8">
                                <div className="relative w-full max-w-4xl p-4 mx-auto bg-white rounded-lg shadow-lg">
                                    <div className="">
                                        <img src={expandedImageSrc} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </>
            <>
                {showToast ? (
                    <>
                        <div id="toast-default" class="flex items-center p-4 fixed bottom-5 right-[42%] transition-opacity ease-in-out delay-100 z-50 w-full max-w-xs rounded-lg text-white bg-[#202123]" role="alert">
                            <div class="ml-3 text-sm font-normal">{toastMessage}</div>
                            <button onClick={() => setShowToast(false)} type="button" class="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 " data-dismiss-target="#toast-default" aria-label="Close">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                    </>
                ) : null}
            </>
        </>
    )
}

export default Suggestions