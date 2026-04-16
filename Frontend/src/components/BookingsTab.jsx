import { useEffect, useState } from 'react';

export default function BookingsTab({ userId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${url}/booking`, {
            method : "GET",
            credentials : "include"
        });

        if (!res.ok) throw new Error('Failed to fetch bookings');

        const data = await res.json();
        setBookings(data.bookings); 
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [url]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  const formatBookedOn = (isoStr) =>
    new Date(isoStr).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  if (loading) {
    return (
      <div className='mt-6 space-y-4'>
        <h2 className='text-lg font-semibold text-gray-700'>Booking History</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className='bg-white rounded-2xl shadow-sm p-5 animate-pulse'>
            <div className='flex gap-4'>
              <div className='w-24 h-32 bg-gray-200 rounded-xl flex-shrink-0' />
              <div className='flex-1 space-y-3'>
                <div className='h-4 bg-gray-200 rounded w-3/4' />
                <div className='h-3 bg-gray-200 rounded w-1/2' />
                <div className='flex gap-2'>
                  <div className='h-6 bg-gray-200 rounded-full w-20' />
                  <div className='h-6 bg-gray-200 rounded-full w-28' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>Booking History</h2>
        <div className='bg-red-50 border border-red-100 rounded-2xl p-6 text-center'>
          <p className='text-red-500 text-sm font-medium'>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (bookings?.length === 0) {
    return (
      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-gray-700 mb-4'>Booking History</h2>
        <div className='bg-white rounded-2xl shadow-sm p-10 text-center'>
          <p className='text-4xl mb-3'>🎟️</p>
          <p className='text-gray-500 text-sm'>No bookings yet. Go catch a movie!</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-6 space-y-4'>
      <h2 className='text-lg font-semibold text-gray-700'>Booking History</h2>

      {bookings?.map((booking) => {
        const { movie, theater, date, startTime, audioType } = booking.showId;
        
        const convenienceFee = booking.bookingFee.convenience;
        const ticketCost = booking.bookingFee.ticketPrice;

        return (
          <div key={booking._id} className='bg-white rounded-2xl shadow-sm overflow-hidden'>
            <div className='flex flex-col md:flex-row gap-4 p-5'>

              <img
                src={movie.posterUrl}
                alt={movie.title}
                className='w-full md:w-24 h-36 md:h-32 object-cover rounded-xl flex-shrink-0'
              />

              <div className='flex-1 space-y-1'>
                <div className='flex items-start justify-between gap-2'>
                  <h3 className='font-bold text-gray-800 text-base leading-tight'>
                    {movie.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-600'
                        : booking.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-500'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <p className='text-xs text-gray-400'>
                  Booking ID:{' '}
                  <span className='text-gray-600 font-medium ml-1'>{booking.bookingRef}</span>
                </p>

                <div className='flex flex-wrap gap-2 mt-2'>
                  <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full'>
                    🎬 {movie.format} • {audioType}
                  </span>
                  <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full'>
                    📅 {formatDate(date)}, {formatTime(startTime)}
                  </span>
                  <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full'>
                    🎭 {booking.seats.length} {booking.seats.length === 1 ? 'Ticket' : 'Tickets'}
                  </span>
                </div>

                <p className='text-xs text-gray-500 mt-1'>
                  🏛️ {theater.name}, {theater.city}
                </p>
                <p className='text-xs text-gray-500'>
                  💺 Seats:{' '}
                  <span className='font-medium text-gray-700'>
                    {booking.seats.join(', ')}
                  </span>
                </p>
              </div>

              <div className='flex flex-col items-end justify-between gap-3 min-w-[120px]'>
                <div className='text-right'>
                  <p className='text-lg font-bold text-gray-800'>₹{booking.bookingFee.total}</p>
                  <p className='text-xs text-gray-400'>Total Paid</p>
                </div>

                <div className='flex flex-col gap-2 w-full'>
                  <button className='bg-[#F84464] text-white text-xs py-2 px-4 rounded-lg hover:bg-[#e03055] transition font-medium'>
                    Download Ticket
                  </button>
                  <button className='border border-gray-200 text-gray-500 text-xs py-2 px-4 rounded-lg hover:border-gray-400 transition'>
                    View Details
                  </button>
                </div>
              </div>

            </div>

            <div className='bg-gray-50 px-5 py-2 flex flex-wrap gap-4 text-xs text-gray-400 border-t border-gray-100'>
              <span>💳 {booking.paymentMethod}</span>
              <span>🕐 Booked on {formatBookedOn(booking.createdAt)}</span>
              <span>🎟️ Ticket: ₹{ticketCost}</span>
              <span>⚡ Convenience Fee: ₹{convenienceFee}</span>
            </div>

          </div>
        );
      })}
    </div>
  );
}