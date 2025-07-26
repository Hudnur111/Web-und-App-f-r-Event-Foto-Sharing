import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateEvent from './components/CreateEvent';
import EventDashboard from './components/EventDashboard';
import UploadPage from './components/UploadPage';
import GalleryPage from './components/GalleryPage';
import { EventProvider } from './context/EventContext';

function App() {
  return (
    <EventProvider>
      <Router>
        <div className="min-h-screen bg-black text-white font-mono">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/event/:eventId" element={<EventDashboard />} />
            <Route path="/upload/:eventId" element={<UploadPage />} />
            <Route path="/gallery/:eventId" element={<GalleryPage />} />
          </Routes>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;