import React from 'react'
import { events } from '../utils/constants'

const LiveEvents = () => {
  return (
    <div className='max-w-screen-xl mx-auto px-4 py-10'>
      <h2 className='text-2xl font-semibold mb-6'>The Best Of Live Events</h2>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
        {events.map((event, i) => (
          <div
            className='rounded-xl overflow-hidden relative group shadow-sm cursor-pointer'
            key={i}
          >
            <img
              src={event.img}
              alt={event.title}
              className='w-full h-56 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
            />

            <div className='absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300' />

            <div className='p-3'>
              <h3 className='font-semibold text-sm md:text-base'>
                {event.title}
              </h3>
              <p className='text-red-500 text-xs md:text-sm mt-1'>
                {event.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveEvents