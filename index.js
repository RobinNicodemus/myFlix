const express = require('express'),
  morgan = require('morgan');

const app = express();

let movies = [{
  title: "name1",
  director: "dir1",
  cast: ["act1","act2","act3"],
  genres: ["gen1","gen2"]
},
{
  title: "name2",
  director: "dir1",
  cast: ["act1","act2","act3"],
  genres: ["gen1","gen2"]
}
];

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => res.send('Welcome to MyFlix!'));

//GET a list of all movies
app.get('/movies', (req,res) => res.json(movies));

//GET data about a single title
app.get('/movies/:title', (req,res) => {
  res.json(movies.find( (movie) => {
  return movie.title === req.params.title }));
});

//GET data about a specific genre
app.get('/genres/:genrename', (req,res) => res.send('Successful GET returning data about the genre'));

//GET data about a director
app.get('/directors/:director', (req,res) => res.send('Successful GET returning data about the director'));

//Allow users to register a profile
app.post('/users', (req,res) => res.send('Successful POST returns the data about the new user'));

//Allow users to update their profile data (pw, username, email, etc)
app.put('/users/:name', (req,res) => res.send('Successful PUT returns changed user data'));

//Allow users to add a movie to their list of favorite movies
app.post('/users/:name/favlist', (req,res) => res.send('POST returns the added movie'));

//Allow users to delete a movie from their list of favorite movies
app.delete('/users/:name/favlist', (req,res) => res.send('Returns a success message'));

//Allow users to deregister
app.delete('/users/:name', (req,res) => res.send('Account deletion succesful'));

app.use( function (err,req,res,next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () =>
  console.log('It´s listening on port 8080.')
);
