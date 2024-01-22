import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation.jsx';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import airplane from './GettyImages-489523492.jpg';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    const handLeInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handLeSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = await Validation(values);
        setErrors(validationErrors);

        // Check if there are any errors in the validationErrors object
        if (Object.values(validationErrors).every((error) => error === '')) {
            axios
                .post('http://localhost:3000/signup', values)
                .then((res) => {
                    navigate('/');
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className="container-fluid" style={{ backgroundColor: '#f0f0f0', height: '100vh' }}>
            <div className="row justify-content-center align-items-center" style={{ height: '100%' }}>
                <div className="card col-md-3">
                    <div className="text-center" style={{marginTop: "3%"}}>
                        <img src={airplane} alt="Your Image" className="img-fluid" />
                    </div>
                    <div className="card-body">
                        <h1>Sign-Up</h1>
                        <form action="" onSubmit={handLeSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    <strong>Name</strong>
                                </label>
                                <input
                                    type="name"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Enter Name"
                                    name="name"
                                    onChange={handLeInput}
                                />
                                {errors.name && <div className="invalid-feedback"> {errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    <strong>Email</strong>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter Email"
                                    name="email"
                                    onChange={handLeInput}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    <strong>Password</strong>
                                </label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter Password"
                                    name="password"
                                    onChange={handLeInput}
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Sign up
                            </button>
                            <p>You agree to our terms and policies</p>
                            <Link to="/">Login</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
