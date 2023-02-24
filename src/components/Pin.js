import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { urlFor } from './urlbuilder'
import { MdDownloadForOffline } from 'react-icons/md'
import { client } from '../client'
import { fetchUser } from '../utils/fetchUser'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { AiTwotoneDelete } from 'react-icons/ai'

const Pin = ({ pin }) => {

    const [postHovered, setPostHovered] = useState(false)

    const navigate = useNavigate();
    const user = fetchUser();
    //console.log(user)
    let alreadySaved;

    if (pin?.save?.filter((item) => item?.postedBy?._id === user?._id)) {
        alreadySaved = true;
    }
    else alreadySaved = false;
    console.log('this is pin save', pin?.save)

    const savePin = (id) => {
        if (!alreadySaved) {
            client.patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?.sub
                    },
                }])
                .commit()
                .then(() => {
                    window.location.reload();

                })
        }
    }

    const deletePin = (id) => {
        client.delete(id)
            .then(() => { window.location.reload() })
    }

    return (
        <div className='m-2 mt-11 md:mt-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}

                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${pin?._id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img alt='user-post' className='rounded-lg w-full' src={urlFor(pin?.image).width(250).url()} />
                {
                    postHovered && (
                        <div
                            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50'
                            style={{ height: '100%' }}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-2'>
                                    <a
                                        href={`${pin?.image?.asset?.url}?.dl=`}
                                        download
                                        onClick={(e) => e.stopPropagation()}
                                        className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opactiy-75 hover:opacity-100 hover:shadow-md outline-none'
                                    >
                                        <MdDownloadForOffline />
                                    </a>

                                </div>
                                {alreadySaved ? (
                                    <button type='button' className='bg-red-600 opacity-70 hover:opacity-100 text-white px-3 py-1 text-base rounded-2xl hover:shadow-md outline-none'>
                                        {pin?.save?.length}  Saved
                                    </button>
                                ) :
                                    (<button
                                        type='button'
                                        className='bg-red-600 opacity-70 hover:opacity-100 text-white px-3 py-1 text-base rounded-2xl hover:shadow-md outline-none'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            savePin(pin?._id)
                                        }}
                                    >
                                        Save
                                    </button>)
                                }
                            </div>
                            <div className='flex justify-between items-center gap-2 w-full'>
                                {pin?.destination && (
                                    <a
                                        href={pin?.destination}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-2 rounded-full opactiy-70 hover:opacity-100 hover:shadow-md'
                                    >
                                        <BsFillArrowUpRightCircleFill />
                                        {pin?.destination.length > 20 ? pin?.destination.slice(8, 20) : pin.destination.slice(8)}
                                    </a>
                                )}

                                {
                                    pin?.postedBy?._id == user.sub && (
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePin(pin?._id);
                                            }}
                                            className='bg-white text-black opacity-100  hover:bg-red-600 hover:text-white px-2 py-2 text-base rounded-3xl hover:shadow-md outline-none'
                                        >
                                            <AiTwotoneDelete />
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between items-center'>
            <Link to={`user-profile/${pin?.postedBy?._id}`} className='flex gap-2 mt-2 items-center '>
                <img
                    src={pin?.postedBy?.image}
                    className='w-8 h-8 rounded-full object-cover'
                    alt='user-profile'
                />
                <p className='capitalize'>
                    {pin?.postedBy?.userName}
                </p>
               
            </Link>
            <div className='lg:hidden'>
            {alreadySaved ? (
                                    <button type='button' className='bg-red-600 opacity-100 text-white px-3 py-1 text-base rounded-2xl hover:shadow-md outline-none'>
                                        {pin?.save?.length}  Saved
                                    </button>
                                ) :
                                    (<button
                                        type='button'
                                        className='bg-red-600 opacity-100 text-white px-3 py-1 text-base rounded-2xl hover:shadow-md outline-none'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            savePin(pin?._id)
                                        }}
                                    >
                                        Save
                                    </button>)
                                }
            {
                    pin?.postedBy?._id == user?.sub && (
                        <button
                            type='button'
                            onClick={(e) => {
                                e.stopPropagation();
                                deletePin(pin?._id);
                            }}
                            className='bg-white text-black opacity-100  hover:bg-red-600 hover:text-white px-2 py-2 text-base rounded-3xl hover:shadow-md outline-none'
                        >
                            <AiTwotoneDelete />
                        </button>
                    )
                }
            </div>
            
            </div>
            
        </div>
    )
}

export default Pin
