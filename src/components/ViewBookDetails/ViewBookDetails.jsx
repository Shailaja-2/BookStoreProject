// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Loader from "../Loader/Loader";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { GrLanguage } from "react-icons/gr";
// import { FaHeart } from "react-icons/fa";
// import { IoMdCart } from "react-icons/io";
// import { useSelector } from "react-redux";
// import { FaEdit } from "react-icons/fa";
// import { MdDeleteOutline } from "react-icons/md";

// const ViewBookDetails = () => {
//   const { id } = useParams(); // Get book ID from URL parameters
//   const navigate = useNavigate();
//   const [data, setData] = useState(null); // Holds book data
//   const [loading, setLoading] = useState(true); // Loading state
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status
//   const role = useSelector((state) => state.auth.role); // Get user role

//   const API_URL = "http://localhost:1000"; // Ensure using the right API URL

//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       setLoading(true); // Ensure loading state is true during fetch
//       try {
//         const response = await axios.get(`${API_URL}/books/get-book-by-id/${id}`);
//         setData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching book details:", error);
//         alert(error.response?.data?.message || "Failed to load book details.");
//       } finally {
//         setLoading(false); // Loading is complete
//       }
//     };

//     fetchBookDetails();
//   }, [id]); // Dependency array ensures fetch happens on ID change

//   const headers = {
//     authorization: `Bearer ${localStorage.getItem("token")}`,
//   };

//   const handleFavourite = async () => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/favourites/add-favourite`,
//         { bookId: id },
//         { headers }
//       );
//       if (response.data.success) {
//         alert("Book added to favourites successfully!");
//       } else {
//         alert(response.data.message || "Failed to add book to favourites.");
//       }
//     } catch (error) {
//       console.error("Error adding to favourites:", error);
//       alert(error.response?.data?.message || "An error occurred while adding the book to favourites.");
//     }
//   };

//   const handleCart = async () => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/carts/add-to-cart`,
//         { bookId: id },
//         { headers }
//       );
//       if (response.data.success) {
//         alert("Book added to cart successfully!");
//       } else {
//         alert(response.data.message || "Failed to add book to cart.");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       alert(error.response?.data?.message || "An error occurred while adding the book to the cart.");
//     }
//   };

//   const deleteBook = async () => {
//     try {
//       console.log("Attempting to delete book with ID:", id);
//       const response = await axios.delete(
//         `${API_URL}/books/delete-book/${id}`,
//         { headers }
//       );
//       console.log("Response after deletion:", response.data);
//       alert(response.data.message || "Book deleted successfully.");
//       navigate("/all-books"); // Redirect after deletion
//     } catch (error) {
//       console.error("Error deleting book:", error);
//       alert(error.response?.data?.message || "Failed to delete book.");
//     }
//   };
  

//   if (loading) {
//     return (
//       <div className="h-screen bg-zinc-900 flex items-center justify-center">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <>
//       {data ? (
//         <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8">
//           {/* Left Section */}
//           <div className="w-full lg:w-3/6">
//             <div className="flex lg:flex-row flex-col justify-around bg-zinc-800 p-12 rounded">
//               <img
//                 src={data.url}
//                 alt={data.title}
//                 className="h-[50vh] md:h-[60vh] lg:h-[70vh] rounded"
//               />
//               {isLoggedIn && role === "user" && (
//                 <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
//                   <button
//                     className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 hover:text-red-500 flex items-center justify-center"
//                     onClick={handleFavourite}
//                   >
//                     <FaHeart />
//                     <span className="ms-4 block lg:hidden">Favourites</span>
//                   </button>
//                   <button
//                     className="hover:text-white rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3 lg:mt-8 bg-blue-500 flex items-center justify-center"
//                     onClick={handleCart}
//                   >
//                     <IoMdCart />
//                     <span className="ms-4 block lg:hidden">Add to cart</span>
//                   </button>
//                 </div>
//               )}
//               {isLoggedIn && role === "admin" && (
//                 <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
//                   <Link
//                     to={`/updateBook/${id}`}
//                     className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 flex items-center justify-center"
//                   >
//                     <FaEdit />
//                     <span className="ms-4 block lg:hidden">Edit</span>
//                   </Link>
//                   <button
//                     className="text-red-500 rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3 lg:mt-8 bg-white flex items-center justify-center"
//                     onClick={deleteBook}
//                   >
//                     <MdDeleteOutline />
//                     <span className="ms-4 block lg:hidden">Delete Book</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="p-4 w-full lg:w-3/6">
//             <h1 className="text-4xl text-zinc-300 font-semibold">{data.title}</h1>
//             <p className="text-zinc-400 mt-1">{data.author}</p>
//             <p className="text-zinc-500 mt-4 text-xl">{data.desc}</p>
//             <p className="flex mt-4 items-center justify-start text-zinc-400">
//               <GrLanguage className="me-3" />
//               {data.language}
//             </p>
//             <p className="mt-4 text-zinc-100 text-3xl font-semibold">
//               Price : &#8377; {data.price}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <p className="text-white text-center mt-12">Book details not available.</p>
//       )}
//     </>
//   );
// };

