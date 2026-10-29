// 读取电价 CSV 数据
d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {
    const states = [
        "Queensland ($ per megawatt hour)",
        "New South Wales ($ per megawatt hour)",
        "Victoria ($ per megawatt hour)",
        "South Australia ($ per megawatt hour)",
        "Tasmania ($ per megawatt hour)",
        "Snowy ($ per megawatt hour)"
    ];

    const parseYear = d3.timeParse("%Y");

    data.forEach(d => {
        d.Year = parseYear(d.Year);
        states.forEach(state => {
            d[state] = d[state] ? +d[state] : null;
        });
    });

    const cleanData = data; 

    const width = 800;
    const height = 400;
    const margin = {top: 60, right: 125, bottom: 50, left: 70};
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select("#line-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", width / 2 - margin.left)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text("Spot Power Prices by State (1998 - 2024)");

    const xScale = d3.scaleTime()
        .domain(d3.extent(cleanData, d => d.Year))
        .range([0, innerW]);

    let yMax = 0;
    states.forEach(state => {
        const maxVal = d3.max(cleanData, d => d[state]);
        if (maxVal > yMax) yMax = maxVal;
    });
    
    const yScale = d3.scaleLinear()
        .domain([0, yMax * 1.1])
        .range([innerH, 0]);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"));
        
    svg.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(xAxis)
        .style("font-size", "12px");

    svg.append("g")
        .call(d3.axisLeft(yScale))
        .style("font-size", "12px");

    svg.append("text")
        .attr("x", innerW / 2)
        .attr("y", innerH + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -innerH / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Spot Price ($/MWh)");

    const colorScale = d3.scaleOrdinal()
        .domain(states)
        .range(["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336", "#00bcd4"]);

    const line = d3.line()
        .defined(d => d !== null)
        .x(d => xScale(d.Year))
        .y(d => yScale(d));

    states.forEach(state => {
        const stateData = cleanData.filter(d => d[state] !== null);

        svg.append("path")
            .datum(stateData)
            .attr("fill", "none")
            .attr("stroke", colorScale(state))
            .attr("stroke-width", 2.5)
            .attr("d", d => {
                return line.x(d => xScale(d.Year)).y(d => yScale(d[state]))(stateData);
            });
    });

    const legend = svg.append("g")
        .attr("transform", `translate(${innerW + 20}, 0)`);

    states.forEach((state, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(state));

        legendRow.append("text")
            .attr("x", 18)
            .attr("y", 10)
            .text(state.split(" (")[0])
            .style("font-size", "11px")
            .style("fill", "#333")
            .attr("alignment-baseline", "middle");
    });
});