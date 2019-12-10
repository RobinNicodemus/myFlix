import React from 'react';
import axios from 'axios';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
  constructor() {

    super();
    var reset
    //initialize the state: (so we can access it later)
    this.state = {
      movies: null,
      selectedMovie: null
    };
  }

  componentDidMount() {
    axios.get('https://radiant-flix.herokuapp.com/movies')
      //axios.get('http://localhost:3000/movies')
      .then(response => {
        //assign the response to the state
        console.log(response.data)
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log("Unable to get movie data: " + error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  //here
  resetState = () => {
    this.setState({ selectedMovie: null });
  }

  render() {
    const { movies, selectedMovie } = this.state;

    if (!movies) return (
      <div className="main-view" />
    );

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView resetState={this.resetState} movie={selectedMovie} />
          : movies.map(movie => (
            <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
          ))
        }
      </div>
    );
  }
}