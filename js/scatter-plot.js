// 读取 CSV 数据
d3.csv("data/Ex5_TV_energy.csv").then(data => {
    data.forEach(d => {
        d.screensize = +d.screensize;
        d.energy_consumpt = +d.energy_consumpt;
        d.star2 = +d.star2;
    });

    const cleanData = data.filter(d => !isNaN(d.star2) && !isNaN(d.energy_consumpt));

    const width = 800;
    const height = 400;
    const margin = {top: 30, right: 30, bottom: 50, left: 70};
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select("#scatter-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("x", innerW / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text("Energy Consumption vs Star Rating");

    const xScale = d3.scaleLinear()
        .domain([1, 8])
        .range([0, innerW]);

    const yMax = d3.max(cleanData, d => d.energy_consumpt);
    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([innerH, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(7))
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
        .text("Star Rating");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -innerH / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#333")
        .text("Energy Consumption (kWh/year)");

    svg.selectAll("circle")
        .data(cleanData)
        .join("circle")
        .attr("cx", d => xScale(d.star2))
        .attr("cy", d => yScale(d.energy_consumpt))
        .attr("r", 4)
        .attr("fill", "#4c74af")
        .attr("opacity", 0.4)
        .attr("stroke", "#383e8e")
        .attr("stroke-width", 0.5);
});