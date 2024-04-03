var express = require('express');
var router = express.Router();
var users = require('./users')
var postModel = require('./post')
var passport = require('passport')
var upload = require('./multer')
var localStrategy = require('passport-local')
passport.use(new localStrategy(users.authenticate()))

router.get('/', function (req, res) {
  res.render('index', { footer: false });
});

router.post('/register', (req, res, next) => {
  var newUser = {
    //user data here
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.name
    //user data here
  };
  users
    .register(newUser, req.body.password)
    .then((result) => {
      passport.authenticate('local')(req, res, () => {
        //destination after user register
        res.redirect('/profile');
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  }),
  (req, res, next) => { }
);

router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});


function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login');
}


router.get('/login', function (req, res) {
  res.render('login', { footer: false });
});

router.get('/feed', function (req, res) {
  res.render('feed', { footer: true });
});

router.get('/profile', isloggedIn, async function (req, res) {

  const loggedInUser = req.user // write nhi kr skte

  res.render('profile', { footer: true, loggedInUser });
});

router.get('/search', function (req, res) {
  res.render('search', { footer: true });
});

router.get('/edit', function (req, res) {
  res.render('edit', { footer: true });
});

router.get('/upload', isloggedIn, function (req, res) {
  res.render('upload', { footer: true });
});

router.post('/upload', isloggedIn, upload.single('image'), async (req, res, next) => {
  console.log(req.body)
  console.log(req.file)

  const newPost = await postModel.create({
    user: req.user._id,
    media: "/uploads/" + req.file.filename,
    caption: req.body.caption
  })

  res.send(newPost)

})

module.exports = router;
