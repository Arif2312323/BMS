import React from 'react'
import BannerSlider from '../components/shared/BannerSlider'
import RecommendedMovies from '../components/Recommended'
import LiveEvents from '../components/LiveEvents'

const Home = () => {
  return (
    <div>
      <BannerSlider/>
      <RecommendedMovies/>
      <LiveEvents/>
    </div>
  )
}

export default Home