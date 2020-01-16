import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import { LoginView } from '../login-view/login-view';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { Link } from 'react-router-dom';

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
          <Link className="profile-link" to={'/'}>
            <Navbar.Brand>myFlix</Navbar.Brand>
          </Link>
        </OverlayTrigger>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end align-content-center">
          <Navbar.Text>
            Signed in as:&nbsp;
            <Link to={`/users/${user}`}>
              <Button variant="outline-primary" size="sm">{user}</Button>
            </Link>
          </Navbar.Text>
          <OverlayTrigger placement="bottom" delay={{ show: 100, hide: 200 }} overlay={<Tooltip>Sign out</Tooltip>} >
            <Button variant="outline-secondary" size="sm" onClick={() => this.props.resetUser()}>Log Out</Button>
          </OverlayTrigger>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

NavbarComponent.propTypes = {
  user: PropTypes.string.isRequired,
  resetUser: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired
};