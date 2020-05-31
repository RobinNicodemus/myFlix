import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './update-view.scss';


export function UpdateView(props) {
	const { userData } = props

	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [birthday, setBirthday] = useState('');

	const [passwordCheck, setPasswordCheck] = useState('');

	const handleUpdate = (e) => {
		e.preventDefault();
		if (!password) {
			alert("password necessary");
		} if (password !== passwordCheck) {
			alert("the passwords do not match")
		} else {
			patchUser(localStorage.getItem('token'));
		}
	}

	const ifUpdated = (newData, oldData) => {
		if (!newData) {
			return oldData;
		} return newData;
	}


	const patchUser = (token) => {
		axios.patch(`https://radiant-flix.herokuapp.com/users/${userData.Username}`, {
			Username: userData.Username,
			Password: password,
			Email: ifUpdated(email, userData.Email),
			Birthday: ifUpdated(birthday, userData.Birthday)
		}, {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(response => {
				const newUserData = response.data;
				console.log(newUserData);
				window.open(`/client/users/${userData.Username}`, '_self'); //'_self' for: current tab
			})
			.catch(function (err) {
				console.log(err);
			});
	}
	return (
		<Form className="profile-form-view update-card">
			<Form.Group controlId="formBasicEmail">
				<Form.Label>Change e-mail:</Form.Label>
				<Form.Control size="sm" type="email" aria-label="Email"
					placeholder="email@email.com"
					value={email}
					onChange={e => setEmail(e.target.value)} />
				<Form.Text className="text-muted">
					optional
    </Form.Text>
			</Form.Group>
			<Form.Group controlId="formBasicDob">
				<Form.Label>Change birthday:</Form.Label>
				<Form.Control size="sm" type="date" aria-label="Birthday"
					value={birthday}
					onChange={e => setBirthday(e.target.value)} />
				<Form.Text className="text-muted">
					optional
    </Form.Text>
			</Form.Group>
			<Form.Group controlId="formBasicPassword">
				<Form.Label>New (or old) password:</Form.Label>
				<Form.Control size="sm" type="password" aria-label="Password"
					placeholder="at least 6 characters"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required />
			</Form.Group>
			<Form.Group controlId="formBasicPassword">
				<Form.Label>Confirm password:</Form.Label>
				<Form.Control size="sm" type="password" aria-label="Password"
					placeholder="repeat"
					value={passwordCheck}
					onChange={e => setPasswordCheck(e.target.value)}
					required />
			</Form.Group>
			<Button variant="primary" type="submit" onClick={handleUpdate}>Send</Button>
		</Form>

	);
}

UpdateView.propTypes = {
	userData: PropTypes.shape({
		Username: PropTypes.string.isRequired,
		Email: PropTypes.string,
		Birthday: PropTypes.string
	}).isRequired
}