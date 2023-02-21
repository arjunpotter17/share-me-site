import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { client } from '../client';
import { urlFor } from './urlbuilder';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetails = ({ user }) => {
  const [pins, setpins] = useState(null)
  const [pinDetails, setpinDetails] = useState(null)
  const [comment, setcomment] = useState('')
  const [addingComment, setaddingComment] = useState(false)

  const { pinId } = useParams();

  const addComment = () => {
    client.patch(pinId)
      .setIfMissing({ comments: [] })
      .insert('after', 'comments[-1]', [{
        comment,
        _key: uuidv4(),
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        }
      }])
      .commit()
      .then(() => {
        fetchPinDetails();
        setcomment('');
        setaddingComment(false)
      })
  }

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query)
        .then((data) => {
          setpinDetails(data)
          console.log(data)

          if (data[0]) {
            query = pinDetailMorePinQuery(data[0]);

            client.fetch(query)
              .then((res) => setpins(res));
          }
        })
    }
  }

  useEffect(() => {
    fetchPinDetails();
  }, [])

  if (!pinDetails) return <Spinner message='loading pin...' />

  return (
    <>
      <div className='flex xl-flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img src={(pinDetails[0]?.image && urlFor(pinDetails[0].image).url())} alt='post-image'
            className='rounded-t-3xl rounded-b-lg'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetails.image?.asset?.url}?.dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opactiy-75 hover:opacity-100 hover:shadow-md outline-none'
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetails[0]?.destination}
              target='_blank'
              rel='noreferrer'
            >
              {pinDetails[0]?.destination.length > 20 ? pinDetails[0]?.destination.slice(8, 20) : pinDetails[0].destination.slice(8)}
            </a>
          </div>
          <div>
            <h1 className='text-4xl font-bold break-words mt-3'>{pinDetails[0].title}</h1>
            <p className='mt-3'>{pinDetails[0].about}</p>
          </div>
          <Link to={`user-profile/${pinDetails[0]?.postedBy._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
            <img
              src={pinDetails[0]?.postedBy.image}
              className='w-8 h-8 rounded-full object-cover'
              alt='user-profile'
            />
            <p className='capitalize'>
              {pinDetails[0]?.postedBy.userName}
            </p>
          </Link>
          <h2 className='mt-5 text-xl md:text-2xl'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetails[0]?.comments?.map((comment, i) => (
              <div className='flex mt-5 gap-2 items-center bg-white rounded-lg' key={i}>
                <img
                  src={comment.postedBy.image}
                  alt='user-icon'
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>

              </div>
            ))}
          </div>
          {user && <div className='flex flex-wrap mt-6 gap-3'>
            <Link to={`user-profile/${user?._id}`}>
              <img
                src={user.image}
                className='w-10 h-10 rounded-full cursor-pointer'
                alt='user-profile'
              />
            </Link>
            <input
              className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
              type='text'
              placeholder='Add a comment'
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
            />
            <button
              type='button'
              className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}
            >
              {addingComment ? 'Posting...' : 'Post'}
            </button>
          </div>}
        </div>
      </div>
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}

    </>


  )
}

export default PinDetails