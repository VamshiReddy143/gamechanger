import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  xsrfCookieName: 'accessToken', // Match your cookie name
  xsrfHeaderName: 'X-CSRF-Token' // Optional for CSRF protection
});

// Add request interceptor to debug cookies
api.interceptors.request.use(config => {
  console.log('Request will send cookies:', document.cookie);
  return config;
});

// Axios interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check for 401 and specific error message
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh tokens (cookie will be set automatically)
        await api.post("/auth/refresh-token");
        
        // Retry original request - cookies will be sent automatically
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure
        toast.error("Session expired - please log in again");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // Make login request
    await api.post("/auth/login", formData);
    
    // Verify login by fetching user data
    const userResponse = await api.get("/auth/me");
    console.log('Login successful, user:', userResponse.data.user);
    
    toast.success("Login successful");
    navigate("/");
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-black bg-cover bg-center relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full">
        <div className="flex items-center gap-10 justify-between">
          <img className="h-15" src="/images/pl.webp" alt="" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mt-7">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="axxxxx@gmail.com"
              className="p-2 bg-white text-black rounded-full text-center focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="p-2 bg-white text-black rounded-full text-center focus:outline-none"
              required
            />
            <div className="flex items-end justify-end">
              <Link
                to="/forgot-password"
                className="text-blue-300 text-[13px] cursor-pointer hover:underline hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="mt-5 bg-white text-black font-bold px-6 py-2 rounded-full cursor-pointer text-[13px] flex items-center justify-center w-fit"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-black"
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
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-7 text-white text-[13px] text-center">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold cursor-pointer hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;