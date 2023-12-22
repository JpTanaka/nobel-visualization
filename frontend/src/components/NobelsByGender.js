import { NOBEL_CATEGORIES } from "../App";
import { ResponsiveWaffle } from '@nivo/waffle'
import { ResponsiveBar } from '@nivo/bar'
import { Select, MenuItem } from "@mui/material";
// import { ResponsiveSwarmPlot } from '@nivo/swarmplot'
import { useMemo, useState } from "react";
import "./NobelsByGender.css"

import { SelectCategory } from "./SelectCategory";
import { calculateAge } from "../utils";

const getChartData = (completeData) => {
    /**
   * This function format the data from complete.csv.
   *
   * @param  completeData - data from complete.csv.
   * @returns array of objects having the name of the category, the year of
   * the prize and the name and age of the awarded.
   */
    if (!completeData) return;
    return completeData.map((award, index) => ({
        id: index,
        group: award.gender,
        name: award.fullName,
        age: calculateAge(award.birth_date, award.dateAwarded, award.awardYear),
        year: parseInt(award.awardYear),
        category: award.category,
    }))
}

export const NobelsByGender = ({ completeData }) => {
    const [selectedCategories, setSelectedCategories] = useState(
        Object.fromEntries(NOBEL_CATEGORIES.map(category => [category, true]))
    );
    const [graphType, setGraphType] = useState("waffle");
    const chartData = getChartData(completeData)
    
    const filteredData = useMemo(() => {
            return chartData
                .filter(({ category }) => selectedCategories[category])
        },
        [selectedCategories, chartData]
    );

    const aggregatedData = useMemo(() => {
        return filteredData.reduce((acc, { group }) => {
            if (!acc.length) {
                acc = [
                    {
                        id: "female",
                        value: 0,
                        label: "Female",
                    },
                    {
                        id: "male",
                        value: 0,
                        label: "Male",
                    },
                ]
            }

            if (group === "male")
                acc[1].value += 1
            else
                acc[0].value += 1

            return acc
        }, [])
    }, [filteredData]);

    const aggregatedDataByCategory = useMemo(() => {
        const aggregations = filteredData.reduce((acc, { group, category }) => {
            if (!acc[category]) {
                acc[category] = {}
            }
            if (!acc[category][group]) {
                acc[category][group] = 0
            }
            acc[category][group] += 1
            return acc
        }, {})

        return [
            ...Object.entries(aggregations).map(([category, values]) => ({
                group: category,
                ...values
            }))
        ]
    }, [filteredData]);

    const graphs = {
        waffle: <ResponsiveWaffle
            data={aggregatedData}
            total={aggregatedData.reduce((acc, { value }) => acc + value, 0)}
            rows={aggregatedData.reduce((acc, { value }) => acc + value, 0) / 25}
            columns={25}
            padding={1}
            valueFormat=".2f"
            margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
            colors={{ scheme: 'nivo' }}
            borderRadius={3}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.3
                    ]
                ]
            }}
            emptyOpacity={0}
            motionStagger={2}
            legends={[
                {
                    anchor: 'top-left',
                    direction: 'column',
                    justify: false,
                    translateX: -100,
                    translateY: 0,
                    itemsSpacing: 4,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    itemTextColor: '#000000',
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000',
                                itemBackground: '#f7fafb'
                            }
                        }
                    ]
                }
            ]}
        />,
        bar: <ResponsiveBar
            data={aggregatedDataByCategory}
            keys={["male", "female"]}
            indexBy="group"
            height={500}
            width={800}
            margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
            groupMode="stacked"
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}

            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 10,
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Number of Nobel Prizes',
                legendPosition: 'middle',
                legendOffset: -40,
                truncateTickAt: 0
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
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
            tooltip={(
                node
            ) => <div style={{
                color: node.color,
                background: '#333',
                padding: '12px 16px'
            }}>
                    <strong>
                        {node.id.charAt(0).toUpperCase() + node.id.slice(1)}
                    </strong>
                    <br />
                    {node.value} awards
                </div>}
            ariaLabel="Nobel Affiliation bar chart"
        />
    }
    return (
        <div className="outer-container">
            <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div className="chart-container">
                {graphs[graphType]}
            </div>
            <Select
                value={graphType}
                label="Graph Type"
                onChange={(event) => setGraphType(event.target.value)}
                className="graph-selector"
            >
                <MenuItem value={"waffle"}>Gender Ratio</MenuItem>
                <MenuItem value={"bar"}>Stacked Bar</MenuItem>
            </Select>
        </div>
    );
}