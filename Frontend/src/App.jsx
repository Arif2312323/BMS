import { Routes, Route, data } from "react-router-dom"
import Header from "./components/shared/Header"
import Footer from "./components/shared/Footer"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setLocation, setError } from "./redux/locationSlice"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import MovieDetails from "./pages/MovieDetails"
import Profile from "./pages/Profile"

function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setLoading(1));
    const fetchLocationData = async (latitude,longitude) => {
      try{
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        dispatch(setLocation(data))
      }
      catch(err)
      {
        console.error('Error fetching location:', err);
        dispatch(setError('Failed to fetch location data'));
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position)=>{
          const {latitude,longitude} = position.coords;
          fetchLocationData(latitude,longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          dispatch(setError('Location access denied or unavailable'));
        }
      );
    } else {
      console.error('Geolocation not supported');
      dispatch(setError('Geolocation not supported'));
    }
  },[]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/movies" element={<Movies/>} />
          <Route path="/movies/:id" element={<MovieDetails/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
