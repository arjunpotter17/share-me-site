import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import UserProfile from '../components/UserProfile'
import Pins from './Pins.js'
import { client } from '../client'
import logo from '../assets/logo.png'
import { userQuery } from '../utils/data'
import { fetchUser } from '../utils/fetchUser'


const Home = () => {
    const userInfo = fetchUser()
    const scrollRef = useRef()
    const [toggleSidebar, setToggleSidebar] = useState(false)
    const [user, setuser] = useState()


    useEffect(() => {
        const query = userQuery(userInfo?.sub)
        client.fetch(query).then((data) => setuser(data[0]))
        console.log(user)
    }, [])

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    }, [])



    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
            <div className='hidden md:flex h-screen flex-initial'>
                <Sidebar user={user && user} />
            </div>
            <div className='flex md:hidden flex-row'>
                <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
                    <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
                    <Link to='/'>
                        <img src={logo} alt="logo" className='w-28' />
                    </Link>
                    {user && <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.image} alt="profile-picture" className='w-9 h-9 rounded-full' />
                        <p>{user?.name}</p>
                    </Link>}

                    {!user && <Link to='/login'>

                        <p>Login</p>
                    </Link>}
                </div>


                {toggleSidebar && (
                    <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
                        <div className="absolute w-full flex justify-end items-center p-2">
                            <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
                        </div>
                        <Sidebar closeToggle={setToggleSidebar} user={user && user} />
                    </div>
                )}

            </div>
            <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
                <Routes>
                    <Route exact path='/user-profile/:userId' element={<UserProfile />} />
                    <Route exact path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>

            <a href='https://portfolio-six-gold-18.vercel.app/#projects'>
                <footer className='absolute bottom-16 md:right-11 md:bottom-8 right-5 md:grayscale hover:grayscale-0'>
                    <img src='/assets/footer-logo.jpg' alt='home-btn' className=' rounded-full mx-auto object-cover w-[55px] h-[55px]' />
                </footer>
            </a>

        </div>
    )
}

export default Home