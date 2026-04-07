import React, { useState } from 'react'
import dayjs from 'dayjs'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { filters } from '../utils/constants'

const TheaterListings = ({ movieId, state }) => {
    const url = import.meta.env.VITE_BACKEND_URL;
    const [selectedDate, setSelectedDate] = useState(0)
    const [selectedFilters, setSelectedFilters] = useState([])

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().add(i, 'day')
        return {
            day: i === 0 ? 'Today' : date.format('ddd'),
            date: date.format('D MMM'),
            fullDate: date,
        }
    })

    const formattedDate = dates[selectedDate].fullDate.format("DD-MM-YYYY")

    const toggleFilter = (filter) => {
        setSelectedFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        )
    }

    const { data, isLoading } = useQuery({
        queryKey: ["shows", movieId, state, formattedDate],
        queryFn: async () => {
            const res = await fetch(`${url}/shows?movieId=${movieId}&state=${state}&date=${formattedDate}`)
            if (!res.ok) throw new Error("Failed to fetch")
            return res.json()
        },
        placeholderData: keepPreviousData
    })

    return (
        <>
            <div className='bg-white shadow-sm sticky top-0 z-20'>
                <div className='max-w-screen-xl mx-auto px-6'>
                    <div className='flex items-center gap-2 overflow-x-auto py-3 border-b border-gray-100 no-scrollbar'>
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

                        <div className='h-10 w-px bg-gray-200 mx-2' />

                        <div className='flex gap-2 overflow-x-auto no-scrollbar'>
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

            <div className='max-w-screen-xl mx-auto px-6 py-6 space-y-4'>
                {data?.map((item, i) => {
                    const theatre = item.theater.theaterDetails;
                    const shows = item.theater.shows;

                    return (
                        <div key={i} className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                            <div className='flex items-start gap-4 px-5 pt-5 pb-3'>
                                <img
                                    src={theatre.logo}
                                    alt={theatre.name}
                                    className='w-10 h-10 object-contain flex-shrink-0 mt-1'
                                />
                                <div className='flex-1'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <h3 className='font-bold text-gray-800 text-sm md:text-base hover:underline cursor-pointer'>
                                            {theatre.name}
                                        </h3>
                                        <span className='text-xs text-gray-400'>📍 {theatre.location}</span>
                                    </div>
                                    <div className='flex gap-4 mt-2'>
                                        <span className='text-[11px] font-medium text-green-500 flex items-center gap-1'>
                                            📱 M-Ticket
                                        </span>
                                        <span className='text-[11px] font-medium text-orange-400 flex items-center gap-1'>
                                            🍿 Food & Beverage
                                        </span>
                                    </div>
                                </div>

                                <button className='text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1'>
                                    <span>INFO</span> ℹ️
                                </button>
                            </div>

                            <div className='border-t border-dashed border-gray-100 mx-5' />

                            <div className='px-5 py-6 flex flex-wrap gap-4'>
                                {shows.map((show, j) => (
                                    <div key={j} className='group relative'>
                                        <button
                                            className='cursor-pointer flex flex-col items-center px-4 py-2 rounded border border-gray-200 text-sm font-medium transition min-w-[100px] hover:border-green-500'
                                        >
                                            <span className='font-bold text-green-600'>{show.startTime}</span>
                                            <span className='text-[9px] mt-[2px] text-gray-400 uppercase tracking-tighter'>
                                                {show.format} • {show.audioType}
                                            </span>
                                        </button>
                                        <div className='hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none'>
                                            Available
                                            <div className='absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black'></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='px-5 pb-4 flex gap-4 text-[10px] text-gray-400 uppercase font-semibold tracking-wider'>
                                <span className='flex items-center gap-1'>
                                    <span className='w-2 h-2 rounded-full bg-green-500'></span> Available
                                </span>
                                <span className='flex items-center gap-1 text-orange-400'>
                                    <span className='w-2 h-2 rounded-full bg-orange-400'></span> Filling Fast
                                </span>
                                <span className='flex items-center gap-1'>
                                <span className='w-2 h-2 rounded-full bg-gray-300 inline-block'></span>
                                    Sold Out
                                </span>


                            </div>
                        </div>
                    )
                })}

                {data?.length === 0 && !isLoading && (
                    <div className="text-center py-20 text-gray-400">
                        No shows available for the selected date.
                    </div>
                )}
            </div>
        </>
    )
}

export default TheaterListings