// Create dropdown of ID numbers
function init() {
    var selector = d3.select("#selDataset");
    // Select dropdown menu, which has an id of #selDataset 
    // Dropdown menu is assigned to the variable selector

    // Create dropdown options
    d3.json("samples.json").then((data) => {
    // Data from JSON is assigned to argument data
        
        var sampleNames = data.names;
        // array with IDs of all participants is assigned to sampleNames

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample)
        });
        
        // Build startup charts with first sample
        var startupId = sampleNames[0];
        buildMetadata(startupId);
        buildCharts(startupId);
    }
)};

// Create Dashboard
init();

// Refresh charts with selected samples
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}
 
// Demographics Table
function buildMetadata(sample) {
// Takes sample, or ID number, as its argument
    d3.json("samples.json").then((data) => {
    // Pulls entire dataset contained in samples.json
    // Once read, samples.json is assigned to data
        
        var metadata = data.metadata;
        // Metadata array in the dataset (data.metadata) is assigned the variable metadata
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        /* filter() method is called on the metadata array to filter for an object in the array
        whose id property matches the ID number passed into buildMetadata() as sample*/
        var result = resultArray[0];
        // First item in the array (resultArray[0]) is assigned to result
        var PANEL = d3.select("#sample-metadata");
        // ID of the Demographic Info panel is sample-metadata
        // d3.select() method is used to select this <div>, and the variable PANEL is assigned to it

        PANEL.html("");
        // Ensures contents of the panel are cleared when another ID number is chosen from the dropdown menu
        
        PANEL.append("h6").text(["id: " + result.id]);
        PANEL.append("h6").text(["ethnicity: " + result.ethnicity]);
        PANEL.append("h6").text(["gender: " + result.gender]);
        PANEL.append("h6").text(["age: " + result.age]);
        PANEL.append("h6").text(["location: " + result.location]);
        PANEL.append("h6").text(["bbtype: " + result.bbtype]);
        PANEL.append("h6").text(["wfreq: " + result.wfreq]);
    });
}

// Build the charts
function buildCharts(sample) {
    // Load samples.js
    d3.json("samples.json").then((data) =>{
        // Assign samples array to a variable
        var samples = data.samples;
        
        // Create filter and convert to an array
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        // Chart variables
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        /* When an individual’s ID is selected, the top 10 bacterial species (OTUs) should be
        visualized with a bar chart. Create a horizontal bar chart to display the top 10 OTUs 
        found in that individual.
            Use sample_values as the values for the bar chart. 
            Use otu_ids as the labels for the bar chart.
            Use otu_labels as the hover text for the chart. */
        
        // Bar chart
        var traceBar = {
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        };
        var data = [traceBar];
        var layout = {
            title: "Top 10 Belly Button Bacteria",
            ytitle: "OTU ID",
            height: 400, 
            width: 1000
        };
        Plotly.newPlot('bar', data, layout);

        /* Create a bubble chart that displays each sample:
            Use otu_ids for the x-axis values.
            Use sample_values for the y-axis values. 
            Use sample_values for the marker size. 
            Use otu_ids for the marker colors.
            Use otu_labels for the text values. */
        
        // Bubble chart
        var traceBubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };
        var data = [traceBubble];
        var layout = {
            title: "Cultures per Belly Button Sample",
            showlegend: false,
            height: 400,
            width: 1200
        };
        Plotly.newPlot('bubble', data, layout);
    }
)};
    