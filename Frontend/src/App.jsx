import { Routes, Route, useMatch } from "react-router-dom"
import Header from "./components/shared/Header"
import Footer from "./components/shared/Footer"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, setLocation, setError } from "./redux/locationSlice"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import MovieDetails from "./pages/MovieDetails"
import Profile from "./pages/Profile"
import SeatLayout from "./pages/SeatLayout"
import Checkout from "./pages/Checkout"
import SignInModal from "./components/auth/signInModal"

function App() {
  const isSignInOpen = useSelector((state) => state.isSignInModalOpen);
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
      finally
      {
        dispatch(setLoading(0));
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

  const isSeatLayoutPage = useMatch(
    "/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
  );
  const isCheckOutPage = useMatch(
    "/shows/:showId/:state/checkout"
  )

  return (
    <div className="min-h-screen flex flex-col">
      {isSignInOpen && <SignInModal />}
      {!isSeatLayoutPage && !isCheckOutPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/movies" element={<Movies/>} />
          <Route path="/movies/:state/:movieName/:id/ticket" element={<MovieDetails/>} />
          <Route path="/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout" element={<SeatLayout/>} />
          <Route path = "/shows/:showId/:state/checkout" element = {<Checkout/>} />
        </Routes>
      </main>
      {!isSeatLayoutPage&& !isCheckOutPage && <Footer />}
    </div>
  )
}

export default App