// export default ViewBookDetails;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { GrLanguage } from "react-icons/gr";
// import { FaHeart, FaEdit } from "react-icons/fa";
// import { IoMdCart } from "react-icons/io";
// import { MdDeleteOutline } from "react-icons/md";
// import { useSelector } from "react-redux";
// import Loader from "../Loader/Loader";

// const ViewBookDetails = () => {
//   const { id } = useParams(); // Get book ID from URL parameters
//   const navigate = useNavigate();
//   const [data, setData] = useState(null); // Holds book data
//   const [loading, setLoading] = useState(true); // Loading state
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get login status
//   const role = useSelector((state) => state.auth.role); // Get user role

//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       setLoading(true); // Ensure loading state is true during fetch
//       try {
//         const response = await axios.get(
//           `http://localhost:1000/books/get-book-by-id/${id}`
//         );
//         setData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching book details:", error);
//         alert("Failed to load book details.");
//       } finally {
//         setLoading(false); // Loading is complete
//       }
//     };

//     fetchBookDetails();
//   }, [id]); // Dependency array ensures fetch happens on ID change

//   const headers = {
//     authorization: `Bearer ${localStorage.getItem("token")}`,
//   };

//   const handleFavourite = async () => {
//     try {
//       const response = await axios.put(
//         "http://localhost:1000/favourites/add-favourite",
//         { bookId: id },
//         { headers }
//       );
//       if (response.data.success) {
//         alert("Book added to favourites successfully!");
//       } else {
//         alert(response.data.message || "Failed to add book to favourites.");
//       }
//     } catch (error) {
//       console.error("Error adding to favourites:", error);
//       alert(
//         error.response?.data?.message ||
//           "An error occurred while adding the book to favourites."
//       );
//     }
//   };

//   const handleCart = async () => {
//     try {
//       const response = await axios.put(
//         "http://localhost:1000/carts/add-to-cart",
//         { bookId: id },
//         {
//           headers: {
//             authorization: `Bearer ${localStorage.getItem("token")}`,
//             bookid: id, // Book ID in the header
//             id: localStorage.getItem("id"), // User ID in the header
//           },
//         }
//       );
//       if (response.data.status === "Success") {
//         alert("Book added to cart successfully!");
//       } else {
//         alert(response.data.message || "Failed to add book to cart.");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       alert(error.response?.data?.message || "An error occurred while adding the book to the cart.");
//     }
//   };

