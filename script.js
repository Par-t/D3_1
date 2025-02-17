// Fetch the columns from data.csv and populate the dropdown menu
d3.csv("data/data.csv").then(data => {
    // Get the column names
    const columns = data.columns;

    // Columns to exclude
    const excludeColumns = ['TractId', 'IncomeErr', 'IncomePerCapErr'];

    // Filter out the columns to exclude
    const filteredColumns = columns.filter(column => !excludeColumns.includes(column));

    // Get the dropdown menu element
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

// Function to update the chart based on the selected data type
function updateChart() {
    const dataType = d3.select("#dataType").property("value");

    if (dataType === "states") {
        d3.csv("data/grouped_state.csv").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawBarChart(data, "State", "TotalPop");
        }).catch(error => {
            console.error("Error loading the state data:", error);
        });
    } else if (dataType === "counties") {
        d3.csv("data/grouped_county.csv").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawBarChart(data, "County", "TotalPop");
        }).catch(error => {
            console.error("Error loading the county data:", error);
        });
    } else if (dataType === "populationDistribution") {
        d3.csv("data/data.csv").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawHistogram(data, "TotalPop", 500);  // Set bin size for MeanCommute
        }).catch(error => {
            console.error("Error loading the mean commute time data:", error);
        });
    }else if (dataType === "ethnicity") {
        d3.json("http://127.0.0.1:5000/data/ethnicity").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawBarChart(data, "Ethnicity", "TotalPop");
        }).catch(error => {
            console.error("Error loading the ethnicity data:", error);
        });
    } else if (dataType === "gender") {
        d3.json("http://127.0.0.1:5000/data/gender").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawBarChart(data, "Gender", "TotalPop");
        }).catch(error => {
            console.error("Error loading the gender data:", error);
        });
    } else if (dataType === "income_state") {
        d3.csv("data/grouped_state.csv").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawHistogram(data, "Income", 10000000);  // Set bin size for MeanCommute
        }).catch(error => {
            console.error("Error loading the mean commute time data:", error);
        });
    }else if (dataType === "income_county") {
        d3.csv("data/grouped_county.csv").then(data => {
            document.getElementById("scatter-options").style.display = "none";
            drawHistogram(data, "Income", 1000000);  // Set bin size for MeanCommute
        }).catch(error => {
            console.error("Error loading the mean commute time data:", error);
        });
    }else if (dataType === "meancommute") {
        d3.csv("data/data.csv").then(data => {
            console.log(data);
            document.getElementById("scatter-options").style.display = "none";
            drawHistogram(data, "MeanCommute", 5);  // Set bin size for MeanCommute
        }).catch(error => {
            console.error("Error loading the mean commute time data:", error);
        });
    } else if (dataType === "scatter") {
        d3.csv("data/grouped_county.csv").then(data => {
            document.getElementById("scatter-options").style.display = "block";
            drawScatterPlot(data);
            // Add event listeners for radio buttons
            d3.selectAll('input[name="xVariable"], input[name="yVariable"]').on("change", () => drawScatterPlot(data));
        }).catch(error => {
            console.error("Error loading the scatter plot data:", error);
        });
    } else {
        document.getElementById("scatter-options").style.display = "none";
    }
}

// Initial chart load
updateChart();