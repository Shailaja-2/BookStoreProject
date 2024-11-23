import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [Value, setValue] = useState({ address: "" });
  const [ProfileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Ensure user is logged in
  useEffect(() => {
    if (!localStorage.getItem("id") || !localStorage.getItem("token")) {
      alert("You must log in to access this page.");
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const change = (e) => {
    const { name, value } = e.target;
    setValue({ ...Value, [name]: value });
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/users/information", // Changed https to http for local development
          { headers }
        );
        setProfileData(response.data);
        setValue({ address: response.data.address || "" });
      } catch (error) {
        console.error("Failed to load profile data:", error);
        alert(
          error.response?.data?.message ||
            "An error occurred while loading profile data."
        );
      }
    };
    fetchProfileData();
  }, []);

  const submitAddress = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/users/update-adress",
        Value,
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Failed to update address:", error);
      alert(
        error.response?.data?.message || "An error occurred while updating the address."
      );
    }
  };

  return (
    <>
      {!ProfileData ? (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Settings
          </h1>
          <div className="flex gap-12">
            <div className="">
              <label htmlFor="">Username</label>
              <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
                {ProfileData.username}
              </p>
            </div>
            <div className="">
              <label htmlFor="">Email</label>
              <p className="p-2 rounded bg-zinc-800 mt-2 font-semibold">
                {ProfileData.email}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label htmlFor="">Address</label>
            <textarea
              className="p-2 rounded bg-zinc-800 mt-2 font-semibold"
              rows="5"
              placeholder="Address"
              name="address"
              value={Value.address}
              onChange={change}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400 transition-all duration-300"
              onClick={submitAddress}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
