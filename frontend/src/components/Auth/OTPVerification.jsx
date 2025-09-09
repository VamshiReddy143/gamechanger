import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").split("").slice(0, 4);
    if (paste.every(char => /^[0-9]$/.test(char))) {
      setOtp(paste);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const otpCode = otp.join("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otpCode
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative bg-black">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full">
        <div className="flex gap-10 justify-between">
          <img className="h-15" src="/images/pl.webp" alt="" />
        </div>

        <h2 className="text-white text-2xl font-bold text-center mt-7">Enter OTP</h2>
        <p className="text-white text-center mt-2">A 4-digit code was sent to {email}</p>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-black bg-white rounded-md focus:outline-none text-xl"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="mt-5 bg-white text-black font-bold w-full py-2 rounded-full cursor-pointer"
            disabled={isLoading || otp.some(digit => !digit)}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-black inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="mt-3 text-white text-sm hover:underline"
          disabled={isLoading}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;