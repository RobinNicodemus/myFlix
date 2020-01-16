import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';
import { NavbarComponent } from '../navbar/navbar-component';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './main-view.scss';

export class MainView extends React.Component {
  constructor() {

    super();
    var reset

    this.state = {
      movies: [],
      selectedMovie: null,
      user: ""
    };
    this.onLoggedIn = this.onLoggedIn.bind(this)
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken)
    }
  }

  getMovies = (token) => {
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

  onMovieClick = (movie) => {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn = (authData) => {
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

  welcomeView = () => {
    return (
      <div className="main-wrap">
        <NavbarComponent onLoggedIn={this.onLoggedIn} resetMovie={this.resetMovie} resetUser={this.resetUser} user={user} />
        <div className="main-view" />
      </div>)
  }

  render() {
    const { movies, user } = this.state;

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
      <Router>
        <div className="main-wrap">
          <NavbarComponent onLoggedIn={this.onLoggedIn} resetMovie={this.resetMovie} resetUser={this.resetUser} user={user} />
          <Row className="main-view justify-content-around">
            <Route exact path="/" render={() => {
              if (!user) return <h1>something happened</h1>;
              return movies.map(m =>
                <MovieCard key={m._id} movie={m} />)
            }
            } />
            <Route path="/register" render={() => <RegistrationView />} />
            <Route path="/movies/:movieId" render={({ match }) => {
              if (!movies) return <h1>something happened</h1>;
              return <MovieView movie={movies.find(m => m._id === match.params.movieId)} />;
            }
            } />
            <Route path="/directors/:directorId" render={({ match }) => {
              if (!movies) return <h1>something happened</h1>;
              return <DirectorView
                director={movies.find(m => m.Director._id === match.params.directorId).Director}
                directorMovies={movies.filter(m => m.Director._id === match.params.directorId)}
              />;

            }} />
            <Route path="/genres/:name" render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return <GenreView
                genre={movies.find(m => m.Genre.Name === match.params.name).Genre}
                genreMovies={movies.filter(m => m.Genre.Name === match.params.name)}
              />
            }
            } />
            <Route path="/users/:username" render={() => {
              if (!movies) return <div className="main-view" />;
              return <ProfileView user={user}
                movies={movies} />
            }
            } />
          </Row>
        </div>
      </Router>
    );
  }
}