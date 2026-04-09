import React, { useState } from 'react'
import Header from '../components/seat-layout/Header'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import Footer from '../components/seat-layout/Footer';
import screenImg from '../assets/screen.png'; // ← drop your screen image here

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .sl-root {
    font-family: 'Inter', sans-serif;
    background: #ffffff;
    color: #1a1a1a;
  }

  .sl-scroll::-webkit-scrollbar { width: 4px; }
  .sl-scroll::-webkit-scrollbar-track { background: transparent; }
  .sl-scroll::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

  .sl-cat-heading {
    text-align: center;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #111;
    margin-bottom: 18px;
    text-transform: uppercase;
  }

  .sl-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .sl-row-label {
    width: 20px;
    text-align: right;
    font-size: 12px;
    font-weight: 600;
    color: #999;
    flex-shrink: 0;
    margin-right: 4px;
  }

  .sl-seat {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    border: 1.5px solid #ccc;
    background: #fff;
    font-size: 11px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    outline: none;
  }
  .sl-seat:hover:not(:disabled) {
    border-color: #555;
    background: #f5f5f5;
  }
  .sl-seat.selected {
    background: #1a1a1a;
    border-color: #1a1a1a;
    color: #fff;
  }
  .sl-seat.booked {
    background: #f0f0f0;
    border-color: #e0e0e0;
    color: #ccc;
    cursor: not-allowed;
  }

  .sl-section { margin-bottom: 36px; }
  .sl-section:last-child { margin-bottom: 0; }

  .sl-legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 32px;
  }
  .sl-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #555;
    font-weight: 500;
  }
  .sl-legend-box {
    width: 16px; height: 16px;
    border-radius: 4px;
    border: 1.5px solid;
  }
  .sl-legend-box.available { background: #fff; border-color: #ccc; }
  .sl-legend-box.selected  { background: #1a1a1a; border-color: #1a1a1a; }
  .sl-legend-box.booked    { background: #f0f0f0; border-color: #e0e0e0; }

  .sl-screen-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 52px;
  }
  .sl-screen-img {
    width: 100%;
    max-width: 420px;
    object-fit: contain;
  }
  .sl-screen-label {
    font-size: 10px;
    letter-spacing: 0.4em;
    color: #aaa;
    text-transform: uppercase;
    font-weight: 600;
    margin-top: 10px;
  }

  .sl-loading {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    font-size: 14px;
    color: #999;
    letter-spacing: 0.05em;
  }

  @media (max-width: 480px) {
    .sl-seat { width: 28px; height: 28px; font-size: 9px; border-radius: 6px; }
    .sl-row  { gap: 4px; }
  }
`;

const SeatLayout = () => {
  const { showId } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  const { data, isLoading } = useQuery({
    queryKey: ["GetShowData", showId],
    queryFn: async () => {
      const res = await fetch(`${url}/shows/${showId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const handleSeatSelect = (rowName, seatNumber, price) => {
    const seatId = `${rowName}-${seatNumber}`;
    setSelectedSeats(prev => {
      if (prev.find(s => s.id === seatId)) return prev.filter(s => s.id !== seatId);
      if (prev.length >= 10) return prev;
      return [...prev, { id: seatId, row: rowName, number: seatNumber, price }];
    });
  };

  if (isLoading) return (
    <div className="sl-root">
      <style>{styles}</style>
      <div className="sl-loading">Loading seats…</div>
    </div>
  );

  return (
    <div className="sl-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{styles}</style>

      <Header showData={data} />

      <div className="sl-scroll" style={{ flex: 1, overflowY: 'auto', paddingTop: 28, paddingBottom: 140 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>

          {/* Legend */}
          <div className="sl-legend">
            <div className="sl-legend-item"><div className="sl-legend-box available" />Available</div>
            <div className="sl-legend-item"><div className="sl-legend-box selected" />Selected</div>
            <div className="sl-legend-item"><div className="sl-legend-box booked" />Booked</div>
          </div>

          {/* Seat sections */}
          {data?.seatLayout?.map((section, idx) => (
            <div className="sl-section" key={idx}>

              <p className="sl-cat-heading">
                {section.type} : ₹{section.price}
              </p>

              <div className="sl-row">
                <span className="sl-row-label">{section.row}</span>
                {section.seats.map((seat) => {
                  const seatId = `${section.row}-${seat.number}`;
                  const isSelected = selectedSeats.some(s => s.id === seatId);
                  const isOccupied = seat.status === "BOOKED";
                  return (
                    <button
                      key={seat.number}
                      disabled={isOccupied}
                      onClick={() => handleSeatSelect(section.row, seat.number, section.price)}
                      className={`sl-seat${isOccupied ? ' booked' : isSelected ? ' selected' : ''}`}
                      title={`Row ${section.row} · Seat ${seat.number}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Screen */}
          <div className="sl-screen-wrap">
            <img src={screenImg} alt="Screen" className="sl-screen-img" />
            <p className="sl-screen-label">All eyes this way</p>
          </div>

        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 20 }}>
        <Footer
          selectedCount={selectedSeats.length}
          totalPrice={selectedSeats.reduce((sum, s) => sum + s.price, 0)}
          isSelected={selectedSeats.length > 0}
        />
      </div>
    </div>
  );
};

export default SeatLayout;