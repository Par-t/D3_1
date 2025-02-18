function drawBarChart(data, labelKey, valueKey, options = {}) {
    // Clear the previous chart
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();

    const margin = { top: 50, right: 50, bottom: 70, left: 120 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    if (isHorizontal) {
        // Create scales for horizontal orientation
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[valueKey])])
            .nice()
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d[labelKey]))
            .range([0, height])
            .padding(0.1);

        // Add horizontal grid lines and labels
        g.selectAll("grid-line")
            .data(x.ticks())
            .enter()
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", d => x(d))
            .attr("x2", d => x(d))
            .attr("y1", 0)
            .attr("y2", height)
            .style("stroke", "#a9a0a0")
            .style("stroke-opacity", 1.0)
            .style("stroke-dasharray", "5,5");

        // Add value labels for grid lines
        g.selectAll(".grid-label")
            .data(x.ticks())
            .enter()
            .append("text")
            .attr("class", "grid-label")
            .attr("x", d => x(d))
            .attr("y", height + 20)
            .attr("text-anchor", "middle")
            .style("fill", "#666")
            .style("font-size", "12px")
            .text(d => d3.format(",")(d));

        // Add y-axis labels (category labels)
        g.selectAll(".y-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "y-label")
            .attr("x", -10)
            .attr("y", d => y(d[labelKey]) + y.bandwidth() / 2)
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .style("fill", "#666")
            .style("font-size", "12px")
            .text(d => d[labelKey]);

        // Create and style the bars for horizontal orientation
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => y(d[labelKey]))
            .attr("width", d => x(d[valueKey]))
            .attr("height", y.bandwidth())
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

        // Add value labels at the end of each bar
        g.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d[valueKey]) + 5)
            .attr("y", d => y(d[labelKey]) + y.bandwidth() / 2)
            .attr("dy", ".35em")
            .style("font-size", "12px")
            .style("fill", "black")
            .text(d => d3.format(",")(d[valueKey]));

        d3.select("#chart").append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 40)
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .style("font-size", "16px")
            .text("Population");

        d3.select("#chart").append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left / 2 - 40)
            .attr("x", -(height / 2) - margin.top)
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .style("font-size", "16px")
            .text(labelKey);
    } else {
        // Create scales for vertical orientation
        const x = d3.scaleBand()
            .domain(data.map(d => d[labelKey]))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[valueKey])])
            .nice()
            .range([height, 0]);

        // horizontal grid lines and labels
        g.selectAll("grid-line")
            .data(y.ticks())
            .enter()
            .append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", d => y(d))
            .attr("y2", d => y(d))
            .style("stroke", "#A9A9A9")
            .style("stroke-opacity", 0.8)
            .style("stroke-dasharray", "5,5");

        // value labels for grid lines
        g.selectAll(".grid-label")
            .data(y.ticks())
            .enter()
            .append("text")
            .attr("class", "grid-label")
            .attr("x", -10)
            .attr("y", d => y(d))
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .style("fill", "#666")
            .style("font-size", "12px")
            .text(d => d3.format(",")(d));

        // x-axis labels
        g.selectAll(".x-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "x-label")
            .attr("x", d => x(d[labelKey]) + x.bandwidth() / 2)
            .attr("y", height + 20)
            .attr("text-anchor", "middle")
            .style("fill", "#666")
            .style("font-size", "12px")
            .text(d => d[labelKey]);

        // Create and style the bars for vertical orientation
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
            .style("transition", "fill 0.3s ease")  // hover
            .append("title")
            .text(d => `${d[labelKey]}\nPopulation: ${d3.format(",")(d[valueKey])}`);

        // Add value labels on top of each bar
        g.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d[labelKey]) + x.bandwidth() / 2)
            .attr("y", d => y(d[valueKey]) - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "black")
            .text(d => options.valueFormat ? 
                options.valueFormat(d[valueKey]) : 
                d3.format(",")(d[valueKey]));

        // Add x-axis label with larger font
        d3.select("#chart").append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.top + 50)
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .style("font-size", "16px")
            .text(labelKey);

        // Add y-axis label with larger font
        d3.select("#chart").append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", margin.left / 2 - 40)
            .attr("x", -(height / 2) - margin.top)
            .attr("text-anchor", "middle")
            .attr("class", "axis-label")
            .style("font-size", "16px")
            .text("Population");
    }

    // Add title with larger font
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2 + margin.left)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text(options.title || `${labelKey} Population Distribution`);
}

function drawHistogram(data, valueKey, binSize, options = {}) {
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
        .style("font-size", "18px")
        .text(options.title || `${valueKey} Distribution`);

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 10)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(options.yLabel || "Frequency");

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
        .text(d => {
            const range = options.valueFormat ? 
                `${options.valueFormat(d.x0)} - ${options.valueFormat(d.x1)}` :
                `${d3.format(",")(d.x0)} - ${d3.format(",")(d.x1)}`;
            return `${range}\nCount: ${d3.format(",")(d.length)}`;
        });

    console.log("Bars:", bars);

    // Update axis labels with units
    g.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text(options.xLabel || valueKey);
}

function drawScatterPlot(data, options = {}) {
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();  // Clear previous chart

    const margin = { top: 50, right: 40, bottom: 70, left: 70 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get selected variables
    const xVariable = document.getElementById('xVariable').value;
    const yVariable = document.getElementById('yVariable').value;

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
        .style("font-size", "18px")
        .text(options.title || `${xVariable} vs ${yVariable}`);

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(options.xLabel || xVariable);

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 2 - 10)
        .attr("x", -(height / 2) - margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(options.yLabel || yVariable);

    // Create and style the points
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(+d[xVariable]))
        .attr("cy", d => y(+d[yVariable]))
        .attr("r", 3)  
        .attr("fill", d => color(d.State))
        .attr("opacity", 0.4)  // Reduced opacity 
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("opacity", 1)  // Full opacity on hover
                .attr("r", 5);  // Slightly larger on hover
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("opacity", 0.4)  
                .attr("r", 3);  
        })
        .append("title")
        .text(d => `State: ${d.State}\nCounty: ${d.County}\n${xVariable}: ${d3.format(",")(d[xVariable])}\n${yVariable}: ${d3.format(",")(d[yVariable])}`);
}

