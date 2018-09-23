var h = 335;
var w = 300;
var lh = 150;
var margin={left:75, right:10, vertical: 60};
var padding = 30
var paddingax = 75;
var paddingem = 10
var nmesh = 70
var gridset, basisset;
var rowBasis = function(d){
    return {b1:+d.b1, b2:+d.b2, b3:+d.b3, t:+d.t};
}
var rowGrid = function(d){
    return {x: +d.x, y: +d.y, coef1:+d.coef1, coef2:+d.coef2, coef3:+d.coef3};
}
var rowDes = function(d){
    return {x: +d.x, y:+d.y};
}
var subscript = ["&#8321;","&#8322;","&#8323;"]
var drawBasis = function(basisset,i){
    var idbasis = "#b"+(i+1);
    var namebasis= "b"+(i+1);
    var svg = d3.select(idbasis);
    var xScale = d3.scaleLinear()
	.domain([0,1])
	.range([margin.left,w-margin.right]);

    var yScale = d3.scaleLinear()
	.domain([d3.min(basisset,function(d){return d[namebasis];}),
		 d3.max(basisset,function(d){return d[namebasis];})])
	.range([h-margin.vertical,margin.vertical]);
    var xAxis = d3.axisBottom().scale(xScale).ticks(5);
    var yAxis = d3.axisLeft().scale(yScale).ticks(5);
    var line = d3.line()
	.x(function(d){return xScale(d.t);})
	.y(function(d){return yScale(d[namebasis]);});
    svg.append("path")
	.datum(basisset)
	.attr("class","line")
	.attr("d",line);
    svg.append("g")
	.attr("class", "axis bottom")
	.attr("transform", "translate(0," + (h - margin.vertical) + ")")
    	.style("font-size",15)
	.call(xAxis);
    svg.append("g")
	.attr("class", "axis left")
	.attr("transform", "translate(" + margin.left + ",0)")
	.style("font-size",15)
	.call(yAxis);
    svg.append("text").attr("x",10)
	.attr("y",0.5*h).html("b"+subscript[i])
	.attr("font-size",25)
    svg.append("text").attr("x",margin.left+0.5*(w-margin.left-margin.right))
	.attr("y",h-20).text("t")
	.attr("font-size",20)

}
var drawDummy = function(basisset)
{
    var dummydata=[];
    for (var i = 0; i < basisset.length; ++i)
	dummydata.push({t:basisset[i].t, b: 0.0});
    var svg = d3.select("#predict");
    var xScale = d3.scaleLinear()
	.domain([0,1])
	.range([margin.left,w-margin.right]);
    var yScale = d3.scaleLinear()
	.domain([-1,1])
	.range([h-margin.vertical,margin.vertical]);
    var xAxis = d3.axisBottom().scale(xScale).ticks(5);
    var yAxis = d3.axisLeft().scale(yScale).ticks(5);
    var line = d3.line()
	.x(function(d){return xScale(d.t);})
	.y(function(d){return yScale(d.b);});
    svg.append("path")
	.datum(dummydata)
	.attr("class","line")
	.attr("d",line);
    svg.append("g")
	.attr("class", "axis bottom")
	.attr("transform", "translate(0," + (h - margin.vertical) + ")")
    	.style("font-size",15)
	.call(xAxis);
    svg.append("g")
	.attr("class", "axis left")
	.attr("transform", "translate(" + margin.left + ",0)")
	.style("font-size",15)
	.call(yAxis);
    svg.append("text").attr("x",10)
	.attr("y",0.5*h).text("y(x)")
	.attr("font-size",20)
    svg.append("text").attr("x",margin.left+0.5*(w-margin.left-margin.right))
	.attr("y",h-20).text("t")
	.attr("font-size",20)
				
}
var i0 = d3.interpolateHsvLong(d3.hsv(120, 1, 0.65), d3.hsv(60, 1, 0.90)),
    i1 = d3.interpolateHsvLong(d3.hsv(60, 1, 0.90), d3.hsv(0, 0, 0.95)),
    interpolateTerrain = function(t) { return t < 0.5 ? i0(t * 2) : i1((t - 0.5) * 2); };



