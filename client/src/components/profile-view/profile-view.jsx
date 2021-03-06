import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { UpdateView } from '../update-view/update-view';
import Card from 'react-bootstrap/Card';
import MoviesList from '../movies-list/movies-list';
import { connect } from 'react-redux';
import { setProfile, setUser } from '../../actions/actions';

import './profile-view.scss';

/**
 * @requires react
 * @requires react-redux
 * @requires PropTypes
 * @requires react-bootstrap
 * @requires react-router-dom
 * @requires MoviesList
 * @requires UpdateView
 */

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

  /**
   * gets relevant user object from /users/:username
   * @function getUser
   * @param {*} token 
   * @param {string} username - from state
   */
  getUser(token) {
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

  /**
  * deletes relevant user from /users/:username
  * @function deleteUser
  * @param {*} token 
  * @param {string} username - from state
  */
  deleteUser = (token) => {
    axios.delete(`https://radiant-flix.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

      .then(response => {
        this.props.resetUser();
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
    user: state.user,
    profile: state.profile,
  }
}

export default connect(mapStateToProps, { setProfile, setUser })(ProfileView);

//
ProfileView.propTypes = {
  movies: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired,
  setProfile: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  resetUser: PropTypes.func.isRequired
};