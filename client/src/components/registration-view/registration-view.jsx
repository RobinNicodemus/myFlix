import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { connect } from 'react-redux';
import { setProfile } from '../../actions/actions';
import { useDispatch } from 'react-redux';

import './registration-view.scss';
import axios from 'axios';

export function RegistrationView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('')

    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();
        registerAndLogin();
    }

    const registerAndLogin = () => {
        axios.post('https://radiant-flix.herokuapp.com/users', {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        })
            .then(response => {
                const data = response.data;
                console.log(data);
                loginAfterRegister();
                // window.open('/', '_self'); //'_self' for: current tab
            })
            .catch(e => {
                console.log(e);
                alert('user already exists');
            })
    };

    const loginAfterRegister = () => {
        axios.post('https://radiant-flix.herokuapp.com/login', {
            // axios.post('http://localhost:3000/login', {
            Username: username,
            Password: password
        })
            .then(response => {
                const data = response.data;
                props.onLoggedIn(data);
                dispatch({ type: 'SET_PROFILE', value: data.user })
            })
            .catch(e => {
                console.log(e)
            });
    };

    return (
        <Form className="registration-card">
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control type="text"
                    aria-label="Username"
                    placeholder="Only letters and numbers"
                    value={username}
                    minLength="5"
                    pattern="[a-zA-Z0-9]+"
                    required
                    onChange={e => setUsername(e.target.value)} />
                <Form.Text className="text-muted">
                    Only numbers and letters. At least 5 characters.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password"
                    aria-label="Password"
                    placeholder="at least 6 characters"
                    value={password}
                    minLength="6"
                    required
                    onChange={e => setPassword(e.target.value)} />
                <Form.Text className="text-muted">
                    Must be at least 6 characters
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>E-mail:</Form.Label>
                <Form.Control type="email"
                    aria-label="Email"
                    placeholder="email@email.com"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formBasicDob">
                <Form.Label>Date of Birth:</Form.Label>
                <Form.Control type="date" aria-label="Birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit}>Register</Button>
        </Form>
    );
}

export default connect(null, { setProfile })(RegistrationView);

//
RegistrationView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired,
    setProfile: PropTypes.func.isRequired
};