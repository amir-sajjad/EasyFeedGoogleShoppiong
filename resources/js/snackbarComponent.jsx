import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function SimpleSnackbar(props) {
    return (
        <div>
            <br />
            <div className="text-black flex items-center justify-between p-2 px-3 w-[100%] py-2 rounded relative mb-2 border border-[#e9c794] bg-[#fff5ea]">
                <span className="text-xl flex items-center inline-block mr-2 align-middle">
                    <ErrorOutlineIcon style={{ color: '#FF0000' }} />
                    <span className="ml-2 inline-block align-middle text-sm font-medium mr-8">
                        {props.text ? props.text : ''}
                    </span>
                </span>
                <button className=" flex items-center bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none">
                    <span onClick={() => props.handleClose(null)} className='text-3xl font-medium hover:text-red-700'>×</span>
                </button>
            </div>
        </div>
    );
}
