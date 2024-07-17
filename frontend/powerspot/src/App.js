import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import ProfileSetup from './pages/ProfileSetup/ProfileSetup';
import PrivateRoute from './components/AuthContext/PrivateRoute';
import { AuthProvider } from './components/AuthContext/AuthContext';
import Login from './components/Login/Login'; // Ensure you have this component
import Features from './pages/Features/Features';
import Footer from './components/Footer/Footer';
import About from './pages/About/About';
import Loading from './pages/Loading/Loading';


function App() {
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200)
  }, [])

  if (isLoading) {
    return <Loading />
  }


  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
