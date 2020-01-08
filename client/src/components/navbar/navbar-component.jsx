import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import { LoginView } from '../login-view/login-view';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import './navbar-component.scss';

export class NavbarComponent extends React.Component {

    constructor() {
        super();

        this.state = {};
    }

    render() {
        const { user } = this.props;

        if (!user) {
            return (
                <Navbar expand="md">
                    <Navbar.Brand href="#">myFlix</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end align-content-center">
                        <LoginView className="justify-content-end" onLoggedIn={user => this.props.onLoggedIn(user)} />
                    </Navbar.Collapse>

                </Navbar>
            );
        }

        return (
            <Navbar expand="sm">
                <OverlayTrigger placement="bottom" delay={{ show: 100, hide: 200 }} overlay={<Tooltip>View all</Tooltip>}>
                    <Navbar.Brand href="#home" onClick={() => this.props.resetMovie()}>myFlix</Navbar.Brand>
                </OverlayTrigger>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end align-content-center">
                    <Navbar.Text>
                        Signed in as:&nbsp;
                        <OverlayTrigger placement="bottom" delay={{ show: 100, hide: 200 }} overlay={<Tooltip>Sign out</Tooltip>} >
                            <a href="#" onClick={() => this.props.resetUser()}>{user}</a>
                        </OverlayTrigger>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

NavbarComponent.propTypes = {
    user: PropTypes.string.isRequired,
    resetMovie: PropTypes.func.isRequired,
    resetUser: PropTypes.func.isRequired,
    onLoggedIn: PropTypes.func.isRequired
};