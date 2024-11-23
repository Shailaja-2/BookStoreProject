const router=require("express").Router();
const User=require('../models/UserModels')
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')
const {authenticateToken}=require('./AuthRoute')
// Sign Up
router.post("/sign-up",async(req,res)=>{
    try{
        const {username,email,password,adress}=req.body;
        if(username.length<4){
            return res.status(400).json({message:"username should be greater than 3"});
        }
        // check username already exist
        const existingUsername=await User.findOne({username:username});
        if(existingUsername){
            return res.status(400).json({message:"Username already exists!"});

        }
        const existingEmail=await User.findOne({email:email});
        if(existingEmail){
            return res.status(400).json({message:"Email already exists!"});
            
        }
        // check password length
        if(password.length<5){
            return res.status(400).json({message:"password should be greater than 5"});

        }
        const salt = await bcrypt.genSalt(10)
        const hashPass=await bcrypt.hash(password,salt);
        const newuser=new User({
            username:username,
            email:email,
            password:hashPass,
            adress:adress,

        });
        await newuser.save();
        return res.status(200).json({message:"SignUp Successfully done"});

            
        }
    
    catch(error){
        return res.status(500).json({message:"Internal Server Error"});
    }
});
router.post("/sign-in",async(req,res)=>{
    try{
        const{username,password}=req.body;
        const existingUser=await User.findOne({username});
        if(!existingUser){
            return res.status(400).json({message:"Invalid Credientials"});
        }
        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authClaims=[
                   { name:existingUser.username},{
                    role:existingUser.role
                   },
                ];
                const token=jwt.sign({authClaims},"bookStore123",{expiresIn:"30d",})
                res.status(200).json({id:existingUser._id,role:existingUser.role,token:token});

            }
            else{
                res.status(400).json({message:"Invalid Credientials"});
            }
        });
       
        }
        catch(error){
            return res.status(500).json({message:"Internal Server Error"});
            

        }
       
        });
        //get user information
        router.get("/information",authenticateToken,async(req,res)=>{
            try{
                const {id}=req.headers;
                    const data=await User.findById(id).select('-password');
                    return res.status(200).json(data);
                

            }
            catch(error){
                return res.status(500).json({message:"Internal Server Error"});

            }
        });
        router.put("/update-adress",authenticateToken,async(req,res)=>{
            try{
                const {id}=req.headers;
                const{adress}=req.body;
                await User.findByIdAndUpdate(id,{adress:adress});
                return res.status(200).json({message:"Adtress updated successfully"});

            }
            catch(error){
                return res.status(500).json({message:"Internal Server Error"});

            }

        });
module.exports=router;