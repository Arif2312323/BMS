import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { socket } from "../../utils/socket";

const Footer = ({selectedCount,totalPrice,isSelected,showId}) => {
    
    const loc = useSelector((state)=>state.location);
    const selectedSeats = useSelector((state)=>state.selectedSeats);
    const user = useSelector((state)=>state.user);
    const state = loc.location?.address?.city;
    const navigate = useNavigate();
    console.log(user)
    const handleClick = ()=>{
        //request the backend to apply lock on the selected seats
        socket.emit("lock-seats",{
            showId: showId,
            seatIds: selectedSeats.map(s => s.id),
            userId : user._id,
        })
        navigate(`/shows/${showId}/${state}/checkout`)
    }
    return (
        <>
            {isSelected ? (
                <div className="bg-white py-3 px-6 flex items-center justify-between z-10">
                    <p className="text-gray-700 font-medium text-base">{`${selectedCount} selected`}</p>
                    <button className="bg-black cursor-pointer text-white px-6 py-2 rounded-lg font-semibold" onClick={handleClick}>
                        <div style={{display:'flex',alignItems:'center', gap:'0.3rem'}}>
                            <span>₹</span>
                            <p>{totalPrice}</p>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center bg-white py-3 px-6 flex items-center justify-between z-10">
                    <p className="text-xs font-bold text-purple-600 tracking-wider">
                        SCREEN THIS WAY
                    </p>
                    <div className="flex gap-4 text-xs mt-3">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 border rounded-[4px]"></div>
                            <p>Available</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-gray-200 border rounded-[4px] flex items-center justify-center">
                                <small className="-mt-1">x</small>
                            </div>
                            Occupied
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-purple-600 rounded-[4px]"></div>
                            Selected
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Footer;