var drawCoeff = function(gridset,i){
    var idcoef = "#c"+(i+1);
    var namecoef = "coef"+(i+1);
    var idlegend = "#legend"+(i+1);
    var cmin = d3.min(gridset,function(d){return d[namecoef];});
    var cmax = d3.max(gridset,function(d){return d[namecoef];});
    var color = d3.scaleSequential(interpolateTerrain).domain([cmin, cmax]);
    var svg = d3.select(idcoef);
    var insvg = svg.select("svg");
    var coef = [];
    for (var i = 0; i < gridset.length; ++i)
	coef.push(gridset[i][namecoef]);
    insvg.selectAll("path")
	.data(d3.contours()
              .size([nmesh,nmesh])
              .thresholds(d3.range(cmin, cmax ,(cmax-cmin)/10))
	      (coef))
	.enter().append("path")
	.attr("d", d3.geoPath(d3.geoIdentity().scale((w-margin.left-margin.right) / nmesh)))
	.attr("fill", function(d) { return color(d.value); });
    var xScale = d3.scaleLinear()
	.domain([0,1])
	.range([margin.left,w-margin.right]);
    var xAxis = d3.axisBottom().scale(xScale).ticks(5);
    var yScale = d3.scaleLinear()
	.domain([0,1])
	.range([h-margin.vertical,margin.vertical]);
    var yAxis = d3.axisLeft().scale(yScale).ticks(5);

    svg.append("g")
	.attr("class", "axis bottom")
	.attr("transform", "translate(0," + (h - margin.vertical) + ")")
	.style("font-size",15)
	.call(xAxis);
    svg.append("g")
	.attr("class", "axis left")
	.attr("transform", "translate(" + margin.left + ",0)")
	.style("font-size",15)
	.call(yAxis);
    svg.append("text").attr("x",10)
	.attr("y",0.5*h).html("x"+subscript[1])
	.attr("font-size",25)
    svg.append("text").attr("x",margin.left+0.5*(w-margin.left-margin.right))
	.attr("y",h-20).html("x"+subscript[0])
	.attr("font-size",25)
    // draw legend
    var lgdata = d3.range(cmin, cmax, (cmax-cmin)/5);
    var lscale = d3.scaleBand()
	.domain(d3.range(5))
	.range([0,lh])
	.paddingInner(0.05);
    var lsvg = d3.select(idlegend);
    lsvg.selectAll("rect")
	.data(lgdata).enter()
	.append("rect")
	.attr("x",0)
	.attr("y",function(d,i){return lscale(i);})
	.attr("width",30)
	.attr("height",lscale.bandwidth())
	.attr("fill",function(d){return color(d);});
    lsvg.selectAll("text")
	.data(lgdata)
	.enter().append("text")
	.text(function(d){return d.toFixed(3);})
	.attr("x",40)
	.attr("y",function(d,i){return lscale(i)+lscale.bandwidth()/2;})
	.attr("font-size",15);
}
var drawDesign = function(designset,i){
    var idcoef = "#c"+(i+1);
    var svg = d3.select(idcoef);
    var xScalein = d3.scaleLinear()
	.domain([0,1])
	.range([0,w-margin.left-margin.right]);

    var yScalein = d3.scaleLinear()
	.domain([0,1])
	.range([h-margin.vertical-margin.vertical,0]);
    var insvg = svg.select("svg");
    insvg.selectAll("circle").data(designset)
	.enter().append("circle")
	.attr("cx",function(d){return xScalein(d.x);})
	.attr("cy",function(d){return yScalein(d.y);})
	.attr("r",3)
}
for(var i = 0; i < 3; ++i)
{
    var idcoef = "#c"+(i+1);
    d3.select(idcoef).append("g")
	.attr("class","inner-svg")
	.attr("transform", "translate("+margin.left+","+margin.vertical+")")
	.append("svg")
	.attr("height",h-2*margin.vertical)
	.attr("width",w-margin.left-margin.right);
}
d3.csv("basis.csv",rowBasis,function(data){
    basisset = data;
    for(var i = 0; i<3; ++i)
	drawBasis(data,i);
    drawDummy(data);
});

d3.csv("grid.csv",rowGrid,function(data){
    gridset = data;
    for(var i = 0; i < 3; ++i)
	drawCoeff(data,i);
    d3.csv("design.csv",rowDes,function(data){
	for(var i = 0; i < 3; ++i)
	    drawDesign(data,i);
    });
});

var ixScale = d3.scaleLinear()
    .domain([0,w-margin.left-margin.right])
    .range([0,1]);
var iyScale = d3.scaleLinear()
    .domain([0,h-2*margin.vertical])
    .range([1,0]);

clicked = function(){
    var coord = d3.mouse(this);
    var x1 = ixScale(coord[0]);
    var x2 = ixScale(coord[1]);
    var cmin=10.0, midx, val, mdata;

    for(var i = 0; i < gridset.length; ++i){
	val = (x1-gridset[i].x)**2+(x2-gridset[i].y)**2;
	if(val < cmin){
	    cmin = val;
	    midx = i;
	}
    }
    mdata = gridset[midx];
    for(var i = 1; i < 4; ++i){
	var id="#pc"+i;
	var name="coef"+i;
	d3.select(id).attr("value",mdata[name].toFixed(4));
    }
    var predict=[];
    for(var i=0; i < basisset.length; i++)
    {
	predict.push({t:basisset[i].t,
		      b: mdata.coef1*basisset[i].b1+mdata.coef2*basisset[i].b2+mdata.coef3*basisset[i].b3});
    }
    var line = d3.line()
	.x(function(d){return xScale(d.t);})
	.y(function(d){return yScale(d.b);});

    var xScale = d3.scaleLinear()
	.domain([0,1])
	.range([margin.left,w-margin.right]);

    var yScale = d3.scaleLinear()
	.domain([d3.min(predict,function(d){return d.b;}),
		 d3.max(predict,function(d){return d.b;})])
	.range([h-margin.vertical,margin.vertical]);
    var xAxis = d3.axisBottom().scale(xScale).ticks(5);
    var yAxis = d3.axisLeft().scale(yScale).ticks(5);
    var line = d3.line()
	.x(function(d){return xScale(d.t);})
	.y(function(d){return yScale(d.b);});

    var svg = d3.select("#predict");
    svg.select("path").datum(predict)
	.transition().duration(1000)
	.attr("d",line);
    svg.select(".left").
	transition().
	duration(1000).
	call(yAxis);
}
d3.select("#c1").select("svg").on("click",clicked)
d3.select("#c2").select("svg").on("click",clicked)
d3.select("#c3").select("svg").on("click",clicked)
