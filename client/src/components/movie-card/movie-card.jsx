import React from 'react';

export class MovieCard extends React.Component {
    render() {
        //get props from the outer element, in this case main-view
        const { movie, onClick } = this.props;

        return (
            <div onClick={() => onClick(movie)} className="movie-card">{movie.Title}</div>
        );
    }
}