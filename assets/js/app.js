function makeResponsive(){
    
       // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  // var svgArea = d3.select("#scatter");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

    // svg params
  var svgHeight = window.innerHeight - 60;
  //var svgWidth = window.innerWidth;  
  var element = d3.select('.container').node();    
  var svgWidth = element.getBoundingClientRect().width;

    console.log(svgWidth)

var margin = {
  top: 20,
  right: 50,
  bottom: 60,
  left: 100
};


var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    //console.log(healthData)
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)+1])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    var circles = circlesGroup.append("circle")
		.attr("cx", d => xLinearScale(d.poverty))
		.attr("cy", d => yLinearScale(d.healthcare))
		.attr("r", "14")
		.attr("fill", "blue")
		.attr("opacity", ".5");
    
    // Step 5: Create Texts inside circles
    // ==============================
    //Add the SVG Text Element to the svgContainer
    var textGroup = chartGroup.selectAll("text")
                         .data(healthData)
                         .enter()
        var texts = circlesGroup.append("text")
                         .attr("x", d => xLinearScale(d.poverty)-8)
                         .attr("y", d => yLinearScale(d.healthcare)+5)
                         .text( function (d) { return d.abbr; })
                         .attr("font-family", "sans-serif")
                         .attr("font-size", "10px")
                         .attr("fill", "white");



    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state} ${d.abbr}<br>Poverty: ${d.poverty}<br>lack healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    circles.call(toolTip);
    texts.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circles.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      }); 
    
    texts.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  });
    
}

makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
