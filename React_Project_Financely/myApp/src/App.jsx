import React from 'react'
import Header from './components/Header'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Signup from './Pages/Signup'
import "./App.css"
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
    <ToastContainer/>
      <Router>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Routes>
</Router>
    </>
  )
}

export default App
