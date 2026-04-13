// BookingReviewPage.jsx

// =====================
// Static Data
// =====================
const show = {
  _id: "show123",
  date: "12-10-2025",
  startTime: "07:30 PM",
  movie: {
    title: "Interstellar",
    certification: "UA13+",
    languages: ["English", "Hindi"],
    format: ["2D", "IMAX"],
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
  },
  theatre: {
    name: "PVR Icon",
    city: "Kolkata",
    state: "West Bengal",
  },
};

const selectedSeats = [
  { type: "PREMIUM", seatNumber: "B5", price: 250 },
  { type: "EXECUTIVE", seatNumber: "B6", price: 250 },
];

const userDetails = {
  name: "Amrit Raj",
  phone: "+91-9876543210",
  email: "amrit@example.com",
  state: "West Bengal",
};

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

const Navbar = () => (
  <nav className="border-b px-6 py-3 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <span className="text-pink-500 font-bold text-xl">🎬 bookMyScreen</span>
    </div>
    <h1 className="text-lg font-bold">Review your booking</h1>
    <button className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition">
      Sign in
    </button>
  </nav>
);

const MovieInfo = ({ movie, theatre }) => (
  <div className="flex items-start gap-4">
    <img
      src={movie.posterUrl}
      alt={movie.title}
      className="w-16 h-20 object-cover rounded"
    />
    <div>
      <h2 className="text-xl font-bold">{movie.title}</h2>
      <p className="text-gray-500 text-sm">
        {movie.certification} • {movie.languages.join(", ")} •{" "}
        {movie.format.join(", ")}
      </p>
      <p className="text-gray-500 text-sm">
        {theatre.name}, {theatre.city}, {theatre.state}
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
          <p key={seat.seatNumber} className="text-gray-500 text-sm">
            {seat.type} - {seat.seatNumber}
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
      <p className="font-semibold text-gray-800">{user.name}</p>
      <p className="text-gray-500 text-sm">{user.phone}</p>
      <p className="text-gray-500 text-sm">{user.email}</p>
      <p className="text-gray-500 text-sm">{user.state}</p>
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
    className="w-full bg-black text-white rounded-lg p-4 flex justify-between items-center hover:bg-gray-900 transition"
  >
    <span className="font-bold text-lg">₹{totalAmount} TOTAL</span>
    <span className="font-semibold">Proceed To Pay</span>
  </button>
);

// =====================
// Main Page
// =====================
const BookingReviewPage = () => {
  // calculations
  const orderAmount = calculateOrderAmount(selectedSeats);
  const tax = calculateTax(orderAmount, TAX_RATE);
  const totalAmount = calculateTotalAmount(orderAmount, tax);
  const formattedDate = formatDate(show.date);

  // will be replaced with actual payment logic
  const handleProceedToPay = () => {
    console.log("Proceeding to pay:", totalAmount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          <MovieInfo movie={show.movie} theatre={show.theatre} />
          <ShowDetails date={formattedDate} startTime={show.startTime} />
          <SeatDetails seats={selectedSeats} orderAmount={orderAmount} />
          <CancellationPolicy />
          <AvailableOffers />
        </div>

        {/* Right Section */}
        <div className="w-80 space-y-4">
          <h2 className="text-lg font-bold">Payment Summary</h2>
          <PaymentSummary
            orderAmount={orderAmount}
            tax={tax}
            totalAmount={totalAmount}
            taxRate={TAX_RATE}
          />
          <h2 className="text-lg font-bold">Your details</h2>
          <UserDetailsCard user={userDetails} />
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