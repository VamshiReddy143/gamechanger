import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, formData);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center relative" >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-w-md w-full">
        <h1 className="text-white text-4xl font-extrabold">Reset Password</h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mt-5">
            <label className="text-white text-[13px]">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="p-2 bg-white text-black text-center rounded-full focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-5 bg-gray-800 text-white px-6 py-3 rounded-xl cursor-pointer text-[13px] flex items-center justify-center w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
              "Change Password"
            )}
          </button>
        </form>

        <p className="mt-7 text-white text-[13px] text-center">
          Back to{" "}
          <Link to="/login" className="font-bold cursor-pointer hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;