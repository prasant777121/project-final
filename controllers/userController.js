const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const user = require('../models/userModel');

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash;

    } catch (err) {
        console.log(err.message);
    }
}

// for send mail
const sendverifyEmail = async (name, email, user_id) => {
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
            subject: "for reset password",
            html: '<p>Hii ' + name + ',click here to <a href="http://localhost:3000/verify?id=' + user_id + '">verify</a>your mail.</p>'

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


//for reset password send mail

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


//load first page of the website
const firstpage = async (req, res) => {
    try {
        res.render('firstpage');

    } catch (err) {
        res.send(err);
    }
}

//load register page
const loadregister = async (req, res) => {
    try {
        res.render('register');

    } catch (err) {
        res.send(err);
    }
}

//post in register page 
const insertuser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: req.file.filename,
            password: spassword,
            is_admin: 0

        });
        const userdata = await user.save();
        if (userdata) {
            sendverifyEmail(req.body.name, req.body.email, userdata._id);
            res.render('register', { message: "registration successful,Please verify your email" })
        } else {
            res.render('register', { message: "registration failed" })

        }

    } catch (err) {
        console.log(err);
    }
}



const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id }, {
            $set: { is_verified: 1 }

        });
        console.log(updateInfo);
        res.render('email_verified')

    } catch (err) {
        console.log(err.message)

    }
}





const login = async (req, res) => {
    try {
        res.render('login')

    } catch (err) {
        console.log(err.message)

    }
}


const home = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { user: userData })

    } catch (err) {
        console.log(err.message)

    }
}


const userlogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');

    } catch (err) {
        console.log(err.message)

    }
}

const forgetLoad = async (req, res) => {
    try {
        res.render('forget')

    } catch (err) {
        console.log(err.message)

    }
}



const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email })
        if (userData) {

            if (userData.is_verified === 0) {
                res.send('forget', { message: "verify your mail first" })
            } else {
                const randomString = randomstring.generate();

                const updatedData = await User.updateOne({ email: email }, { $set: { token: randomString } })
                sendResetPassword(userData.name, userData.email, randomString);
                res.render('forget', { message: "check your mail to reset password" })
            }

        } else {
            res.render('forget', { message: "email is incorrect" })
        }

    } catch (err) {
        console.log(err.message)

    }
}





const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token })
        if (tokenData) {
            res.render('forget-password', { user_id: tokenData._id });

        } else {
            res.render('404', { message: "token is invalid" })
        }

    } catch (err) {
        console.log(err.message)

    }
}



const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id

        const secure_password = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({
            _id: user_id
        }, { $set: { password: secure_password, token: '' } });
        res.redirect('/');



    } catch (err) {
        console.log(err.message)

    }
}


const getverification = async (req, res) => {
    try {
        res.render('verification')

    } catch (err) {
        console.log(err);
    }
}


const verification = async (req, res) => {
    try {
        const email = req.body.email;
        const userdata = await User.findOne({ email: email })

        if (userdata) {
            sendverifyEmail(userdata.name, userdata.email, userdata._id);
            res.render('login', { message: "Please verify your email" })
        } else {
            res.render('verification', { message: " registration failed  \n insert correct mail" })

        }

    } catch (err) {
        console.log(err);
    }
}

//user can edit profile

// const editLoad = async (req, res) => {
//     try {
//         const id = req.query.id;
//         const userData = await User.findById({ _id: id });
//         if (userData) {
//             res.render('edit', { usuer: userData });

//         } else {
//             res.redirect('/home')
//         }

//     } catch (err) {
//         console.log(err.message)
//     }
// }

const editLoad=async(req,res)=>{
    try{
        const id=req.query.id;
        const userData=await User.findById({_id:id});
        if(userData){
            res.render('edit',{user:userData})
        }else{
            res.redirect('/home');
        }

    }
    catch(err){
        console.log(err.message);


    }
}



//uodate profile


const updateProfile = async (req, res) => {
    try {
      if(req.file){
        const update=await User.findByIdAndUpdate({_id:req.body.user_id},{
            $set:{
                name:req.body.name,
                image:req.file.filename
            }
        })

      }else{
        const update=await User.findByIdAndUpdate({_id:req.body.user_id},{
            $set:{
                name:req.body.name,
               
            }
        })

      }
      res.redirect("/home");

    } catch (err) {
        console.log(err.message)
    }
}




const getcandidate=async(req,res)=>{
    try{
       const usersData=await User.find({is_admin:0})
     
    
        res.render('candidatelist',{users:usersData});
    }
    catch(err){
        console.log(err.message)
    }
}


const voted = async (req, res) => {
    try {
    //     const id=req.query.id;
    //     const UserData=await User.findById({_id:id});
    //   if (!UserData) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
  
    //   // Increment the user's total_votes
    //   UserData.total_votes += 1;
    //   await UserData.save();

      res.render('voted')
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };













        module.exports = {
            loadregister, insertuser, verifyMail, login, home, userlogout, forgetLoad,
            forgetVerify, forgetPasswordLoad, resetPassword, verification, getverification,
            editLoad, updateProfile,firstpage,getcandidate,voted
        }