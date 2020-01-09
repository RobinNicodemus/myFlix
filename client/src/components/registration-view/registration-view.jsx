import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './registration-view.scss';

export function RegistrationView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password)
        //send req to server for authentication then call props.onLoggedIn(username)
        props.onLoggedIn(username);
    };

    return (
        <Form className="registration-card">
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" aria-label="Username" placeholder="..." value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>E-mail:</Form.Label>
                <Form.Control type="email" aria-label="Email" placeholder="..." value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" aria-label="Password" placeholder="..." value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit}>Register</Button>
        </Form>
    );
}

RegistrationView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired
}