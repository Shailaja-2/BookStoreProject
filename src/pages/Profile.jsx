import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import Sidebar from "../components/Profile/Sidebar";
import MobileNav from "../components/Profile/MobileNav";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Renamed state to lowercase 'profile'
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Make sure the 'id' and 'token' are available before making the request
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    // Check if the user is logged in and has a token
    if (!headers.id || !headers.authorization) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/users/information", // Use HTTP for local development
          { headers }
        );
        setProfile(response.data); // Update profile data
      } catch (error) {
        setError("Failed to fetch profile data."); // Handle error
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after the request is done
      }
    };

    fetchProfile(); // Fetch profile information on component mount
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row py-8 gap-4 text-white">
      {loading && !error && (
        <div className="w-full h-[100vh] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {error && !loading && (
        <div className="w-full h-[100vh] flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {profile && !loading && !error && (
        <>
          <div className="w-full md:w-1/6 h-auto lg:h-screen">
            <Sidebar data={profile} /> {/* Sidebar receives profile data */}
            <MobileNav />
          </div>
          <div className="w-full md:w-5/6">
            <Outlet /> {/* Render nested route content */}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
