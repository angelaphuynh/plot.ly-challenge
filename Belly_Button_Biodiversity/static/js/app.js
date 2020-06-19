function buildMetadata(sample) {
  // Build the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + sample;
  d3.json(url).then(function(sample){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Inside the loop, use d3 to append new tags for each key-value
    Object.entries(sample).forEach(([key, value]) => {
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    }) 
  }) 
};  

function buildBarChart(sample) {
   // Use `d3.json` to fetch the sample data for the bar chart
   var url = `/samples/${sample}`;
   d3.json(url).then(function(data) { 
    var ybar = data.otu_ids;
    var xbar = data.sample_values;
    var barHover = data.otu_labels;

      // Build a Bar Chart using the sample data
      var trace1 = {
        y: ybar.slice(0, 10).map(object => `OTU ${object}`).reverse(),
        x: xbar.slice(0, 10).reverse(),
        hovertext: barHover.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {color:'gray'}
      };
      var data = [trace1];
        
      // Apply the group bar mode to the layout
      var layout = {
          title: "Top 10 OTUs",
          margin: {l: 100, r: 100, t: 30, b: 20} 
    };  

    Plotly.newPlot("plot", data, layout);
  });  
} 

// Build the bubble chart
function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // Build a Bubble Chart using the sample data
    var xValues = data.otu_ids;
    var yValues = data.sample_values;
    var tValues = data.otu_labels;
    var mSize = data.sample_values;
    var mClrs = data.otu_ids;

    var trace_bubble = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mClrs,
        colorscale: "gray"
      }  
    };  
    var data = [trace_bubble];

    var layout = {
      title: "OTU ID",
      margin: {l: 100, r: 100, t: 30, b: 20}
    }; 

    Plotly.newPlot("bubble", data, layout);
  });  
} 

function init() {
  
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = sampleNames[0];
    buildBarChart(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }); 
};  

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildBarChart(newSample);
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();

