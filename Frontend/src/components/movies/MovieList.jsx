import React from 'react'
import { languages,allMovies } from '../../utils/constants'
import MovieCard from './MovieCard'
import { Navigate } from 'react-router-dom'
import { useQuery, keepPreviousData } from '@tanstack/react-query'

const MovieList = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const {data : recMovies} = useQuery({
    queryKey : ["recommended movies"],
    queryFn : async () => {
      const res = await fetch(`${url}/movies/recommended`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    placeholderData : keepPreviousData,
  })
  const movies = recMovies?.movies;
  return (
    <div className='w-full md:w-3/4 p-4'>
      <div className='flex flex-wrap gap-2 mb-4'>
        {
          languages.map((lang, i) => (
            <span
              key={i}
              className='bg-white border border-gray-200 text-[#f74362] py-1 px-3 rounded-[24px] text-sm cursor-pointer hover:bg-gray-100'
            >
              {lang}
            </span>
          ))
        }
      </div>
      <div className='flex justify-between items-center bg-white px-6 py-6 rounded mb-6'>
        <h3 className='font-semibold text-xl'>Coming Soon</h3>
        <a href="#" className='text-red-500 text-sm font-medium flex items-center'>
            Explore Upcoming Movies <span className='ml-1'>→</span>
        </a>
      </div>
      <div className='flex flex-wrap gap-6'>
        {
          movies?.map((movie, i) => (
            <MovieCard key={i} movie={movie}/>
          ))
        }
      </div>
    </div>
  )
}

export default MovieList