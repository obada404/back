const express = require('express');
const book = require('../models/Book');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const router = express.Router();
const bcrypt = require('bcrypt');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const doc = new PDFDocument;
const request = require('request');
var busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const multer = require('multer');

exports.geticon = async (req, res) => {
  try {
    let books;
    let b=false;

    const email = req.query.email;
    let user1;
    const book = req.query.name;

    console.log(book);
    user1 = await User.findOne({ Email: email })


    for (var i = 0; i < user1.liked.length; i++) {
      if(user1.liked[i]==book){
        b=true;
    }
  }
    res.json(b);
  } catch (err) {
    res.json({ message: err })
  }
}
exports.getAll = async (req, res) => {
  try {
    const books = await book.find().limit(40);
    res.json(books);
  } catch (err) {
    res.json({ message: err })
  }

}

exports.deleteone = async (req, res, next) => {
  const isbn = req.query.isbn;
  console.log(isbn);
  await book.findOneAndDelete({ ISBN:isbn  })
  res.json(" book deleted ")
}
exports.saveoneofbook = async (req, res) => {
  try {
    isbn =req.query.ISBN;
    something =req.query.something;
    value  =req.query.value;
    const books = await book.findOne({ISBN :isbn}) ;
    books[something] =value
    console.log(something +"vvvvv" + value  +" vvvvvvvv " + isbn)
    books.save();
    console.log(books)
    res.json(books);
  } catch (err) {
    res.json({ message: err })
  }

}

exports.getOne = async (req, res) => {
  try {
    console.log(req.query);
    isbnreq = req.query.isbn;

    const books = await book.findOne({ ISBN: isbnreq });
    console.log(books);
    res.json(books);
  } catch (err) {
    res.json({ message: err })
  }
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    console.log(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    console.log(err);
  });
  wr.on("close", function(ex) {
    console.log(ex);
  });
  rd.pipe(wr);


}


exports.postAddbook  = async (req, res) => {

  const books = new book({
    'ISBN': req.query.ISBN,
    'Book-Title': req.query.Book_Title,
    'Book-Author': req.query.Book_Author,
    'catogery': req.query.catogery,
    'Year-Of-Publication': req.query.YOP,
    'Publisher': req.query.Publisher,
    'Image-URL-S': req.query.Image,
    'Image-URL-M': req.query.Image,
    'Image-URL-L': req.query.Image,

  })
  try {

    await  copyFile(req.query.pdfurl,"C:/Users/ali_q/Documents/GitHub/books1/books"+req.query.ISBN+".pdf")

    console.log(books.ISBN)
    const savebook = await books.save();
    
   return res.json(savebook);
  

 

  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message })
  }
};

exports.sendtxt = (req, res) => {
  let s=req.query.isbn;

const pdfExtract = new PDFExtract();
const options = {}; /* see below */
console.log(s)
pdfExtract.extract("C:/Users/user/Downloads/audiual"+s+".pdf", options, (err, data) => {
  if (err) return console.log(err);
  res.json(data);
  console.log(data);
});
 
}
exports.sendpdf = (req, res) => {
  let s=req.query.isbn;
  res.sendFile("C:/Users/ali_q/Documents/GitHub/books1/books/"+s+".pdf");
}
exports.addbook = (req,res) => {
  console.log(req.file)
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
      console.log(file.name)
    }
  })
}
exports.addmp3 = (req, res1) => {
  let s=req.query.name;
  console.log(s)
  const requestq = request.get(
    'http://localhost:3000/books/loadAudio?isbn=0060801263',
    {},
  ).on('error', function(e) {
    console.log("Got error: " + e.message);
  }); 
  requestq.on('response', function (res) {
    res.pipe(fs.createWriteStream('./'+s+'.mp3'));
  });
  res1.json('File is created successfully.');
}
exports.sendaudio = (req, res) => {
  let s=req.query.isbn;
  res.sendFile("C:/Users/ali_q/Documents/GitHub/books1/books/"+s+".mp3");
}
exports.gethistory = async (req, res) => {
  try {
    let books;

    booksArray = [];

    const email = req.query.email;
    let user1;

    console.log(req.query.email);
    user1 = await User.findOne({ Email: email })
    console.log("hee");


    for (var i = 0; i < user1.history.length; i++) {
      books = await book.findOne({ "ISBN": user1.history[i] });
      booksArray.push(books);

    }
    console.log(booksArray);

    res.json(booksArray);
  } catch (err) {
    res.json({ message: err })
  }
}
exports.getliked = async (req, res) => {
  try {
    let books;

    booksArray = [];

    const email = req.query.email;
    let user1;

    console.log(req.query.email);
    user1 = await User.findOne({ Email: email })


    for (var i = 0; i < user1.liked.length; i++) {
      books = await book.findOne({ ISBN: user1.liked[i] });
      console.log(books);
      booksArray.push(books);
    }
    res.json(booksArray);
  } catch (err) {
    res.json({ message: err })
  }
}

exports.geticon = async (req, res) => {
  try {
    let books;
    let b=false;

    const email = req.query.email;
    let user1;
    const book = req.query.name;

    console.log(book);
    user1 = await User.findOne({ Email: email })


    for (var i = 0; i < user1.liked.length; i++) {
      if(user1.liked[i]==book){
        b=true;
    }
  }
    res.json(b);
  } catch (err) {
    res.json({ message: err })
  }
}

exports.getlater = async (req, res) => {
  try {
    let books;

    booksArray = [];

    const email = req.query.email;
    let user1;

    console.log(req.query.email);
    user1 = await User.findOne({ Email: email })

    console.log(user1);

    for (var i = 0; i < user1.later.length; i++) {
      books = await book.findOne({ "Book-Title": user1.later[i] });
      console.log(books);
      booksArray.push(books);
    }
    res.json(booksArray);
  } catch (err) {
    res.json({ message: err })
  }
}

exports.getrec = async (req, res) => {
  try {
    let books;
    booksArray = [];

    const email = req.query.email;
    let user1;

    console.log(req.query.email);
    user1 = await User.findOne({ Email: email })


    for (var i = 0; i < user1.genre.length; i++) {
      books = await book.find({ "catogery": user1.genre[i] });
      Array.prototype.push.apply(booksArray, books);
    }
    res.json(booksArray);
  } catch (err) {
    res.json({ message: err })
  }
}
exports.getloadBook = (req, res) => {

  var fs = require('fs');

  require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };

  var words = require("../../../books1/epubtxt/1st-chance.epub.txt");

  console.log(typeof words);

}
exports.getaudiobook = (req, res) => {

  let audio = document.querySelector('audio');
  audio.src = base64str;
  audio.play();

}

exports.searchh = async (req, res) => {
  try {
  booksArray = [];
console.log(req.query.genre);
  books = await book.find( { "Book-Title" : { $regex : new RegExp(req.query.Book_Title, "i") } ,"Book-Author" : { $regex : new RegExp(req.query.Book_Author, "i") }
  ,"Year-Of-Publication" :{ $regex : new RegExp(req.query.YOP, "i") },"catogery" :{ $regex : new RegExp(req.query.genre, "i") }
  ,"ISBN" : { $regex : new RegExp(req.query.ISBN, "i") } }
 );

  Array.prototype.push.apply(booksArray, books);
} catch (err) {
  res.json({ message: err })
}
res.json(booksArray);
}

exports.ser = async (req, res) => {
  try {
  booksArray = [];

  books = await book.find( { "Book-Title" : { $regex : new RegExp(req.query.Book_Title, "i") }  }
 );
  Array.prototype.push.apply(booksArray, books);
} catch (err) {
  res.json({ message: err })
}
res.json(booksArray);
}

exports.getgene = async (req, res) => {

  try {
  let books;
console.log(req.query.name);
books = await book.find({ "catogery": req.query.name});
res.json(books);

} catch (err) {
  res.json({ message: err })
}


}


exports.getsame = async (req, res) => {
  try {
    isbnreq = req.query.isbn;

    const books = await book.findOne({ ISBN: isbnreq });
    const gen = await book.find({ catogery: books.catogery });
    console.log(gen);

    res.json(gen);
  } catch (err) {
    res.json({ message: err })
  }

}


exports.recommend = async (req, res) => {
    try {
      let books;
      num = [];
      genArray2 = [];

      booksArray = [];
      genArray = [];
      const email = req.query.email;
      let user1;
      let gen;
      console.log(req.query.email);
      user1 = await User.findOne({ Email: email })
  
  
      for (var i = 0; i < user1.history.length; i++) {
        console.log(user1.history[i]);
        books = await book.findOne({ ISBN: user1.history[i] });
        booksArray.push(books);
      }
      for(var i = 0; i < booksArray.length; i++){
        num.push(booksArray[i].catogery);
      }

      const counts = {};
      num.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      console.log(counts)
      console.log(counts.History);
      uniqueArray = num.filter(function(elem, pos) {
        return num.indexOf(elem) == pos;
    })

    for (var i = 0; i < uniqueArray.length; i++) {
      if(uniqueArray[i]=="History"){
        gen = await book.find({ catogery: uniqueArray[i] }).limit(5*counts.History);
        for(var j = 0; j < gen.length; j++)
        genArray.push(gen[j]);
      }
      if(uniqueArray[i]=="Romance"){
        gen = await book.find({ catogery: uniqueArray[i] }).limit(5*counts.Romance);
        for(var j = 0; j < gen.length; j++)
        genArray.push(gen[j]);
      }
      if(uniqueArray[i]=="Crime"){
        gen = await book.find({ catogery: uniqueArray[i] }).limit(5*counts.Crime);
        for(var j = 0; j < gen.length; j++)
        genArray.push(gen[j]);
      }
      if(uniqueArray[i]=="Action"){
        gen = await book.find({ catogery: uniqueArray[i] }).limit(5*counts.Action);
        for(var j = 0; j < gen.length; j++)
        genArray.push(gen[j]);
      }
      if(uniqueArray[i]=="Adventure"){
        gen = await book.find({ catogery: uniqueArray[i] }).limit(5*counts.Adventure);
        for(var j = 0; j < gen.length; j++)
        genArray.push(gen[j]);
      }
      if(uniqueArray[i]=="Mystery"){
        gen = await book.find({ catogery: uniqueArray[i] }).limit(5*counts.Mystery);
        for(var j = 0; j < gen.length; j++)
        genArray.push(gen[j]);
      }
      }
      res.json(genArray);
    } catch (err) {
      res.json({ message: err })
    }
  }
