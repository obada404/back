const express = require('express');
const User = require('../models/User');
const Book = require('../models/User');
const recordReset = require('../models/recordReset');
var rand = require("random-key");
var nodemailer = require('nodemailer');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const { redirect } = require('express/lib/response');
const request = require('request');

exports.postAddUser = async (req, res) => {
  sess = req.session;
  if (sess.email) {
    return res.redirect('/');
  }

  const hash = bcrypt.hashSync(req.body.Password, 5);
  console.log(hash);
  const user = new User({
    Email: req.body.Email,
    Password: hash,
  })
  try {
    const savedUser = await user.save();
    res.json(savedUser);
    sess.Email = req.body.Email;

    res.json({ message: err })

  } catch (error) {
    console.log(error.message);
  }
};

exports.postlike = async (req, res) => {
  console.log("1" + req.query.Email)
  console.log("2" + req.query.likedbook)
  email = req.query.Email;
  const likedbook = req.query.likedbook;
  user = await User.findOne({ Email: email }).select('liked');
  const requestq = request.get(
    'http://localhost:3000/users/increaslike?likedbook='+likedbook,
    {},
  ).on('error', function(e) {
    console.log("Got error: " + e.message);
  }); 
  if (Array.from(user.liked).includes(likedbook)) {
    const update = { $pull: { liked: likedbook } }
    const updated = User.findOneAndUpdate({ Email: email }, update, { upsert: true }, (err) => {
      if (err) console.log(err);
      else
        console.log("Successfully removed");
    })
  
  }
  else {
    const update = { $push: { liked: likedbook } }
    const updated = User.findOneAndUpdate({ Email: email }, update, { upsert: true }, (err) => {
      if (err) console.log(err);
      else
        console.log("Successfully added");
    })


  }
}

exports.increaslike = async (req, res) => {
  const likedbook = req.query.likedbook;
  book1 = await Book.findOne({ 'Book-Title': likedbook });
  console.log(book1);

}


exports.posthistory = async (req, res) => {
  console.log("1" + req.query.Email)
  console.log("2" + req.query.history)
  email = req.query.Email;
  let mass ;
  const historybook = req.query.history;
  user =   await User.findOne({ Email: email }).select('history');

  if (Array.from(user.history).includes(historybook)) {
    user.history.pull(historybook)
    user.history.unshift(historybook)
    user.save();
  }
  else {
    user.history.unshift(historybook)
    user.save();
  }

  await res.json(mass)
}

exports.postlater = async (req, res) => {
  console.log("1" + req.query.Email)
  console.log("2" + req.query.laterbook)
  email = req.query.Email;
  const laterbook = req.query.laterbook;
  user = await User.findOne({ Email: email }).select('later');

  if (Array.from(user.later).includes(laterbook)) {
    const update = { $pull: { later: laterbook } }
    const updated = User.findOneAndUpdate({ Email: email }, update, { upsert: true }, (err) => {
      if (err) console.log(err);
      else
        console.log("Successfully removed");
    })
  }
  else {
    const update = { $push: { later: laterbook } }
    const updated = User.findOneAndUpdate({ Email: email }, update, { upsert: true }, (err) => {
      if (err) console.log(err);
      else
        console.log("Successfully added");
    })
  }
}

exports.ispress = async (req, res) => {
  console.log("1" + req.query.Email)
  console.log("2" + req.query.likedbook)
  email = req.query.Email;
  const likedbook = req.query.likedbook;
  user = await User.findOne({ Email: email }).select('liked');

  if (Array.from(user.liked).includes(likedbook)) {
    res.json("1")
  }
  else {
    console.log("2");
  }
}

exports.postsignup2 = async (req, res) => {
  console.log(req.body);
  console.log(req.json);
  const DoBReq = req.body.DOB;
  const email = req.body.Email;
  const genderReq = req.body.Gender;
  const userNameReq = req.body.Username;
  const ge = req.body.genre;
  const update = { userName: userNameReq, DoB: DoBReq, gender: genderReq, liked: [], genre: ge, later: [] };
  console.log(update)
  const updated = User.findOneAndUpdate({ Email: email }, update, (err, doc) => {
    if (err) console.log(err);
    console.log("jkhjhkj");
  })
  // console.log(updated)
  res.json("dsasd")
}

