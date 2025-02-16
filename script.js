// Global variables
let statesData = [];  // Store the fetched data
let selectedStates = [];  // Store user-selected states
let currentAnalysisType = 'population';  // Add at the top with other global variables

// Fetch the state data from the Flask server
function fetchStateData() {
    d3.json("http://127.0.0.1:5000/data/state")
        .then(data => {
            statesData = data;
            populateStateDropdown();
            handleAnalysisChange(); // Initialize with current analysis type
        })
        .catch(error => console.log("Error loading data:", error));
}

// Populate the dropdown with state names
function populateStateDropdown() {
  const checklist = d3.select("#stateChecklist");
  
  // Clear existing options
  checklist.html("");
  
  // Sort states alphabetically
  const sortedStates = statesData.sort((a, b) => d3.ascending(a.State, b.State));
  
  // Add checkbox options
  const options = checklist.selectAll(".state-option")
      .data(sortedStates)
      .enter()
      .append("label")
      .attr("class", "state-option");
      
  options.append("input")
      .attr("type", "checkbox")
      .attr("value", d => d.State)
      .attr("id", d => `state-${d.State.replace(/\s+/g, '-')}`);
      
  options.append("span")
      .style("margin-left", "8px")
      .text(d => d.State);
}

function updateChart() {
  // Get selected states from checkboxes
  const selectedCheckboxes = document.querySelectorAll('#stateChecklist input:checked');
  selectedStates = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

  // If no states selected, show all states
  const filteredData = selectedStates.length > 0 
      ? statesData.filter(d => selectedStates.includes(d.State))
      : statesData;

  // Draw the bar chart with filtered data
  drawBarChart(filteredData);
}

// Function to draw the bar chart
function drawBarChart(data) {
    const svg = d3.select("#populationChart");
    svg.selectAll("*").remove();  // Clear previous chart

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.State))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.TotalPop)])
        .nice()
        .range([height, 0]);

    // Create axes
    const xAxis = g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    g.append("g")
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d3.format(".2s")));

    // Add title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", svg.attr("width") / 2)
        .attr("y", 25)
        .text("State Population Distribution");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .text("Population");

    // Create and style the bars
    g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.State))
    .attr("y", d => y(d.TotalPop))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.TotalPop))
    .attr("fill", "steelblue")
    .style("transition", "fill 0.3s ease")  // Smooth transition for hover
    .append("title")
    .text(d => `${d.State}\nPopulation: ${d3.format(",")(d.TotalPop)}`);
}

// Add this new function
function handleAnalysisChange() {
    currentAnalysisType = d3.select("#analysisType").property("value");
    const stateControls = d3.select("#stateControls");
    
    if (currentAnalysisType === 'income') {
        stateControls.style("display", "none");
        drawIncomeHistogram();
    } else {
        stateControls.style("display", "block");
        updateChart();
    }
}

// Add new function for drawing income histogram
function drawIncomeHistogram() {
    const svg = d3.select("#populationChart");
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get all income values
    const incomes = statesData.map(d => +d.Income);
    
    // Create histogram bins
    const histogram = d3.histogram()
        .domain(d3.extent(incomes))
        .thresholds(30);

    const bins = histogram(incomes);

    // Create scales
    const x = d3.scaleLinear()
        .domain([bins[0].x0, bins[bins.length - 1].x1])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);

    // Create axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(d3.format("$,.0f")));

    g.append("g")
        .call(d3.axisLeft(y)
            .tickFormat(d => Math.round(d)));

    // Add bars
    g.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0))
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .attr("fill", "steelblue")
        .append("title")
        .text(d => `Income Range: $${d3.format(",")(d.x0)} - $${d3.format(",")(d.x1)}\nNumber of States: ${d.length}`);

    // Add title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", svg.attr("width") / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text("Distribution of State Income Levels");

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", margin.left + width / 2)
        .attr("y", height + margin.top + 40)
        .text("Income Range ($)");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 15)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .text("Number of States");
}

// Call fetchStateData to get data and populate dropdown
fetchStateData();