import React, { JSX } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LogInPage from './pages/login';
import HomePage from './pages/home';

const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path='/login' element={<LogInPage />} />
      <Route path='/' element={<HomePage />} />
    </Routes>
  );
};

export default App;