exports.updateData = async (req, res) => {
  console.log(req.query);

  const email = req.query.email;
  const userNameReq = req.query.userName;
  const update = { userName: userNameReq, }
  console.log(update)
  const updated = User.findOneAndUpdate({ Email: email }, update, (err, doc) => {
    if (err) console.log(err);
    console.log("jkhjhkj");
  })
  // console.log(updated)
  res.json("dsasd")
}



exports.postlogin = async (req, res, next) => {
  sess = req.session;
  if (sess.email) {
    return res.json({
      URL: "/main",
      session: true
    });
  }
  const password = req.body.Password;
  const email = req.body.Email;
  await User.findOne({ Email: email })
    .then(user1 => {

      if (!user1) {
        return res.json({
          URL: "/login"
          , message: "no user with such email"
        });
      } else {
        console.log(user1.Password);
        console.log(user1.Email);
        bcrypt.compare(password, user1.Password)
          .then(doMatch => {

            if (doMatch) {
              sess.email = email;
              return res.json({
                URL: "/main"
                , message: "Succeful"
              });
            }
            return res.json({
              URL: "/login"
              , message: "bad password"
            });
          })
          .catch(err => {
            console.log(err);
            return res.json({
              URL: "/login"
              , message: "error22"
            });
          })

      }
    })


};
exports.postreset1 = async (req, res, next) => {

  const email = req.query.Email;

  console.log(email + "nulllllllllllllllllll")
  await User.findOne({ Email: email })
    .then(user1 => {

      if (!user1) {
        console.log('not found');

        return res.json({
          URL: "/login"
          , message: "no user with such email"
        });
      } else {
        console.log(user1.Email);
        mykey = rand.generate(8)
        let record = recordReset.findOne({ Email: user1.Email }).then(user1 => {
          if (!user1) {
            record = new recordReset({
              Email: email,
              key: mykey
            });
            record.save()
          }
          else {
            user1.key = mykey;
            user1.save();
          }
        })

        console.log(record);


        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'oday.qr.2001@gmail.com',
            pass: 'KILLTOHEALkito12'
          }
        });

        var mailOptions = {
          from: 'oday.qr.2001@gmail.com',
          to: email,
          subject: 'Sending Email to rest youer aduial passwor',
          text: 'http://localhost:54588/reset?key=' + mykey
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.json({ URL: "/login", message: 'check your email to rest your password ' });
      }
    })

}

exports.getresetkey = async (req, res, next) => {
  const keyreq = req.query.key
  console.log(keyreq)
  await recordReset.findOne({ key: keyreq })
    .then(async record => {

      if (!record) {
        console.log('not found');

        return res.json({
          URL: "/login"
          , message: "your token has been expered "
        });
      } else {
        return res.json({
          URL: "/resetpassword"
          , message: "you can update password now "
        });



      }
    })
}

exports.getresetpass = async (req, res, next) => {
  const keyreq = req.query.key
  const pass = req.query.password
  console.log(keyreq)
  await recordReset.findOne({ key: keyreq })
    .then(async record => {

      if (!record) {
        console.log('not found');

        return res.json({
          URL: "/login"
          , message: "your token has been expered "
        });
      } else {
        const hash = bcrypt.hashSync(pass, 5);
        console.log(hash);
        console.log(record.Email)

        let doc = await User.findOne({ Email: record.Email }, { Password: hash }).then(user1 => {


          if (!user1) {
            return res.json({
              URL: "/login"
              , message: "no user "
            });


          }
          else {
            user1.Password = hash;
            user1.save()
            return res.json({
              URL: "/login"
              , message: "your passwor has been updated "
            });
          }


        })


      }
    })
}
exports.allusers = async (req, res, next) => {
  console.log("asasdasdasd")
  const users = await User.find().limit(40);
  res.json(users);


}
exports.getuser = async (req, res, next) => {
  const email = req.query.email;
  console.log(req.query.email);
  await User.findOne({ Email: email })
    .then(user1 => {
      res.json(user1);
    })

}
exports.deleteone = async (req, res, next) => {
  const email = req.query.email;
  console.log(req.query.email);
  await User.findOneAndDelete({ Email: email })
  res.json(" user deleted ")
}
exports.editoneuser = async (req, res) => {
  try {
    email = req.query.email;
    something = req.query.something;
    value = req.query.value;
    console.log(something + "vvvvv" + value + " vvvvvvvv " + email)
    const Users = await User.findOne({ Email: email })
    Users[something] = value
    console.log(something + "vvvvv" + value + " vvvvvvvv " + email)
    Users.save();
    console.log(Users)
    res.json(Users);
  } catch (err) {
    res.json({ message: err })
  }

}