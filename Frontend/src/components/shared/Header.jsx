// Header.jsx
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { toggleSignIn } from "../../redux/signInSlice";
import { setUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const loc = useSelector((state)=>state.location);
  const navigate = useNavigate();
  const user = useSelector((state)=>state.user);
  useEffect(()=>{
    const f = async() => {
      const res = await fetch(`${url}/users/me`,{
        method : "GET",
        credentials : "include",
      })
      if(!res.ok) return;
      const userData = await res.json();
      dispatch(setUser(userData.data));
    };
    f();
  },[])
  const handleSignInClick = ()=>{
    dispatch(toggleSignIn());
  };
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded bg-pink-600 text-xs font-bold text-white">
            BMS
          </span>
          <span className="text-sm font-semibold text-gray-900">
            bookMyScreen
          </span>
        </a>

        {/* Search */}
        <div className="flex flex-1 items-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 21l-4.3-4.3m1.3-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Location + Sign in */}
        <div className="hidden items-center gap-4 md:flex">
          <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
            {loc.isLoading ? 'Loading...' : (loc.error ? 'Location unavailable' : (loc.location?.address?.city || 'West Bengal'))}
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.1 1.02l-4.25 4.5a.75.75 0 01-1.1 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

         {
           user ?
           <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate("/profile")}>
              <FaUserCircle size={28} color="#ff4444" />
              <span className="text-black text-sm font-semibold capitalize">
                {user.name}
              </span>
            </div>
            :
            <button onClick={handleSignInClick} className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700  cursor-pointer">
              Sign in
            </button>
         }
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-gray-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <nav className="flex items-center gap-6 text-sm text-gray-700">
            {["Movies", "Stream", "Events", "Plays", "Sports", "Activities"].map(
              (item) => (
                <a
                  href={item === "Movies" ? "/movies" : "#"}
                  key={item}
                  className="hover:text-gray-900"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            {["ListYourShow", "Corporates", "Offers", "Gift Cards"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-gray-900"
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}