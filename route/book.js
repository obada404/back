const path = require('path');

const express = require('express');

const bookController = require('../controllers/book');

const router = express.Router();

// // /admin/add-product => GET

 router.get('/all', bookController.getAll);
 router.get('/book', bookController.getOne);
 router.get('/later', bookController.getlater);
 router.get('/history', bookController.gethistory);
 router.get('/liked', bookController.getliked);
 router.get('/icon', bookController.geticon);

 router.get('/rec', bookController.getrec);
 router.get('/loadBook', bookController.getloadBook )
 router.get('/someroute', bookController.sendpdf )
 router.get('/search', bookController.ser )
 router.get('/searchh', bookController.searchh )
 router.get('/loadAudio', bookController.sendaudio )
 router.get('/gene', bookController.getgene )
 router.get('/same', bookController.getsame )
 router.get('/recom', bookController.recommend )
 router.post('/Addbook', bookController.postAddbook )
 router.post('/deleteone', bookController.deleteone )
 router.post('/icon', bookController.geticon )

 router.post('/editbook', bookController.saveoneofbook )

 module.exports=router;