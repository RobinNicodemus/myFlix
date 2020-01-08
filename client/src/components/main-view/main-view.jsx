import React from 'react';
import axios from 'axios';

import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { NavbarComponent } from '../navbar/navbar-component';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './main-view.scss';

export class MainView extends React.Component {
  constructor() {

    super();
    var reset

    this.state = {
      movies: null,
      selectedMovie: null,
      user: ""
    };
    this.onLoggedIn = this.onLoggedIn.bind(this)
  }

  componentDidMount() {
    //axios.get('https://radiant-flix.herokuapp.com/movies')
    axios.get('http://localhost:3000/movies')
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

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  resetMovie = () => {
    this.setState({ selectedMovie: null });
  }

  resetUser = () => {
    this.setState({ user: "" });
  }

  render() {
    const { movies, selectedMovie, user } = this.state;

    if (!user) return (
      <div className="main-wrap">
        <NavbarComponent onLoggedIn={this.onLoggedIn} resetMovie={this.resetMovie} resetUser={this.resetUser} user={user} />
        <Row className="main-view justify-content-around">
          <Col className="form-container" xs={12} sm={6}>
            <RegistrationView onLoggedIn={user => this.onLoggedIn(user)} />
          </Col>
        </Row>
      </div >
    );

    if (!movies) return (
      <div className="main-wrap">
        <NavbarComponent onLoggedIn={this.onLoggedIn} resetMovie={this.resetMovie} resetUser={this.resetUser} user={user} />
        <div className="main-view" />
      </div>
    );

    return (
      <div className="main-wrap">
        <NavbarComponent onLoggedIn={this.onLoggedIn} resetMovie={this.resetMovie} resetUser={this.resetUser} user={user} />
        <Row className="main-view justify-content-around">
          {selectedMovie
            ? <MovieView resetMovie={this.resetMovie} movie={selectedMovie} />
            : movies.map(movie => (
              <Col className="card-container" key={movie._id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
              </Col>
            ))
          }
        </Row>
      </div>
    );
  }
}