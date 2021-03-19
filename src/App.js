import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import FlightSearch from './components/FlightSearch';

function App() {
  return (
    <div className="App">
      <Header title="Flight Search"></Header>
      <FlightSearch></FlightSearch>
      <Footer title="2021 || Made with &#x2665; in Ithaca"></Footer>
    </div>
  );
}

export default App;