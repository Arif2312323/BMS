import React from 'react';
import {useNavigate} from "react-router-dom"
import {keepPreviousData, useQuery} from "@tanstack/react-query"
import { useSelector } from 'react-redux';

const RecommendedMovies = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const loc = useSelector((state)=>state.location);
  const state = loc.location?.address.state

  const {data : recMovies, isError} = useQuery({
    queryKey : ["recommended movies"],
    queryFn : async () => {
      const res = await fetch(`${url}/movies/recommended`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    placeholderData : keepPreviousData,
  })
  const movies = recMovies?.movies.slice(0,5);
  return (
    <div className='max-w-screen-xl mx-auto px-4 py-10'>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Recommended Movies</h2>
        <button className="text-red-500 font-medium hover:text-red-600 cursor-pointer">
          See All
        </button>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" >
        {movies?.map((movie, i) => (
          <div key={i} className="rounded overflow-hidden cursor-pointer"
            onClick={()=>navigate(`/movies/${state}/${movie.title}/${movie._id}/ticket`)}
          >
            <div className="relative">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-[300px] object-cover rounded"
              />
            </div>

            {/* Rating Bar */}
            <div className="bg-black text-white text-sm px-2 py-1 flex items-center justify-between">
              <span>⭐ {movie.rating}/10</span>
              <span>{movie.votes} Votes</span>
            </div>

            {/* Movie Info */}
            <div className="px-2 py-1">
              <h3 className="font-semibold text-lg">{movie.title}</h3>
              <p className="text-md text-gray-500">
                {movie.genre.join("|")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedMovies;