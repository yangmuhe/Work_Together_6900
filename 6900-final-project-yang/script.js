/**
 * Created by yangmuhe on 3/22/16.
 */
var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;

//dispatcher
var dispatcherStation = d3.dispatch('changestation');


//Module
var stationChart = d3.StationChart()
    .width(400).height(300)
    .margin([15,0,5,30])
    //.barWidth(20)

var plot = d3.select('.plot').datum([]).call(stationChart);

dispatcherStation.on('changestation',function(array){ //"array" here is nestCF
    //var ticks = d3.range(0, array.length, 5);
    //var histCF = d3.layout.histogram()  //--> refers to module?
    //    .value(function(d){ return d.values.length; })
    //    .range([0,array.length])
    //    .bins(ticks);
    //
    //var histStationCF = histCF(array);
    //console.log(histStationCF);

    //stationChart.value(function(d){ return d.values.length; })
    //    .bins(ticks)
    //    .range([0,array.length])

    plot.datum(array)
        .call(stationChart)
})


d3_queue.queue()
    .defer(d3.csv,'../data/hubway_trips_reduced.csv',parse)
    .defer(d3.csv,'../data/hubway_stations.csv',parseStations)
    .await(dataLoaded);

function dataLoaded(err,rows,stations){

    //crossfilter and dimensions
    var cfStart = crossfilter(rows);
    var tripsByStart1 = cfStart.dimension(function(d){return d.startStation;}),
        tripsByTimeStart = cfStart.dimension(function(d){return d.startTimeT;});

    var cfEnd = crossfilter(rows);
    var tripsByEnd1 = cfEnd.dimension(function(d){return d.endStation;}),
        tripsByTimeEnd = cfEnd.dimension(function(d){return d.startTimeT;});


    //drop-down menu: choose station
    d3.select('.station').on('change',function(){
        console.log(this.value);
        //if(!this.value) tripsByStart1.filter(null);
        //else {tripsByStart1.filter(this.value);}

        //choose the station as start station
        var nestStart = d3.nest()
            .key(function(d){return d.endStation})
            .rollup(function(d){return d.length})  //rollup!!
            .entries(tripsByStart1.filter(this.value).top(Infinity));


        //tripsByStart1.filter(this.value).top(Infinity);
        //var groupStation = tripsByStart1.group(function(d){return d.endStation; }).all();
        //console.log(groupStation);


        var cf2Start = crossfilter(nestStart);
        var topTripsStart = cf2Start.dimension(function(d){return d.values;}).top(10);
        console.log(topTripsStart);



        //choose the station as end station
        var nestEnd = d3.nest()
            .key(function(d){return d.startStation})
            .rollup(function(d){return d.length})  //rollup!!
            .entries(tripsByEnd1.filter(this.value).top(Infinity));

        var cf2End = crossfilter(nestEnd);
        var topTripsEnd = cf2End.dimension(function(d){return d.values;}).top(10);


        dispatcherStation.changestation(topTripsStart);

        //choose specific time span
        var morning = [new Date(0,0,0,6,0), new Date(0,0,0,12,0)],
            afternoon = [new Date(0,0,0,12,0), new Date(0,0,0,19,0)],
            evening = [new Date(0,0,0,19,0), new Date(0,0,0,24,0)];

        //when click button "start" or "end"
        d3.selectAll('.btn-group .station').on('click', function(){
            var id = d3.select(this).attr('id');
            if(id=='startstation'){
                dispatcherStation.changestation(topTripsStart);

                //when click button "morning", "afternoon" or "evening"
                d3.selectAll('.btn-group .time').on('click', function(){
                    var id = d3.select(this).attr('id');
                    if(id=='morning'){
                        //var tripsByTimeMorning = tripsByTimeStart.filter(morning).top(Infinity);
                        //var nestTime = d3.nest()
                        //    .key(function(d){return d.endStation})
                        //    .rollup(function(d){return d.length})  //rollup!!
                        //    .entries(tripsByTimeMorning);
                        //
                        //var cfTime = crossfilter(nestTime);
                        //var topTripsTime = cfTime.dimension(function(d){return d.values;}).top(10);
                        var topTripsStartMorning = timeDimension(tripsByTimeStart, morning);
                        console.log(topTripsStartMorning);
                        dispatcherStation.changestation(topTripsStartMorning);
                    }if(id=='afternoon'){
                        var topTripsStartAfternoon = timeDimension(tripsByTimeStart, afternoon);
                        console.log(topTripsStartAfternoon);
                        dispatcherStation.changestation(topTripsStartAfternoon);
                    }if(id=='evening'){
                        var topTripsStartEvening = timeDimension(tripsByTimeStart, evening);
                        console.log(topTripsStartEvening);
                        dispatcherStation.changestation(topTripsStartEvening);
                    }
                })

            }if(id=='endstation'){
                console.log(topTripsEnd);
                dispatcherStation.changestation(topTripsEnd);

                //when click button "morning", "afternoon" or "evening"
                d3.selectAll('.btn-group .time').on('click', function(){
                    var id = d3.select(this).attr('id');
                    if(id=='morning'){
                        //var tripsByTimeMorning = tripsByTimeEnd.filter(morning).top(Infinity);
                        //var nestTime = d3.nest()
                        //    .key(function(d){return d.startStation})
                        //    .rollup(function(d){return d.length})  //rollup!!
                        //    .entries(tripsByTimeMorning);
                        //
                        //var cfTime = crossfilter(nestTime);
                        //var topTripsTime = cfTime.dimension(function(d){return d.values;}).top(10);
                        //dispatcherStation.changestation(topTripsTime);

                        var topTripsEndMorning = timeDimensionEnd(tripsByTimeEnd, morning);
                        console.log(topTripsEndMorning);
                        dispatcherStation.changestation(topTripsEndMorning);
                    }if(id=='afternoon'){
                        var topTripsEndAfternoon = timeDimensionEnd(tripsByTimeEnd, afternoon);
                        console.log(topTripsEndAfternoon);
                        dispatcherStation.changestation(topTripsEndAfternoon);
                    }if(id=='evening'){
                        var topTripsEndEvening = timeDimensionEnd(tripsByTimeEnd, evening);
                        console.log(topTripsEndEvening);
                        dispatcherStation.changestation(topTripsEndEvening);
                    }
                })
            }
        });




        ////when click button "morning", "afternoon" or "evening"
        //d3.selectAll('.btn-group .time').on('click', function(){
        //    var id = d3.select(this).attr('id');
        //    if(id=='morning'){
        //        var tripsByTimeMorning = tripsByTimeStart.filter(morning).top(Infinity);
        //        var nestTime = d3.nest()
        //            .key(function(d){return d.endStation})
        //            .rollup(function(d){return d.length})  //rollup!!
        //            .entries(tripsByTimeMorning);
        //
        //        var cfTime = crossfilter(nestTime);
        //        var topTripsTime = cfTime.dimension(function(d){return d.values;}).top(10);
        //        console.log(topTripsTime);
        //        dispatcherStation.changestation(topTripsTime);
        //    }if(id=='afternoon'){
        //
        //    }else{
        //
        //    }
        //})

    })


} //end of dataLoaded


