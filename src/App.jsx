import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Splash from './pages/Splash'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FarmerPanel from './pages/FarmerPanel'
import BuyerPanel from './pages/BuyerPanel'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/farmer-panel" element={<FarmerPanel />} />
        <Route path="/buyer-panel" element={<BuyerPanel />} />
      </Routes>
    </Router>
  )
}

export default App
