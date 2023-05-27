const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const user = require('../models/userModel');



const sendResetPassword = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "maharjanprasant59@gmail.com",
                pass: "cnkuvyfmmqpezyhy"  // App password not gmail password
            }
        });
        const mailObject = {
            from: "maharjanprasant59@gmail.com",
            to: email,
            subject: "for verification email",
            html: '<p>Hii ' + name + ',click here to <a href="http://localhost:3000/forget-password?token=' + token + '">Reset</a> your password.</p>'


        };
        transporter.sendMail(mailObject, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("email has been send", info.response)
            }
        })


    } catch (err) {
        console.log(err);
    }
}


const loadLogin=async(req,res)=>{
    try{
        res.render('login')

    }catch(err){
        console.log(err.message)

    }

}


const verifyLogin=async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

       const userData=await User.findOne({email:email})
       const passwordMatch = await bcrypt.compare(password, userData.password)
       if(userData){
        if(passwordMatch){
            if(userData.is_admin===0){
                res.render('login'),{message:"please verify the admin"}

            }else{
                req.session.user_id=userData._id;
                res.redirect("/admin/home");
            }

        }else{
            res.render('login'),{message:"password not match"}
        }



       }else{
        res.render('login'),{message:"email not found"}
       }

    }catch(err){
        console.log(err.message)

    }

}

const loadDashboard=async(req,res)=>{
    try{
       
        const userData=await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData});
    }
    catch(err){
        console.log(err.message)
    }
}

const logout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin')
    }
    catch(err){
        console.log(err.message)
    }
}

const forget_password=async(req,res)=>{
    try{
        res.render('forget');
    }
    catch(err){
        console.log(err.message)
    }
}


//send verificaion by clicking forget password


const forgetVerify=async(req,res)=>{
    try{
        const email=req.body.email;
     
        const userData=await User.findOne({email:email});
        
        if(userData){
            if(userData.is_admin===1){
                const name=userData.name;
                const randomString=randomstring.generate();
                const updatedData = await User.updateOne({ email: email }, { $set: { token: randomString } })
                sendResetPassword(name,email,randomString);
                res.render('forget',{message:"check your mail"});
            }else{
                res.render('forget',{message:"email not verified found"});
            }

        }else{
            res.render('forget',{message:"email not found"});

        }
        


    }
    catch(err){
        console.log(err.message)
    }
}


const Dashboard=async(req,res)=>{
    try{
    //    const usersData=await User.find({is_admin:0})
       const usersData=await User.find()
    
        res.render('dashboard',{users:usersData});
    }
    catch(err){
        console.log(err.message)
    }
}

  








module.exports={
    loadLogin,verifyLogin,loadDashboard,logout,
    forget_password,forgetVerify,Dashboard
}