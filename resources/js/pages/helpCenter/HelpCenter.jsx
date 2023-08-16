import React, { useState, useEffect } from 'react'
// import Box from '@mui/material/Box';
import axioshttp from '../../axioshttp';
import CircularProgress from "@mui/material/CircularProgress";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button } from '@material-ui/core';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import VideoModal from '../tutorials/VideoModal'
import ReactGA from "react-ga4";

const HelpCenter = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [allTickets, setAllTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [closedTickets, setClosedTickets] = useState([]);

  const navigate = useNavigate();
  const ReplyTicketsOnClick = useCallback((id) => navigate('/ReplyTickets/' + id, { replace: true }), [navigate]);
  const NewTicketsOnClick = useCallback(() => navigate('/NewTickets', { replace: true }), [navigate]);
  const CloseTicketsOnClick = useCallback(() => navigate('/CloseTickets', { replace: true }), [navigate]);

  const fetchAllTickets = () => {
    axioshttp.get('user/tickets').then(response => {
      if (response.data.status == true) {
        setAllTickets(response.data.tickets);
        setOpenTickets(response.data.tickets);
        // setOpenTickets(response.data.tickets.filter((element) => element.status == 'open'));
        // setClosedTickets(response.data.tickets.filter((element) => element.status == 'closed'));
        setIsLoading(false)
        setTimeout(() => {
          setDataLoading(false);
        }, 1000)
      }
    }).catch(error => {
      console.log(error)
      setIsLoading(false)
      setDataLoading(false);
    })
  }

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/helpCenter", title: "Help Center" });
    fetchAllTickets();
  }, [])

  const openTicketRows = openTickets.length > 0 ? openTickets.map((value, index) => (
    <tr onClick={() => { ReplyTicketsOnClick(value.id) }} className='hover:bg-gray-100 cursor-pointer border-b' key={value.id}>
      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
        {value.subject}
      </td>
      <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {value.created_at}
      </td>
      <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {value.updated_at}
      </td>
      <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
        {value.status == 'open' ? <span class="ml-2 bg-[#aee9d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Open</span> : <span class="ml-2 bg-pink-200 text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Closed</span>}
      </td>
    </tr>
  )) :
    <tr className='bg-gray-100'>
      <td className="py-3 pl-4" colSpan={4}>No Record Found</td>
    </tr>;

  // const closedTicketRows = closedTickets.length > 0 ? closedTickets.map((value, index) => (
  //   <tr onClick={() => { ReplyTicketsOnClick(value.id) }} className='hover:bg-gray-100 cursor-pointer border-b' key={value.id}>
  //     <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
  //       {"[#" + value.ticket_id + "]" + " - " + value.subject}
  //     </td>
  //     <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
  //       {value.created_at}
  //     </td>
  //     <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
  //       {value.updated_at}
  //     </td>
  //     <td className="px-6 py-2 text-sm text-gray-800 whitespace-nowrap">
  //       <span class="ml-2 bg-[#aee9d1] text-black text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">{value.status}</span>
  //     </td>
  //   </tr>
  // )) :
  //   <tr className='bg-gray-100'>
  //     <td className="py-3 pl-4" colSpan={4}>No Record Found</td>
  //   </tr>;

  // tabs

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {isLoading && <CircularProgress style={{ color: "#008060", marginRight: "10px", marginTop: "10%", marginLeft: "40%" }} size={60} />}
      {!isLoading && <div className='pt-12 pl-2 sm:pl-8 md:pl-20 lg:pl-20 xl:pl-20 2xl:pl-20 pr-2 sm:pr-8 md:pr-20 lg:pr-20 xl:pr-20 2xl:pr-20'>
        <div className='pt-4 pb-4'>
          <div className='flex items-center'>
            <p className='text-xl font-medium'>My Tickets</p>
          </div>
          <span>Opening this ticket will lead you to our technical support team</span>
        </div>
        <div className='pt-2 pb-2 flex justify-between'>
          <Button onClick={NewTicketsOnClick} style={{ background: '#008060', color: 'white' }} variant='contained' startIcon={<MessageIcon />}>Create New Tickets</Button>
          <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ color: 'white', background: '#008060' }}>Book A Call</Button></a>
        </div>
        <div className='w-full'>
          {/* <TabContext value={value}> */}
          {/* <div sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Open Tickets" value="1" />
                <Tab label="Close Tickets" value="2" />
              </TabList>
            </div> */}
          {/* <TabPanel value="1"> */}
          <div className='w-full' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
            <table className="overflow-scroll min-w-full divide-y divide-gray-200 mt-4 rounded-md">
              <thead className="bg-white overflow-x-scroll">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                  >
                    Last Activity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                  >
                    Status
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
                {!dataLoading && openTicketRows}
              </tbody>
            </table>
          </div>
          {/* </TabPanel> */}
          {/* <TabPanel value="2">
              <div className='overflow-scroll' style={{ boxShadow: '0 0 0.3125rem rgba(23, 24, 24, .05), 0 0.0625rem 0.125rem rgba(0, 0, 0, .15)' }}>
                <table className="overflow-scroll min-w-full divide-y divide-gray-200 mt-4 rounded-md">
                  <thead className="bg-white overflow-x-scroll">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                      >
                        Created
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                      >
                        Last Activity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-bold text-start text-gray-500 capitalize "
                      >
                        Status
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
                    {!dataLoading && closedTicketRows}
                  </tbody>
                </table>
              </div>
            </TabPanel> */}
          {/* </TabContext> */}
        </div>
      </div>}
    </>
  )
}

export default HelpCenter