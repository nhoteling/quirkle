//Width and height
// (Not needed for r2d3; specified automatically OR in chunk header)
//var width = 800;
//var height = 900;

// Read data
// (data were prepared and saved with R)
//
//d3.json("data/quirkle.json", function(data) {
//  console.log(data);
//  quirkleVis(data);
//});


// Make the vis
//function quirkleVis(data) {
 
 
 // D3 code chunk
var margin = {top:10, right:10, bottom:100, left:10};
var quirkle = data.quirkle;
var totals = data.totals;
var min_round = d3.min(quirkle, d => d.round);
var max_round = d3.max(quirkle, d => d.round);
var min_value = d3.min(quirkle, d => d.value);
var max_value = d3.max(quirkle, d => d.value);
var min_score = d3.min(totals, d => d.score);
var max_score = d3.max(totals, d => d.score);


// Scales //
var colorScale = d3.scaleOrdinal().domain(["Na", "Cr", "Lu", "Co"])
                   .range(['#ddaeff','#67d9dc','#b0cf66','#fbada7']);

// Adjustments to yScale                   
var nameScale = d3.scaleBand()
                  .domain(["Na", "Cr", "Lu", "Co"])
                  .range([0, 60, 100, 140]);
// yScale
var yScale = d3.scaleLinear()
                .domain([ d3.min(quirkle, d => d.match), 
                          d3.max(quirkle, d => d.match) ])
               //.domain([9, 20])
               .range([height - margin.bottom, 1]);
var xScale = d3.scaleLinear()
               .domain([ min_round, max_round])
               .range([margin.left ,450]);
var alphaScale = d3.scaleSqrt()
                   .domain([ min_value, max_value ])
                   .range([0.3,1.0]);
var barScale = d3.scaleLinear()
                 .domain([ min_score, max_score ])   // 70, 150
                 .range([25,75]);

var xAxis = d3.axisBottom(xScale);


/////////////////////////////////////////////////////////////
// Create SVG element
// (Not used for r2d3, but needed for js stuff)
//var svg = d3.select("body")
//			.append("svg")
//			.attr("width", width)
//			.attr("height", height);
////////

// Tooltips
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) { return "Name: " + d.name + "<br />Value: " + d.value; });
svg.call(tip);

// Gridlines
svg.selectAll("line")
  .data(data.totals)
  .enter()
    .append("line")
      .attr("x1", function(d, i) { return xScale(1); })
      .attr("y1", function(d, i) { return yScale(d.match) + nameScale(d.name) + 7.5; })
      .attr("x2", function(d, i) { return xScale(19); })
      .attr("y2", function(d, i) { return yScale(d.match) + nameScale(d.name) + 7.5; })
      .style("stroke", "#dcdcdc")     // "#dcdcdc"
      .style("stroke-width", "1px")
      .style("pointer-events","none");
      
// Bars to right of figure
svg.selectAll('rect')
  .data(data.totals)
  .enter()
  //.append("g")
  //.attr("class","bars")
    .append('rect')
      .attr('width', function(d, i) { return barScale(d.score); })
      .attr('height', '15px')
      .attr('x', function(d, i) { return xScale(max_round+1); })
      .attr('y', function(d, i) { return yScale(d.match) + nameScale(d.name); })
      .attr('fill', function(d, i) { return colorScale(d.name); })
      .attr('opacity', 0.8);

// Bar labels
svg.selectAll('text')
   .data(data.totals)
   .enter()
   .append('text')
      .text(function(d, i) { return d.score; })
      .attr('x', function(d, i) { return xScale(19) + barScale(d.score) + 5;})
      .attr('y', function(d, i) { return yScale(d.match) + nameScale(d.name) + 12; })
      .attr('font-size', '11px')
      .attr('fill', 'grey');

// Data points
svg.selectAll('g')
  .data(data.quirkle)
  .enter()
  .append("g")
  .attr("class","boxes")
    .append('rect')
      .attr('width', function(d, i) { return d.value; })
      .attr('height', '15px')
      .attr('x', function(d, i) { return xScale(d.round) - 0.5*d.value;})
      .attr('y', function(d, i) { return yScale(d.match) + nameScale(d.name); })
      .attr('fill', function(d, i) { return colorScale(d.name); })
      .attr('opacity', function(d, i) { return alphaScale(d.value); })
      .on("mouseover",tip.show)
			.on("mouseout",tip.hide);

// Axis styling doesn't seem to work well with r2d3...
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (height-25) + ")")
  //.style("fill", "grey")
  //.style("stroke", "grey")
  //.style("shape-rendering", "crispEdges")
  //.style("font-size", "14px")
  .call(xAxis);
 
 
 
 /////////////////////////////

 
//}