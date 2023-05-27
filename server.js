const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.b54nrw5.mongodb.net/MVC?retryWrites=true&w=majority")

const express=require('express');
const app=express();


//for admin
const adminRoute=require('./routes/adminRoutes.js')
app.use('/admin',adminRoute.route);  

//for user
const userRoute=require('./routes/userRoutes')
app.use('/',userRoute.route);       

app.listen(3000,()=>{
    console.log("running in 3000")
})