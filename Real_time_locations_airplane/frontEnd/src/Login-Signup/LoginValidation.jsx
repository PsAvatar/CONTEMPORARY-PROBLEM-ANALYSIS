// Function for validating email and password
function Validation(values){
    let error ={}
    const email_pattern = /^[^s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.email === ""){
        error.email = ""
    }
    else if(!email_pattern.test(values.email)){
        error.email =""
    }else {
        error.email =""
    }

    if(values.password === ""){
        error.password = ""
    }
    else if(!password_pattern.test(values.password)){
        error.password =""
    }else {
        error.password =""
    }
    return error;

}

export default Validation;