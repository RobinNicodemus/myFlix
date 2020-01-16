import React from 'react';
import { MovieCard } from '../movie-card/movie-card';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';

import './genre-view.scss';

export class GenreView extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { genre, genreMovies } = this.props;

        if (!genre || !genreMovies) return null;

        return (
            <div className="genre-view">
                <Row className="justify-content-around">
                    <Col xs={8} md={6} className="dir-card">

                        <h5>{genre.Name}</h5>


                        <p>{genre.Description}</p>

                        <Link to={'/'}>
                            <Button variant="primary">View all</Button>
                        </Link>
                    </Col>
                </Row>
                <Row className="justify-content-around">
                    {genreMovies.map(m =>
                        <MovieCard key={m._id} movie={m} />)}
                </Row>
            </div>

        )

    }
}

GenreView.propTypes = {
    genre: PropTypes.object.isRequired,
    genreMovies: PropTypes.array.isRequired
}