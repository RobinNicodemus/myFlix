import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import MoviesList from '../movies-list/movies-list';

import './director-view.scss';


/**
 * @requires react
 * @requires PropTypes
 * @requires react-bootstrap
 * @requires react-router-dom
 * @requires MoviesList
 */


export class DirectorView extends React.Component {
    constructor() {
        super();
    }


    handleDate = (dateString) => {
        if (dateString) {
            let date = new Date(dateString);
            return date.toLocaleDateString();
        } else {
            return null
        }
    }

    render() {
        const { director, directorMovies } = this.props;

        return (
            <div className="director-view">
                <Row className="justify-content-around">
                    <Col xs={10} md={8} className="dir-card">

                        <h5 className="value">{director.Name}</h5>

                        <p className="value">{director.Bio}</p>

                        <div className="director-birth">
                            <span className="label">Birth: </span>
                            <span className="value">{this.handleDate(director.Birth)}</span>
                        </div>
                        <div className="director-death">
                            <span className="label">Death: </span>
                            <span className="value">{this.handleDate(director.Death)}</span>
                        </div>
                        <Link to={'/'}>
                            <Button variant="primary">View all</Button>
                        </Link>
                    </Col>
                </Row>
                <MoviesList movies={directorMovies} />
            </div>

        )

    }
}

DirectorView.propTypes = {
    director: PropTypes.object.isRequired,
    directorMovies: PropTypes.array.isRequired
}