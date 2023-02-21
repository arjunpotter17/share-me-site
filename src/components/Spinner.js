import React from 'react'
import {ColorRing} from 'react-loader-spinner'

const Spinner = ({ message }) => {
    return (
        <div className='flex flex-col w-full h-full justify-center items-center'>
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                colors={['#b8c480', '#B2A3B5', '#F4442E', '#51E5FF', '#429EA6']}
            />
            <p className='text-lg px-2 text-center'>{message}</p>
        </div>
    )
}

export default Spinner