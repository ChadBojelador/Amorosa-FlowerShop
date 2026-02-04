import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/bouquets" element={<Shop />} />
            <Route path="/arrangements" element={<Shop />} />
            <Route path="/plants" element={<Shop />} />
            <Route path="/orchid" element={<Shop />} />
            <Route path="/events" element={<Shop />} />
            <Route path="/weddings" element={<Shop />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
