var margin = {top: 20, right: 100, bottom: 210, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));

var svg = d3.select("#StackBarContent").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("rating.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "pixibranche"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.smiley = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; })
    d.smiley.forEach(function(d){ d.y0 /= y0; d.y1 /= y0;});
  });

  data.sort(function(a, b) { return b.smiley[0].y1 - a.smiley[0].y1; });

  x.domain(data.map(function(d) { return d.pixibranche; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(65)")
    .style("text-anchor", "start");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var state = svg.selectAll(".pixibranche")
      .data(data)
    .enter().append("g")
      .attr("class", "state")
      .attr("transform", function(d) { return "translate(" + x(d.pixibranche) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.smiley; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(color.domain().slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width + 48)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 38)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});