import React from 'react'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import YouTubeIcon from '@mui/icons-material/YouTube';
import { Button } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import ReactGA from "react-ga4";

const Tutorials = () => {

  const [videoModal, setVideoModal] = React.useState(false)

  const [videoSrc, setVideoSrc] = React.useState('')
  console.log(videoSrc)

  ReactGA.send({ hitType: "pageview", page: "/tutorials", title: "Tutorials" });

  return (
    <>
      <Grid className="Grid_video_tutorial" style={{ padding: '10px' }} container spacing={1}>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/wE8RuU7ck7E'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/wE8RuU7ck7E/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/XcIQXvg_IVw'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/XcIQXvg_IVw/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/wHGntqKEhCc'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/wHGntqKEhCc/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/xB2i16XG8rA'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/xB2i16XG8rA/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/D_szKJrA_HU'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/D_szKJrA_HU/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/E1iTMSwOjo8'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/E1iTMSwOjo8/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/Cid-DOFiDl4'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/Cid-DOFiDl4/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/0u0JIlsbNAI'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/0u0JIlsbNAI/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/ej308o3HUVU'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/ej308o3HUVU/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/drjfgEwK68Y'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/drjfgEwK68Y/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/F9b1xwlywjk'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/F9b1xwlywjk/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/RRcJQ0FmZA4'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/RRcJQ0FmZA4/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/yOce0abt2ic'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/yOce0abt2ic/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/-TqkKIRDtKE'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/-TqkKIRDtKE/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/I6Rcgvu6Wno'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/I6Rcgvu6Wno/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/NPXNCmDnPDg'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/NPXNCmDnPDg/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/HkNCX2qr6kc'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/HkNCX2qr6kc/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/t2u6ATxg2wc'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/t2u6ATxg2wc/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/x8SuTk_4tMc'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/x8SuTk_4tMc/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/yvzRlNab9A8'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/yvzRlNab9A8/maxresdefault.jpg' />
          </Card>
        </Grid>
        <Grid className='cursor-pointer' onClick={() => { setVideoSrc('https://www.youtube.com/embed/sWALzgmmkYM'); setVideoModal(!videoModal) }} style={{ padding: '10px' }} xs={12} md={4}>
          <Card sx={{ boxShadow: 3 }} style={{ padding: '10px' }}>
            <img src='http://img.youtube.com/vi/sWALzgmmkYM/maxresdefault.jpg' />
          </Card>
        </Grid>
      </Grid>

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
                      <iframe width="100%" height="600vh" src={videoSrc} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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

export default Tutorials