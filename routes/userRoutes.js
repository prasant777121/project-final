const express=require('express');
const route=express();

const bcrypt = require('bcrypt');

const User=require('../models/userModel')

const session=require('express-session');
route.use(session({secret:"ok"}))
const auth=require('../middleware/auth')

route.use(express.static('public'))

const body_parser=require('body-parser')
route.use(body_parser.json());
route.use(body_parser.urlencoded({extended:true}))
const path=require('path');
const img_path=path.join(__dirname,'../public/userImg')


const hbs=require("hbs")

const multer=require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,img_path)
    },
    filename:function(req,file,cb){
        const name=Date.now()+file.originalname;
        cb(null,name);

    }
})

const upload =multer({storage:storage});




const userController=require('../controllers/userController')
route.set('view engine','hbs');
route.set('views','./views/users')

const partials_path=path.join(__dirname,'../views/layouts')
hbs.registerPartials(partials_path)

route.get('/register',auth.islogout,userController.loadregister);
route.post('/register',upload.single('image'),userController.insertuser);

route.get('/verify',userController.verifyMail);
route.get('/',userController.firstpage);
route.get('/login',auth.islogout,userController.login);
route.get('/home',auth.islogin,userController.home);


route.post("/login",async(req,res)=>{
    try{
       const email=req.body.email; 
       const password=req.body.password; 
       console.log(`${email} and password is ${password}`)
       const userData = await User.findOne({ email: email })

       if (userData) {
           const passwordMatch = await bcrypt.compare(password, userData.password)
           if (passwordMatch) {
               if (userData.is_verified === 0) {
                   res.render('login', { message: "please verify your mail" })
                   console.log('please verify your mail')

               } else {
                req.session.user_id=userData._id;
                   res.redirect('/home')

               }

           } else {
               res.render('login', { message: "password not match" })
               console.log('password not match')
           }

       } else {
           res.render('login', { message: "no email found" })
           console.log('no email')
       }


   } catch (e) {
       console.log(e);
   }


})
route.get('/logout',auth.islogin,userController.userlogout);
route.get('/forget',auth.islogout,userController.forgetLoad);
route.post('/forget',userController.forgetVerify);
route.get('/forget-password',auth.islogout,userController.forgetPasswordLoad);
route.post('/forget-password',userController.resetPassword);
route.get('/verification',userController.getverification);
route.post('/verification',userController.verification);
route.get('/edit',auth.islogin,userController.editLoad);
route.post('/edit',upload.single('image'),auth.islogin,userController.updateProfile)
route.get('/candidatelist',userController.getcandidate);
route.get('/voted',userController.voted);





module.exports={route};