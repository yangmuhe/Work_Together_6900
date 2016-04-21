
var svgContainer = d3.select('.container')
						.append('svg')
                            .attr('width', 500)
                            .attr('height', 500);

var circle = svgContainer
			.append('circle')
				.attr('cx', 250)
				.attr('cy', 250)
				.attr('r', 30)
				.style('fill', 'orange')
				.style('opacity', 1);

var traceCircle = svgContainer
					.append('circle')
						.attr('cx', 250)
						.attr('cy', 250)
						.attr('r', 50)
						.style('fill', 'none')
						.style('stroke', 'black')
						.style('stroke-width', .5);


var line = svgContainer
				.append('line')
					.attr('x1', 300)
					.attr('y1', 250)
					.attr('x2', 325)
					.attr('y2', 250)
					.attr('id', 'line')
					.style('stroke', 'blue')
					.style('stroke-width', 6);


var clicks = document.getElementById('.container').
			addEventListener('click', function() {
    			console.log('You clicked!');
  			});

// var getLine = document.getElementById("line");

// var centerX = 250, centerY = 250, radius = 50, angle = 0;


// var rotated = function(angle){
//     var x1, y1, x2, y2;
//  	x1 = centerX + radius * Math.cos( angle );
//     y1 = centerY + radius * Math.sin( angle );
//     x2 = centerX - radius * Math.cos( angle );
//     y2 = centerY - radius * Math.sin( angle );
    
//     line.setAttribute( 'x1', x1 );
//     line.setAttribute( 'y1', y1 );
//     line.setAttribute( 'x2', x2 );
//     line.setAttribute( 'y2', y2 );
// }

// var calcAngle = function(){
// 	var x = event.clientX + 250;     // Get the horizontal coordinate
// 	var y = event.clientY - 250;     // Get the vertical coordinate

// 	var ang = Math.atan(y/x);

// 	return ang;
// }

// line.rotated(calcAngle());


