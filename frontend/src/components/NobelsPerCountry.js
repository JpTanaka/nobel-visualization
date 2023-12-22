import { NOBEL_CATEGORIES } from "../App";
import { useMemo, useState } from "react";
import "./NobelsPerCountry.css";
import "../App.css"
import countries from "./world_countries.json";
import { SelectCategory } from "./SelectCategory";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveChoropleth } from '@nivo/geo'
import { Select, MenuItem } from "@mui/material";
import { max } from "d3";

const countryCodes = {
    "USA": "USA", // United States of America
    "Denmark": "DNK",
    "Israel": "ISR",
    "Lithuania": "LTU",
    "Pakistan": "PAK",
    "India": "IND",
    "Ethiopia": "ETH",
    "Germany": "DEU",
    "Argentina": "ARG",
    "Egypt": "EGY",
    "Japan": "JPN",
    "United Kingdom": "GBR",
    "New Zealand": "NZL",
    "Poland": "POL",
    "Algeria": "DZA",
    "Belgium": "BEL",
    "France": "FRA",
    "Switzerland": "CHE",
    "Zimbabwe": "ZWE",
    "Hungary": "HUN",
    "Australia": "AUS",
    "Russia": "RUS",
    "Mexico": "MEX",
    "Austria": "AUT",
    "Canada": "CAN",
    "South Africa": "ZAF",
    "Sweden": "SWE",
    "Scotland": "GBR", // Part of the United Kingdom
    "Finland": "FIN",
    "Myanmar": "MMR",
    "Turkey": "TUR",
    "Venezuela": "VEN",
    "the Netherlands": "NLD",
    "Czech Republic": "CZE",
    "Northern Ireland": "GBR", // Part of the United Kingdom
    "Norway": "NOR",
    "Italy": "ITA",
    "Spain": "ESP",
    "East Timor": "TLS",
    "South Korea": "KOR",
    "China": "CHN",
    "Cyprus": "CYP",
    "Madagascar": "MDG",
    "Democratic Republic of the Congo": "COD",
    "Saint Lucia": "LCA",
    "Iran": "IRN",
    "Portugal": "PRT",
    "Bulgaria": "BGR",
    "Romania": "ROU",
    "Liberia": "LBR",
    "Ireland": "IRL",
    "Slovenia": "SVN",
    "Colombia": "COL",
    "Luxembourg": "LUX",
    "Chile": "CHL",
    "Iceland": "ISL",
    "Ukraine": "UKR",
    "Bosnia and Herzegovina": "BIH",
    "Ghana": "GHA",
    "Vietnam": "VNM",
    "Croatia": "HRV",
    "Azerbaijan": "AZE",
    "Peru": "PER",
    "Belarus": "BLR",
    "Guatemala": "GTM",
    "North Macedonia": "MKD",
    "Bangladesh": "BGD",
    "Iraq": "IRQ",
    "Faroe Islands (Denmark)": "DNK", // Part of Denmark
    "Greece": "GRC",
    "Costa Rica": "CRI",
    "Brazil": "BRA",
    "Slovakia": "SVK",
    "Guadeloupe Island": "GLP", // Overseas region of France
    "Morocco": "MAR",
    "Yemen": "YEM",
    "Trinidad and Tobago": "TTO",
    "Kenya": "KEN",
    "Latvia": "LVA",
    "Indonesia": "IDN",
    "Nigeria": "NGA",
    "Taiwan": "TWN", // Officially known as Republic of China (ROC)
    "No Birth Country": "USA",
};


const getChartData = (completeData) => {
    /**
   * This function format the data from complete.csv.
   *
   * @param  completeData - data from complete.csv.
   * @returns array of objects having the name of the category and 
   * the distribution per country of nobels.
   */
    const dataByCountry = Object.groupBy(completeData, ({ ind_or_org, birth_countryNow, org_founded_country }) => ind_or_org === "Individual" ? birth_countryNow : org_founded_country);
    return Object.entries(dataByCountry).map(([country, awards], index) => {
        const data = {
            name: country.length ? country : "No Birth Country",
            id: countryCodes[country],
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
    const [graphType, setGraphType] = useState("bar");
    const chartData = getChartData(completeData, selectedCategories)
    const numberOfCountries = 10;
    const filteredData = useMemo(() => {
        const filtered = chartData.map(data => {
            const filtered = { name: data.name, awardeds: data.awardeds, id: data.id }
            let totalAwards = 0;
            Object.entries(selectedCategories).forEach(([category, isSelected]) => {
                if (!isSelected) return;
                filtered[category] = data[category] || 0;
                filtered[category + "Awardeds"] = data[category + "Awardeds"] || [];
                totalAwards += data[category] || 0
            })
            filtered.totalAwards = totalAwards
            return filtered;
        })
        if (graphType !== "bar") return filtered;
        return filtered.sort((a, b) => - a.totalAwards + b.totalAwards).slice(0, numberOfCountries)
    }, [selectedCategories, chartData, graphType]);

    const graphs = {
        choropleth: <ResponsiveChoropleth
            data={filteredData}
            label="code"
            value="totalAwards"
            height={500}
            width={800}
            domain={[0, max(filteredData, d => d.totalAwards)]}
            features={countries.features}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors="YlGnBu"
            unknownColor="#feffd9"
            valueFormat=".2s"
            projectionType="mercator"
            projectionTranslation={[0.5, 0.5]}
            projectionRotation={[0, 0, 0]}
            enableGraticule={true}
            graticuleLineColor="#dddddd"
            borderWidth={0.5}
            borderColor="#152538"
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
                },
                {
                    id: 'gradient',
                    type: 'linearGradient',
                    colors: [
                        {
                            offset: 0,
                            color: '#000'
                        },
                        {
                            offset: 100,
                            color: 'inherit'
                        }
                    ]
                }
            ]}
            tooltip={(data, color) => (
                <div
                  style={{
                    padding: 12,
                    color,
                    background: "#ffffff"
                  }}
                >
                  <strong>
                    <span>{data.feature.properties.name}</span>
                  </strong>
                  <br />
                {data.feature.value ?? 0} awards
                </div>
              )}
              legends={[
                {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 30,
                    translateY: 0,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemsSpacing: 4,
                    symbolSize: 20,
                    itemDirection: 'left-to-right',
                    itemTextColor: '#777',
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
            data={filteredData}
            keys={NOBEL_CATEGORIES}
            indexBy="name"
            height={500}
            width={800}
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
                <MenuItem value={"bar"}>Bar Chart</MenuItem>
                <MenuItem value={"choropleth"}>Map View</MenuItem>
            </Select>
        </div>
    );
}