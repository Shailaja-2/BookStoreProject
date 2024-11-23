const router = require("express").Router();
const User = require("../models/UserModels");
const { authenticateToken } = require("./AuthRoute");

// Add book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);

    // Check if the book is already in the cart
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({ status: "Success", message: "Book is already in Cart" });
    }

    // Add the book to the cart
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.json({ status: "Success", message: "Book added to cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Remove book from cart
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    // Remove the book from the cart
    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.json({ status: "Success", message: "Book removed from cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Get user's cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse(); // Optional: reverse the cart
    return res.json({ status: "Success", data: cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
