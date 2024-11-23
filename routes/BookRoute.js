const router=require("express").Router();
const User=require('../models/UserModels')
const jwt=require('jsonwebtoken')
const Book=require('../models/BooksModel')
const {authenticateToken}=require('./AuthRoute')
// add book--admin
router.post("/addbook",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const user=await User.findById(id);
        if(user.role!=="admin"){
            return res.status(400).json({message:"Your not having access to perform admin work"});
        }
        const book=new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        });
        await book.save();
        return res.status(200).json({message:"Book added successfully"})

    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }
});
router.put("/update-book",authenticateToken,async(req,res)=>{
    try{
        const{bookid}=req.headers;
        await Book.findByIdAndUpdate(bookid,{
           
                url:req.body.url,
                title:req.body.title,
                author:req.body.author,
                price:req.body.price,
                desc:req.body.desc,
                language:req.body.language,
            });
            return res.status(200).json({message:"Book Updated Successfully!"});
        }catch(error){
            console.log(error);
            return res.status(500).json({message:"An error Occurred"})

    }
});
router.delete("/delete-book/:id", authenticateToken, async (req, res) => {
    try {
      const bookId = req.params.id;
      // Logic to delete the book from the database
      await Book.findByIdAndDelete(bookId);
      return res.json({ status: "Success", message: "Book deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });
  
router.get("/get-all-books",async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1});
        return res.json({status:"Success",data:books,});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"})
    }
    
});
router.get("/get-recent-books",async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1}).limit(4);
        return res.json({status:"Success",data:books,});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"})
    }
    
});
router.get("/get-book-by-id/:id",async(req,res)=>{
    try{ const{id}=req.params;
        const book=await Book.findById(id);
        return res.json({status:"Success",data:book,});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occurred"})
    }
    
});
module.exports=router