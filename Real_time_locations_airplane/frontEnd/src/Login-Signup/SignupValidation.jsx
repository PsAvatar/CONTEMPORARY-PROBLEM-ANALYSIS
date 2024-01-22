// Importing the axios library for making HTTP requests
import axios from 'axios';

// Asynchronous function to check if an email exists in the database
async function checkEmailInDatabase(email) {
    try {
        // Sending a POST request to the server endpoint for email checking
        const response = await axios.post('http://localhost:3000/check-email', { email });

        // Log the server response for debugging
        console.log('Server Response:', response);

        // Return whether the email exists in the database based on the server response
        return response.data.exists;
    } catch (error) {
        // Handle errors during the HTTP request or processing of the response
        console.error('Error checking email in database', error);

        // Rethrow the error for higher-level error handling
        throw error;
    }
}

// Asynchronous function for validating form input values
async function Validation(values) {
    // Object to store validation errors
    let error = {};

    // Regular expression patterns for email and password validation
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    // Validation for the 'name' field
    if (values.name === "") {
        error.name = "Name should not be empty";
    } else {
        error.name = "";
    }

    // Validation for the 'email' field
    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Invalid email format";
    } else {
        // Check if the email ends with "@gmail.com"
        if (!values.email.endsWith("@gmail.com")) {
            error.email = "Email must end with @gmail.com";
        } else {
            try {
                // Check if the email already exists in the database
                const emailExists = await checkEmailInDatabase(values.email);

                if (emailExists) {
                    error.email = "Email already exists in the database";
                } else {
                    error.email = "";
                }
            } catch (error) {
                // Handle errors from the checkEmailInDatabase function
                console.error('Error in email validation:', error);
                error.email = "Error checking email existence";
            }
        }
    }

    // Validation for the 'password' field
    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password requires at least one digit, one lowercase letter, one uppercase letter, and a minimum length of 8 characters";
    } else {
        error.password = "";
    }

    // Return the validation error object
    return error;
}

// Exporting the Validation function as the default export
export default Validation;
