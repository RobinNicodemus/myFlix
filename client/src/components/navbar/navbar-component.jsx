import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import { LoginView } from '../login-view/login-view';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import './navbar-component.scss';

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

export class NavbarComponent extends React.Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { user, visibilityFilter } = this.props;

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
          <Form inline>
            <VisibilityFilterInput visibilityFilter={visibilityFilter} />
          </Form>
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

export default connect(mapStateToProps)(NavbarComponent);

NavbarComponent.propTypes = {
  user: PropTypes.string.isRequired,
  resetUser: PropTypes.func.isRequired,
  onLoggedIn: PropTypes.func.isRequired,
  //
  visibilityFilter: PropTypes.string.isRequired
};