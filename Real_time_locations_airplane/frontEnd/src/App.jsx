import React from 'react';
import Map from './Map.jsx';
import Login from "./Login-Signup/Login.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Signup from "./Login-Signup/Signup.jsx";

const App = () => {

    return (
        <BrowserRouter >
            <Routes>
                <Route path='/' element={<Login/>}></Route>
                <Route path='/Signup' element={<Signup/>}></Route>
                <Route path='/Map' element={<Map/>}></Route>
            </Routes>
        </BrowserRouter>
    );
};
export default App;