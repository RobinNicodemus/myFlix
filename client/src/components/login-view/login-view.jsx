import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import { connect } from 'react-redux';
import { setProfile } from '../../actions/actions';
import { useDispatch } from 'react-redux';

import './login-view.scss';

export function LoginView(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://radiant-flix.herokuapp.com/login', {
            // axios.post('http://localhost:3000/login', {
            Username: username,
            Password: password
        })
            .then(response => {
                const data = response.data;
                props.onLoggedIn(data)
                dispatch({ type: 'SET_PROFILE', value: data.user })
            })
            .catch(e => {
                console.log(e)
            });
    };

    return (
        <Form inline className="login-form">
            <Form.Control
                id="loginFormBasicUsername"
                type="text"
                placeholder="Username"
                aria-label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <Form.Control
                id="loginFormBasicPassword"
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

export default connect(null, { setProfile })(LoginView);

LoginView.propTypes = {
    onLoggedIn: PropTypes.func.isRequired
}