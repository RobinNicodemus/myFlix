const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

//const router = express.Router();
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
require('./passport');

const Models = require('./models.js');
const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Users = Models.User;

const app = express();

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

var auth = require('./auth')(app);

//router.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(Error, err.message);
  });
//mongoose.connect('mongodb+srv://myFlixDBadmin:adminmyFlixDB@cluster0-4fg1r.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true });


app.get('/', (req, res) => res.send('Welcome to MyFlix!'));

//GET a list of all movies
app.get('/movies', function (req, res) {
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

//GET data about a single title
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

//GET data about a specific genre
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

//GET data about a director
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

//XXX GET data about a single user by username
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

//Allow users to register a profile
/*  It´ll expect JSON in the following format:
{
ID : Integer,
Username: String,
Password: String,
Email: String,
Birthday: Date
}
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

//Allow users to update their profile data (pw, username, email, etc)
/* We´ll expect JSON in this format:
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}
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

//Allow users to add a movie to their list of favorite movies
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

//Allow users to delete a movie from their list of favorite movies
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

//Allow users to deregister
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(400).send(req.params.Username + " was deleted");
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
