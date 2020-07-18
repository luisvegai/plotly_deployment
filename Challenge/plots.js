function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
  init();

  function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("GENDER: " + result.gender);
      PANEL.append("h6").text("AGE: " + result.age);
      PANEL.append("h6").text("LOCATION: " + result.location);
      PANEL.append("h6").text("BBTYPE: " + result.bbtype);
      PANEL.append("h6").text("WFREQ: " + result.wfreq);
    });
  }

//   var url = "/samples/" + sample;

function buildCharts(sample) {

// Bar Chart
    d3.json("samples.json").then((data) => {
        var smples = data.samples;
        var resultArray = smples.filter(sampleObj => sampleObj.id == sample)[0];
        console.log(resultArray);

        var otuID = resultArray.otu_ids;
        var otuLabels = resultArray.otu_labels;
        var smplesValues = resultArray.sample_values;

        smplesValuesSor = smplesValues.sort((a,b) => b - a);
        otuIDSor = otuID.sort(function(a, b) {
            return smplesValuesSor.indexOf(b) - smplesValuesSor.indexOf(a);
        });
        otuLabelsSor = otuLabels.sort(function(a, b) {
            return smplesValuesSor.indexOf(b) - smplesValuesSor.indexOf(a);
        });

        otuIDtop = otuIDSor.slice(0,10).reverse();
        otuLabelsTop = otuLabelsSor.slice(0,10).reverse();
        smplesValuesTop = smplesValuesSor.slice(0,10).reverse();

        for(var i=0;i<otuIDtop.length;i++){
            otuIDtop[i]="OTU "+otuIDtop[i];
        }

        var trace1 = {
            x: smplesValuesTop,
            y: otuIDtop,
            type: "bar",
            orientation: "h"
        };
        
        var layout = {
            title: "",
            margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
            }
        };

        Plotly.newPlot("bar", [trace1], layout);
    });


    // Bubble Chart
    d3.json("samples.json").then((data) => {
        var smples = data.samples;
        var resultArray = smples.filter(sampleObj => sampleObj.id == sample)[0];
        console.log(resultArray);

        var otuID = resultArray.otu_ids;
        var otuLabels = resultArray.otu_labels;
        var smplesValues = resultArray.sample_values;

        var trace2 = {
            x: otuID,
            y: smplesValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: smplesValues,
                color: otuID
            },
            type: 'scatter'
        };

        var layout2 = {
            // title: "Belly Button Diversity",
            xaxis: {title: "OTU ID"},
            showlegend: false
        };

        Plotly.newPlot("bubble", [trace2], layout2);
    });


    // Gauge chart
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var wfreq = result.wfreq

        let level = wfreq * 20;

        let degrees = 180 - level;
        let radius = 0.5; 
        let radians = (degrees * Math.PI) / 180;
        let x = radius * Math.cos(radians);
        let y = radius * Math.sin(radians);

        let mainPath = "M-.0 -0.05 L  .0 0.05 L";
        let pathX = String(x);
        let space = " ";
        let pathY = String(y);
        let pathEnd = " Z";
        let path = mainPath.concat(pathX, space, pathY, pathEnd);
        let trace3 = [
            {
                type: "scatter",
                x:[0],
                y:[0],
                marker: { size: 15, color: "rgba(255, 99, 71, 1)" },
                showlegend: false,
                // text: level
            },
            {
                values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                rotation: 90,
                text:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                textinfo: "text",
                textposition: "inside",
                marker: {
                    colors: [
                        "rgba(0,105,11,.5)",
                        "rgba(10,120,22,.5)",
                        "rgba(14,127,0,.5)",
                        "rgba(110,154,22,.5)",
                        "rgba(170,202,42,.5)",
                        "rgba(202,209,95,.5)",
                        "rgba(210,206,145,.5)",
                        "rgba(232,226,202,.5)",
                        "rgba(240, 230,215,.5)",
                        "rgba(255,255,255,0)"
                    ]
                },
                labels:["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
                hoverinfo: "label",
                hole: 0.5,
                type: "pie",
                showlegend: false
            }
        ]

        var layout = {
            shapes: [
                {
                    type: "path",
                    path: path,
                    fillcolor: "rgba(255, 99, 71, 1)",
                    line: {
                        color: "rgba(255, 99, 71, 1)"
                    }
                }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            height: 500,
            width: 500,
            xaxis: {
                zeroline:false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            },
            yaxis: {
                zeroline: false,
                showticklabels: false,
                showgrid: false,
                range: [-1, 1]
            }
        }

        Plotly.newPlot("gauge", trace3, layout);
    });

}
