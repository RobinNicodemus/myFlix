const mongoose = require('mongoose');

var movieSchema = mongoose.Schema({
  Title : {type: String, required: true},
  Description : {type: String, required: true},
  Director : {type: mongoose.Schema.Types.ObjectId, ref: 'Director'},
  Genre : {type: mongoose.Schema.Types.ObjectId, ref: 'Genre'},
  Featured : Boolean,
  Actors: [String],
  ImagePath: String
});

var genreSchema = mongoose.Schema({
  Name : {type: String, required: true},
  Description : {type: String, required: true}
});

var directorSchema = mongoose.Schema({
  Name : {type: String, required: true},
  Bio: {type: String, required: true},
  Birth: Date,
  Death: Date,
  Movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

var userSchema = mongoose.Schema({
  Username : {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true} ,
  Birthday: Date,
  FavList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

var Movie = mongoose.model('Movie', movieSchema);
var Genre = mongoose.model('Genre', genreSchema);
var Director = mongoose.model('Director', directorSchema);
var User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.User = User;
