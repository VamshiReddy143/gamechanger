import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success(response.data.message);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
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

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mt-7">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              className="p-2 bg-white text-black rounded-full text-center focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2 mt-5">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="axxxxx@gmail.com"
                className="p-2 bg-white text-black rounded-full text-center w-[340px] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-2 bg-white text-black rounded-full focus:outline-none"
              >
                <option value="user">User</option>
                <option value="coach">Coach</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="p-2 bg-white text-black rounded-full text-center focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-5 bg-white text-black font-bold w-fit px-6 py-2 rounded-full cursor-pointer text-[13px] flex items-center justify-center"
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
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-7 text-white text-[13px] text-center">
          Have an account?{" "}
          <Link to="/login" className="font-bold cursor-pointer hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;