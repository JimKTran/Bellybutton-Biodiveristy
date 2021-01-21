//function to group IDs for dropdown selections
function selectID() {
    var dropdown = d3.select("#selDataset");
    d3.json("samples.json").then((samplesdata) => {
            console.log(samplesdata);
            samplesdata.names.forEach(function(name) {
                dropdown.append("option").text(name).property("value");
            });

            getsamplesData(samplesdata.names[0]);
            getplotData(samplesdata.names[0]);
    });
};

selectID();

//function to get IDs from metadata in samples.json data
function getsamplesData(id) {
    d3.json("samples.json").then((samplesdata) => {
        var metadata = samplesdata.metadata;
        
        console.log(metadata);

        //grab data by IDs
        var idResults = metadata.filter(meta => meta.id.toString() === id)[0];

        //dump selected data into demographic class
        var demographicData = d3.select("#sample-metadata");

        //reset demographic info on new selection
        demographicData.html("");

        //grab the demographic data and append the text on selected ID
        Object.entries(idResults).forEach((key) => {
            demographicData.append("h5").text(key[0].toLocaleLowerCase() + ": " + key[1] + " \n");
        });
    });
};

//function to point the selected ID to metadata
function optionChanged(id) {
    getsamplesData(id);
    getplotData(id);
};

//function to build required bar & bubble plots
function getplotData(id) {
    // getting data from the json file
    d3.json("samples.json").then((graphdata)=> {
      console.log(graphdata)
  
      var washfreq = graphdata.metadata.map(d => d.washfreq)
      console.log(washfreq)
          
      //filter sample values by id 
      var samples = graphdata.samples.filter(s => s.id.toString() === id)[0];          
      console.log(samples);
    
      //Getting the top 10 
      var samplevalues = samples.sample_values.slice(0, 10).reverse();
    
      //get only top 10 otu ids for the plot OTU and reversing it. 
      var OTU_top10 = (samples.otu_ids.slice(0, 10)).reverse();
      
      //get the otu id's to the desired form for the plot
      var OTU_id = OTU_top10.map(d => "OTU " + d)
    
      //get the top 10 labels for the plot
      var labels = samples.otu_labels.slice(0, 10);
  
      //Create trace variable for the bar plot
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
            color: '#005a99'},
            type:"bar",
            orientation: "h",
      };
    
      //create data variable
      var data = [trace];
    
      //create layout variable to set plots layout
      var layout = {
        font:{family:"Verdana Pro Black"},
        title: "<b>Top 10 OTU</b>",
        yaxis:{
            tickmode:"linear",
        },
        margin: {
            l: 100,
            r: 50,
            t: 100,
            b: 30
        }
      };
      
      //create the bar plot
      Plotly.newPlot("bar", data, layout);
  
      //Create The bubble chart
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
            color: samples.otu_ids,
            size: samples.sample_values
          },
          text: samples.otu_labels
      };
    
      //set the layout for the bubble plot
      var layout_bubble = {
        font:{family:"Verdana Pro Black"},
        xaxis:{
          title: "<b>OTU ID</b>",
        },
        showlegend: false
      };
    
      //creating data variable 
      var data1 = [trace1];
    
      //create the bubble plot
      Plotly.newPlot("bubble", data1, layout_bubble); 
    })
  };
