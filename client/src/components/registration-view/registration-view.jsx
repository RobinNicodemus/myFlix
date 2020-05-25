import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { connect } from 'react-redux';
import { setUser } from '../../actions/actions';


import './registration-view.scss';
import axios from 'axios';

export function RegistrationView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('')

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post('https://radiant-flix.herokuapp.com/users', {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        })
            .then(response => {
                const data = response.data;
                console.log(data);
                window.open('/', '_self'); //'_self' for: current tab
            })
            .catch(e => {
                console.log('error registering the user')
            })
    };

    return (
        <Form className="registration-card">
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text" aria-label="Username" placeholder="Only letters and numbers" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" aria-label="Password" placeholder="at least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>E-mail:</Form.Label>
                <Form.Control type="email" aria-label="Email" placeholder="email@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicDob">
                <Form.Label>Date of Birth:</Form.Label>
                <Form.Control type="date" aria-label="Birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleRegister}>Register</Button>
        </Form>
    );
}
