/** Created by yangmuhe on 2/25/16. ...*/
console.log("Final Project: Hubway");

var m = {t:50,r:50,b:50,l:50},
    w = d3.select('.plot').node().clientWidth- m.l- m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var chartW = w + m.l + m.r,
    chartH = h + m.t + m.b;

var plot = d3.select('.plot').append('svg')
    .attr('width',chartW)
    .attr('height',chartH)
    .append('g').attr('class','histogram')
    .attr('transform','translate('+ m.l+','+ m.t+')');

var cf;

d3.csv("data/hubway_trips_reduced.csv", parse, dataLoaded);

function dataLoaded(err, rows){
    //console.log(rows);

    //by nest twice
    /*//nest by start station
    var nestTripsByStart = d3.nest()
        .key(function(d){ return d.startStation; })
        .entries(rows)
    //console.log(nestTripsByStart[2]);

    //nest by end station based on start station
    var nestTripsByStartEnd = d3.nest()
        .key(function(d){ return d.endStation})
        .entries(nestTripsByStart[2].values)
    //console.log(nestTripsByStartEnd);

    //console.log(d3.max(nestTripsByStartEnd, function(d){ return d.values.length; }));  //!!

    var ticks = d3.range(0, nestTripsByStartEnd.length, 5);

    var histNest = d3.layout.histogram()
        .value(function(d){ return d.values.length; })
        .range([0,nestTripsByStartEnd.length])
        .bins(ticks);

    var histStation = histNest(nestTripsByStartEnd);
    //console.log(histStation);

     var scaleY = d3.scale.linear()
     .domain([0, d3.max(nestTripsByStartEnd, function(d){return d.values.length;})])
     .range([h,0]); //some problem??

     var padding = 1;
     var barW = ( chartW - (nestTripsByStartEnd.length-1)*padding )/nestTripsByStartEnd.length;
*/

    //by crossfilter + nest
    cf = crossfilter(rows);
    var tripsByStart = cf.dimension(function(d){return d.startStation;}),
        tripsByEnd = cf.dimension(function(d){return d.endStation;});

    //nest by end station
    var nestCF = d3.nest()  //--> done in script.js
        .key(function(d){ return d.endStation})
        .rollup(function(d){return d.length})  //rollup!!
        //.map(tripsByStart.filter("5").top(Infinity))
        .entries(tripsByStart.filter("5").top(Infinity));
    console.log(nestCF);
    console.log(nestCF.length);
    console.log(nestCF[0].values); //this is the value of y axis


    /*var scaleX = d3.scale.linear()
        .domain()
        .range([0,chartW]);*/
    var scaleY = d3.scale.linear()
        .domain([0, d3.max(nestCF, function(d){return d.values;})])
        .range([h,0]);

    var padding = 1;
    var barW = ( chartW - (nestCF.length-1)*padding )/nestCF.length;

    plot.selectAll('rect')
        .data(nestCF)
        .enter()
        .append('rect')
        .attr('x', function(d,i){ return i*(barW + padding);})
        .attr('y', function(d){ return scaleY(d.values)})
        .attr('width', barW)
        .attr('height', function(d){ return h - scaleY(d.values)})
        .style('fill','red')

    /*//histogram seems not necessary?
     var ticks = d3.range(0, nestCF.length, 5);

     var histCF = d3.layout.histogram()  //--> refers to module?
     .value(function(d){ return d.values.length; })  //--> set in script.js
     .range([0,nestCF.length])
     .bins(ticks);

    var histStationCF = histCF(nestCF);
    console.log(histStationCF);

    //for histogram layout
    plot.selectAll('rect')
        .data(histStationCF)
        .enter()
        .append('rect')
        .attr('x', function(d,i){ return i*(barW + padding);})
        .attr('y', function(d){ return Math.abs(scaleY(d.y));})
        .attr('width', barW)
        .attr('height', function(d){ return Math.abs(h - scaleY(d.y));})
        .style('fill','red')
        */

}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

