let selectedRegions = new Set();
let isInitialLoad = true;

// Fetch the columns from data.csv and populate the dropdown menu
d3.csv("data/data.csv").then(data => {
    const columns = data.columns;
    const excludeColumns = ['TractId', 'IncomeErr', 'IncomePerCapErr'];
    const filteredColumns = columns.filter(column => !excludeColumns.includes(column));
    const dropdown = d3.select("#columns");
    // Populate the dropdown menu with the filtered columns
    dropdown.selectAll("option")
        .data(filteredColumns)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});

let isHorizontal = false; //toggle orientation of bar chart

// Function to show chart options
function showChartOptions() {
    document.getElementById("chart-options").style.display = "block";
    document.getElementById("scatter-options").style.display = "none";
    
    // Show/hide toggle button based on selected chart type
    const dataType = d3.select("#dataType").property("value");
    const barChartTypes = ["states", "counties", "ethnicity", "gender"];
    document.getElementById("toggleOrientation").style.display = 
        barChartTypes.includes(dataType) ? "block" : "none";
    
    updateChart();
}

// Function to show scatter plot options
function showScatterOptions() {
    document.getElementById("chart-options").style.display = "none";
    document.getElementById("scatter-options").style.display = "block";
    document.getElementById("toggleOrientation").style.display = "none";
    
    // Set default values for scatter plot
    document.getElementById('xVariable').value = 'Income';
    document.getElementById('yVariable').value = 'Poverty';
    
    // Draw default scatter plot
    updateScatterPlot();
}

