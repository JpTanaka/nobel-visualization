import { NOBEL_CATEGORIES } from "../App";
import { ResponsiveBar } from '@nivo/bar'
import { useMemo, useState } from "react";
import Button from '@mui/material/Button';

import "./NobelsPerAffiliation.css"

import { SelectCategory } from "./SelectCategory";

// TODO: try to optimize when the selectedCategories change.
const getChartData = (completeData) => {
    /**
   * This function format the data from complete.csv.
   *
   * @param  completeData - data from complete.csv.
   * @returns array of objects having the name of the category, the year of
   * the prize and the name and age of the awarded.
   */
    if (!completeData) return;
    const dataByAffiliation = Object.groupBy(completeData, ({ affiliation_1 }) => affiliation_1);
    return Object.entries(dataByAffiliation).map(([affiliation, awards], index) => {
        const data = {
            name: affiliation.length ? affiliation : "No Affiliation",
            totalAwards: awards.length,
            awardeds: awards.map(award => award.fullName)
        }
        Object.entries(Object.groupBy(awards, ({ category }) => category))
            .forEach(([category, awardsInCategory], idx) => {
                data[category] = awardsInCategory.length;
                data[category + "Awardeds"] = awardsInCategory.map(award => award.fullName)
            }
            )
        return data
    })
}

export const NobelsPerAffiliation = ({ completeData }) => {
    const [selectedCategories, setSelectedCategories] = useState(
        Object.fromEntries(NOBEL_CATEGORIES.map(category => [category, true]))
    );
    const [removeNoAffiliation, setRemoveNoAffiliation] = useState(false)

    const chartData = getChartData(completeData);

    const filteredData = useMemo(() => {
        const filteredDataWithAffiliation = chartData.map(data => {
            const filtered = { name: data.name, awardeds: data.awardeds }
            let totalAwards = 0;
            Object.entries(selectedCategories).forEach(([category, isSelected]) => {
                if (!isSelected) return;
                filtered[category] = data[category] || 0;
                filtered[category + "Awardeds"] = data[category + "Awardeds"] || [];
                totalAwards += data[category] || 0
            })
            filtered.totalAwards = totalAwards
            return filtered;
        }).sort((a, b) => - a.totalAwards + b.totalAwards).slice(0, 11)
        if (removeNoAffiliation) {
            return filteredDataWithAffiliation.filter(({ name }) => name !== "No Affiliation")
        }
        return filteredDataWithAffiliation.slice(0, 10)
    }, [selectedCategories, chartData, removeNoAffiliation]);
    return (
        <div className="outer-container">
            <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div className="line-chart-container">
                <ResponsiveBar
                    data={filteredData}
                    keys={NOBEL_CATEGORIES}
                    indexBy="name"
                    margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
                    groupMode="grouped"
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
                                {node.id}
                            </strong>
                            <br />
                            <strong>
                                List of Awardeds(Maximum of 10)
                            </strong>
                            {(node.data[node.id + "Awardeds"] ?? []).slice(0, 10).map(awarded => <><br />{awarded}</>)}
                        </div>}
                    ariaLabel="Nobel Affiliation bar chart"
                />
                <div className="button-container" >
                    <Button variant="outlined" onClick={() => setRemoveNoAffiliation(value => !value)} size="small" className="toggle-button">Toggle No Affiliation</Button>

                </div>
            </div>
        </div>
    );
}