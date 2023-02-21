import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data';

const Feed = () => {
  const [loading, Setloading] = useState(false)
  const [pins, setPins] = useState()
  const {categoryId} = useParams()

  useEffect(()=>{
    
    if(categoryId){
      Setloading(true)
      const query = searchQuery(categoryId);
      console.log(query)
      client.fetch(query).then(
        (data)=>{setPins(data)
          console.log(data)
        Setloading(false)
        })
        
      
    }
    else{
      Setloading(true)
      client.fetch(feedQuery).then(
        (data)=>{
          console.log('this is pin data from sanity',data)
          setPins(data)
        Setloading(false)
        })
    }
  },[categoryId])

  if(loading) return <Spinner message='working on this category'/>

  if(!pins?.length) return <h2>No Posts available</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed