/**
 * Created by yangmuhe on 3/23/16.
 */
d3.StationChart = function(){

    var w = 500,
        h = 300,
        m = {t:0, r:0, b:0, l:0},
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        barWidth = 10,
        labels = [],
        padding,
        scaleY = d3.scale.ordinal(),
        scaleX = d3.scale.linear(),
        axisX = d3.svg.axis().orient('top').ticks(3),
        valueAccessor = function(d){return d;};

    var exports = function (_selection) {
        //recalculate width, height, scales, layout if updated
        chartW = w - m.l - m.r;
        chartH = h - m.t - m.b;
        
        _selection.each(draw);
    }


    function draw (array){

        var svg = d3.select(this).selectAll('svg').data([array]);  //"this" is plot
        var svgEnter = svg.enter().append('svg').attr('width',w).attr('height',h);

        svgEnter.append('g').attr('transform','translate('+ m.l+','+ m.t+')')
            .attr('class','chart');
        svgEnter.append('g').attr('transform','translate('+ m.l+','+m.t+')')
            .attr('class','axis axis-x');
        svgEnter.append('g').attr('class','label');
        svgEnter.append('g').attr('class','value')
            .attr('transform','translate('+ m.l+',0)');


        padding = (chartH - barWidth)/(array.length - 1) -barWidth;

        var maxX = d3.max(array, function(d){return d.values;});

        scaleX.domain([0, maxX]).range([0, chartW]);
        scaleY.domain(array.map(function(d){return d.key}))  //d3.map!!
            .rangeRoundBands([0,chartH], 0.2);  //actually control the padding and barWidth

        axisX.scale(scaleX).tickSize(-chartH+5)
            .tickPadding(-2);


        //draw bar chart
        var bar = svg.select('.chart')
            .selectAll('.bar')
            .data(array, function(d){return d.key;});

        bar.enter().append('rect').attr('class','bar')
            .style("fill-opacity", 0);

        bar.exit().remove();

        bar.transition()
            .duration(500)
            .attr('x', 0)
            .attr('y', function(d){return scaleY(d.key)})
            .attr('height', scaleY.rangeBand())
            //.attr('y', function(d,i){ return i*(barWidth + padding);})
            //.attr('height', barWidth)
            .attr('width',function(d){return scaleX(d.values);})
            .style("fill-opacity", 1)


        var stationNameID = d3.map(labels, function(d){return d.id;});

        //add labels on each bar
        var labelY = svg.select('.label')
            .selectAll('.label-y')
            .data(array);

        labelY.enter().append('text')
            .attr('class', 'label-y')
            //.style("fill-opacity", 0);

        labelY.exit().remove();

        labelY.transition()
            .duration(800)
            .attr('x', m.l +2)
            .attr('y', function(d){return scaleY(d.key) + scaleY.rangeBand()})
            //.attr('y', function(d,i){ return i*(barWidth + padding)+ m.t +barWidth/2;})
            .attr("dy", ".85em")
            .attr("text-anchor", "start")
            .style('font-size', '11px')
            .style('font-weight', '400')
            .style('fill', 'white')
            .text(function(d){return stationNameID.get(d.key).fullName;})


        //add values
        var value = svg.select('.value')
            .selectAll('.value-x')
            .data(array);

        value.enter().append('text')
            .attr('class', 'value-x')

        value.exit().remove();

        value.transition()
            .duration(500)
            .attr('x', function(d){return scaleX(d.values) - 3;})
            .attr('y', function(d){return scaleY(d.key) + scaleY.rangeBand()})
            .attr("dy", ".85em")
            .attr("text-anchor", "end")
            .style('font-size', '11px')
            .style('fill', 'rgb(80,80,80)')
            .text(function(d){return d.values ;})

        svg.select('.axis-x').transition().call(axisX);


    }


    //Getter and setter
    exports.width = function(_x){
        if(!arguments.length) return w;
        w = _x;
        return this;
    };
    exports.height = function(_x){
        if(!arguments.length) return h;
        h = _x;
        return this;
    };
    exports.margin = function(_m){
        if(!arguments.length) return [m.t, m.r, m.b, m.l];
        m.t = _m[0];m.r = _m[1];m.b = _m[2];m.l = _m[3];
        return this;
    };
    exports.barWidth = function(_x){
        if(!arguments.length) return barWidth;
        barWidth = _x;
        return this;
    };
    exports.labels = function(_x){
        if(!arguments.length) return labels;
        labels = _x;
        return this;
    };

    return exports;

}