// Function to update the chart based on the selected data type
function updateChart() {
    const dataType = d3.select("#dataType").property("value");
    const regionSelector = document.getElementById('region-selector');
    const updateButton = document.getElementById('updateChartButton');
    const toggleButton = document.getElementById('toggleOrientation');

    // Show toggle button for bar chart types
    const barChartTypes = ["popStates", "popCounty", "incStates", "incCounty", "ethnicity", "gender"];
    toggleButton.style.display = barChartTypes.includes(dataType) ? "block" : "none";

    if (dataType === "popStates") {
        d3.csv("data/grouped_state.csv").then(data => {
            regionSelector.style.display = 'block';
            updateButton.style.display = 'block';
            
            // Only update checkboxes if it's the initial load
            if (isInitialLoad) {
                populateRegionCheckboxes(data, 'State');
            }
            
            // Filter data based on selected regions
            const filteredData = data.filter(d => selectedRegions.has(d.State));
            if (filteredData.length > 0) {
                drawBarChart(filteredData, "State", "TotalPop", {
                    title: "Population Distribution by State",
                    xLabel: "States",
                    yLabel: "Population"
                });
            } else {
                // Show message if no regions selected
                const svg = d3.select("#chart");
                svg.selectAll("*").remove();
                svg.append("text")
                    .attr("x", +svg.attr("width") / 2)
                    .attr("y", +svg.attr("height") / 2)
                    .attr("text-anchor", "middle");
            }
        }).catch(error => {
            console.error("Error loading the state data:", error);
        });
    } else if (dataType === "popCounty") {
        d3.csv("data/grouped_county.csv").then(data => {
            regionSelector.style.display = 'block';
            updateButton.style.display = 'block';
            
            // Only update checkboxes if it's the initial load
            if (isInitialLoad) {
                populateRegionCheckboxes(data, 'County');
            }
            
            // Filter data based on selected regions
            const filteredData = data.filter(d => selectedRegions.has(d.County));
            if (filteredData.length > 0) {
                drawBarChart(filteredData, "County", "TotalPop", {
                    title: "Population Distribution by County",
                    xLabel: "Counties",
                    yLabel: "Population"
                });
            } else {
                // Show message if no regions selected
                const svg = d3.select("#chart");
                svg.selectAll("*").remove();
                svg.append("text")
                    .attr("x", +svg.attr("width") / 2)
                    .attr("y", +svg.attr("height") / 2)
                    .attr("text-anchor", "middle")
                    .text("Please select at least one region to display data");
            }
        }).catch(error => {
            console.error("Error loading the county data:", error);
        });
    } else if (dataType === "incStates") {
        d3.csv("data/grouped_state.csv").then(data => {
            regionSelector.style.display = 'block';
            updateButton.style.display = 'block';
            
            // Only update checkboxes if it's the initial load
            if (isInitialLoad) {
                populateRegionCheckboxes(data, 'State');
            }
            
            // Filter data based on selected regions
            const filteredData = data.filter(d => selectedRegions.has(d.State));
            if (filteredData.length > 0) {
                drawBarChart(filteredData, "State", "Income", {
                    title: "Income Distribution by State",
                    xLabel: "States",
                    yLabel: "Income ($)",
                    valueFormat: value => `$${d3.format(",")(value)}`
                });
            } else {
                // Show message if no regions selected
                const svg = d3.select("#chart");
                svg.selectAll("*").remove();
                svg.append("text")
                    .attr("x", +svg.attr("width") / 2)
                    .attr("y", +svg.attr("height") / 2)
                    .attr("text-anchor", "middle")
                    .text("Please select at least one region to display data");
            }
        }).catch(error => {
            console.error("Error loading the county data:", error);
        });
    } else if (dataType === "incCounty") {
        d3.csv("data/grouped_county.csv").then(data => {
            regionSelector.style.display = 'block';
            updateButton.style.display = 'block';
            
            // Only update checkboxes if it's the initial load
            if (isInitialLoad) {
                populateRegionCheckboxes(data, 'County');
            }
            
            // Filter data based on selected regions
            const filteredData = data.filter(d => selectedRegions.has(d.County));
            if (filteredData.length > 0) {
                drawBarChart(filteredData, "County", "Income", {
                    title: "Income Distribution by County",
                    xLabel: "Counties",
                    yLabel: "Income ($)",
                    valueFormat: value => `$${d3.format(",")(value)}`
                });
            } else {
                // Show message if no regions selected
                const svg = d3.select("#chart");
                svg.selectAll("*").remove();
                svg.append("text")
                    .attr("x", +svg.attr("width") / 2)
                    .attr("y", +svg.attr("height") / 2)
                    .attr("text-anchor", "middle")
                    .text("Please select at least one region to display data");
            }
        }).catch(error => {
            console.error("Error loading the county data:", error);
        });
    }else if (dataType === "populationDistribution") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/data.csv").then(data => {
            drawHistogram(data, "TotalPop", 500, {
                title: "Population Distribution",
                xLabel: "Population Range",
                yLabel: "Frequency"
            });
        }).catch(error => {
            console.error("Error loading the population distribution data:", error);
        });
    }  else if (dataType === "incomeDistribution") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/data.csv").then(data => {
            drawHistogram(data, "Income", 5000, {
                title: "Income Distribution",
                xLabel: "Income ($)",
                yLabel: "Frequency",
                valueFormat: value => `$${d3.format(",")(value)}`
            });
        }).catch(error => {
            console.error("Error loading the income distribution data:", error);
        });
    } else if (dataType === "ethnicity") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
         d3.json("http://127.0.0.1:5000/data/gender").then(data => {
            drawBarChart(data, "Ethnicity", "TotalPop", {
                title: "Population Distribution by Ethnicity",
                xLabel: "Ethnic Groups",
                yLabel: "Population"
            });
        }).catch(error => {
            console.error("Error loading the ethnicity data:", error);
        });
    } else if (dataType === "gender") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        d3.json("http://127.0.0.1:5000/data/gender").then(data => {
            drawBarChart(data, "Gender", "TotalPop", {
                title: "Population Distribution by Gender",
                xLabel: "Gender",
                yLabel: "Population"
            });
        }).catch(error => {
            console.error("Error loading the gender data:", error);
        });
    } else if (dataType === "income_state") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/grouped_state.csv").then(data => {
            drawHistogram(data, "Income", 10000000, {
                title: "Income Distribution by State",
                xLabel: "Income Range ($)",
                yLabel: "Frequency"
            });
        }).catch(error => {
            console.error("Error loading the income state data:", error);
        });
    } else if (dataType === "income_county") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/grouped_county.csv").then(data => {
            drawHistogram(data, "Income", 1000000, {
                title: "Income Distribution by County",
                xLabel: "Income Range ($)",
                yLabel: "Frequency"
            });
        }).catch(error => {
            console.error("Error loading the income county data:", error);
        });
    } else if (dataType === "meancommute") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/data.csv").then(data => {
            drawHistogram(data, "MeanCommute", 5, {
                title: "Mean Commute Time Distribution",
                xLabel: "Time (minutes)",
                yLabel: "Frequency",
                valueFormat: value => `${d3.format(".1f")(value)} min`
            });
        }).catch(error => {
            console.error("Error loading the mean commute time data:", error);
        });
    } else if (dataType === "production") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/data.csv").then(data => {
            drawHistogram(data, "Production", 1, {  // Reduced bin size for percentages
                title: "Production Occupation Distribution",
                xLabel: "Production (%)",
                yLabel: "Frequency",
                valueFormat: value => `${value.toFixed(1)}%`
            });
        }).catch(error => {
            console.error("Error loading the production data:", error);
        });
    } else if (dataType === "scatter") {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        toggleButton.style.display = 'none';
        d3.csv("data/grouped_county.csv").then(data => {
            document.getElementById("scatter-options").style.display = "block";
            drawScatterPlot(data);
            // Add event listeners for radio buttons
            d3.selectAll('input[name="xVariable"], input[name="yVariable"]').on("change", () => drawScatterPlot(data));
        }).catch(error => {
            console.error("Error loading the scatter plot data:", error);
        });
    } else {
        regionSelector.style.display = 'none';
        updateButton.style.display = 'none';
        document.getElementById("scatter-options").style.display = "none";
    }

    // Update all similar percentage metrics
    const percentageDataTypes = [
        'production', 'drive', 'carpool', 'transit', 'walk', 
        'otherTransp', 'workAtHome', 'privateWork', 
        'publicWork', 'selfEmployed', 'familyWork', 'unemployment'
    ];

    //To capitalize first letter, required for data fetching
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Update each percentage metric case
    percentageDataTypes.forEach(metric => {
        if (dataType === metric) {
            regionSelector.style.display = 'none';
            updateButton.style.display = 'none';
            toggleButton.style.display = 'none';
            d3.csv("data/data.csv").then(data => {
                const formattedMetric = metric.charAt(0).toUpperCase() + 
                metric.slice(1).replace(/([A-Z])/g, ' $1').trim(); // for visualization 
                drawHistogram(data, capitalizeFirst(metric), 1, {
                    title: `${formattedMetric} Distribution`,
                    xLabel: `${formattedMetric} (%)`,
                    yLabel: "Frequency",
                    valueFormat: value => `${value.toFixed(1)}%`
                });
            }).catch(error => {
                console.error(`Error loading the ${metric} data:`, error);
            });
        }
    });
}

