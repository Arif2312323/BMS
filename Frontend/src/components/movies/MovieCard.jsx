import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const MovieCard = ({ movie }) => {
  const loc = useSelector((state)=>state.location);
  const state = loc.location?.address.state
  const navigate = useNavigate();
  return (
    <div className='w-40 md:w-52 cursor-pointer' onClick = {()=>{navigate(`/movies/${state}/${movie.title}/${movie._id}/ticket`)}}>
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className='rounded-lg shadow-md'
      />
      <p className='mt-2 font-medium'>{movie.title}</p>
      <p className='text-xs text-gray-500'>{movie.rating} | {movie.votes}</p>
      <p className='text-sm text-gray-600'>{movie.age}</p>
      <p className='text-sm text-gray-500 truncate'>{movie.languages}</p>
    </div>
  )
}

export default MovieCard