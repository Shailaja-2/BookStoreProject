// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import BookCard from "../BookCard/BookCard";

// const Favourites = () => {
//   const [FavouriteBooks, setFavouriteBooks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Get user credentials from localStorage
//   const userId = localStorage.getItem("id");
//   const token = localStorage.getItem("token");

//   // Check if the user is authenticated
//   if (!userId || !token) {
//     alert("User not authenticated. Please log in.");
//     return null; // Return null if not authenticated
//   }

//   const headers = {
//     id: userId,
//     authorization: `Bearer ${token}`,
//   };

//   useEffect(() => {
//     const fetchFavourites = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:1000/favourites/get-favourite", // Fixed to HTTP for local dev
//           { headers }
//         );
//         setFavouriteBooks(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching favourite books:", error);
//         alert(error.response?.data?.message || "Error fetching favourites.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFavourites();
//   }, []); // Empty dependency array ensures the effect runs only once

//   const handleAddToFavourites = async (bookId) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:1000/favourites/add-favourite", // Adjust your backend endpoint if needed
//         { bookId, userId },
//         { headers }
//       );

//       if (response.data.success) {
//         // Add the new book to the state or re-fetch the favourites
//         setFavouriteBooks((prevBooks) => [...prevBooks, response.data.newFavouriteBook]);
//         alert("Book added to favourites!");
//       } else {
//         alert("Failed to add book to favourites.");
//       }
//     } catch (error) {
//       console.error("Error adding to favourites:", error);
//       alert(error.response?.data?.message || "Error adding book to favourites.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full h-[100%] flex items-center justify-center">
//         <p className="text-2xl text-zinc-500">Loading...</p>
//       </div>
//     );
//   }

//   if (FavouriteBooks.length === 0) {
//     return (
//       <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center flex-col w-full">
//         No Favourite Books
//         <img src="./star.png" alt="star" className="h-[20vh] my-8" />
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {FavouriteBooks.map((item) => (
//         <div key={item.id}>
//           <BookCard data={item} favourite={true} />
//           <button
//             onClick={() => handleAddToFavourites(item.id)}
//             className="mt-2 text-blue-500 hover:text-blue-700"
//           >
//             Add to Favourites
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Favourites;
import axios from "axios";
import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard"; // Assuming BookCard is correctly set up

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user credentials from localStorage
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Check if the user is authenticated
  if (!userId || !token) {
    alert("User not authenticated. Please log in.");
    return null; // Return null if not authenticated
  }

  const headers = {
    authorization: `Bearer ${token}`,
  };

  // Fetch favourites on component mount
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/favourites/get-favourite", // Adjust endpoint for local development
          { headers }
        );
        setFavouriteBooks(response.data.data || []);
      } catch (error) {
        console.error("Error fetching favourite books:", error);
        alert(error.response?.data?.message || "Error fetching favourites.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavourites();
  }, [token]); // Re-fetch if token changes

  // Function to toggle book in favourites (add/remove)
  const handleToggleFavourite = async (bookId) => {
    try {
      const response = await axios.put(
        "http://localhost:1000/favourites/toggle-favourite", // This is the backend endpoint to toggle the favourite
        { bookid: bookId }, // Send the bookId to the backend
        { headers }
      );

      if (response.data.message.includes("added")) {
        setFavouriteBooks((prevBooks) => [...prevBooks, { id: bookId }]);
        alert("Book added to favourites!");
      } else if (response.data.message.includes("removed")) {
        setFavouriteBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        alert("Book removed from favourites!");
      }
    } catch (error) {
      console.error("Error adding/removing from favourites:", error);
      alert(error.response?.data?.message || "Error toggling favourite.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[100%] flex items-center justify-center">
        <p className="text-2xl text-zinc-500">Loading...</p>
      </div>
    );
  }

  // No favourites state
  if (FavouriteBooks.length === 0) {
    return (
      <div className="text-5xl font-semibold h-[100%] text-zinc-500 flex items-center justify-center flex-col w-full">
        No Favourite Books
        <img src="./star.png" alt="star" className="h-[20vh] my-8" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {FavouriteBooks.map((item) => (
        <div key={item.id}>
          <BookCard data={item} favourite={true} />
          <button
            onClick={() => handleToggleFavourite(item.id)}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            {FavouriteBooks.some((book) => book.id === item.id)
              ? "Remove from Favourites"
              : "Add to Favourites"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favourites;
