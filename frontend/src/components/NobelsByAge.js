import { NOBEL_CATEGORIES } from "../App";
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import { useMemo, useState } from "react";
import "./NobelsByAge.css"

import { SelectCategory } from "./SelectCategory"
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

    const filteredData = useMemo(() => {
        return chartData.filter((dataPoint) => selectedCategories[dataPoint.id])
    }, [selectedCategories, chartData]);
    return (
        <div className="outer-container">
            <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div className="chart-container">
                {/* Slow update, see: https://github.com/plouc/nivo/issues/1740 */}
                <ResponsiveScatterPlot
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
                />
            </div>
        </div>
    );
}