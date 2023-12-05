import './App.css';
import React, { useState, useEffect } from 'react';
import * as d3 from "d3";
import ToggleButton from '@mui/material/ToggleButton';

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { NobelsPerCountry } from './components/NobelsPerCountry';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlagIcon from '@mui/icons-material/Flag';
import SchoolIcon from '@mui/icons-material/School';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WcIcon from '@mui/icons-material/Wc';
import { NobelsByAge } from './components/NobelsByAge';
import { NobelsByGender } from './components/NobelsByGender';
import { NobelsPerAffiliation } from './components/NobelsPerAffiliation';

export const NOBEL_CATEGORIES = ["Peace", "Literature", "Chemistry", "Economic Sciences", "Physics", "Physiology or Medicine"];
const chartOptions = [
  { label: "Flag", value: "country", icon: <FlagIcon /> },
  { label: "Age", value: "age", icon: <DateRangeIcon /> },
  { label: "Affiliation", value: "affiliation", icon: <SchoolIcon /> },
  { label: "Gender", value: "gender", icon: <WcIcon /> },
]

function App() {
  const [complete, setComplete] = useState(null);
  const [awards, setAwards] = useState(null);
  const [laureates, setLaureates] = useState(null);
  const [chartOption, setChartOption] = useState('country');
  useEffect(() => {
    d3.csv("complete.csv").then(data => setComplete(data))
    d3.json("json_award.json").then(awards => setAwards(awards))
    d3.json("json_laureates.json").then(laureates => setLaureates(laureates))
  }, [])
  console.log(complete?.filter(({ fullName }) => !fullName.length))
  // TODO: Add loading stage.
  return (
    <div className="app-container">
      <ToggleButtonGroup
        value={chartOption}
        exclusive
        onChange={(_, chartOption) => setChartOption(chartOption)}
        aria-label="chart option"
      >
        {chartOptions.map(({ value, label, icon }) =>
          <ToggleButton value={value} key={value}>
            {icon}
          </ToggleButton>
        )}
      </ToggleButtonGroup>
      {complete && chartOption === "country" && <NobelsPerCountry completeData={complete} />}
      {complete && chartOption === "age" && <NobelsByAge completeData={complete} />}
      {complete && chartOption === "gender" && <NobelsByGender completeData={complete} />}
      {complete && chartOption === "affiliation" && <NobelsPerAffiliation completeData={complete} />}
    </div>
  );
}

export default App;
