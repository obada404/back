const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

// // /admin/add-product => GET

 router.post('/signup', userController.postAddUser);
 router.post('/login', userController.postlogin);
 router.post('/like', userController.postlike);
 router.get('/allusers', userController.allusers);
 router.post('/later', userController.postlater);
 router.post('/signup2', userController.postsignup2);
 router.post('/reset', userController.postreset1);
 router.get('/resetkey', userController.getresetkey);
 router.get('/resetpass', userController.getresetpass);
 router.get('/profile', userController.getuser);
 router.post('/update', userController.updateData);
 router.get('/ispress', userController.ispress);
 router.post('/editoneuser', userController.editoneuser);
 router.post('/deleteone', userController.editoneuser);
 router.post('/history', userController.posthistory);
 router.post('/likedbook', userController.increaslike);

 module.exports=router;