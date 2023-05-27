const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },  
    email:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    is_admin:{
        type:Number,
        required:true
    }, is_verified:{
        type:Number,
       default:0
    },
    is_voted:{
        type:Number,
       default:0
    },
    total_votes:{
        type:Number,
       default:0
    },
    token:{
        type:String,
        default:''
    }
})
const user=new mongoose.model("user",userSchema)
module.exports=user;