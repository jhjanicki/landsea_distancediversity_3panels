d3.custom = {};
 
d3.custom.scatterplot = function module() {
	var margin = {top: 30, right: 40, bottom: 100, left: 40},
    	width = 450,
    	height = 400,
    	xValue ='Distance',
    	yValue='Taxonomic',
    	xLabel='Pairwise Distance',
    	yLabel = 'Beta Diversity (Taxonomic)',
    	landsea = 'Land',
    	_index = 0,
    	xlog='log';
    

    
    
    	var svg;
    
    	function exports(_selection) {
			_selection.each(function(_data) {
		
			var x;
			
			console.log(yValue);
		
				if(xlog=='log'){
				
					 x = d3.scale.log()
					.range([0, width]);
				}else{
					 x = d3.scale.linear()
					.range([0, width]);
				}

				var y = d3.scale.linear()
					.range([height, 0]);


				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.tickFormat(function (d) {
						return x.tickFormat(4,d3.format(",d"))(d)
					});

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

		
				if (!svg) {
					 svg = d3.select(this).append('svg');
					 var container = svg.append('g').classed('container-group'+_index, true);

				}
			
				svg.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom);
			
				container
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				
				
				  _data = _data.filter(function(d){
						return d[yValue] != null;
				  }); 	
				  
				  console.log(_data);
				
				  x.domain(d3.extent(_data, function(d) { return d[xValue]; })).nice();
				  //y.domain(d3.extent(_data, function(d) { return d[yValue]; })).nice();
				  //  y.domain([0,1]);
				  
				  
				  if(yValue == 'Taxonomic'){
				  	console.log('taxonomic');
				  	console.log(d3.extent(_data, function(d) { return d[yValue]; }));
				  	 y.domain([-1,1]);
				  }
				  
				  if(yValue == 'Phylogenetic'){
				  	console.log('phylogenetic');
				  	console.log(d3.extent(_data, function(d) { return d[yValue]; }));
				  	 y.domain([100,150]);
				  }
				  
				  
				  
				  if(yValue == 'Functional'){
				  	console.log('functional');
				  	console.log(_data);
				  	console.log(d3.extent(_data, function(d) { return d[yValue]; }));
				  	 y.domain([0.11, 0.2]);
				  }
				  
				  
	

				   //x-axis labels
				  container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(0," + height + ")")
					  .call(xAxis)
					  .selectAll("text")	
							.style("text-anchor", "end")
							.attr("dx", "-.8em")
							.attr("dy", ".15em")
							.attr("transform", function(d) {
								return "rotate(-65)" 
							});
   
				   //x-axis title label
					container.append("g")
					  .attr("class", "x axis")
					  .attr("transform", "translate(-5," + height + ")")
					  .append("text")
					  .attr("class", "label")
					  .attr("x", width)
					  .attr("y", -6)
					  .style("text-anchor", "end")
					  .text(xLabel);

				
				  
				var data_land =  _data.filter(function(d){
						return d.Landsea == 'Land';
				  }); 
				  
				var data_sea =  _data.filter(function(d){
						return d.Landsea == 'Sea';
				  }); 	
					  
					  
			
					  
					container.selectAll(".dotland"+_index)
					  .data(data_land)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y(d[yValue]); })
					  .style("fill", '#E69F00')
					  .style("opacity",0.7);
					  
					container.selectAll(".dotsea"+_index)
					  .data(data_sea)
					  .enter().append("circle")
					  .attr("class", "dot")
					  .attr("r", 3.5)
					  .attr("cx", function(d) { return x(d[xValue]); })
					  .attr("cy", function(d) { return y(d[yValue]); })
					  .style("fill", '#56B4E9')
					  .style("opacity",0.7);
	  			
	  				// container.selectAll(".dot"+_index)
// 					  .data(_data)
// 					  .enter().append("path")
//       				  .attr("d", d3.svg.symbol().type("triangle-up"))
// 					  .attr("class", "dot")
// 					  .attr("transform", function(d){ return "translate(" + x(d[xValue]) + "," +y(d[yValue]) + ")"})
// 					  .style("fill", '#737373')
// 					  .style("opacity",0.7);
	  			
	  			

		  
					  

					var ySeriesLand = data_land.map(function(d){return d[yValue]});
					var ySeriesSea = data_sea.map(function(d){return d[yValue]});

					//get the x and y values for least squares
					var xSeriesLand = data_land.map(function(d) { return d[xValue] });
					var xSeriesSea = data_sea.map(function(d) { return d[xValue] });
		
		
		
					var dataArrayLand=[];
					var dataArraySea=[];
					
		
					for (var i=0;i<xSeriesLand.length;i++){
						var indvArrayLand = [];
						indvArrayLand.push(xSeriesLand[i],ySeriesLand[i]);
						dataArrayLand.push(indvArrayLand);	
					}
					
					for (var i=0;i<xSeriesSea.length;i++){
						var indvArraySea = [];
						indvArraySea.push(xSeriesSea[i],ySeriesSea[i]);
						dataArraySea.push(indvArraySea);	
					}
		
		
					var resultLand= regression('linear', dataArrayLand);
					var slopeLand = resultLand.equation[0];
					var yInterceptLand = resultLand.equation[1];
					
					var resultSea= regression('linear', dataArraySea);
					var slopeSea = resultSea.equation[0];
					var yInterceptSea = resultSea.equation[1];
		
		
		
					// apply the reults of the least squares regression
		
					var x1Land = d3.min(xSeriesLand);
					var y1Land= slopeLand*x1Land+ yInterceptLand;
					var x2Land= d3.max(xSeriesLand);
					var y2Land = slopeLand*x2Land + yInterceptLand;
					var trendDataLand= [[x1Land,y1Land,x2Land,y2Land]];
					
					var x1Sea= d3.min(xSeriesSea);
					var y1Sea= slopeSea*x1Sea+ yInterceptSea;
					var x2Sea= d3.max(xSeriesSea);
					var y2Sea= slopeSea*x2Sea + yInterceptSea;
					var trendDataSea= [[x1Sea,y1Sea,x2Sea,y2Sea]];
		
		
					var trendlineLand= container.selectAll(".trendlineland"+_index)
						.data(trendDataLand);
						
					var trendlineSea= container.selectAll(".trendlinesea"+_index)
						.data(trendDataSea);
						
						
					trendlineLand.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y(d[3]); })
						.attr("stroke-width", 2)
						.attr("stroke","#E69F00");
						
					trendlineSea.enter()
						.append("line")
						.attr("class", "trendline")
						.attr("x1", function(d) { return x(d[0]); })
						.attr("y1", function(d) { return y(d[1]); })
						.attr("x2", function(d) { return x(d[2]); })
						.attr("y2", function(d) { return y(d[3]); })
						.attr("stroke-width", 2)
						.attr("stroke","#56B4E9");


				 //y-axis title label
				  container.append("g")
					  .attr("class", "y axis")
					  .call(yAxis)
					  .append("text")
					  .attr("class", "label")
					  .attr("transform", "rotate(-90)")
					  .attr("y", 6)
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
					  .text(yLabel);
					
					  
					  
					  
					  

			})
	
		}
		
		exports.xValue = function(value) {
			if (!arguments.length) return xValue;
			xValue = value;
			return this;
		}
		
	
		exports.yValue = function(value) {
			if (!arguments.length) return yValue;
			yValue = value;
			return this;
		}
		
		exports.xLabel = function(value) {
			if (!arguments.length) return xLabel;
			xLabel = value;
			return this;
		}
		
		exports.yLabel = function(value) {
			if (!arguments.length) return yLabel;
			yLabel = value;
			return this;
		}
		
		exports.landsea = function(value) {
			if (!arguments.length) return _index;
			_index = value;
			return this;
		}
	
		exports._index = function(value) {
			if (!arguments.length) return _index;
			_index = value;
			return this;
		}
		
		exports.xlog = function(value) {
			if (!arguments.length) return xlog;
			xlog = value;
			return this;
		}
	
	
		return exports;

}








  




  

	


