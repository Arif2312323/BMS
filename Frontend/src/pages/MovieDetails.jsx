import React, { useState } from 'react'
import { theatres, filters } from '../utils/constants'
import { data, useParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import TheaterListings from '../components/TheaterListings'

const MovieDetail = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const param = useParams();
  
  const {data,isLoading} = useQuery({
    queryKey : ["GetMovieByID"],
    queryFn : async ()=> {
      const res = await fetch(`${url}/movies/${param.id}`)
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    placeholderData : keepPreviousData
  })

  return (
    isLoading ? <div>loading...</div>:
    <div className='min-h-screen bg-[#F2F2F2]'>

      {/* ── Hero Banner ── */}
      <div className='relative w-full h-[350px] overflow-hidden'>
        {/* Blurred BG */}
        <div
          className='absolute inset-0 bg-cover bg-center scale-110'
          style={{ backgroundImage: `url(${data.movie.posterUrl})`, filter: 'blur(8px) brightness(0.4)' }}
        />

        {/* Content */}
        <div className='relative z-10 max-w-screen-xl mx-auto px-6 h-full flex items-center gap-8'>
          {/* Poster */}
          <img
            src={data.movie.posterUrl}
            alt={data.movie.title}
            className='w-36 md:w-44 rounded-lg shadow-2xl flex-shrink-0'
          />

          {/* Info */}
          <div className='text-white space-y-3'>
            <h1 className='text-2xl md:text-4xl font-bold leading-tight'>
              {data.movie.title}
            </h1>

            {/* Rating */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full'>
                <span className='text-yellow-400'>⭐</span>
                <span className='font-bold text-sm text-black'>{data.movie.rating}/10</span>
                <span className='text-gray-300 text-xs text-red-600'>({data.movie.votes} Votes)</span>
              </div>
            </div>

            {/* Genre Tags */}
            <div className='flex flex-wrap gap-2'>
              <span className='border border-gray-400 text-gray-200 px-3 py-[2px] rounded-full text-xs'>
                13UA+
              </span>
              {data.movie.genre.map((g, i) => (
                <span key={i} className='border border-gray-400 text-gray-200 px-3 py-[2px] rounded-full text-xs'>
                  {g.trim()}
                </span>
              ))}
            </div>

          <p className='text-gray-300 text-sm flex items-center gap-1'>
            <span>🌐</span>
            {data.movie.languages.map((lang, i) => (
              <span key={i}>{lang}</span>
            ))}
          </p>

            {/* Book Button */}
            <button className='bg-[#F84464] hover:bg-[#e03055] text-white px-10 py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg'>
              Book tickets
            </button>
          </div>
        </div>
      </div>

      <TheaterListings movieId={param.id} state={param.state}/>
    </div>
  )
}

export default MovieDetail