import { NOBEL_CATEGORIES } from "../App";
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { ResponsiveBoxPlot } from '@nivo/boxplot'
import { Select, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import "./NobelsByAge.css"

import { SelectCategory } from "./SelectCategory"
import { calculateAge } from "../utils";
import { max, min } from "d3";



const getChartData = (completeData) => {
    /**
   * This function format the data from complete.csv.
   *
   * @param  completeData - data from complete.csv.
   * @returns array of objects having the name of the category, the year of
   * the prize and the name and age of the awarded.
   */
    if (!completeData) return;
    const awardByCategory = Object.groupBy(completeData, ({ category }) => category)
    const scatterPlotData = Object.entries(awardByCategory).map(([category, awards]) =>
    ({
        id: category, data: awards.map(award =>
        ({
            x: award.awardYear,
            y: calculateAge(award.birth_date, award.dateAwarded, award.awardYear),
            name: award.fullName
        })).filter(dataPoint => dataPoint.y)
    }
    ))
    return scatterPlotData
}

export const NobelsByAge = ({ completeData }) => {
    const [selectedCategories, setSelectedCategories] = useState(Object.fromEntries(NOBEL_CATEGORIES.map(category => [category, true])))
    const chartData = getChartData(completeData)
    const [graphType, setGraphType] = useState("scatter");

    const filteredData = useMemo(() => {
        return chartData.filter((dataPoint) => selectedCategories[dataPoint.id])
    }, [selectedCategories, chartData]);

    const flattenedData = useMemo(() => {
        return filteredData.reduce((acc, { id, data }) => {
            return [...acc, ...data.map((point) => ({ ...point, group: id }))];
        }, [])
    }, [filteredData]);

    const graphs = {
        scatter: <ResponsiveScatterPlot
            data={filteredData}
            height={500}
            width={800}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: 'linear', min: "auto", max: 'auto' }}
            yScale={{ type: 'linear', min: "auto", max: 'auto' }}
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Year of the award',
                legendPosition: 'middle',
                legendOffset: 46
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Age',
                legendPosition: 'middle',
                legendOffset: -60
            }}
            tooltip={({
                node
            }) => <div style={{
                color: node.color,
                background: '#333',
                padding: '12px 16px'
            }}>
                    <strong>
                        {node.serieId}
                    </strong>
                    <br />
                    {node.data.name}
                    <br />
                    {`Year of the award: ${node.formattedX}`}
                    <br />
                    {`Age: ${node.formattedY}`}
                </div>}

            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 130,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 12,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    symbolSize: 12,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />,
        box: <ResponsiveBoxPlot
            data={flattenedData}
            value="y"
            groupBy="group"
            margin={{ top: 60, right: 140, bottom: 60, left: 60 }}
            valueScale={{ type: 'linear', min: min(flattenedData, (datum) => datum.y), max: max(flattenedData, (datum) => datum.y) }}
            padding={0.2}
            axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 36
            }}
            axisRight={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 0
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Award Category',
                legendPosition: 'middle',
                legendOffset: 50
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Age',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            colors={{ scheme: 'nivo' }}
            borderRadius={2}
            borderWidth={2}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            medianWidth={2}
            medianColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            whiskerEndSize={0.6}
            whiskerColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            motionConfig="stiff"
            legends={[]}
        />
    }
    console.log(flattenedData)
    return (
        <div className="outer-container">
            {graphType !== "box" && <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />}
            <div className="chart-container">
                {graphs[graphType]}
            </div>
            <Select
                value={graphType}
                label="Graph Type"
                onChange={(event) => {
                    setGraphType(event.target.value)
                    if (event.target.value === "box") {
                        setSelectedCategories(Object.fromEntries(NOBEL_CATEGORIES.map(category => [category, true])))
                    }
                }}
                className="graph-selector"
            >
                <MenuItem value={"scatter"}>Scatter Plot</MenuItem>
                <MenuItem value={"box"}>Box Plot</MenuItem>
            </Select>
        </div>
    );
}