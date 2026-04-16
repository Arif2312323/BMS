import React, { useState } from 'react'
import { ordersData } from '../utils/constants'
import { useSelector } from 'react-redux'
import BookingsTab from '../components/BookingsTab'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const user = useSelector((state)=>state.user);
  const loc = useSelector((state)=>state.location);
  const url = import.meta.env.VITE_BACKEND_URL;
  const handleLogout = async () =>{
    await fetch(`${url}/auth/logout`,{
      method : "POST",
      credentials : "include",
    })
  }
  return (
    <div className='min-h-screen bg-[#F2F2F2]'>

      {/* ── Header Banner ── */}
      <div className='w-full h-40 bg-gradient-to-r from-[#F84464] to-[#c0185a]' />

      {/* ── Main Content ── */}
      <div className='max-w-screen-lg mx-auto px-4 pb-10'>

        {/* ── Profile Card ── */}
        <div className='bg-white rounded-2xl shadow-md p-6 -mt-16 relative z-10'>
          <div className='flex flex-col md:flex-row gap-6 items-center md:items-start'>

            {/* Avatar */}
            <div className='relative flex-shrink-0'>
              <img
                alt={user?.name}
                className='w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-100'
              />
              <button className='absolute bottom-1 right-1 bg-[#F84464] text-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-[#e03055] transition text-sm'>
                ✎
              </button>
            </div>

            {/* User Info */}
            <div className='flex-1 text-center md:text-left'>
              <div className='flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start'>
                <h1 className='text-2xl font-bold text-gray-800'>{user?.name}</h1>
                <span className='bg-[#F84464] text-white text-xs px-3 py-1 rounded-full font-medium w-fit mx-auto md:mx-0'>
                  Premium Member
                </span>
              </div>
              <p className='text-gray-400 text-sm mt-1'>Member since {Date.now()-user?.createdAt}</p>

              {/* Stats Row */}
              <div className='flex gap-6 mt-4 justify-center md:justify-start'>
                <div className='text-center'>
                  <p className='text-xl font-bold text-gray-800'>NA</p>
                  <p className='text-xs text-gray-400'>Bookings</p>
                </div>
                <div className='w-px bg-gray-200' />
                <div className='text-center'>
                  <p className='text-xl font-bold text-gray-800'>2</p>
                  <p className='text-xs text-gray-400'>Movies</p>
                </div>
                <div className='w-px bg-gray-200' />
                <div className='text-center'>
                  <p className='text-xl font-bold text-gray-800'>₹{ordersData.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
                  <p className='text-xs text-gray-400'>Total Spent</p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div style={{display:'flex',flexDirection:'column', gap:'2rem'}}>
              <button className='border border-[#F84464] text-[#F84464] px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#F84464] hover:text-white transition'>
                Edit Profile
              </button>
              <button className='border border-[#F84464] text-[#F84464] px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#F84464] hover:text-white transition' onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className='flex gap-4 mt-6 border-b border-gray-200'>
          {['profile', 'bookings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-sm font-semibold capitalize transition border-b-2
                ${activeTab === tab
                  ? 'border-[#F84464] text-[#F84464]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab === 'profile' ? '👤 Profile' : '🎟️ Booking History'}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Name */}
              <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                <div className='w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-lg'>
                  👤
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Full Name</p>
                  <p className='text-sm font-semibold text-gray-700'>{user?.name}</p>
                </div>
              </div>
              {/* Email */}
              <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg'>
                  📧
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Email Address</p>
                  <p className='text-sm font-semibold text-gray-700'>{user?.email}</p>
                </div>
              </div>
              {/* Location */}
              <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg'>
                  📍
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Location</p>
                  <p className='text-sm font-semibold text-gray-700'>{loc.location?.address?.city}</p>
                </div>
              </div>
              {/* Member Since */}
              <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-lg'>
                  🗓️
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Member Since</p>
                  <p className='text-sm font-semibold text-gray-700'>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
        )}

        {/* ── Bookings Tab ── */}
        {activeTab === 'bookings' && (
          <BookingsTab userId={user._id}/>
        )}

      </div>
    </div>
  )
}

export default Profile