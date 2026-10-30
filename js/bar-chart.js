d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
    data.forEach(d => {
        d.Screen_Tech = d.Screen_Tech;
        d.energy = +d['Mean(Labelled energy consumption (kWh/year))'];
    });

    const width = 800;
    const height = 400;
    const margin = {top: 40, right: 30, bottom: 60, left: 80};
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select("#bar-container")
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
        .text("Average Energy Consumption (55-inch TVs)");        

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Screen_Tech))
        .range([0, innerW])
        .padding(0.4);

    const yMax = d3.max(data, d => d.energy);
    const yScale = d3.scaleLinear()
        .domain([0, yMax * 1.1])
        .range([innerH, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale))
        .style("font-size", "13px")

    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .style("font-size", "12px")

    svg.append("text")
        .attr("x", innerW / 2)
        .attr("y", innerH + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#555")
        .text("Screen Technology");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -innerH / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#555")
        .text("Mean Energy Consumption (kWh/year)");

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(yScale)
            .ticks(5)
            .tickSize(-innerW)
            .tickFormat("")
        )
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
            .attr("stroke", "#818181")
            .attr("stroke-dasharray", "4 4")
            .attr("display", d => d === 0 ? "none" : null)
        );

    svg.selectAll("rect.bar")
        // ...

    const colorScale = d3.scaleOrdinal()
        .domain(["LCD", "LED", "OLED"])
        .range(["#64b5f6", "#207eca", "#040e91"]);

    svg.selectAll("rect.bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.Screen_Tech))
        .attr("y", innerH) 
        .attr("height", 0) 
        .attr("width", xScale.bandwidth())
        .attr("fill", d => colorScale(d.Screen_Tech))
        .attr("rx", 4)
        .attr("ry", 4)
        .on("mouseenter", function() {
            d3.select(this).attr("fill", "#0d47a1");
        })
        .on("mouseleave", function(event, d) {
            d3.select(this).attr("fill", colorScale(d.Screen_Tech));
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 150)
        .attr("y", d => yScale(d.energy))
        .attr("height", d => innerH - yScale(d.energy));

    svg.selectAll("text.value-label")
        .data(data)
        .join("text")
        .attr("class", "value-label")
        .attr("x", d => xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.energy) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(d => d.energy.toFixed(2))
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 150 + 500)
        .style("opacity", 1);

});