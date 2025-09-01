import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import Dashboard2 from '../src/components/Dashboard/Dashboard2';
import IncidentForm from './components/IncidentForm';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
          }}
        />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard2" element={<Dashboard2 />} />
            <Route path="/add-incident" element={<IncidentForm />} />
          </Routes>
        </main>
   
    </Router>
  );
};

export default App;