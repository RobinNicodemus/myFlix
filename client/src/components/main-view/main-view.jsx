import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import { setMovies, setUser, setProfile } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';

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

class MainView extends React.Component {
  constructor() {

    super();
    var reset
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    let username = localStorage.getItem('user')
    if (accessToken !== null) {
      console.log(this.props)
      this.props.setUser(localStorage.getItem('user'));
      this.getMovies(accessToken)
      this.getUser(accessToken, username)
    }
  }

  getMovies = (token) => {
    //axios.get('http://localhost:3000/movies'), {
    axios.get('https://radiant-flix.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  getUser(token, username) {
    //axios.get('http://localhost:3000/users/:username'), {
    axios.get(`https://radiant-flix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log(response.data)
        this.props.setProfile(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  onLoggedIn = (authData) => {
    console.log(authData);
    this.props.setUser(authData.user.Username);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token)
  }

  resetUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.props.setUser({ user: "" });
    window.open('/', '_self');

  }

  render() {

    // #2
    let { movies } = this.props;
    let { user } = this.props;
    let { profile } = this.props;

    if (!movies || !movies.length || !profile) return (
      <Router>
        <div className="main-wrap">
          <NavbarComponent onLoggedIn={this.onLoggedIn} resetUser={this.resetUser} user={user} />
          <Route exact path="/" render={() => {
            if (!user) return <RegistrationView onLoggedIn={this.onLoggedIn} />
            return <MoviesList movies={movies} profile={profile} />;
          }} />
        </div>
      </Router>
    );

    return (

      <Router>
        <div className="main-wrap">
          <NavbarComponent onLoggedIn={this.onLoggedIn} resetUser={this.resetUser} user={user} />
          <Row className="main-view">
            <Col lg={{ span: 8, offset: 2 }}>
              <Route exact path="/" render={() => {
                if (!user) return <RegistrationView onLoggedIn={this.onLoggedIn} />
                return <MoviesList movies={movies} profile={profile} />;
              }} />
              <Route path="/register" render={() => <RegistrationView />} />
              <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
              <Route
                path="/genres/:name"
                render={({ match }) => (
                  <GenreView
                    genre={movies.find(m => m.Genre.Name === match.params.name).Genre}
                    genreMovies={movies.filter(m => m.Genre.Name === match.params.name)}
                  />
                )}
              />
              <Route path="/directors/:directorId" render={({ match }) => {
                return <DirectorView
                  director={movies.find(m => m.Director._id === match.params.directorId).Director}
                  directorMovies={movies.filter(m => m.Director._id === match.params.directorId)}
                />;
              }} />
              <Route path="/users/:username" render={() => {
                return <ProfileView user={user}
                  movies={movies} />
              }} />
            </Col>
          </Row>
        </div>
      </Router>
    );

    // 
  }
}


let mapStateToProps = state => {
  return {
    movies: state.movies,
    user: state.user,
    profile: state.profile
  }
}


export default connect(mapStateToProps, { setMovies, setUser, setProfile })(MainView);