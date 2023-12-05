import { NOBEL_CATEGORIES } from "../App";
import { useMemo, useState } from "react";
import "./NobelsPerCountry.css";
import { SelectCategory } from "./SelectCategory";
import { ResponsiveBar } from "@nivo/bar";

const getChartData = (completeData) => {
    /**
   * This function format the data from complete.csv.
   *
   * @param  completeData - data from complete.csv.
   * @returns array of objects having the name of the category and 
   * the distribution per country of nobels.
   */
    const dataByCountry = Object.groupBy(completeData, ({ ind_or_org, birth_country, org_founded_country }) => ind_or_org === "Individual" ? birth_country : org_founded_country);
    return Object.entries(dataByCountry).map(([country, awards], index) => {
        const data = {
            name: country.length ? country : "No Birth Country",
            totalAwards: awards.length,
            awardeds: awards.map(award => award.name)
        }
        Object.entries(Object.groupBy(awards, ({ category }) => category))
            .forEach(([category, awardsInCategory], idx) => {
                data[category] = awardsInCategory.length;
                data[category + "Awardeds"] = awardsInCategory.map(award => award.name)
            }
            )
        return data
    })
}

export const NobelsPerCountry = ({ completeData }) => {
    const [selectedCategories, setSelectedCategories] = useState(
        Object.fromEntries(NOBEL_CATEGORIES.map(category => [category, true]))
    );
    const chartData = getChartData(completeData, selectedCategories)
    const numberOfCountries = 10;
    const filteredData = useMemo(() => {
        return chartData.map(data => {
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
        }).sort((a, b) => - a.totalAwards + b.totalAwards).slice(0, numberOfCountries)
    }, [selectedCategories, chartData]);
    return (
        <div className="outer-container">
            <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div className="chart-container">
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
            </div>
        </div>
    );
}