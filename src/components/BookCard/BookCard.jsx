import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ data, favourite }) => {
  // Define headers for API requests
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: data._id,
  };

  // Handle removing a book from favourites
  const handleRemoveBook = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/favourites/remove-favourite",
        { bookId: data._id }, // Send bookId in the request body for clarity
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      alert("Failed to remove book from favourites.");
    }
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col">
      {/* Link to view book details */}
      <Link to={`/view-book-details/${data._id}`}>
        <div>
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img
              src={data.url}
              alt={data.title || "Book Cover"}
              className="h-[25vh] object-cover"
            />
          </div>
          <h2 className="mt-4 text-xl text-white font-semibold">
            {data.title}
          </h2>
          <p className="mt-2 text-zinc-400 font-semibold">by {data.author}</p>
          <p className="mt-2 text-zinc-200 font-semibold text-xl">
            &#8377; {data.price}
          </p>
        </div>
      </Link>

      {/* Remove from Favourites button */}
      {favourite && (
        <button
          className="bg-yellow-50 px-4 py-2 rounded border border-yellow-500 text-yellow-500 mt-4 hover:bg-yellow-500 hover:text-white transition"
          onClick={handleRemoveBook}
        >
          Remove from favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;
