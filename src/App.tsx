import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import MainPage from "./pages/MainPage";

function App() {
    return (
        <div style={{padding: 0}}>
            <Routes>
                <Route element={<SplashPage/>} path="/"/>
                <Route element={<LoginPage/>} path="/login"/>
                <Route element={<MainPage/>} path="/main"/>
            </Routes>

            <ToastContainer autoClose={3000} hideProgressBar={false}/>
        </div>
    );
}


export default App;
