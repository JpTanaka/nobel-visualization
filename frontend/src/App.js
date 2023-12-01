import './App.css';
import React, { useState, useEffect } from 'react';
import * as d3 from "d3";


function App() {
  const [complete, setComplete] = useState(null);
  const [awards, setAwards] = useState(null);
  const [laureates, setLaureates] = useState(null);
  useEffect(() => {
    d3.csv("complete.csv").then(data => setComplete(data))
    d3.json("json_award.json").then(awards => setAwards(awards))
    d3.json("json_laureates.json").then(laureates => setLaureates(laureates))
  }, [])
  return (
    <div className="App">
      {JSON.stringify(complete)}
    </div>
  );
}

export default App;
