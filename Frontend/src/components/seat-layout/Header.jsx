import React from 'react'
import dayjs from 'dayjs'

// A reusable Logo component based on image_1.png
const BmsLogo = () => (
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-pink-600 text-xs font-bold text-white">
            BMS
          </span>
          <span className="text-sm font-semibold text-gray-900">
            bookMyScreen
          </span>
        </a>

)

// The main Header component, incorporating showData from image_0.png
const Header = ({ showData }) => {
    // Construct the date and theater location string as per image 0
    // Example output: "31 May 2024 | 09:30 PM | PVR: Nexus, Koramangala, Bengaluru, Karnataka"
    const dateString = dayjs(showData?.date, "DD-MM-YYYY").format("D MMMM YYYY");
    const locationString = `${showData?.theater?.name}, ${showData?.theater?.city}, ${showData?.theater?.state}`;

    return (
        <>
            <div className='bg-white shadow-md sticky top-0 z-50'>
                <div className='max-w-screen-xl mx-auto px-6 py-4'>
                    <div className='flex items-center justify-between gap-8'>
                        {/* Left Side: Brand Logo */}
                        <BmsLogo />

                        {/* Middle: Dynamic Show Details (based on image_0.png) */}
                        <div className='text-center'>
                            <h2 className='font-bold text-lg md:text-2xl text-gray-900'>
                                {showData?.movie.title}
                            </h2>
                            <p className='text-sm text-gray-600 font-medium mt-1'>
                                {dateString} | {showData?.startTime} | {locationString}
                            </p>
                        </div>

                        {/* Right Side: Action Button (based on image_0.png) */}
                        {/* Using a color cohesive with the BMS logo box */}
                        <button className='bg-[#EC1C7F] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition hover:bg-[#d13754] flex-shrink-0'>
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white pt-4">
                <div className="mx-auto px-6 pb-4 flex items-center gap-4 max-w-7xl">
                    <div className="text-sm text-gray-700">
                        <p className="text-xs text-gray-500 font-medium">
                            {dayjs(showData?.date, "DD-MM-YYYY").format("ddd")}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                            {dayjs(showData?.date, "DD-MM-YYYY").format("DD MMMM")}
                        </p>
                    </div>

                    <button
                        className={`border cursor-pointer rounded-[14px] px-8 py-3 text-sm border-black font-medium bg-gray-200`}
                    >
                           {showData?.startTime}
                        <p className="text-[10px] text-gray-500 -mt-1">
                            {showData?.audioType.toUpperCase()}
                        </p>
                    </button>
                </div>
            </div>
            <hr className="my-2 border-gray-300 max-w-7xl mx-auto" />
        </>
    )
}

export default Header