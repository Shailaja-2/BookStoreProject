import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/orders/order-history", // Backend API URL
          { headers }
        );
        console.log("Order History Response:", response.data); // Debug
        setOrderHistory(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch order history:", error);
        alert(error.response?.data?.message || "Failed to load order history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (orderHistory.length === 0) {
    return (
      <div className="h-[80vh] p-4 text-zinc-100">
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">
            No Order History
          </h1>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
            alt="No orders"
            className="h-[20vh] mb-8"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-0 md:p-4 text-zinc-100">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
        Your Order History
      </h1>
      <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
        <div className="w-[3%]">
          <h1 className="text-center">Sr.</h1>
        </div>
        <div className="w-[22%]">
          <h1>Books</h1>
        </div>
        <div className="w-[45%]">
          <h1>Description</h1>
        </div>
        <div className="w-[9%]">
          <h1>Price</h1>
        </div>
        <div className="w-[16%]">
          <h1>Status</h1>
        </div>
        <div className="hidden md:block md:w-[5%]">
          <h1>Mode</h1>
        </div>
      </div>
      {orderHistory.map((items, i) => {
  const book = items.book || {}; // Fallback to an empty object if book is null
  return (
    <div
      key={items._id || i} // Ensure unique key for React
      className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor-pointer transition-all duration-300"
    >
      <div className="w-[3%]">
        <h1 className="text-center">{i + 1}</h1>
      </div>
      <div className="w-[22%]">
        {book._id ? (
          <Link
            to={`/view-book-details/${book._id}`}
            className="hover:text-blue-300"
          >
            {book.title}
          </Link>
        ) : (
          <span className="text-red-500">Book info unavailable</span>
        )}
      </div>
      <div className="w-[45%]">
        <h1>{book.desc ? book.desc.slice(0, 50) : "No description"} ...</h1>
      </div>
      <div className="w-[9%]">
        <h1>&#8377; {book.price || "N/A"}</h1>
      </div>
      <div className="w-[16%]">
        <h1
          className={`font-semibold ${
            items.status === "Order placed"
              ? "text-yellow-500"
              : items.status === "Canceled"
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {items.status}
        </h1>
      </div>
      <div className="hidden md:block md:w-[5%]">
        <h1 className="text-sm text-zinc-400">COD</h1>
      </div>
    </div>
  );
})}

    </div>
  );
};

export default UserOrderHistory;
