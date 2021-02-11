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


// Scales //
var colorScale = d3.scaleOrdinal().domain(["Na", "Cr", "Lu", "Co"])
                   .range(['#ddaeff','#67d9dc','#b0cf66','#fbada7']);
                   
var nameScale = d3.scaleBand()
                  .domain(["Na", "Cr", "Lu", "Co"])
                  .range([0, 60, 100, 140]);
var yScale = d3.scaleLinear()
               .domain([9, 20])
               .range([800,1]);
var xScale = d3.scaleLinear()
               .domain([1,18])
               .range([10,450]);
var alphaScale = d3.scaleSqrt()
                   .domain([1,24])
                   .range([0.3,1.0]);
var barScale = d3.scaleLinear()
                 .domain([70,150])
                 .range([25,75]);




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
  .html(function(d) { return d.value; });
svg.call(tip);

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
      
// Bars at right of figure
svg.selectAll('rect')
  .data(data.totals)
  .enter()
  //.append("g")
  //.attr("class","bars")
    .append('rect')
      .attr('width', function(d, i) { return barScale(d.score); })
      .attr('height', '15px')
      .attr('x', function(d, i) { return xScale(19); })
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

 
 /////////////////////////////

 
//}