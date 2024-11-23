const mongoose=require('mongoose')
mongoose.connect("mongodb+srv://devasothnikitha06:1234567890@in-aws.pnn6k.mongodb.net/?retryWrites=true&w=majority&appName=In-AWS ")
const connection=mongoose.connection;
connection.on('connected',()=>(console.log("DB Connected")))
connection.on('error',(error)=>(console.log("DB error"+error)))
module.exports=mongoose