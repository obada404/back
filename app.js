const express =require('express');
const session =require('express-session');
const res = require('express/lib/response');
var mongoose = require('mongoose');
const bodyParser=require('body-parser');
const app=express();
const cors = require("cors");
//app.use(express.bodyParser({ keepExtensions: true, uploadDir: "uploads" }));                     
app.engine('jade', require('jade').__express);     
app.use(cors());
app.use(session({
  secret:'secretadamobada',
  resave: false,
  saveUninitialized: false,
  
}))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Content-Type", 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
const userRoute=require('./route/user');
const bookRoute=require('./route/book');

app.use('/users',userRoute)
app.use('/books',bookRoute)


mongoose.connect('mongodb+srv://Adamsiksik:ebaa2009@cluster0.an1q8.mongodb.net/Project0?retryWrites=true&w=majority',()=>
  console.log("connected")
  );

  // obada 
app.listen(3000);
