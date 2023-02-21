import { useState } from "react"
import React from 'react'
import { Route, Routes } from "react-router-dom"
import Navbar from "../components/Navbar"
import PinDetails from '../components/PinDetails'
import Search from "../components/Search.js"
import Feed from '../components/Feed.js'
import Createpin from '../components/Createpin'


const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="px-2 md:px-5" >
      <div className="bg-gray-50">
        <Navbar searchTerm ={searchTerm} setSearchTerm={setSearchTerm} user={user && user}/>
      </div>
      <div className="h-full">
        <Routes>
          <Route path='/' element={<Feed/>}/>
          <Route path='/category/:categoryId' element={<Feed/>}/>
          <Route path='/pin-detail/:pinId' element={<PinDetails user={user}/>}/>
          <Route path='/create-pin' element={<Createpin user={user}/>}/>
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Pins