import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { closeSignIn } from "../../redux/signInSlice";
import bookMyScreenImage from "../../assets/bookMyScreen.png";
import { setUser } from "../../redux/userSlice";

const SignInModal = () => {
  const dispatch = useDispatch();
  const url = import.meta.env.VITE_BACKEND_URL

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [hashOtp,setHashOtp] = useState(null);

  // ─── Send OTP Mutation ────────────────────────────────────
  // ✅ Hooks are called at TOP LEVEL of component
  const sendOtpMutation = useMutation({
    mutationFn: async (emailToSend) => {
      const res = await fetch(`${url}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSend }),
      });
      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }
      return res.json();
    },
    onSuccess: (data) => {
      console.log("OTP sent successfully", data);
      setHashOtp(data.hash)
      setStep("otp");
      setTimer(20);
      setCanResend(false);
    },
    onError: (error) => {
      console.error("Error sending OTP", error);
      setEmailError("Failed to send OTP. Please try again.");
    },
  });

  // ─── Verify OTP Mutation ──────────────────────────────────
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp }) => {
      const res = await fetch(`${url}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email,hash:hashOtp, otp, }),
      });
      if (!res.ok) {
        throw new Error("Invalid OTP");
      }
      return res.json();
    },
    onSuccess: (data) => {
      console.log("OTP verified successfully", data);
      getUserMutation.mutate();
      dispatch(closeSignIn());
    },
    onError: (error) => {
      console.error("OTP verification failed", error);
      setOtpError("Invalid OTP. Please try again.");
    },
  });
  //getting current user mutation
  const getUserMutation = useMutation({
    mutationFn : async()=>{
      const res = await fetch(`${url}/users/me`,{
        method : "GET",
        credentials : "include",
      })
      if(!res.ok)
      {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
    onSuccess : (data)=>{
      dispatch(setUser(data.data));
    },
    onError : (error)=>{
      console.log("User could not be fetched");
    }
  })

  // ─── Timer Logic ──────────────────────────────────────────
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  // ─── Email Validation ─────────────────────────────────────
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ─── Handle Email Continue ────────────────────────────────
  // ✅ Now just calls mutation.mutate() — no hook inside
  const handleEmailContinue = () => {
    if (!email) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    sendOtpMutation.mutate(email); // ✅ triggers the API call
  };

  // ─── Handle OTP Input ─────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // ─── Handle Backspace ─────────────────────────────────────
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // ─── Handle OTP Verify ────────────────────────────────────
  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setOtpError("Please enter the complete 4-digit OTP");
      return;
    }
    verifyOtpMutation.mutate({ email, otp: enteredOtp }); // ✅
    getUserMutation.mutate();
  };

  // ─── Handle Resend OTP ────────────────────────────────────
  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    setTimer(20);
    setCanResend(false);
    setOtpError("");
    sendOtpMutation.mutate(email); // ✅ reuse same mutation
  };

  // ─── Close Modal ──────────────────────────────────────────
  const handleClose = () => {
    dispatch(closeSignIn());
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 backdrop-blur-md bg-black/40"
        onClick={handleClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-gray-100">

          {/* ── Top Image ──────────────────────────────────── */}
          <div className="relative w-full h-48">
            <img
              src={bookMyScreenImage} // ← YOUR IMAGE PATH HERE
              alt="BookMyShow"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-white" />
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-700 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all hover:scale-110"
            >
              ✕
            </button>
          </div>

          {/* ── Modal Body ─────────────────────────────────── */}
          <div className="px-8 pb-8 pt-2">
            <h2 className="text-gray-800 text-2xl font-bold text-center mb-1">
              {step === "email" ? "Sign In" : "Verify OTP"}
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              {step === "email"
                ? "Get access to your Orders, Wishlist and Recommendations"
                : (
                  <span>
                    OTP sent to{" "}
                    <span className="text-gray-600 font-semibold">{email}</span>
                  </span>
                )}
            </p>

            {/* ── STEP 1 : Email ───────────────────────────── */}
            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-500 text-xs mb-1.5 block uppercase tracking-wider font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEmailContinue()
                    }
                    placeholder="example@email.com"
                    className={`w-full bg-gray-50 border ${
                      emailError
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-red-400"
                    } outline-none text-gray-800 rounded-xl px-4 py-3 text-sm transition-all placeholder-gray-300`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1.5">
                      ⚠️ {emailError}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleEmailContinue}
                  // ✅ show loading state from mutation
                  disabled={sendOtpMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all text-sm tracking-widest shadow-lg shadow-red-200"
                >
                  {sendOtpMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Sending OTP...
                    </span>
                  ) : (
                    "CONTINUE →"
                  )}
                </button>

                <p className="text-gray-400 text-xs text-center">
                  By continuing, you agree to our{" "}
                  <span className="text-red-500 cursor-pointer hover:underline">
                    Terms of Use
                  </span>{" "}
                  &{" "}
                  <span className="text-red-500 cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>
            )}

            {/* ── STEP 2 : OTP ─────────────────────────────── */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-14 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all duration-200 border-2
                        ${digit
                          ? "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-100"
                          : "border-gray-200 bg-gray-50 text-gray-800"
                        }
                        focus:border-red-400 focus:bg-red-50`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-500 text-xs text-center">
                    ⚠️ {otpError}
                  </p>
                )}

                <div className="text-center bg-gray-50 rounded-xl py-3 px-4">
                  {!canResend ? (
                    <p className="text-gray-400 text-sm">
                      Resend OTP in{" "}
                      <span className="text-red-500 font-bold text-base">
                        00:{String(timer).padStart(2, "0")}
                      </span>
                    </p>
                  ) : (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Didn't receive the OTP?
                      </p>
                      <button
                        onClick={handleResendOtp}
                        disabled={sendOtpMutation.isPending}
                        className="text-red-500 hover:text-red-600 text-sm font-bold transition-colors"
                      >
                        {sendOtpMutation.isPending ? "Sending..." : "Resend OTP →"}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyOtpMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed active:scale-95 text-white font-semibold py-3 rounded-xl transition-all text-sm tracking-widest shadow-lg shadow-red-200"
                >
                  {verifyOtpMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12" cy="12" r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "VERIFY OTP ✓"
                  )}
                </button>

                <button
                  onClick={() => {
                    setStep("email");
                    setOtp(["", "", "", ""]);
                    setOtpError("");
                  }}
                  className="w-full text-gray-400 hover:text-gray-600 text-sm transition-colors"
                >
                  ← Change Email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInModal;