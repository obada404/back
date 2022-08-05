const User = require('../models/user');
const Product = require('../models/user');
var bcrypt = require('bcryptjs');
const { redirect } = require('express/lib/response');
const user = require('../models/user');
exports.getlogin = (req, res, next) => {
 
};
exports.getsignup = (req, res, next) => {
 
};
exports.postAddUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email})
  .then(userDoc => {
    if(userDoc){
      return res.redirect('signup');
    }

    return bcrypt.hash(password, 12)
    .then (hashPassowrd => {
      const user1 = new User({
        name: 'ahmad',
        email: email,
        password: hashPassowrd
      });
  
      return user1.save();
  
    })
    .then(result => {
      console.log('Create user');
       res.redirect('login');
    });
   
  })
.catch(err => {
    console.log(err);
   
  })

}

exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne( {email : email})
  .then(user => {
    if(!user){
      return res.redirect('login');
    }
    bcrypt.compare(password ,user.password)
    .then(doMatch => {

      if(doMatch){
        return res.redirect('/');

      }
       res.redirect('login');
    })
    .catch(err => {
      console.log(err);
      res.redirect('login');
    })
  })

  
};