//   const deleteBook = async () => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:1000/books/delete-book/${id}`,
//         { headers }
//       );
//       alert(response.data.message || "Book deleted successfully.");
//       navigate("/all-books"); // Redirect after deletion
//     } catch (error) {
//       console.error("Error deleting book:", error);
//       alert(error.response?.data?.message || "Failed to delete book.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen bg-zinc-900 flex items-center justify-center">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <>
//       {data ? (
//         <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8">
//           {/* Left Section */}
//           <div className="w-full lg:w-3/6">
//             <div className="flex lg:flex-row flex-col justify-around bg-zinc-800 p-12 rounded">
//               <img
//                 src={data.url}
//                 alt={data.title}
//                 className="h-[50vh] md:h-[60vh] lg:h-[70vh] rounded"
//               />
//               {isLoggedIn && role === "user" && (
//                 <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
//                   <button
//                     className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 hover:text-red-500 flex items-center justify-center"
//                     onClick={handleFavourite}
//                   >
//                     <FaHeart />
//                     <span className="ms-4 block lg:hidden">Favourites</span>
//                   </button>
//                   <button
//                     className="hover:text-white rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3 lg:mt-8 bg-blue-500 flex items-center justify-center"
//                     onClick={handleCart}
//                   >
//                     <IoMdCart />
//                     <span className="ms-4 block lg:hidden">Add to cart</span>
//                   </button>
//                 </div>
//               )}
//               {isLoggedIn && role === "admin" && (
//                 <div className="flex flex-col md:flex-row lg:flex-col items-center justify-between lg:justify-start mt-4 lg:mt-0">
//                   <Link
//                     to={`/updateBook/${id}`}
//                     className="bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 flex items-center justify-center"
//                   >
//                     <FaEdit />
//                     <span className="ms-4 block lg:hidden">Edit</span>
//                   </Link>
//                   <button
//                     className="text-red-500 rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3 lg:mt-8 bg-white flex items-center justify-center"
//                     onClick={deleteBook}
//                   >
//                     <MdDeleteOutline />
//                     <span className="ms-4 block lg:hidden">Delete Book</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="p-4 w-full lg:w-3/6">
//             <h1 className="text-3xl text-white font-bold mb-4">{data.title}</h1>
//             <p className="text-white">{data.description}</p>
//           </div>
//         </div>
//       ) : (
//         <p className="text-white">No book found.</p>
        
//       )}
//     </>
//   );
// };

// export default ViewBookDetails;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaEdit } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:1000/books/get-book-by-id/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        alert("Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleFavourite = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/favourites/add-favourite",
        { bookid: id },
        { headers }
      );
      alert(response.data.message || "Added to favourites successfully!");
    } catch (error) {
      console.error("Error adding to favourites:", error);
      alert(error.response?.data?.message || "Failed to add to favourites.");
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/carts/add-to-cart",
        { bookid: id },
        { headers }
      );
      alert(response.data.message || "Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  const deleteBook = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:1000/books/delete-book/${id}`,
        { headers }
      );
      alert(response.data.message || "Book deleted successfully.");
      navigate("/all-books");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(error.response?.data?.message || "Failed to delete book.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8">
      {data ? (
        <>
          {/* Left Section */}
          <div className="w-full lg:w-3/6">
            <div className="flex lg:flex-row flex-col justify-around bg-zinc-800 p-12 rounded">
              <img
                src={data.url}
                alt={data.title}
                className="h-[50vh] md:h-[60vh] lg:h-[70vh] rounded"
              />
              {isLoggedIn && role === "user" && (
                <div className="flex flex-col items-center">
                  <button
                    className="bg-white text-4xl p-3 rounded hover:text-red-500"
                    onClick={handleFavourite}
                  >
                    <FaHeart />
                  </button>
                  <button
                    className="bg-blue-500 text-4xl p-3 rounded hover:text-white mt-4"
                    onClick={handleCart}
                  >
                    <IoMdCart />
                  </button>
                </div>
              )}
              {isLoggedIn && role === "admin" && (
                <div className="flex flex-col items-center">
                  <Link
                    to={`/updateBook/${id}`}
                    className="bg-white text-4xl p-3 rounded"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    className="bg-white text-4xl p-3 rounded text-red-500 mt-4"
                    onClick={deleteBook}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-3/6 p-4">
            <h1 className="text-3xl text-white font-bold mb-4">{data.title}</h1>
            <p className="text-xl text-white">{data.author}</p>
            <p className="text-white mt-4">{data.desc}</p>
            <p className="flex items-center text-zinc-400 mt-4">
              <GrLanguage className="mr-2" />
              {data.language}
            </p>
            <p className="text-3xl text-white mt-4 font-semibold">
              &#8377; {data.price}
            </p>
          </div>
        </>
      ) : (
        <p className="text-white">No book found.</p>
      )}
    </div>
  );
};

export default ViewBookDetails;
