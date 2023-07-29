const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        // required:true
    }
})

// Creating a collection

const Register=new mongoose.model("Register",userSchema);
module.exports=Register;