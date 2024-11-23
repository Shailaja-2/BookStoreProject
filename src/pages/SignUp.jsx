import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState(""); // For error message handling
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Validate form fields
  const validateFields = () => {
    if (!values.username || !values.email || !values.password || !values.address) {
      return "All fields are required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      return "Please enter a valid email address.";
    }
    if (values.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationError = validateFields();
    if (validationError) {
      setError(validationError); // Set validation error
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:1000/users/sign-up", // Use http for local development
        values
      );
      alert(response.data.message);
      navigate("/LogIn"); // Redirect to login page
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Sign Up</p>
        {error && <p className="text-red-500 mt-2">{error}</p>} {/* Error message */}
        <div className="mt-4">
          <div>
            <label htmlFor="username" className="text-zinc-400">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Username"
              name="username"
              value={values.username}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="text-zinc-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="xyz@example.com"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="text-zinc-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="address" className="text-zinc-400">
              Address
            </label>
            <textarea
              id="address"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              rows="5"
              placeholder="Address"
              name="address"
              value={values.address}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
            Already have an account? &nbsp;
            <Link to="/LogIn" className="hover:text-blue-500">
              <u>Log In</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
