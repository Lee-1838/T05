d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
    data.forEach(d => {
        d.energy = +d['Mean(Labelled energy consumption (kWh/year))'];
    });

    const width = 600;
    const height = 600;
    const margin = 40;
    
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#donut-container")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg.append("text")
        .attr("x", 0)
        .attr("y", -radius - 18)
        .attr("text-anchor", "middle")
        .style("font-size", "23px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text("Avg Energy by Screen Tech (All Sizes)");

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.Screen_Tech))
        .range(["#4caf50", "#2196f3", "#ff9800"]); 

    const pie = d3.pie()
        .value(d => d.energy)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.55)
        .outerRadius(radius);

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .join("g")
        .attr("class", "arc");

    const arcHover = d3.arc()
        .innerRadius(radius * 0.55)
        .outerRadius(radius + 10);
        
    const arcNormal = d3.arc()
        .innerRadius(radius * 0.55)
        .outerRadius(radius);

    arcs.append("path")
        .attr("d", arcNormal)
        .attr("fill", d => colorScale(d.data.Screen_Tech))
        .attr("stroke", "white")
        .attr("stroke-width", "2px")
        .on("mouseover", function(event, d) {
            d3.select(this).transition().duration(200).attr("d", arcHover);
        })
        .on("mouseout", function(event, d) {
            d3.select(this).transition().duration(200).attr("d", arcNormal);
        });

    arcs.append("polyline")
        .attr("stroke", "#999")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr("points", function(d) {
            const posA = arc.centroid(d); 
            const posB = outerArc.centroid(d); 
            const posC = outerArc.centroid(d);
            
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
            
            return [posA, posB, posC];
        });

    arcs.append("text")
        .text(d => {
            const percent = (d.data.energy / d3.sum(data, d => d.energy) * 100).toFixed(1);
            return `${d.data.Screen_Tech}: ${percent}%`;
        })
        .attr("transform", function(d) {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * (midangle < Math.PI ? 1.05 : -1.05);
            return `translate(${pos})`;
        })
        .style("text-anchor", function(d) {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midangle < Math.PI ? "start" : "end";
        })
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#333");

    const totalAvg = d3.mean(data, d => d.energy);
    
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -5)
        .style("font-size", "28px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .text(totalAvg.toFixed(1));

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 20)
        .style("font-size", "12px")
        .style("fill", "#666")
        .text("Avg kWh/year");
});