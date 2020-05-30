import React from 'react';
import axios from 'axios';
import { MovieCard } from '../movie-card/movie-card';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { UpdateView } from '../update-view/update-view';
import Card from 'react-bootstrap/Card';
import MoviesList from '../movies-list/movies-list';
import { connect } from 'react-redux';
import { setProfile, setUser } from '../../actions/actions';



import './profile-view.scss';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      userData: {},
      favMovies: [],
      open: false
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        username: localStorage.getItem('user')
      });
      this.getUser(accessToken)
    }
  }

  getUser(token) {
    //axios.get('http://localhost:3000/users/:username'), {
    axios.get(`https://radiant-flix.herokuapp.com/users/${this.props.user}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log(response.data)
        this.setState({
          userData: response.data,
          favMovies: response.data.FavList,
        });
      })
      .catch(function (err) {
        console.log(err);
      });

  }


  deleteHandler = (e) => {
    e.preventDefault();
    if (confirm("Do you really want to deregister? Your profile data will be deleted.")) {
      this.deleteUser(localStorage.getItem('token'));
    }
  }

  handleDate = (dateString) => {
    if (dateString) {
      let date = new Date(dateString);
      return date.toLocaleDateString();
    } else {
      return null
    }
  }

  deleteUser = (token) => {
    /*   axios({
         method: "delete",
         url: `https://radiant-flix.herokuapp.com/users/${localStorage.getItem('user')}`,
         headers: { Authorization: `Bearer ${token}` },
         responseType: 'text',
         params: {}
       })*/
    //not working: why?

    axios.delete(`https://radiant-flix.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

      .then(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.setState({
          //   user: null
          userData: null
        });
        this.props.resetUser();
        window.open('/client', '_self');
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  render() {
    const { userData, favMovies, open, } = this.state;
    const { movies } = this.props;

    let profileFavMovies = movies.filter(m => favMovies.includes(m._id))

    return (
      <div className="profile-view">
        <Row className="justify-content-around">
          <Card className="profile-card">
            <div className="profile-head">
              <div className="profile-data">
                <span className="label">Username: </span>
                <span className="value">{userData.Username}</span>
              </div>
              <div className="profile-data">
                <span className="label">Email: </span>
                <span className="value">{userData.Email}</span>
              </div>

              <div className="profile-data">
                <span className="label">Birthday: </span>
                <span className="value">{this.handleDate(userData.Birthday)}</span>
              </div>
            </div>
            <Card.Body className="profile-body">
              <div className="profile-card-btns">
                <Button className="profile-btn"
                  size="sm"
                  aria-controls="changeform-collapse"
                  aria-expanded={open}
                  onClick={() => this.setState({ open: !open })}
                >Update</Button>
                <Link className="profile-link" to={'/'}>
                  <Button className="mv-btn" size="sm" variant="primary">All Movies</Button>
                </Link>
                <Button className="profile-btn"
                  size="sm"
                  onClick={(e) => this.deleteHandler(e)}
                >Deregister</Button>
              </div>
              <Collapse in={open}>
                <div id="changeform-collapse">
                  <UpdateView userData={userData} />
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        </Row >

        <MoviesList movies={profileFavMovies} />s



      </div >

    )

  }
}
let mapStateToProps = state => {
  return {
    //movies: state.movies,
    user: state.user,
    profile: state.profile
  }
}


export default connect(mapStateToProps, { setProfile, setUser })(ProfileView);