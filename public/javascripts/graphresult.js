window.onload = function () {
    var results = JSON.parse(this.document.getElementById('results').value)
    let expressons = []
    let terms = []
    let clauses = []
    
    var chart1 = new CanvasJS.Chart("expressionContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "expressons per Probes"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            //itemclick: toogleDataSeries
        },
        
        data: [{        
            type: "line",
              indexLabelFontSize: 16,
              
              axisYType: "secondary",
		name: "deshpande",
		showInLegend: true,
		markerSize: 0,
		
            dataPoints: results["expressions"]["deshpande"]
        },
        {        
            type: "line",
            indexLabelFontSize: 16,
            
            axisYType: "secondary",
      name: "random",
      showInLegend: true,
      markerSize: 0,
      
            dataPoints: results["expressions"]["random"]
        },
        {        
            type: "line",
              indexLabelFontSize: 16,
              
              axisYType: "secondary",
		name: "huristicAllen",
		showInLegend: true,
		markerSize: 0,
		
            dataPoints: results["expressions"]["huristicAllen"]
        }]
    });
    chart1.render();

    var chart2 = new CanvasJS.Chart("termsContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "terms per Probes"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            //itemclick: toogleDataSeries
        },
        data: [{        
            type: "line",
            indexLabelFontSize: 16,
            
            axisYType: "secondary",
      name: "deshpande",
      showInLegend: true,
      markerSize: 0,
      
            dataPoints: results["terms"]["deshpande"]
        },
        {        
            type: "line",
              indexLabelFontSize: 16,
              
              axisYType: "secondary",
		name: "random",
		showInLegend: true,
		markerSize: 0,
		
            dataPoints: results["terms"]["random"]
        },
        {        
            type: "line",
              indexLabelFontSize: 16,
              
              axisYType: "secondary",
		name: "huristicAllen",
		showInLegend: true,
		markerSize: 0,
		
            dataPoints: results["terms"]["huristicAllen"]
        }]
    });
    chart2.render();

    var chart3 = new CanvasJS.Chart("clausesContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "clauses per Probes"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            //itemclick: toogleDataSeries
        },
        data: [{        
            type: "line",
            indexLabelFontSize: 16,
            
            axisYType: "secondary",
      name: "deshpande",
      showInLegend: true,
      markerSize: 0,
      
            dataPoints: results["clauses"]["deshpande"]
        },
        {        
            type: "line",
            indexLabelFontSize: 16,
            
            axisYType: "secondary",
      name: "random",
      showInLegend: true,
      markerSize: 0,
      
            dataPoints: results["clauses"]["random"]
        },
        {        
            type: "line",
            indexLabelFontSize: 16,
            
            axisYType: "secondary",
      name: "huristicAllen",
      showInLegend: true,
      markerSize: 0,
      
            dataPoints: results["clauses"]["huristicAllen"]
        }]
    });
    chart3.render();

    var chart4 = new CanvasJS.Chart("conceptsContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "concept per Probes"
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
            //itemclick: toogleDataSeries
        },
        data: [{        
            type: "line",
            indexLabelFontSize: 16,
            
            axisYType: "secondary",
      name: "deshpande",
      showInLegend: true,
      markerSize: 0,
      
            dataPoints: results["concepts"]["deshpande"]
        },
        {        
            type: "line",
              indexLabelFontSize: 16,
              
              axisYType: "secondary",
		name: "random",
		showInLegend: true,
		markerSize: 0,
		
            dataPoints: results["concepts"]["random"]
        },
        {        
            type: "line",
              indexLabelFontSize: 16,
              
              axisYType: "secondary",
		name: "huristicAllen",
		showInLegend: true,
		markerSize: 0,
		
            dataPoints: results["concepts"]["huristicAllen"]
        }]
    });
    chart4.render();
}
