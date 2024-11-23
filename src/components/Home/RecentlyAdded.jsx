import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = () => {
  const [data, setData] = useState(null); // Store book data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:1000/books/get-recent-books");
        
        if (response.data && response.data.data) {
          setData(response.data.data); // Update state with fetched data
        } else {
          throw new Error("No data found");
        }
      } catch (err) {
        console.error("Error fetching recently added books:", err);
        setError(err.response?.data?.message || "Failed to fetch recently added books.");
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    fetchBooks();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100">Recently Added Books</h4>

      {loading && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 my-8">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (!data || data.length === 0) ? (
        <div className="text-center text-yellow-100 my-8">
          <p>No recently added books available.</p>
        </div>
      ) : (
        !loading && !error && data && (
          <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {data.map((item, i) => (
              <div key={i}>
                <BookCard data={item} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default RecentlyAdded;
