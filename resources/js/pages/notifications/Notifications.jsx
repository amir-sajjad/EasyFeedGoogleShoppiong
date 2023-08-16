import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';
import axioshttp from '../.././axioshttp';
import CloseIcon from '@mui/icons-material/Close';
import ReactGA from "react-ga4";
import { values } from 'lodash';




const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


const Notifications = () => {


  const [expanded, setExpanded] = React.useState(false);
  const [expandNotification, setExpandNotification] = React.useState([]);
  const [notifications, setNotifications] = useState([]);
  const [videoModal, setVideoModal] = React.useState(false)

  const handleExpandClick = (noti) => {
    if (expandNotification[noti.id]) {
      setExpandNotification(values => ({ ...values, [noti.id]: false }));
    } else {
      setExpandNotification(values => ({ ...values, [noti.id]: true }));
    }

    if (noti.read == 0) {
      setNotifications(notifications.map((value, index) => {
        if (value.id == noti.id) {
          value.read = 1;
        }
        return value;
      }));
      const data = { id: noti.id }
      axioshttp.post('update/notification', data).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error);
      })
    }

  }

  const getNotifications = () => {
    axioshttp
      .get("product/notification")
      .then((res) => {
        console.log(res.data);
        setNotifications(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/notifications", title: "Notifications" });
    getNotifications();
  }, []);
  return (
    <>
      <div className='flex justify-between items-center pt-8 pl-20 pr-20'>
        <p className='text-3xl font-semibold text-center mt-2'>Notifications</p>
        <a target='_blank' href='https://calendly.com/talk-to-specialist/30min'><Button variant='contained' style={{ color: 'white', background: '#008060' }}>Book A Call</Button></a>
      </div>
      <div className='pt-8 pl-20 pr-20'>
        {
          notifications &&
          notifications.map((n, index) => (
            <Card className='mt-2'>
              <div className='cursor-pointer' expand={expandNotification[n.id]} onClick={() => { handleExpandClick(n) }} aria-expanded={expandNotification[n.id]} aria-label="show more">
                <div className='flex justify-between p-3'>
                  <div className='flex items-center'>
                    {n.read == 0 && <div className='relative'>
                      <span class="flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008060] opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-[#008060]"></span>
                      </span>
                    </div>}
                    <p className={n.read == 0 ? 'ml-4' : 'text-gray-500'}><b>{n.title}</b></p>
                  </div>
                  <div className='flex items-center'>
                    <p className='mr-2'> {n.update_at_shopify}</p>
                    {!expandNotification[n.id] && <ExpandMoreIcon />}
                    {expandNotification[n.id] && <ExpandLessIcon />}
                  </div>
                </div>
              </div>
              <Collapse in={expandNotification[n.id]} timeout="auto" unmountOnExit>
                {n.notification_type == "update" && <CardContent>
                  <p className='text-base'>
                    This product has been updated. To sync these changes to your feed in Merchant Center, click the link.
                    <br></br>
                    {/* <b>{n.title}
                                    </b> */}
                  </p>
                  <div className='pt-3'>
                    <Button variant="contained" onClick={() => { setVideoModal(!videoModal) }} style={{ color: 'white', background: '#008060' }}>Learn More</Button>
                  </div>
                </CardContent>}
                {n.notification_type == "error" && <CardContent>
                  <p className='text-base'>
                    This error occured during the sync of local inventory feed.Please resolve the error and try again.
                    <br></br>
                  </p>
                </CardContent>}
              </Collapse>
            </Card>
          ))
        }
      </div>


      {
        videoModal ? (
          <>
            <div className="fixed inset-0 z-40 overflow-y-auto">
              <div
                className="fixed inset-0 w-full h-full bg-black opacity-70"
                onClick={() => setVideoModal(false)}
              ></div>
              <div className="flex w-full h-full items-center px-4 py-8">
                <div className="relative w-[80%] p-4 mx-auto">
                  <div className="">
                    <div className='flex items-center p-2'>
                      <CloseIcon style={{ color: 'white', fontSize: '35px' }} onClick={() => setVideoModal(false)} className='absolute top-0 right-0 hover:transition-all transition ease-in-out delay-250 hover:rotate-180 cursor-pointer' />
                    </div>
                    <div className='p-4'>
                      <iframe width="100%" height="600vh" src="https://www.youtube.com/embed/sWALzgmmkYM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null
      }

    </>
  )
}

export default Notifications