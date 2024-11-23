// const router=require("express").Router();
// const {authenticateToken}=require('./AuthRoute');
// const Book=require('../models/BooksModel');
// const Order=require('../models/OrdersModel');
// const User=require('../models/UserModels')
// router.post('/place-order',authenticateToken,async(req,res)=>{
//     try{
//         const{id}=req.header;
//         const{order}=req.body;
//         for(const orderData of order){
//             const newOrder=new Order({user:id,book:orderData._id});
//                 const orderDataFromDb=await newOrder.save();
//               //saving order in user model  
//             await User.findByIdAndUpdate(id,{
//                 $push:{orders:orderDataFromDb._id},
//             });
//             //clear cart
//                 await User.findByIdAndUpdate(id,{
//                     $pull:{cart:orderData._id},
//             });
//         }
//         return res.json({
//             status:"Success",message:"Order Placed Successfully",
//         });

//     }
//     catch(error){
//         return res.status(500).json({message:"An error occured"})
//     }
// });
// router.get('/order-history',authenticateToken,async(req,res)=>{
//     try{
//         const{id}=req.headers;
//         const userData=await User.findById(id).populate({
//             path:"orders",
//             populate:{path:"book"},
//         });
//         const ordersData=userData.orders.reverse();
//         return res.json({
//             status:"Success",
//             data:ordersData,
//         });

//     }
//     catch(error){
//         return res.status(500).json({message:"An error occured"})
//     }
// });
// //get all orders--admin
// router.get('/all-orders',authenticateToken,async(req,res)=>{
//     try{
//         const userData=await Order.findOne().populate({
//             path:"book",

//         })
//         .populate({
//             path:"user",
//         })
//       .sort({createdAt:-1});
//       return res.json({
//         status:"Success",
//         data:userData,
//       });

//     }
//     catch(error){
//         return res.status(500).json({message:"An error occured"})
//     }
// });
// router.put('/update-status/:id',authenticateToken,async(req,res)=>{
//     try{
//         const{id}=req.params;
//         await Order.findByIdAndUpdate(id,{status:req.body.status});
//         return res.json({status:"Success",message:"Status Updated Successfully",});
//     }
//     catch(error){
//         return res.status(500).json({message:"An error occured"})
//     }
// });
// module.exports=router;
const router = require("express").Router();
const { authenticateToken } = require("./AuthRoute");
const Book = require("../models/BooksModel");
const Order = require("../models/OrdersModel");
const User = require("../models/UserModels");

// Place an order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Get `id` from headers
    const { order } = req.body;

    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: "Invalid order data provided." });
    }

    for (const orderData of order) {
      // Check if book exists
      const bookExists = await Book.findById(orderData._id);
      if (!bookExists) {
        return res.status(404).json({ message: `Book with ID ${orderData._id} not found.` });
      }

      // Create new order
      const newOrder = new Order({
        user: id,
        book: orderData._id,
      });
      const orderDataFromDb = await newOrder.save();

      // Update user's orders and cart
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
        $pull: { cart: orderData._id },
      });
    }

    return res.json({
      status: "Success",
      message: "Order placed successfully.",
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "An error occurred while placing the order." });
  }
});

// Get order history for a user
router.get("/order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    if (!userData || !userData.orders) {
      return res.status(404).json({ message: "No order history found for this user." });
    }

    const ordersData = userData.orders.reverse();

    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({ message: "An error occurred while fetching the order history." });
  }
});

// Get all orders (Admin) with pagination
router.get("/all-orders", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const orders = await Order.find()
      .populate("book", "title price")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const totalOrders = await Order.countDocuments();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    return res.json({
      status: "Success",
      data: orders,
      meta: {
        total: totalOrders,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalOrders / limitNumber),
      },
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ message: "An error occurred while fetching orders." });
  }
});

// Update order status
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required to update the order." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json({
      status: "Success",
      message: "Status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "An error occurred while updating the status." });
  }
});

module.exports = router;
