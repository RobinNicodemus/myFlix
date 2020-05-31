import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './movie-view.scss'

export function MovieView(props) {

  const { movie } = props;

  return (
    <div className="movie-view">
      <img className="movie-poster" src={movie.ImagePath} />
      <div className="movie-title">
        <span className="label">Title: </span>
        <span className="value">{movie.Title}</span>
      </div>
      <div className="movie-descitption">
        <span className="label">Description: </span>
        <span className="value">{movie.Description}</span>
      </div>
      <div className="movie-genre">
        <span className="label">Genre: </span>
        <Link to={`/genres/${movie.Genre.Name}`}>
          <Button variant="link">{movie.Genre.Name}</Button>
        </Link>
      </div>
      <div className="movie-director">
        <span className="label">Director: </span>
        <Link to={`/directors/${movie.Director._id}`}>
          <Button variant="link">{movie.Director.Name}</Button>
        </Link>
      </div>
      <Link to={'/'}>
        <Button className="mv-btn" variant="primary">View all</Button>
      </Link>
    </div>
  );
}

export default connect(null)(MovieView);


MovieView.propTypes = {
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
};
