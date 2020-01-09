import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from "react-router-dom";

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
    let accesToken = localStorage.getItem('token');
    if (accesToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accesToken)
    }
  }

  getMovies(token) {
    //axios.get('http://localhost:3000/movies'), {
    axios.get('https://radiant-flix.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token)
  }

  resetMovie = () => {
    this.setState({ selectedMovie: null });
  }

  resetUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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