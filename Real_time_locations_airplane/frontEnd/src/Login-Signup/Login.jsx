// Importing necessary modules and components
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation.jsx'; // Assuming this is a validation utility
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import aeroplana from './GettyImages-489523492.jpg';

// Main Login component
function Login() {
    // State to manage form values
    const [values, setValues] = useState({
        email: '',
        password: '',
    });

    // React Router hook for navigation
    const navigate = useNavigate();

    // State to manage form validation errors
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message

    // Handling input changes in the form
    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    // Handling form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values)); // Using the validation utility

        // Checking if there are no validation errors
        if (!errors.email && !errors.password) {
            // Making a POST request to the login endpoint
            axios
                .post('http://localhost:3000/login', values)
                .then((res) => {
                    if (res.data === 'Success') {
                        // Saving user login status and email in sessionStorage
                        sessionStorage.setItem('loggedIn', 'true');
                        sessionStorage.setItem('userEmail', values.email);

                        // Navigating to the Map component upon successful login
                        navigate('/Map');
                    } else {
                        // Setting error message if login is unsuccessful
                        setErrorMessage('Incorrect email or password. Please try again.');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    // Setting error message for other errors during login
                    setErrorMessage('An error occurred. Please try again later.');
                });
        }
    };

    // Rendering the UI
    return (
        <div className="container-fluid" style={{ backgroundColor: '#f0f0f0', height: '100vh' }}>
            <div className="row justify-content-center align-items-center" style={{ height: '100%' }}>
                <div className="card col-md-3">
                    <div className="text-center" style={{ marginTop: '3%' }}>
                        <img src={aeroplana} alt="Your Image" className="img-fluid" />
                    </div>
                    <div className="card-body">
                        <h1 className="card-title">Login</h1>
                        <form action="" onSubmit={handleSubmit}>
                            {/* Email input field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    <strong>Email</strong>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter Email"
                                    name="email"
                                    onChange={handleInput}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            {/* Password input field */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    <strong>Password</strong>
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter Password"
                                    name="password"
                                    onChange={handleInput}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            {/* Submit button */}
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                            {/* Displaying error message if present */}
                            {errorMessage && <div className="alert alert-danger mt-2">{errorMessage}</div>}
                            <p>You agree to our terms and policies</p>
                            {/* Link to the signup page */}
                            <Link to="/signup">Sign up</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Exporting the Login component
export default Login;
