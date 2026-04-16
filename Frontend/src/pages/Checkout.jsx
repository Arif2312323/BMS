import React, { useState, useEffect, use } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams, useNavigate, data } from "react-router-dom";
import { socket } from "../utils/socket";
import {razorPayScript} from "../utils/constants"

const TAX_RATE = 0.05;

// =====================
// Utils
// =====================
const calculateOrderAmount = (seats) => {
  return seats.reduce((total, seat) => total + seat.price, 0);
};

const calculateTax = (amount, taxRate) => {
  return Math.round(amount * taxRate);
};

const calculateTotalAmount = (amount, tax) => {
  return amount + tax;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [day, month] = dateString.split("-");
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];
  return `${day} ${months[parseInt(month) - 1]}`;
};

// =====================
// Components
// =====================

const Navbar = ({ timer }) => (
  <nav className="border-b px-6 py-3 flex justify-between items-center">
    <a href="/" className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded bg-pink-600 text-xs font-bold text-white">
        BMS
      </span>
      <span className="text-sm font-semibold text-gray-900">
        bookMyScreen
      </span>
    </a>
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-bold">Review your booking</h1>
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold tabular-nums">
        {timer}
      </span>
    </div>
  </nav>
);

const MovieInfo = ({ movie, theater }) => (
  <div className="flex items-start gap-4">
    <img
      src={movie?.posterUrl}
      alt={movie?.title}
      className="w-16 h-20 object-cover rounded"
    />
    <div>
      <h2 className="text-xl font-bold">{movie?.title}</h2>
      <p className="text-gray-500 text-sm">
        {movie?.certification} • {movie?.languages?.join(", ")} •{" "}
        {movie?.format?.join(", ")}
      </p>
      <p className="text-gray-500 text-sm">
        {theater?.name}, {theater?.city}, {theater?.state}
      </p>
    </div>
  </div>
);

const ShowDetails = ({ date, startTime }) => (
  <div className="border rounded-lg p-4">
    <p className="font-semibold text-gray-800">
      {date} • {startTime}
    </p>
  </div>
);

const SeatDetails = ({ seats, orderAmount }) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-gray-800">
          {seats.length} ticket{seats.length > 1 ? "s" : ""}
        </p>
        {seats.map((seat) => (
          <p key={seat.id} className="text-gray-500 text-sm">
            {seat.row}-{seat.number}
          </p>
        ))}
      </div>
      <p className="font-semibold">₹{orderAmount}</p>
    </div>
  </div>
);

const CancellationPolicy = () => (
  <div className="border rounded-lg p-4 flex items-center gap-2">
    <span className="text-yellow-600 text-lg">ℹ️</span>
    <p className="text-yellow-600 text-sm font-medium">
      No cancellation or refund available after payment.
    </p>
  </div>
);

const AvailableOffers = () => (
  <div className="border rounded-lg p-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="text-gray-600">🏷️</span>
      <p className="text-gray-800 font-medium">Available Offers</p>
    </div>
    <button className="text-blue-500 font-medium hover:underline">
      View all offers
    </button>
  </div>
);

const PaymentSummary = ({ orderAmount, tax, totalAmount, taxRate }) => (
  <div className="border rounded-lg p-4 space-y-3">
    <div className="flex justify-between text-gray-500 text-sm">
      <span>Order amount</span>
      <span>₹{orderAmount}</span>
    </div>
    <div className="flex justify-between text-gray-500 text-sm">
      <span>Taxes & fees ({taxRate * 100}%)</span>
      <span>₹{tax}</span>
    </div>
    <div className="border-t pt-3 flex justify-between font-semibold">
      <span>To be paid</span>
      <span>₹{totalAmount}</span>
    </div>
  </div>
);

const UserDetailsCard = ({ user }) => (
  <div className="border rounded-lg p-4 flex items-start gap-3">
    <span className="text-gray-400 text-2xl">👤</span>
    <div>
      <p className="font-semibold text-gray-800">{user?.name}</p>
      <p className="text-gray-500 text-sm">{user?.email}</p>
      <p className="text-gray-500 text-sm">{user?.state}</p>
    </div>
  </div>
);

const TermsAndConditions = () => (
  <div className="border rounded-lg p-4 flex items-center gap-2">
    <span className="text-gray-400">❓</span>
    <p className="text-gray-800 font-medium">Terms and conditions</p>
  </div>
);

