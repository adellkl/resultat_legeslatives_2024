import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChartPage from './components/ChartPage';
import HomePage from './components/HomePage';

const App = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('/results.json')
      .then(response => response.json())
      .then(data => setResults(data));
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chart" element={<ChartPage data={results} />} />
      </Routes>
    </Router>
  );
}

export default App;