// Function to update the scatter plot based on the selected variables
function updateScatterPlot() {
    d3.csv("data/data.csv").then(data => {
        const xVariable = document.getElementById('xVariable').value;
        const yVariable = document.getElementById('yVariable').value;
        drawScatterPlot(data, {
            title: `${xVariable} vs ${yVariable} Relationship`,
            xLabel: xVariable,
            yLabel: yVariable
        });
    }).catch(error => {
        console.error("Error loading the scatter plot data:", error);
    });
}

// Scatter plot dropdown menu
function populateScatterOptions(columns) {
    const excludeColumns = ['TractId', 'State', 'County', 'IncomeErr', 'IncomePerCapErr'];
    const filteredColumns = columns.filter(column => !excludeColumns.includes(column));

    const xDropdown = d3.select("#xVariable");
    const yDropdown = d3.select("#yVariable");

    xDropdown.selectAll("option").remove();
    yDropdown.selectAll("option").remove();

    xDropdown.selectAll("option")
        .data(filteredColumns)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    yDropdown.selectAll("option")
        .data(filteredColumns)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);
}

// Function to toggle the orientation of the bar chart
function toggleOrientation() {
    isHorizontal = !isHorizontal;
    const dataType = d3.select("#dataType").property("value");
    updateChart(); 
}

function populateRegionCheckboxes(data, type) {
    const regionContainer = document.getElementById('regionCheckboxes');
    const updateButton = document.getElementById('updateChartButton');
    regionContainer.innerHTML = ''; // Clear existing checkboxes
    
    let regions = [...new Set(data.map(d => d[type]))].sort();
    
    if (isInitialLoad) {
        selectedRegions.clear();
        isInitialLoad = false;
    }

    regions.forEach(region => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = region;
        checkbox.checked = selectedRegions.has(region);
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                selectedRegions.add(region);
            } else {
                selectedRegions.delete(region);
            }
        });

        const label = document.createElement('label');
        label.htmlFor = region;
        label.textContent = region;

        div.appendChild(checkbox);
        div.appendChild(label);
        regionContainer.appendChild(div);
    });

    // Show update button for states and counties
    updateButton.style.display = (type === 'State' || type === 'County') ? 'block' : 'none';
}

// Resetting state when choosing a new variable in dropdown menu
function onDataTypeChange() {
    isInitialLoad = true;
    selectedRegions.clear();
    updateChart();
}

// Initial chart load
updateChart();