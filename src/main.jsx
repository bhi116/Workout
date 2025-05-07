import {createRoot} from 'react-dom/client';
import React from 'react';
import App from './App.jsx'
import { HashRouter, Routes, Route } from 'react-router-dom';
import Customers from './components/Customers.jsx';
import Trainings from './components/Trainings.jsx';
import Error from './components/Error.jsx';
import Home from './components/Home.jsx';
import Calendar from './components/Calendar.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="customers" element={<Customers />} />
          <Route path="trainings" element={<Trainings />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
