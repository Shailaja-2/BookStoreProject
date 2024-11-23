import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";

const AllBooks = () => {
  const [Data, setData] = useState();
  const [Error, setError] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/books/get-all-books" // Corrected URL
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (Loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (Error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {Error}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 h-auto px-12 py-8">
      <h4 className="text-3xl text-yellow-100">All Books</h4>
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {Data &&
          Data.map((item, index) => (
            <div key={index}>
              <BookCard data={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllBooks;
