import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Check if the user is logged in
        if (!localStorage.getItem("id") || !localStorage.getItem("token")) {
          alert("You are not logged in.");
          navigate("/login"); // Redirect to login if not authenticated
          return;
        }

        // Fetch the cart data
        const response = await axios.get(
          "http://localhost:1000/carts/get-user-cart",
          { headers }
        );
        console.log(response.data); // Log the response for debugging
        setCart(response.data.data || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert(error.response?.data?.message || "Failed to fetch cart.");
      } finally {
        setIsLoading(false); // Stop loader once the API call finishes
      }
    };

    fetchCart();
  }, []); // Empty dependency array ensures the effect runs only once

  // Recalculate the total amount whenever the cart changes
  useEffect(() => {
    const total = Cart.reduce((sum, item) => sum + item.price, 0);
    setTotal(total);
  }, [Cart]);

  // Function to delete an item from the cart
  const deleteItem = async (bookId) => {
    try {
      const response = await axios.put(
        `http://localhost:1000/carts/remove-from-cart/${bookId}`,
        {},
        { headers }
      );
      alert(response.data.message);
      setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error.response?.data?.message || "Failed to remove item.");
    }
  };

  // Function to place an order
  const PlaceOrder = async () => {
    try {
      const response = await axios.post(
        `http://localhost:1000/orders/place-order`,
        { order: Cart },
        { headers }
      );
      alert(response.data.message);
      navigate("/profile/orderHistory");
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Failed to place order.");
    }
  };

  // Show a loading spinner while the cart data is being fetched
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // If the cart is empty
  if (Cart.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl lg:text-6xl font-semibold text-zinc-400">
          Empty Cart
        </h1>
        <img
          src="./empty-cart.webp"
          alt="empty cart"
          className="lg:h-[50vh]"
        />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-12 h-screen py-8">
      <h1 className="text-5xl font-semibold text-zinc-500 mb-8">Your Cart</h1>
      {Cart.map((item) => (
        <div
          className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
          key={item._id}
        >
          <img
            src={item.url}
            alt={item.title}
            className="h-[20vh] md:h-[10vh] object-cover"
          />
          <div className="w-full md:w-auto">
            <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
              {item.title}
            </h1>
            <p className="text-normal text-zinc-300 mt-2 hidden lg:block">
              {item.desc.slice(0, 100)}...
            </p>
          </div>
          <div className="flex mt-4 w-full md:w-auto items-center justify-between">
            <h2 className="text-zinc-100 text-3xl font-semibold flex">
              &#8377; {item.price}
            </h2>
            <button
              className="bg-red-100 text-red-700 border border-red-700 rounded p-2 ms-12"
              onClick={() => deleteItem(item._id)}
            >
              <AiFillDelete />
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4 w-full flex items-center justify-end">
        <div className="p-4 bg-zinc-800 rounded">
          <h1 className="text-3xl text-zinc-200 font-semibold">Total Amount</h1>
          <div className="mt-3 flex items-center justify-between text-xl text-zinc-200">
            <h2>{Cart.length} books</h2>
            <h2>&#8377; {Total}</h2>
          </div>
          <button
            className="bg-zinc-100 rounded px-4 py-2 flex justify-center w-full font-semibold hover:bg-zinc-200 mt-3"
            onClick={PlaceOrder}
          >
            Place your order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
