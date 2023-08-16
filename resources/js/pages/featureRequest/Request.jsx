import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import VideoModal from "../tutorials/VideoModal";
import axioshttp from "../../axioshttp";
import CircularProgress from "@mui/material/CircularProgress";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import ReactGA from "react-ga4";

const Request = () => {
  const navigate = useNavigate();
  const YourSuggestionOnClick = useCallback(() => navigate('/YourSuggestion', { replace: true }), [navigate]);
  const SuggestionsOnClick = useCallback((id) => navigate('/Suggestions/' + id, { replace: true }), [navigate]);

  const [allSuggestions, setAllSuggestions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const getAllSuggestions = () => {
    axioshttp.get('all/suggestions').then(response => {
      if (response.data.status) {
        setAllSuggestions(response.data.suggestions);
        setTimeout(() => {
          setDataLoading(false);
        }, 1000)
      }
    }).catch(error => {
      console.log(error)
    })
  }

  const addPositiveVote = (featureId) => {
    const positiveData = { id: featureId }
    axioshttp.post('add/vote/positive', positiveData).then(res => {
      if (res.data.status == true) {
        getAllSuggestions();
      }
    }).catch(error => {
      // if (error.response.data.hasOwnProperty('errors')) {
      setToastMessage('Something Went Wrong');
      setShowToast(true);
      // }
    })
  }

  const addNegativeVote = (featureId) => {
    const negativeData = { id: featureId }
    axioshttp.post('add/vote/negative', negativeData).then(res => {
      if (res.data.status == true) {
        getAllSuggestions();
      }
    }).catch(error => {
      // if (error.response.data.hasOwnProperty('errors')) {
      setToastMessage('Something Went Wrong');
      setShowToast(true);
      // }
    })
  }

  useEffect(() => {
    setTimeout(function () {
      setShowToast(false);
      setToastMessage('');
    }, 5000)
  }, [showToast])

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/requests", title: "Feature Requests" });
    getAllSuggestions();
  }, [])

  const suggestionRows = allSuggestions.length > 0 ? allSuggestions.map((value, index) => (
    <tr className='hover:bg-gray-100 cursor-pointer border-b' key={value.id}>
      <td onClick={() => { SuggestionsOnClick(value.id) }} className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        {"[#" + value.feature_id + "]" + " - " + value.subject}
        {value.status && <span class="ml-2 bg-[#aee9d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{value.status == 'inReview' ? "In-Review" : value.status == 'inProcess' ? "In-Process" : value.status}</span>}
      </td>
      <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        <div className='flex'>
          <Button onClick={() => { addPositiveVote(value.id) }} style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }} variant='outlined'><ThumbUpAltIcon style={{ color: '#008060' }} />{value.positiveVotes}</Button>
          <Button onClick={() => { addNegativeVote(value.id) }} style={{ display: 'flex', alignItems: 'center' }} variant='outlined'><ThumbDownAltIcon style={{ color: '#d82c0d' }} />{value.negativeVotes}</Button>
        </div>
      </td>
    </tr>
  )) :
    <tr className='bg-gray-100 border-b'>
      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        No Record Found
      </td>
    </tr>

  return (
    <>
      <div className='pt-12 pr-2 pl-2 sm:pr-4 md:pr-32 lg:pr-32 xl:pr-32 2xl:pr-32 sm:pl-4 md:pl-32 lg:pl-32 xl:pl-32 2xl:pl-32'>
        <div className='flex flex-wrap justify-between'>
          <Button onClick={YourSuggestionOnClick} variant='contained' style={{ color: 'white', background: '#008060' }}><EmojiObjectsIcon /> Your Suggestion</Button>
          <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ color: 'white', background: '#008060' }}>Book A Call</Button></a>
        </div>
        <div className='overflow-x-scroll' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
          <table className="overflow-x-scroll min-w-full divide-y divide-gray-200 mt-4 rounded-md">
            <thead className="bg-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                >
                  Suggestions List
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                >
                  Vote
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 overflow-x-scroll bg-white">
              {dataLoading && <tr className='hover:bg-gray-100 cursor-pointer'>
                <td className="bg-gray-100 py-3 pl-4">
                  <CircularProgress style={{ color: "#008060", marginRight: "10px" }} size={20} />
                  <span>Loading</span>
                </td>
              </tr>}
              {!dataLoading && suggestionRows}
            </tbody>
          </table>
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

export default Request