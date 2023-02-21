import React from 'react'
import {client} from '../client.js'
import {useNavigate} from 'react-router-dom'
import Spinner from './Spinner.js'
import { useState } from 'react'
import {categories} from '../utils/data'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'


const Createpin = ({user}) => {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [loading, setLoading] = useState(false)
  const [destination, setDestination] = useState()
  const [fields, setFields] = useState()
  const [category, setCategory] = useState()
  const [imageAsset, setImageAsset] = useState()
  const [wrongImageType, setwrongImageType] = useState(false)

  const navigate = useNavigate();
 
  const uploadImage = (e) =>{
    const {type, name} = e.target.files[0];
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif'){
      setwrongImageType(false)
      setLoading(true)
      client.assets.upload('image', e.target.files[0], {contentType: type, fileName: name})
      .then((doc) => {
        setImageAsset(doc);
        setLoading(false);
    })
    .catch((error) => {console.log('Upload Error', error)})
    }else{
      setwrongImageType(true)
      setTimeout(()=>{setwrongImageType(false)}, 2500)
    }
  }

  const savePin = () =>{
    if(title && about && destination && imageAsset?._id && category ){
      const doc = {
        _type: 'post',
        title,
        destination,
        about,
        image: {
          _type: 'image',
          asset: {
            _type:'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy:{
          _type:'postedBy',
          _ref:user._id,
        },
        category,
      }

      client.create(doc)
      .then(navigate('/')).catch(
        (error) => (
          console.log('error in creating post', error)
        )
      )
    }else{
      setFields(true);
      setTimeout(() => setFields(false), 2000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
          Fill in all the fields
        </p>
      )}
      <div className=" flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5  w-full">
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-420'>
            {loading && <Spinner/>}
            {wrongImageType && (
              <p>Wrong Image Type</p>
            )}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                        <AiOutlineCloudUpload/>
                    </p>
                    <p>Click to Upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    File Size upto 20Mb
                  </p>
                </div>
                <input 
                  type='file' 
                  name='Upload-image'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            ):(
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='uploaded-image' className='h-full w-full'/>
                <button
                  type='button'
                  className='absolute bottom-3 right-3 padding-3 rounded-full bg-white text-xl outline-none cursor-pointer hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={()=> setImageAsset(null)}
                >
                  <MdDelete/>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
              <input 
                type='text'
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
                placeholder='Title'
                className=' outline-none text-l sm:text-2xl border-b-2 border-gray-200 p-2'
              />
              {user && (
                <div className='flex gap-2 my-2 items-center bg-white rounded-lg '>
                  <img src={user.image}
                  className='w-10 h-10 rounded-full'
                  alt='user-profile'
                />
                <p className='font-bold'>{user.userName}</p>
                </div>
              )}
              <input 
                type='text'
                value={about}
                onChange={(e)=>{setAbout(e.target.value)}}
                placeholder='About'
                className=' outline-none text-base sm:text-l border-b-2 border-gray-200 p-2'
              />
              <input 
                type='text'
                value={destination}
                onChange={(e)=>{setDestination(e.target.value)}}
                placeholder='Destination Link'
                className=' outline-none text-base sm:text-l border-b-2 border-gray-200 p-2'
              />
              <div className='flex flex-col'>
                <div>
                  <p className='mb-2 font-semibold text-lg sm:text-xl'>
                    Category
                  </p>
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
                  >
                    <option value='Other' className='bg-white' >Select Category</option>
                    {categories.map((category) => (
                      <option key='category' value={category.name} className='text-base border-0 outline-none capitalize bg-white text-black'>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className='flex justify-end items-end mt-5'>
                      <button
                        type='button'
                        onClick={savePin}
                        className='bg-red-500 text-white rounded-full p-2 w-28 '
                      >
                        Save Post
                      </button>
                </div>
              </div>
        </div>

      </div>

    </div>
  )
}

export default Createpin