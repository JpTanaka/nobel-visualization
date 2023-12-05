import { NOBEL_CATEGORIES } from "../App";
import { ResponsiveSwarmPlot, ResponsiveSwarmPlotCanvas } from '@nivo/swarmplot'
import { useCallback, useMemo, useState } from "react";
import moment from "moment";

import "./NobelsByGender.css"

import { SelectCategory } from "./SelectCategory";

const calculateAge = (birthDate, awardDate, awardYear) => {
    return awardDate.length ? moment(awardDate).diff(moment(birthDate), "years") : parseInt(awardYear) - parseInt(birthDate.slice(0, 4));
}

// TODO: try to optimize when the selectedCategories change.
const getScatterPlotData = (completeData) => {
    /**
   * This function format the data from complete.csv.
   *
   * @param  completeData - data from complete.csv.
   * @returns array of objects having the name of the category, the year of
   * the prize and the name and age of the awarded.
   */
    if (!completeData) return;
    const scatterPlotData = completeData.map((award, index) => ({
        id: index,
        group: award.gender,
        name: award.fullName,
        age: calculateAge(award.birth_date, award.dateAwarded, award.awardYear),
        year: parseInt(award.awardYear),
        category: award.category,
    }))
    return scatterPlotData
}

export const NobelsByGender = ({ completeData }) => {
    const [selectedCategories, setSelectedCategories] = useState(
        Object.fromEntries(NOBEL_CATEGORIES.map(category => [category, true]))
    );

    const getScatterPlotDataMemoized = useCallback(
        data => getScatterPlotData(data),
        []
    );

    const filteredData = useMemo(() => {
        const scatterPlotData = getScatterPlotDataMemoized(completeData);
        const filteredData = scatterPlotData.filter(({ category }) => selectedCategories[category]);
        return filteredData;
    }, [selectedCategories, completeData, getScatterPlotDataMemoized]);
    return (
        <div className="outer-container">
            <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div className="line-chart-container">
                <ResponsiveSwarmPlot
                    data={filteredData}
                    groups={['male', 'female']}
                    identity="id"
                    value="year"
                    valueScale={{ type: 'linear', min: 1898, max: 2025, reverse: false }}
                    forceStrength={2}
                    simulationIterations={80}
                    colorBy={(
                        node
                    ) =>
                        node.data.category}
                    margin={{ top: 50, right: 100, bottom: 80, left: 100 }}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 10,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Gender',
                        legendPosition: 'middle',
                        legendOffset: 46
                    }}
                    tooltip={(
                        node
                    ) => <div style={{
                        color: node.color,
                        background: '#333',
                        padding: '12px 16px'
                    }}>
                            <strong>
                                {node.data.name}
                                <br />
                                {node.data.category} - {node.data.year}
                            </strong>
                        </div>}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 10,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Year of the award',
                        legendPosition: 'middle',
                        legendOffset: -76
                    }}
                // motionConfig="default"
                />
            </div>
        </div>
    );
}