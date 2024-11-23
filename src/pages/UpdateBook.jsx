import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBook = () => {
  const [data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = "http://localhost:1000";

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:1000/books/update-book/${id}`,  // pass the book ID here in the URL
        bookData, // send the updated book data
        { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data.success) {
        alert("Book updated successfully!");
        navigate(`/viewBookDetails/${id}`);  // Redirect after success
      } else {
        alert(response.data.message || "Failed to update book.");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      alert("An error occurred while updating the book.");
    }
  };
  

  // Fetch existing book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/get-book-by-id/${id}`, { headers });
        setData(response.data.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to fetch book details");
      }
    };

    fetchBookDetails();
  }, [id]);

  return (
    <div className="bg-zinc-900 h-full p-4">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
        Update Book
      </h1>
      <div className="p-4 bg-zinc-800 rounded">
        <div>
          <label htmlFor="url" className="text-zinc-400">
            Image URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Enter image URL"
            value={data.url}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="title" className="text-zinc-400">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Enter book title"
            value={data.title}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="author" className="text-zinc-400">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="Enter author name"
            value={data.author}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-1/2">
            <label htmlFor="language" className="text-zinc-400">
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Enter language"
              value={data.language}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="price" className="text-zinc-400">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Enter price"
              value={data.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="desc" className="text-zinc-400">
            Description
          </label>
          <textarea
            id="desc"
            name="desc"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            rows="5"
            placeholder="Enter book description"
            value={data.desc}
            onChange={handleChange}
          />
        </div>
        <button
          className="mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
          onClick={handleSubmit}
        >
          Update Book
        </button>
      </div>
    </div>
  );
};

export default UpdateBook;
