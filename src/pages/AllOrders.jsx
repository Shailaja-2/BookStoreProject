import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import { FaUserLarge } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { IoOpenOutline } from "react-icons/io5";
import SeeUserData from "./SeeUserData";

const AllOrders = () => {
  const [AllOrders, setAllOrders] = useState([]);
  const [Options, setOptions] = useState(-1);
  const [Values, setValues] = useState({ status: "" });
  const [UserDiv, setUserDiv] = useState("hidden");
  const [UserDivData, setUserDivData] = useState();
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id") || "",  // Use an empty string as a fallback
    authorization: `Bearer ${localStorage.getItem("token") || ""}`, 
     // Fallback to an empty string if token is missing
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/orders/all-orders",
          { headers }
        );
        setAllOrders(response.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const change = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const submitChanges = async (i) => {
    try {
      const id = AllOrders[i]?._id;  // Use optional chaining to avoid errors
      if (!id) return; // If there's no valid ID, stop the update
      const response = await axios.put(
        `http://localhost:1000/orders/update-status/${id}`,
        Values,
        { headers }
      );
      alert(response.data.message);
      // Update the order locally to avoid refetching
      const updatedOrders = [...AllOrders];
      updatedOrders[i].status = Values.status;
      setAllOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-[100%] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {AllOrders.length > 0 ? (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            All Orders
          </h1>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%] text-center">Sr.</div>
            <div className="w-[40%] md:w-[22%]">Books</div>
            <div className="w-0 md:w-[45%] hidden md:block">Description</div>
            <div className="w-[17%] md:w-[9%]">Price</div>
            <div className="w-[30%] md:w-[16%]">Status</div>
            <div className="w-[10%] md:w-[5%]">
              <FaUserLarge />
            </div>
          </div>

          {AllOrders.map((items, i) => (
            <div
              key={items?._id}  // Optional chaining in case items is null
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
            >
              <div className="w-[3%] text-center">{i + 1}</div>
              <div className="w-[40%] md:w-[22%]">
                <Link
                  to={`/view-book-details/${items?.book?._id}`}  // Optional chaining for book and _id
                  className="hover:text-blue-300"
                >
                  {items?.book?.title || "No title available"}  {/* Safe access */}
                </Link>
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                {items?.book?.desc ? `${items?.book?.desc.slice(0, 50)}...` : "No description available"}
              </div>

              <div className="w-[17%] md:w-[9%]">&#8377; {items?.book?.price || "N/A"}</div>
              <div className="w-[30%] md:w-[16%]">
                <button
                  className="hover:scale-105 transition-all duration-300"
                  onClick={() => setOptions(i)}
                >
                  <div
                    className={ 
                      items?.status === "Order placed"
                        ? "text-yellow-500"
                        : items?.status === "Canceled"
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {items?.status || "Unknown"}
                  </div>
                </button>
                {Options === i && (
                  <div className="flex mt-4">
                    <select
                      name="status"
                      className="bg-gray-800"
                      onChange={change}
                      value={Values.status}
                    >
                      {[
                        "Order Placed",
                        "Out for delivery",
                        "Delivered",
                        "Canceled",
                      ].map((status, idx) => (
                        <option key={idx} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-green-500 hover:text-pink-600 mx-2"
                      onClick={() => {
                        setOptions(-1);
                        submitChanges(i);
                      }}
                    >
                      <FaCheck />
                    </button>
                  </div>
                )}
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl hover:text-orange-500"
                  onClick={() => {
                    setUserDiv("fixed");
                    setUserDivData(items?.user);  // Optional chaining for user data
                  }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-3xl text-zinc-500">No orders found</h1>
      )}

      {UserDivData && (
        <SeeUserData
          UserDivData={UserDivData}
          UserDiv={UserDiv}
          setUserDiv={setUserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;
