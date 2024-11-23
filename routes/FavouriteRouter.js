const router = require("express").Router();
const User = require("../models/UserModels");
const { authenticateToken } = require("./AuthRoute");

// Add book to favourites
router.put("/add-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.body;
    const { id } = req.headers; // User ID from headers
    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already in favourites!" });
    }

    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book added to favourites!" });
  } catch (error) {
    console.error("Error in add-favourite:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Remove book from favourites
router.put("/remove-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.body;
    const { id } = req.headers; // User ID from headers
    const userData = await User.findById(id);

    if (!userData) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isBookFavourite = userData.favourites.includes(bookid);
    if (!isBookFavourite) {
      return res.status(404).json({ message: "Book is not in favourites!" });
    }

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
    return res.status(200).json({ message: "Book removed from favourites!" });
  } catch (error) {
    console.error("Error in remove-favourite:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/get-favourite", authenticateToken, async (req, res) => {
    const { id } = req.headers;
    console.log("Received user ID:", id); // Check if ID is received
    
    try {
        const userData = await User.findById(id).populate("favourites");
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        const favouriteBooks = userData.favourites;
        return res.json({ status: "Success", data: favouriteBooks });
    } catch (error) {
        console.error("Error fetching favourites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
