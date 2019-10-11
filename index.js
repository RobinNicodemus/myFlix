const express = require('express'),
  morgan = require('morgan');

const app = express();

let topMovies = [ {
    title : 'Movie1'
},
{
    title : 'Movie2'
},
{
    title : 'Movie3'
},
{
    title : 'Movie4'
},
{
    title : 'Movie5'
},
{
    title : 'Movie6'
},
{
    title : 'Movie7'
},
{
    title : 'Movie8'
},
{
    title : 'Movie9'
},
{
    title : 'Movie10'
}
]

app.use(morgan('common'));

app.get('/movies', (req,res) => res.json(topMovies));

app.get('/', (req, res) => res.send('Welcome to MyFlix!'));

app.use(express.static('public'));

app.use( function (err,req,res,next) {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(8080, () =>
  console.log('It´s listening on port 8080.')
);
