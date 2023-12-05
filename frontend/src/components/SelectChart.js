import './SelectChart.css';
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { chartOptions } from '../App';

export const SelectChart = ({ chartOption, setChartOption }) => {
    return (
        <Paper className='bottom-navigation-paper' elevation={3}>
            <BottomNavigation
                className='bottom-navigation'
                showLabels
                value={chartOption}
                onChange={(_, newChartOption) =>
                    setChartOption(newChartOption)
                }
            >
                {chartOptions.map(({ value, label, icon }) =>
                    <BottomNavigationAction icon={icon} label={label} value={value} key={value}>
                    </BottomNavigationAction>
                )}
            </BottomNavigation>
        </Paper >
    );
}

