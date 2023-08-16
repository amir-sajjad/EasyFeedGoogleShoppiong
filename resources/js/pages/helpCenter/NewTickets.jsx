import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import axioshttp from '../../axioshttp';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { Button } from '@material-ui/core';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactGA from "react-ga4";

const NewTickets = () => {

    const [ticketInput, setTicketInput] = useState({
        attachments: []
    });
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [defaultErrors, setDefaultErrors] = useState({
        email: false,
        subject: false,
        description: false,
        attachments: false,
    });
    const [emailErrorMessage, setEmailErrorMessage] = useState('Please Enter an Email');
    const [attachmentErrors, setAttachmentErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const navigate = useNavigate();

    const handleFileChanges = (e) => {
        console.log(e.target.files)
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.match(/image.*/)) {
                setTicketInput(values => ({ ...values, attachments: [...values.attachments, file] }))
                setFilesUploaded(values => ([...values, { name: file.name, valid: true }]))
            } else {
                setFilesUploaded(values => ([...values, { name: file.name, valid: false }]))
            }
        }
    };

    const handleTicketInputChange = (e) => {
        if (defaultErrors[e.target.name]) {
            if (e.target.value.length > 0) {
                setDefaultErrors(values => ({ ...values, [e.target.name]: false }))
            }
            else {
                setDefaultErrors(values => ({ ...values, [e.target.name]: true }))
            }
        }
        setTicketInput(values => ({ ...values, [e.target.name]: e.target.value }))
    }

    const createNewTicket = () => {
        setAttachmentErrors([]);
        setIsSubmitting(true)
        axioshttp.post('create/ticket', ticketInput, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            if (response.data.status) {
                setTicketInput({ attachments: [] });
                setFilesUploaded([]);
                setDefaultErrors({
                    email: false,
                    subject: false,
                    description: false,
                    attachments: false,
                })
                setAttachmentErrors([])
                setIsSubmitting(false)
                navigate('/HelpCenter')
            } else {
                setToastMessage(response.data.erorr)
                setShowToast(true);
            }
        }).catch(error => {
            if (error.response.data.hasOwnProperty('errors')) {
                var allErrors = error.response.data.errors;
                for (const error in allErrors) {
                    if (error == 'email') {
                        setEmailErrorMessage(allErrors.email[0])
                    }
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

    ReactGA.send({ hitType: "pageview", page: "/ticketCreate", title: "Create Ticket" });


    useEffect(() => {
        setTimeout(function () {
            setShowToast(false);
            setToastMessage('');
        }, 5000)
    }, [showToast])

    const HelpCenterOnClick = useCallback(() => navigate('/HelpCenter', { replace: true }), [navigate]);
    return (
        <>
            <div className='p-16'>
                <Button onClick={HelpCenterOnClick} variant='outlined' style={{ marginBottom: '10px' }} ><ArrowBackIcon /></Button>
                <div className='p-4 rounded-md bg-white' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                    <p className='pb-2 text-sm font-medium'>Create A New Support Tickets</p>
                    <div className='mt-4'>
                        <p className='text-sm font-medium'>Email</p>
                        <input type="text" onChange={handleTicketInputChange} name="email" value={ticketInput && ticketInput.email ? ticketInput.email : null} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                        {defaultErrors.email && (
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
                                    {emailErrorMessage}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className='mt-4'>
                        <p className='text-sm font-medium'>Subject</p>
                        <input type="text" onChange={handleTicketInputChange} name="subject" value={ticketInput && ticketInput.subject ? ticketInput.subject : null} class="input-focus-none px-4 py-2 w-[100%] focus:border-none focus:ring-none border border-[#babfc3] rounded-md" />
                        {defaultErrors.subject && (
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
                                    Please Enter a Subject
                                </span>
                            </div>
                        )}
                    </div>
                    <div className='mt-4'>
                        <label for="message" class="block text-sm font-medium text-gray-900 ">Description</label>
                        <textarea id="message" onChange={handleTicketInputChange} name="description" value={ticketInput && ticketInput.description ? ticketInput.description : null} rows="4" class="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-[#babfc3]" placeholder="Write your problem here..."></textarea>
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
                    <div className='mt-4'>
                        <p className='text-sm font-medium'>Add an attachment</p>
                        <label
                            class="flex flex-col py-8 justify-center items-center m-auto w-full h-fit px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
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

                    <div className='flex justify-end pt-4'>
                        <Button disabled={isSubmitting} onClick={createNewTicket} variant='contained' style={{ color: 'white', background: !isSubmitting ? "#008060" : "rgb(184 178 178 / 87%)" }} >Submit</Button>
                    </div>
                </div>
            </div>

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

export default NewTickets