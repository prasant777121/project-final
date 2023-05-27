const express=require('express');

const route=express();
const session =require('express-session');
route.use(session({secret:"ok"}))

const bodyParser=require('body-parser');

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({extended:true}))

const adminController=require('../controllers/adminController')
const adminauth = require('../middleware/adminauth');

route.set('view engine','hbs');
route.set('views','./views/admin')

route.get('/', adminController.loadLogin);


route.post('/',adminController.verifyLogin);
route.get('/home',adminController.loadDashboard);
route.get('/logout',adminController.logout);
route.get('/forget',adminController.forget_password);
route.post('/forget',adminController.forgetVerify);
route.get('/dashboard',adminController.Dashboard);



route.get('*',(req,res)=>{
    res.redirect('/admin');

});

module.exports={
    route
}