// Function to draw the bar chart
function drawBarChart(data, labelKey, valueKey) {
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();  // Clear previous chart

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d[labelKey]))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[valueKey])])
        .nice()
        .range([height, 0]);

    // Create axes
    g.append("g")
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
        .attr("x", width / 2 + margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text(`${labelKey} Population Distribution`);

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 10)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .text("Population");

    // Create and style the bars
    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[labelKey]))
        .attr("y", d => y(d[valueKey]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d[valueKey]))
        .attr("fill", "steelblue")
        .on("mouseover", function() {
            d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "steelblue");
        })
        .style("transition", "fill 0.3s ease")  // Smooth transition for hover
        .append("title")
        .text(d => `${d[labelKey]}\nPopulation: ${d3.format(",")(d[valueKey])}`);
}

// Function to draw the histogram
function drawHistogram(data, valueKey, binSize) {
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();  // Clear previous chart

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[valueKey])])
        .nice()
        .range([0, width]);

    console.log("X Scale Domain:", x.domain());

    const histogram = d3.histogram()
        .value(d => d[valueKey])
        .domain(x.domain())
        .thresholds(x.ticks(Math.ceil((x.domain()[1] - x.domain()[0]) / binSize)));  // Set bin size

    const bins = histogram(data);

    console.log("Histogram Bins:", bins);

    const y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([height, 0]);

    console.log("Y Scale Domain:", y.domain());

    // Create axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d3.format(".2s")));

    // Add title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2 + margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text(`${valueKey} Distribution`);

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 10)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .text("Frequency");

    // Create and style the bars
    const bars = g.selectAll(".bar")
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => x(d.x1) - x(d.x0) - 1)
        .attr("height", d => height - y(d.length))
        .attr("fill", "steelblue")
        .on("mouseover", function() {
            d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "steelblue");
        })
        .style("transition", "fill 0.3s ease")  // Smooth transition for hover
        .append("title")
        .text(d => `${d.x0} - ${d.x1}\nCount: ${d3.format(",")(d.length)}`);

    console.log("Bars:", bars);
}

// Function to draw the scatter plot
function drawScatterPlot(data) {
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();  // Clear previous chart

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get selected variables
    const xVariable = d3.select('input[name="xVariable"]:checked').property("value");
    const yVariable = d3.select('input[name="yVariable"]:checked').property("value");

    // Create scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[xVariable])])
        .nice()
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d[yVariable])])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(data.map(d => d.State));

    // Create axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d3.format(".2s")));

    // Add title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2 + margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .text(`${xVariable} vs ${yVariable}`);

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .attr("text-anchor", "middle")
        .text(xVariable);

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 10)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .text(yVariable);

    // Create and style the points
    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d[xVariable]))
        .attr("cy", d => y(d[yVariable]))
        .attr("r", 5)
        .attr("fill", d => color(d.State))
        .style("transition", "fill 0.3s ease")  // Smooth transition for hover
        .append("title")
        .text(d => `State: ${d.State}\n${xVariable}: ${d3.format(",")(d[xVariable])}\n${yVariable}: ${d3.format(",")(d[yVariable])}`);
}