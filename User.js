const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://sumanpandey2910:K6L9Joav97MsGLgQ@cluster0.kj8xpc0.mongodb.net/");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:"admin"
       
    },
    isVoted: {
        type:Boolean,
        default:false,
    }


})
module.exports=mongoose.model("User",userSchema);