var app = angular.module("myApp", []);

var dataset = {};

var appDataSet = JSON.parse('{"retailerName":"Atom","offerRate":{"average":90,"ratebreakup":{"Retailer service charges":{"DMA":80,"charge":450,"percentage":"50%"},"Energy Charges":{"DMA":80,"charge":1500,"percentage":"60%"},"Renewable Charges":{"DMA":80,"charge":450,"percentage":"55%"}},"currency":"$","offerTotal":3550,"offerValidFrom":"2016-07-15","offerValidTo":"2016-07-27"},"retailerId":11,"LoadProfile":{"shoulder":200,"offpeak":150,"peak":100},"DaysLeft":{"approx":14,"actual":"2 days 14 hours 840 minutes 50400 seconds"},"quoteofferId":3,"$$hashKey":"object:89"}');

var offerRate = appDataSet.offerRate;
var rateBreakupData = appDataSet.offerRate.ratebreakup;

var rateBreakupDataKeys = Object.keys(appDataSet.offerRate.ratebreakup);

angular.forEach(rateBreakupData, function (value, key) {
    this[key] = value.charge;
}, dataset);

app.directive("donutChart", function ($window) {
    return {
        restrict: "E",
        scope: true,
        replace: true,
        template: "<div> <div class='breakupDonutChartHolder'></div> <div class='breakupDonutContentHolder'> <div class='breakupDonutStarTitle'></div> <div class='breakupDonutLegend'></div> <div class='breakupDonutDmaBox'></div> </div> </div>",
        link: function (scope, elem, attrs) {
            var radius = 100,
        padding = 10,
		svgWidth = 210,
		svgHeight = 210,
		svgLegendWidth = 400,
		svgLegendHeight = 100;

    var color = d3.scale.ordinal()
        .range(["#1f6ebe", "#32bfb0", "#924ecc"]);

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 30);
		
	var outerArc = d3.svg.arc()
		.outerRadius(radius + 7)
		.innerRadius(radius);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.data.charge;
        });


    color.domain(d3.keys(dataset).filter(function (key) {
        return key !== "State";
    }));

    dataset.energyData = color.domain().map(function (name) {
        return {
            name: name,
            data: rateBreakupData[name]
        };
    });
		
    var svg = d3.select(".breakupDonutChartHolder").selectAll(".donutChartPie")
        .data([dataset])
        .enter().append("svg")
        .attr("class", "donutChartPie")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
		.style("padding-top", 7)
		.style("padding-left", 7)		
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");			

    svg.selectAll(".donutChartArc")
        .data(function (d) {
            return pie(d.energyData);
        })
        .enter().append("path")
        .attr("class", "donutChartArc")
        .attr("d", arc)		
        .style("fill", function (d) {
            return color(d.data.name);
        });
		
	svg.selectAll(".donutChartOuterArc")
        .data(function (d) {
            return pie(d.energyData);
        })
        .enter().append("path")
        .attr("class", "donutChartOuterArc")
        .attr("d", outerArc).style("fill", function (d) {
            return color(d.data.name);
        });			

    var donutMiddleText = svg.append("text")
        .attr("dy", ".35em")
		.attr("font-size", 18)
        .style("text-anchor", "middle");

		var donutMiddleTextTSpan1 = donutMiddleText.append("tspan");
		var donutMiddleTextTSpan2 = donutMiddleText.append("tspan");
		
		donutMiddleTextTSpan1.attr("x", 0);
		donutMiddleTextTSpan1.attr("dy", '-0.35em');
		donutMiddleTextTSpan2.attr("x", 0);
		donutMiddleTextTSpan2.attr("dy", '1.5em');
		donutMiddleTextTSpan2.style("font-weight", 'bold');
				
		donutMiddleTextTSpan1.text(function (d) {
            return "Avg rate";
        });
		
        donutMiddleTextTSpan2.text(function (d) {
            return offerRate.currency + offerRate.average + "/MWh";
        });
	
	var starText = d3.select(".breakupDonutStarTitle")
        .append("svg")		
		.attr("height", 50)
		.attr("width", 25)		
		.attr("class", "donutChartStarText");
	
	starText.append("text")
        .attr("x", 0)
        .attr("y", 20)		
		.attr("height", 100)
		.attr("width", 100)
		.style("fill", "#627380")
		.attr("font-size", 20)
        .text(function (d) {
            return "*";
        });
		
	var titleText = d3.select(".breakupDonutStarTitle")
        .append("svg")		
		.attr("height", 50)
		.attr("width", 150)		
		.attr("class", "donutChartStarText");
	
	titleText.append("text")
        .attr("x", 5)
        .attr("y", 40)		
		.attr("height", 100)
		.attr("width", 100)
		.style("fill", "#627380")
		.attr("font-size", 16)
		.attr("font-weight", "bold")
        .text(function (d) {
            return "Rate Breakup";
        });		

    var legend = d3.select(".breakupDonutLegend")
        .append("svg")
        .attr("class", "donutChartLegend")		
        .attr("width", svgLegendWidth)
        .attr("height", svgLegendHeight)
        .selectAll("g")
        .data(color.domain().slice())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 30 + ")";
        });

    legend.append("circle")
        .attr("r", 7)
		.attr("cx", 10)
		.attr("cy", 9)
        .style("fill", color);

    var getMaxTextWidth = function (textElements) {
        var prevTextWidth = null;
        textElements.forEach(function (textElement) {
            var textElementWidth = textElement.getBBox().width;
            if (prevTextWidth === null || textElementWidth > prevTextWidth) {
                prevTextWidth = textElementWidth;
            }
        });
        return prevTextWidth;
    }

    var labelText = legend.append("text")
		.attr("class", "donutLabelText")
        .attr("x", 24)
        .attr("y", 9)
		.attr("width", 250)
        .attr("dy", ".35em")
        .text(function (d) {
            return d;
        });

    var percentText = legend.append("text")
        .attr("x", getMaxTextWidth(labelText[0]) + 75)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) {
            return rateBreakupData[d].percentage;
        });
			
	var labelDottedText = legend.append("foreignObject")
		.attr("class", "donutLabelDottedText")        
		.attr("x", function(d){			
			var labelTextContents = labelText[0];
			var labelTextElement = null;
			labelTextContents.some(function(labelTextEl) {
				if (d === labelTextEl.innerHTML) {
					labelTextElement = labelTextEl;
					return true;
				}
			});			
			return labelTextElement.getBBox().width + 18;
		})
        .attr("y", 0)						
		.append('xhtml:body')
		.append('xhtml:div')
		.style("overflow", "hidden")	
		.style("width", function(d){			
			var labelTextContents = labelText[0];
			var percentTextContents = percentText[0];
			var labelTextElement, percentTextElement = null;
			labelTextContents.some(function(labelTextEl) {
				if (d === labelTextEl.innerHTML) {
					labelTextElement = labelTextEl;
					return true;
				}
			});
			percentTextContents.some(function(percentTextEl) {
				if (rateBreakupData[d].percentage === percentTextEl.innerHTML) {
					percentTextElement = percentTextEl;
					return true;
				}
			});
			var width = percentTextElement.getBBox().x - labelTextElement.getBBox().width;
			return width - 28;
		})
        .text(function (d) {
            return "..........................................................";
        });

    var chargeText = legend.append("foreignObject")
        .attr("x", getMaxTextWidth(labelText[0]) + getMaxTextWidth(percentText[0]) + 65)
        .attr("y", 0)
		.attr('font-size', 16)
        .style('font-weight', 'bold')		
		.append('xhtml:body')
		.append('xhtml:p')
		.style("text-align", "right")	
		.style("width", 90)
        .text(function (d) {
            return offerRate.currency + rateBreakupData[d].charge;
        });
		
	var dmaText = d3.select(".breakupDonutDmaBox")
        .append("svg")		
		.attr("height", 60)
		.attr("width", 100);
		
	dmaText.append("rect")
        .attr("x", 0)
        .attr("y", 0)		
		.attr("height", 55)
		.attr("width", 60)
		.style("fill", "#d23956")
		.attr("font-size", 16)
		.attr("font-weight", "bold");
	
	dmaText.append("text")
		.attr("x", 30)
        .attr("y", 25)	
		.attr("font-size", 18)
		.attr("fill", '#FFF')
        .style("text-anchor", "middle")
		.text(function (d) {
            return "DMA";
        });

	dmaText.append("text")
		.data(color.domain().slice())
		.attr("x", 30)
        .attr("y", 45)	
		.attr("font-size", 18)
		.attr("fill", '#FFF')
        .style("text-anchor", "middle")
		.text(function (d) {			
            return offerRate.currency + rateBreakupData[d].DMA;
        });
	
	dmaText.append("text")
        .attr("x", 65)
        .attr("y", 10)		
		.attr("height", 5)
		.attr("width", 5)
		.style("fill", "#627380")
		.attr("font-size", 12)
		.attr("font-weight", "normal")
        .text(function (d) {
            return "#";
        });
        }
    };
});

app.controller("MainCtrl", ["$scope", function ($scope) {}]);