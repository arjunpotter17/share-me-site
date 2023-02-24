import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate, json } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?photography,technology,film'

const UserProfile = () => {
  const [user, setuser] = useState(null)
  const [pins, setpins] = useState(null)
  const [text, settext] = useState('Created')
  const [activeBtn, setactiveBtn] = useState('created')
  const [tempUser, setTempUser] = useState()
  const navigate = useNavigate();
  const {userId} = useParams();

  const activeBtnStyles = 'bg-red-600 p-1 text-white  rounded-full w-20 outline-none mt-5'
  const notActiveBtnStyles = 'bg-primary p-1 mr-4 border-black text-black  rounded-full w-20 outline-none mt-5'

  console.log('this is userID', userId)
  console.log('this is user._id', user?._id)

  const clickhandler = () =>{
    googleLogout();
    localStorage.clear();
    navigate('/');
    window.location.reload()
  }

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('user from localStorage', user)
    setTempUser(user?.sub)
  },[])

  useEffect(()=>{
    const query = userQuery(userId);
    client.fetch(query)
    .then((data) => {
      setuser(data[0]);
    })
  },[userId])

  useEffect(()=>{
    if(text === 'Created'){
      const query = userCreatedPinsQuery(userId)
      client.fetch(query).then((data) => { setpins(data)})
    }
    else{
      const query = userSavedPinsQuery(userId)
      client.fetch(query).then((data) => {console.log(data); setpins(data)})
    
    }
  },[text, userId])

  if(!user) {
    return <Spinner message='Loading Profile'/>
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              alt='user-pic'
              src={user.image}
            />
            <h1 className='font-bold text-center mt-3'>{user.userName}</h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {tempUser === user._id && (
                <button
                type="button"
                className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                onClick={clickhandler}
                
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
                <button
                  type='button'
                  onClick={(e)=>{
                    settext(e.target.textContent)
                    setactiveBtn('created')
                  }}
                  className={`${activeBtn === 'created'?activeBtnStyles:notActiveBtnStyles}`}
                >
                  Created
                </button>

                <button
                  type='button'
                  onClick={(e)=>{
                    settext(e.target.textContent)
                    setactiveBtn('saved')
                  }}
                  className={`${activeBtn === 'saved'?activeBtnStyles:notActiveBtnStyles}`}
                >
                  Saved
                </button>
          </div>
          {pins?.length ?(
            <div className='px-2'>
              <MasonryLayout pins={pins}/>
            </div>
          ):(
            <p className='text-center margin-auto'>You have not created any posts yet!</p>
          )
        }
          
        </div>
      </div>
    </div>
  )
}

export default UserProfile