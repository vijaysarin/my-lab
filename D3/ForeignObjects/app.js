var radioGroupName = 'chartRadio';
var dataStore = null;
var selectedData = [];
var legendConfig = {};

var margin = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 40
},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var app = angular.module("myApp", []);

app.directive("groupedBarChart", function ($window) {
    return {
        restrict: "E",
        scope: true,
        replace: true,
        template: "<div><div class='chart'><svg width='850' height='200'></svg></div><div class='legendHolder'><svg width='850' height='50'></svg></div></div>",
        link: function (scope, elem, attrs) {
            legendConfig.shape = attrs.legendshape;
            d3.json("data.json", redrawChart);
        }
    };
});

app.controller("MainCtrl", ["$scope", function ($scope) {

}]);



var redrawChart = function (error, data) {

    if (dataStore === null) {
        dataStore = data;
    } else {
        data = dataStore;
    }

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var colors = ["#a1d3e3", "#dda8b1"];

    var color = d3.scale.ordinal()
        .range(colors);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format("$"));

    var svg = d3.select(document.getElementsByTagName("svg")[0])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (error) throw error;

    var ageNames = d3.keys(data[0]).filter(function (key) {
        return key !== "State";
    });

    data.forEach(function (d) {
        d.ages = ageNames.map(function (name) {
            return {
                name: name,
                value: isNaN(+d[name]) ? 0 : +d[name],
                state: d.State
            };
        });
    });

    x0.domain(data.map(function (d) {
        return d.State;
    }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function (d) {
        return d3.max(d.ages, function (d) {
            return d.value;
        });
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll(".tick").each(function (d, i) {

            /************* Implementation using 'Pure SVG' *************/

            var me = this;
            var meBox = this.getBBox();

            var allButtons = d3.select(me).append("g")
                .attr("id", "allButtons")

            var buttonGroups = allButtons.selectAll("g.button")
                .data(['\uf10c'])
                .enter()
                .append("g")
                .attr("class", "button")
                .style("cursor", "pointer")
                .on("mouseover", function () {
                    var button = d3.select(this);
                    d3.selectAll("g.button").select("text").attr("fill", "#5a5a5a");
                    if (button.select("text").attr("fill") != "#000") {
                        button.select("text").attr("fill", "#000");
                    }
                })
                .on("mouseout", function () {
                    d3.selectAll("g.button").select("text").attr("fill", "#5a5a5a");
                })
                .on("click", function (d) {
                    var button = d3.select(this);
                    var parent = d3.select(this.parentNode);
                    d3.selectAll("g.button").select("text").text('\uf10c');
                    button.select("text").text('\uf192');
                    selectedData = [];
                    svg.selectAll(".tick").each(function (d, i) {
                        d3.select(this).attr("fill", "black");
                    });
                    svg.selectAll("rect").each(function (d, i) {
                        d3.select(this).attr("stroke", "none");
                    });
                    d3.select(me).attr("fill", "red");
                    svg.selectAll("rect").each(function (d, i) {
                        var selectedRect = d3.select(this).filter(function (d) {
                            return d.state === d3.select(me).data()[0];
                        });
                        if (selectedRect && selectedRect.data().length > 0) {
                            var selectedRectData = selectedRect.data()[0];
                            selectedData.push(selectedRectData);
                            if (selectedRectData.name === "Quote1") {
                                document.getElementById("quoteConfigInput1").value = selectedRectData.value;
                            } else if (selectedRectData.name === "Quote2") {
                                document.getElementById("quoteConfigInput2").value = selectedRectData.value;
                            }
                            selectedRect.attr("stroke", "#333");
                        }
                    });
                });

            var buttonRect = buttonGroups.append("rect")
                .attr("class", "buttonRect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", -10)
                .attr("y", 18)
                .attr("rx", 5)
                .attr("ry", 5)
                .attr("fill", "transparent");

            var buttonText = buttonGroups.append("text")
                .attr("class", "buttonText")
                .attr("font-family", "FontAwesome")
                .attr("font-size", 16)
                .attr("x", 0)
                .attr("y", 35)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .attr("fill", "#5a5a5a")
                .text(function (d) { return d; });


            /************* Implementation using 'foreignObject' *************/

            /*
            var me = this;
            var meBox = this.getBBox();
            var fo = d3.select(me).append('foreignObject')
                .attr({
                    'x': (me.getBBox().x) + (me.getBBox().width / 2) - 10,
                    'y': meBox.y / 2 + 15
                });
            fo.on("change", function () {
                selectedData = [];
                svg.selectAll(".tick").each(function (d, i) {
                    d3.select(this).attr("fill", "black");
                });
                svg.selectAll("rect").each(function (d, i) {
                    d3.select(this).attr("stroke", "none");
                });
                d3.select(me).attr("fill", "red");
                svg.selectAll("rect").each(function (d, i) {
                    var selectedRect = d3.select(this).filter(function (d) {
                        return d.state === d3.select(me).data()[0];
                    });
                    if (selectedRect && selectedRect.data().length > 0) {
                        var selectedRectData = selectedRect.data()[0];
                        selectedData.push(selectedRectData);
                        if (selectedRectData.name === "Quote1") {
                            document.getElementById("quoteConfigInput1").value = selectedRectData.value;
                        } else if (selectedRectData.name === "Quote2") {
                            document.getElementById("quoteConfigInput2").value = selectedRectData.value;
                        }
                        selectedRect.attr("stroke", "#333");
                    }
                });
            });

            fo.append('xhtml:div')
                .append('input')
                .attr({
                    'type': 'radio',
                    'name': radioGroupName
                });
            fo.attr({
                'height': 25
            });
            */
        });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var state = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "state")
        .attr("transform", function (d) {
            return "translate(" + x0(d.State) + ",0)";
        });

    state.selectAll("rect")
        .data(function (d) {
            return d.ages;
        })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function (d) {
            return x1(d.name);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .style("fill", function (d) {
            return color(d.name);
        });

    var legendSvg = d3.select(document.getElementsByTagName("svg")[1]);

    var legend = legendSvg.selectAll()
        .data(ageNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    if (legendConfig.shape === "circle") {
        legend.append(legendConfig.shape)
            .attr("cx", 20)
            .attr("cy", 10)
            .attr("r", 8)
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("fill", color);
    } else {
        legend.append(legendConfig.shape)
            .attr("x", 10)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);
    }


    legend.append("text")
        .attr("x", 70)
        .attr("y", 10)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });
};

document.getElementById("quoteConfigInputUpdate").addEventListener('click', function () {
    var me = this;
    var newDataStore = [];
    if (selectedData.length > 0) {
        selectedData.forEach(function (selectedRecord) {
            dataStore.forEach(function (storeRecord) {
                var newRecord = {};
                newRecord.State = storeRecord.State;
                if (storeRecord.State === selectedRecord.state) {
                    newRecord.Quote1 = document.getElementById("quoteConfigInput1").value;
                    newRecord.Quote2 = document.getElementById("quoteConfigInput2").value;
                } else {
                    newRecord.Quote1 = storeRecord.Quote1;
                    newRecord.Quote2 = storeRecord.Quote2;
                }
                newDataStore.push(newRecord);
            });
        });
        d3.select("svg").remove();
        dataStore = newDataStore;
        d3.json("data.json", redrawChart);
        document.getElementById("quoteConfigInput1").value = null;
        document.getElementById("quoteConfigInput2").value = null;
    } else {
        alert("No updates to chart data");
    }
});