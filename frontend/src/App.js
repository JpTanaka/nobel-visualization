import './App.css';
import React, { useState, useEffect } from 'react';
import * as d3 from "d3";

import { NobelsPerCountry } from './components/NobelsPerCountry';
import FlagIcon from '@mui/icons-material/Flag';
import SchoolIcon from '@mui/icons-material/School';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CircularProgress from '@mui/material/CircularProgress';
import WcIcon from '@mui/icons-material/Wc';
import { NobelsByAge } from './components/NobelsByAge';
import { NobelsByGender } from './components/NobelsByGender';
import { NobelsPerAffiliation } from './components/NobelsPerAffiliation';
import { SelectChart } from './components/SelectChart';

export const NOBEL_CATEGORIES = ["Peace", "Literature", "Chemistry", "Economic Sciences", "Physics", "Physiology or Medicine"];
export const chartOptions = [
  { label: "Country", value: "country", icon: <FlagIcon /> },
  { label: "Age", value: "age", icon: <DateRangeIcon /> },
  { label: "Affiliation", value: "affiliation", icon: <SchoolIcon /> },
  { label: "Gender", value: "gender", icon: <WcIcon /> },
]

const App = () => {
  const [complete, setComplete] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [awards, setAwards] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [laureates, setLaureates] = useState(null);
  const [chartOption, setChartOption] = useState('country');
  const displayedChart = {
    country: <NobelsPerCountry completeData={complete} />, age: <NobelsByAge completeData={complete} />, gender: <NobelsByGender completeData={complete} />
    , affiliation: <NobelsPerAffiliation completeData={complete} />
  }
  useEffect(() => {
    d3.csv("complete.csv").then(data => setComplete(data))
    d3.json("json_award.json").then(awards => setAwards(awards))
    d3.json("json_laureates.json").then(laureates => setLaureates(laureates))
  }, [])
  return (
    <div className="app-container">
      <div className="title-container">
        <p className='title'>
          Nobel Visualization
        </p>
      </div>
      <div className='separator' />
      {complete ? displayedChart[chartOption] :
        <div className='loading-chart-container'>
          <CircularProgress />
        </div>
      }
      <SelectChart chartOption={chartOption} setChartOption={setChartOption} />
    </div >
  );
}

export default App;