function timeDimension(cfdimension, time){
    var tripsByTimeMorning = cfdimension.filter(time).top(Infinity);
    var nestTime = d3.nest()
        .key(function(d){return d.endStation})
        .rollup(function(d){return d.length})  //rollup!!
        .entries(tripsByTimeMorning);

    var cfTime = crossfilter(nestTime);
    var topTripsTime = cfTime.dimension(function(d){return d.values;}).top(10);

    return topTripsTime;
}


function timeDimensionEnd(cfdimension, time){
    var tripsByTimeMorning = cfdimension.filter(time).top(Infinity);
    var nestTime = d3.nest()
        .key(function(d){return d.startStation})
        .rollup(function(d){return d.length})  //rollup!!
        .entries(tripsByTimeMorning);

    var cfTime = crossfilter(nestTime);
    var topTripsTime = cfTime.dimension(function(d){return d.values;}).top(10);

    return topTripsTime;
}

/*-------------------------- Parse data -----------------------*/
function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        startTimeT: parseTime(d.start_date)
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

function parseTime(t){
    var time = t.split(' ')[1].split(':');

    return new Date(0, 0, 0, +time[0], +time[1]);
}

function parseStations(s){
    d3.select('.station')
        .append('option')
        .html(s.station)
        .attr('value', s.id);
}
