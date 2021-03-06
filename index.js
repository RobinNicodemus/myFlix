const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

const { check, validationResult } = require('express-validator');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./passport');
const path = require("path");

const Models = require('./models.js');
const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());



var auth = require('./auth')(app);

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('DB Connected!'))
//   .catch(err => {
//     console.log(Error, err.message);
//   });
mongoose.connect('mongodb+srv://myFlixDBadmin:adminmyFlixDB@cluster0-4fg1r.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true });

/**
 * <p>GET: "/" </p> 
 * <p>just gives a welcome message</p>
 * <p>Response: {string} Welcome to MyFlix!</p>
 * @name Hello_World
 */
app.get('/', (req, res) => res.send('Welcome to MyFlix!'));

/**
 * <p>GET "/movies" </p>
 * <p>returns a list of all movies</p>
 * <p>Response: {Array<movie>} movies + Statuscode: 201 - succcess code / 500 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response Example: [{ Actors: ["Act1","Act2"], _id: "MovieID1" Title: "Movie1", Description: "lorem ipsum", Genre: "ObjectID", Director: "ObjectID", ImagePath: "movie1.png", Featured: Boolean }, { Actors: [...], _id: "MovieID2", Title: "Movie2", Description: "lorem ipsum", ... }, ... ]
 * @name GET_Movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .populate('Genre')
    .populate('Director')
    .then(function (movies) {
      res.status(201).json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


/**
 * <p>GET "/movies/:MovieID" </p>
 * <p>returns data about a single movie</p>
 * <p>Response: {Object} movie + Statuscode: 201 - succcess code / 500 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response Example: { _id: "MovieID1" Title: "Movie1", Description: "lorem ipsum", Genre: "ObjectID", Director: "ObjectID", ImagePath: "movie1.png", Featured: Boolean }
 * @name GET_Movie_byID
 * @params {string} MovieID
 */
app.get('/movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.findOne({ _id: req.params.MovieID })
    .populate('Genre')
    .populate('Director')
    .then(function (movie) {
      res.status(201).json(movie)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * <p>GET "/genres/:Genrename" </p>
 * <p>returns data about a single genre</p>
 * <p>Response: {Object} genre + Statuscode: 201 - succcess code / 500 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response example: { Name: "Thriller", Description: "Thrillers are movies that focus on ..." }
 * @name GET_Genre_byName
 * @params {string} Genrename
 */
app.get('/genres/:Genrename', passport.authenticate('jwt', { session: false }), function (req, res) {
  Genres.findOne({ Name: req.params.Genrename })
    .then(function (genre) {
      res.status(201).json(genre)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * <p>GET "/directors/:directorname" </p>
 * <p>returns data about a single director</p>
 * <p>Response: {Object} director + Statuscode: 201 - succcess code / 500 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response example: { "Movies": ["ObjectID", "ObjectID"], "_id": "5dcef9b16ac458b6033b2316", "Name": "Jonathan Demme", "Bio": "Robert Jonathan Demme was an American director, producer and screenwriter.", "Birth": "1944-02-22T00:00:00.000Z", "Death": "2017-04-26T00:00:00.000Z" }
 * @name GET_Director_byName
 * @params {string} Directorname
 */
app.get('/directors/:DirectorID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Directors.findOne({ _id: req.params.DirectorID })
    .populate('Movies')
    .then(function (director) {
      res.status(201).json(director)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//XXX GET data about all users
app.get('/users', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


/**
 * <p>GET "/users/:UserID" </p>
 * <p>Create a new user profile</p>
 * <p>Response: {Object} user + Statuscode: 201 - succcess code / 500 or 422 failure code</p>
 * <p>Auth: This route is requires valid jwt</p>
 * Response example: { _id: "ID", FavList: [MovieID , MovieID2], Username: "User", Password: "hashedpw", Email: "E@mail.com"
 * @name POST_create_User
 * @params {string} Username
 * @params {string} Password
 * @params {string} Email
 * @params {Date} [Birthday]
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOne({ Username: req.params.Username })
    .then(function (user) {
      res.json(user)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * <p>Post "/users" </p>
 * <p>Create a new user profile</p>
 * <p>Response: {Object} user + Statuscode: 201 - succcess code / 500 or 422 failure code</p>
 * <p>Auth: This route is open</p>
 * <p>Request example: { Username: String, (required) Password: String, (required) Email: String, (required) Birthday: Date }</p
 * <p>username must be alphanumberic, password at least 6 chars, email must be valid</p>
 * Response example: { _id: "exampleID", Username: "newUser", Password: "complex", Email: "newUser@example.com", }
 * @name POST_create_User
 * @params {string} Username
 * @params {string} Password
 * @params {string} Email
 * @params {Date} [Birthday]
 */
app.post('/users', [check('Username', 'Username required').isLength({ min: 5 }),
check('Username', 'Username may only be Alphanumeric').isAlphanumeric(),
check('Password', 'Password has minimum length of 6').isLength({ min: 6 }),
check('Email', 'Email seems not valid').isEmail()],
  function (req, res) {
    //validation
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //creating user
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(function (user) {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then(function (user) { res.status(201).json(user) })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            })
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

/**
 * <p>PATCH "/users/:username" </p>
 * <p>Change existing user profile</p>
 * <p>Response: {Object} user + Statuscode: 201 - succcess code / 500 or 422 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * <p>Request example: { Username: String, (required) Password: String, (required) Email: String, (required) Birthday: Date }</p
 * Response example: { _id: "exampleID", Username: "newUser", Password: "complex", Email: "newUser@example.com", }
 * @name PATCH_change_userProfile
 * @params {string} Username
 * @params {string} Password
 * @params {string} Email
 * @params {Date} [Birthday]
 */
app.patch('/users/:Username', [check('Username', 'Username required').isLength({ min: 5 }),
check('Username', 'Username may only be Alphanumeric').isAlphanumeric(),
check('Password', 'Password has minimum length of 6').isLength({ min: 6 }),
check('Email', 'Email seems not valid').isEmail()],
  passport.authenticate('jwt', { session: false }), function (req, res) {
    //validation
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //updating
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        // Username may not be changed. Otherwise it might overwirte another user
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
  });

/**
 * <p>POST "/users/:username/favlist/:NewMovieID" </p>
 * <p>Add Movie to Users Favourites</p>
 * <p>Response: {Object} user + Statuscode: 201 - succcess code / 500 or 422 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response example: { FavList: [NewMovieID , MovieID2] Username: "User", Password: "complex", Email: "changed@changed.com" }
 * @name POST_favouriteMovie_byID
 */
app.post('/users/:Username/favlist/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavList: req.params.MovieID }
  },
    { new: true },
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

/**
 * <p>DELETE "/users/:username/favlist/:MovieID" </p>
 * <p>Delete Movie from Users Favourites</p>
 * <p>Response: {Object} user + Statuscode: 201 - succcess code / 500 or 422 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response example: {string}
 * @name DELETE_favouriteMovie_byID
 */
app.delete('/users/:Username/favlist/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavList: req.params.MovieID }
  },
    { new: true },
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

/**
 * <p>DELETE "/users/:username" </p>
 * <p>Delete existing user profile</p>
 * <p>Response: {Object} user + Statuscode: 201 - succcess code / 500 or 422 failure code</p>
 * <p>Auth: This route requires valid jwt</p>
 * Response example: {string}
 * @name DELETE_User
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log('It´s listening on port 3000')
);
