import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import MoviesList from '../movies-list/movies-list';

import './genre-view.scss';

export function GenreView(props) {

    const { genre, genreMovies } = props;

    return (
        <div className="genre-view">
            <Row className="justify-content-around">
                <Col xs={10} md={8} className="dir-card">

                    <h5>{genre.Name}</h5>


                    <p>{genre.Description}</p>

                    <Link to={'/'}>
                        <Button variant="primary">View all</Button>
                    </Link>
                </Col>
            </Row>
            <MoviesList movies={genreMovies} />
        </div>

    )
}


GenreView.propTypes = {
    genre: PropTypes.object.isRequired,
    genreMovies: PropTypes.array.isRequired
}