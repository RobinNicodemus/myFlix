import React from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import { MovieCard } from '../movie-card/movie-card';

import './movies-list.scss'

export function MoviesList(props) {
    const { movies, visibilityFilter, profile } = props;
    let filteredMovies = movies;

    if (visibilityFilter !== '') {
        filteredMovies = movies.filter(m => m.Title.toLowerCase().includes(visibilityFilter.toLowerCase()));
    }

    if (!movies || !profile) return <div className="main-view"><div class="lds-ripple"><div></div><div></div></div></div>;

    return <Row className="movies-list justify-content-center">
        {filteredMovies.map(m => <MovieCard key={m._id} movie={m} /*profile={profile}*/ isFav={profile.FavList.includes(m._id)} />)}
    </Row>;
}

const mapStateToProps = state => {
    const { visibilityFilter, profile } = state;
    return { visibilityFilter, profile };
};

export default connect(mapStateToProps)(MoviesList);

MoviesList.propTypes = {
    visibilityFilter: PropTypes.string,
    movies: PropTypes.object,
    profile: PropTypes.object
};