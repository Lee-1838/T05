window.addEventListener("load", () => {
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id;

                if (targetId === "bar-container") {
                    const bars = d3.select("#bar-container").selectAll("rect.bar");
                    const labels = d3.select("#bar-container").selectAll("text.value-label");

                    bars.interrupt()
                        .transition()
                        .duration(0)
                        .style("opacity", 0)
                        .attr("transform", "translate(0, 400)");

                    labels.interrupt()
                        .transition()
                        .duration(0)
                        .style("opacity", 0)
                        .attr("transform", "translate(0, 400)");

                    setTimeout(() => {
                        bars.transition()
                            .duration(1000)
                            .delay((d, i) => i * 150)
                            .style("opacity", 1)
                            .attr("transform", "translate(0, 0)");

                        labels.transition()
                            .duration(1000)
                            .delay((d, i) => i * 150 + 500)
                            .style("opacity", 1)
                            .attr("transform", "translate(0, 0)");
                    }, 0);
                }

                if (targetId === "donut-container") {
                    d3.select("#donut-container").selectAll("path")
                        .style("opacity", 0)
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                    
                    d3.select("#donut-container").selectAll("text")
                        .style("opacity", 0)
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                }

                if (targetId === "line-container") {
                    d3.select("#line-container").selectAll("path").each(function() {
                        const path = d3.select(this);
                        const totalLength = this.getTotalLength();
                        path.attr("stroke-dasharray", totalLength + " " + totalLength)
                            .attr("stroke-dashoffset", totalLength)
                            .transition()
                            .duration(1000)
                            .ease(d3.easeLinear)
                            .attr("stroke-dashoffset", 0);
                    });
                }
            }
        });
    }, observerOptions);

    const chartContainers = ["bar-container", "donut-container", "line-container"];
    chartContainers.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
});