const ProceedToPayButton = ({ totalAmount, onProceed }) => (
  <button
    onClick={onProceed}
    className="w-full bg-black text-white rounded-lg p-4 flex justify-between items-center hover:bg-gray-900 transition cursor-pointer"
  >
    <span className="font-bold text-lg">₹{totalAmount} TOTAL</span>
    <span className="font-semibold">Proceed To Pay</span>
  </button>
);

function loadScript(src)
{
  return new Promise((resolve)=>{
    const script = document.createElement("script");
    script.src = src;
    script.onload = ()=>{
      resolve(true);
    }
    script.onerror = ()=>{
      resolve(false);
    }

    document.body.appendChild(script);
  })
}

// =====================
// Main Page
// =====================
const BookingReviewPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes
  const selectedSeats = useSelector((state) => state.selectedSeats);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (timeLeft <= 0) {
      socket.emit("unlock-seats", {
        showId: showId,
        seatIds: selectedSeats.map((s) => s.id),
        userId: user?._id,
      });
      navigate(-1); 
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, navigate, showId, selectedSeats, user]);
  useEffect(() => {
    return () => {
      socket.emit("unlock-seats", {
        showId: showId,
        seatIds: selectedSeats.map((s) => s.id),
        userId: user?._id,
      });
    };
  }, [showId, selectedSeats, user]);

  const { data: show, isLoading } = useQuery({
    queryKey: ["GetShowData", showId],
    queryFn: async () => {
      const res = await fetch(`${url}/shows/${showId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const orderAmount = calculateOrderAmount(selectedSeats);
  const tax = calculateTax(orderAmount, TAX_RATE);
  const totalAmount = calculateTotalAmount(orderAmount, tax);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!show) return <div className="min-h-screen flex items-center justify-center">Show not found.</div>;

  const formattedDate = formatDate(show.date);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const bookTicketMutation = useMutation({
    mutationFn : async (reqData) =>{
      const res = await fetch(`${url}/booking`,{
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials : "include",
        body : JSON.stringify(reqData),
      })
      if(!res.ok)
      {
        console.log("Error in booking ticket");
        return;
      }
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      alert("Booking completed");
      socket.emit("lock-seats", {
        showId: show._id,
        userId: user._id,
        seatIds: selectedSeats
      })
      navigate(`/profile`);
    },
    onError: (err) => {
      console.log(err);
    }
  })
  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData) => {
      const res = await fetch(`${url}/payment/verify-payment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!res.ok) {
        throw new Error("Payment verification failed");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Payment verified:", data);
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Verification error:", error);
      navigate("/");
    }
  });
  const createOrderMutation = useMutation({
    mutationFn : async (reqData)=>{
      const res = await fetch(`${url}/payment/create-order`,{
        method : "POST",
        credentials : "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      })
      if(!res.ok)
      {
        console.log("Error in creating razorpay order");
        return;
      }
      const data = res.json();
      return data;
    },
    onSuccess: (data) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "BookMyScreen",
        description: "Secure Payment for your tickets",
        order_id: data.id, 
        handler: async function (response) {
          console.log(response);
          verifyPaymentMutation.mutate(response)
          const reqData = {
            showId: show._id,
            seats: selectedSeats.map(seat => seat.id),
            paymentId: response.razorpay_payment_id,
            bookingFee: {
              ticketPrice: orderAmount,
              total : totalAmount,
              convenience: tax
            }
          }
          bookTicketMutation.mutate(reqData)
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#025cca" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error(response.error);
      });
      rzp.open();
    },
    onError: (err)=>{
      console.log(err)
    }
  })

  const handleProceedToPay = async () => {
    try{
      const res = await loadScript(razorPayScript);
      if(!res)
      {
        console.log("Razorpay sdk failed");
        return;
      }
      const reqData = {
        amount : totalAmount
      }

      createOrderMutation.mutate(reqData);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar timer={formatTimer(timeLeft)} />

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          <MovieInfo movie={show.movie} theater={show.theater} />
          <ShowDetails date={formattedDate} startTime={show.startTime} />
          <SeatDetails seats={selectedSeats} orderAmount={orderAmount} />
          <CancellationPolicy />
          <AvailableOffers />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-80 space-y-4">
          <h2 className="text-lg font-bold">Payment Summary</h2>
          <PaymentSummary
            orderAmount={orderAmount}
            tax={tax}
            totalAmount={totalAmount}
            taxRate={TAX_RATE}
          />
          <h2 className="text-lg font-bold">Your details</h2>
          <UserDetailsCard user={user} />
          <TermsAndConditions />
          <ProceedToPayButton
            totalAmount={totalAmount}
            onProceed={handleProceedToPay}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingReviewPage;