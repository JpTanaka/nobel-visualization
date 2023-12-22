import { NOBEL_CATEGORIES } from "../App";
import { ResponsiveWaffle } from '@nivo/waffle'
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
    const chartData = getChartData(completeData)
    
    const filteredData = useMemo(() => {
            return chartData
                .filter(({ category }) => selectedCategories[category])
        },
        [selectedCategories, chartData]
    );

    const aggregatedData = useMemo(() => {
        return filteredData.reduce((acc, { group, category }) => {
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

    console.log(aggregatedData)
    return (
        <div className="outer-container">
            <SelectCategory selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
            <div className="chart-container">
                <ResponsiveWaffle
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
                />
            </div>
        </div>
    );
}