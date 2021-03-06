import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import axios from 'axios';

import { connect } from 'react-redux';
import { setProfile } from '../../actions/actions';
import { useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';

import './movie-card.scss'


/**
 * @requires react
 * @requires axios
 * @requires react-redux
 * @requires PropTypes
 * @requires react-bootstrap
 * @requires react-router-dom
 */

const mapStateToProps = state => {
    return {
        profile: state.profile
    }
};

export function MovieCard(props) {
    const dispatch = useDispatch()

    let { movie, isFav } = props;

    /**
     * handles event to remove movie from favlist
     * @function removeFavHandler
     * @param {*} e - event
     * @param {string} movieId 
     */
    const removeFavHandler = (e, movieId) => {
        e.preventDefault();
        removeFromFavs(localStorage.getItem('token'), movieId);
    }

    /**
    * removes movie from favlist by stating movieID
    * @function removeFromFavs
    * @param {string} token 
    * @param {string} movieId 
    */
    const removeFromFavs = (token, movieId) => {
        axios.delete(`https://radiant-flix.herokuapp.com/users/${localStorage.getItem('user')}/favlist/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                dispatch({ type: 'SET_PROFILE', value: response.data })
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    /**
     * handles event to add movie to favlist
     * @function addFavHandler
     * @param {*} e - event
     * @param {string} movieId 
     */
    const addFavHandler = (e, movieId) => {
        e.preventDefault();
        addToFavs(localStorage.getItem('token'), movieId);
    }

    /**
    * adds movie to favlist by stating movieID
    * @function removeFromFavs
    * @param {string} token 
    * @param {string} movieId 
    */
    const addToFavs = (token, movieId) => {
        axios({
            method: "post",
            url: `https://radiant-flix.herokuapp.com/users/${localStorage.getItem('user')}/favlist/${movieId}`,
            headers: { Authorization: `Bearer ${token}` }
        })
            /* not working. why??
            axios.post(`https://radiant-flix.herokuapp.com/users/${localStorage.getItem('user')}/favlist/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })*/

            .then(response => {
                dispatch({ type: 'SET_PROFILE', value: response.data })
            })
            .catch(function (err) {
                console.log(err);
            });
    }


    if (isFav) {
        return (
            <Card className="movie-card">
                <Card.Img variant="top" src={movie.ImagePath} />
                <Card.Body>
                    <Card.Title>{movie.Title}</Card.Title>
                    <Card.Text>{movie.Description}</Card.Text>
                </Card.Body>
                <div className="card-links">
                    <Link to={`/movies/${movie._id}`}>
                        <Button variant="link">Open</Button>
                    </Link>
                    <Link to={`/directors/${movie.Director._id}`}>
                        <Button variant="link">Director</Button>
                    </Link>
                    <Link to={`/genres/${movie.Genre.Name}`}>
                        <Button variant="link">Genre</Button>
                    </Link>
                    <button className="favBtn isFav" onClick={(e) => removeFavHandler(e, movie._id)}></button>
                </div>
            </Card>
        )
    }


    return (
        <Card className="movie-card">
            <Card.Img variant="top" src={movie.ImagePath} />
            <Card.Body>
                <Card.Title>{movie.Title}</Card.Title>
                <Card.Text>{movie.Description}</Card.Text>
            </Card.Body>
            <div className="card-links">
                <Link to={`/movies/${movie._id}`}>
                    <Button variant="link">Open</Button>
                </Link>
                <Link to={`/directors/${movie.Director._id}`}>
                    <Button variant="link">Director</Button>
                </Link>
                <Link to={`/genres/${movie.Genre.Name}`}>
                    <Button variant="link">Genre</Button>
                </Link>
                <button className="favBtn notFav" onClick={(e) => addFavHandler(e, movie._id)}></button>
            </div>
        </Card>

    );
}


export default connect(mapStateToProps, { setProfile })(MovieCard);


MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string.isRequired,
        Featured: PropTypes.bool.isRequired,
        Director: PropTypes.shape({
            Name: PropTypes.string.isRequired
        }).isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    //
    key: PropTypes.string.isRequired,
    isFav: PropTypes.bool.isRequired,
    //profile: PropTypes.object
    // setProfile: PropTypes.func
};