import React, { useState } from 'react'
import dayjs from 'dayjs'
import { allMovies, theatres, filters } from '../utils/constants'

const MovieDetail = () => {
  const movie = allMovies[2]
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedFilters, setSelectedFilters] = useState([])

  // ── Generate next 7 days using dayjs ──
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().add(i, 'day')
    return {
      day: i === 0 ? 'Today' : date.format('ddd'),
      date: date.format('D MMM'),
    }
  })

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  return (
    <div className='min-h-screen bg-[#F2F2F2]'>

      {/* ── Hero Banner ── */}
      <div className='relative w-full h-[350px] overflow-hidden'>
        {/* Blurred BG */}
        <div
          className='absolute inset-0 bg-cover bg-center scale-110'
          style={{ backgroundImage: `url(${movie.img})`, filter: 'blur(8px) brightness(0.4)' }}
        />

        {/* Content */}
        <div className='relative z-10 max-w-screen-xl mx-auto px-6 h-full flex items-center gap-8'>
          {/* Poster */}
          <img
            src={movie.img}
            alt={movie.title}
            className='w-36 md:w-44 rounded-lg shadow-2xl flex-shrink-0'
          />

          {/* Info */}
          <div className='text-white space-y-3'>
            <h1 className='text-2xl md:text-4xl font-bold leading-tight'>
              {movie.title}
            </h1>

            {/* Rating */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 bg-white bg-opacity-20 px-3 py-1 rounded-full'>
                <span className='text-yellow-400'>⭐</span>
                <span className='font-bold text-sm text-black'>{movie.rating}/10</span>
                <span className='text-gray-300 text-xs text-red-600'>({movie.votes} Votes)</span>
              </div>
            </div>

            {/* Genre Tags */}
            <div className='flex flex-wrap gap-2'>
              <span className='border border-gray-400 text-gray-200 px-3 py-[2px] rounded-full text-xs'>
                {movie.age}
              </span>
              {movie.genre.split('/').map((g, i) => (
                <span key={i} className='border border-gray-400 text-gray-200 px-3 py-[2px] rounded-full text-xs'>
                  {g.trim()}
                </span>
              ))}
            </div>

            {/* Languages */}
            <p className='text-gray-300 text-sm flex items-center gap-1'>
              <span>🌐</span>
              <span>{movie.languages}</span>
            </p>

            {/* Book Button */}
            <button className='bg-[#F84464] hover:bg-[#e03055] text-white px-10 py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg'>
              Book tickets
            </button>
          </div>
        </div>
      </div>

      {/* ── Sticky Date + Filter Bar ── */}
      <div className='bg-white shadow-sm sticky top-0 z-20'>
        <div className='max-w-screen-xl mx-auto px-6'>

          {/* Date Selector */}
          <div className='flex items-center gap-2 overflow-x-auto py-3 border-b border-gray-100'>
            {dates.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(i)}
                className={`flex flex-col items-center px-5 py-2 rounded-lg text-sm font-medium transition min-w-[72px] border
                  ${selectedDate === i
                    ? 'bg-[#F84464] text-white border-[#F84464]'
                    : 'text-gray-600 border-gray-200 hover:border-[#F84464] hover:text-[#F84464]'
                  }`}
              >
                <span className='text-xs'>{d.day}</span>
                <span className='font-semibold'>{d.date}</span>
              </button>
            ))}

            {/* Divider */}
            <div className='h-10 w-px bg-gray-200 mx-2' />

            {/* Filter Chips */}
            <div className='flex gap-2 overflow-x-auto'>
              {filters.map((filter, i) => (
                <button
                  key={i}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition
                    ${selectedFilters.includes(filter)
                      ? 'bg-[#F84464] text-white border-[#F84464]'
                      : 'text-gray-600 border-gray-300 hover:border-[#F84464] hover:text-[#F84464]'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Theatre Listings ── */}
      <div className='max-w-screen-xl mx-auto px-6 py-6 space-y-4'>

        {theatres.map((theatre, i) => (
          <div key={i} className='bg-white rounded-xl shadow-sm overflow-hidden'>

            {/* Theatre Info */}
            <div className='flex items-center gap-4 px-5 pt-5 pb-3'>
              <img
                src={theatre.img}
                alt={theatre.name}
                className='w-10 h-10 object-contain flex-shrink-0'
              />
              <div className='flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <h3 className='font-semibold text-gray-800 text-sm md:text-base'>
                    {theatre.name}
                  </h3>
                  <span className='text-xs text-gray-400'>📍 {theatre.distance}</span>
                </div>
                <span className={`text-xs font-medium mt-1 inline-block
                  ${theatre.cancellation === 'Allows cancellation'
                    ? 'text-green-500'
                    : 'text-gray-400'
                  }`}>
                  {theatre.cancellation === 'Allows cancellation'
                    ? '✦ Cancellation Available'
                    : '✦ Non-Cancellable'
                  }
                </span>
              </div>

              {/* Info Icon */}
              <button className='text-gray-400 hover:text-gray-600 text-lg ml-auto'>
                ℹ️
              </button>
            </div>

            {/* Divider */}
            <div className='border-t border-dashed border-gray-200 mx-5' />

            {/* Timings */}
            <div className='px-5 py-4 flex flex-wrap gap-3'>
              {theatre.timings.map((timing, j) => (
                <button
                  key={j}
                  className={`flex flex-col items-center px-4 py-2 rounded border text-sm font-medium transition min-w-[90px]
                    ${timing.highlight
                      ? 'border-[#F84464] text-[#F84464] hover:bg-[#F84464] hover:text-white'
                      : 'border-green-400 text-green-600 hover:bg-green-50'
                    }`}
                >
                  <span className='font-bold'>{timing.time}</span>
                  <span className='text-[10px] mt-[2px] opacity-70'>{timing.label}</span>
                </button>
              ))}
            </div>

            {/* Seat Legend */}
            <div className='px-5 pb-4 flex gap-4 text-xs text-gray-400'>
              <span className='flex items-center gap-1'>
                <span className='w-2 h-2 rounded-full bg-green-400 inline-block'></span>
                Available
              </span>
              <span className='flex items-center gap-1'>
                <span className='w-2 h-2 rounded-full bg-[#F84464] inline-block'></span>
                Filling Fast
              </span>
              <span className='flex items-center gap-1'>
                <span className='w-2 h-2 rounded-full bg-gray-300 inline-block'></span>
                Sold Out
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieDetail