import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

import './login-view.scss';


export function LoginView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password)
        //send req to server for authentication then call props.onLoggedIn(username)
        props.onLoggedIn(username);
    };

    return (
        //<Form className="login-card">
        <Form inline className="login-form">
            <Form.Control
                type="text"
                placeholder="Username"
                aria-label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <Form.Control
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button variant="primary" type="submit" onClick={handleSubmit}>Login</Button>
        </Form >
    );
}

LoginView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired
}