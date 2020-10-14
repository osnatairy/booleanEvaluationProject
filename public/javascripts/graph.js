window.onload = function () {
    var results = JSON.parse(this.document.getElementById('results').value)
    let expressons = []
    let terms = []
    let clauses = []
    for (const [key, value] of Object.entries(results)) {
        expressons.push({y: value['expressions']})
        terms.push({y: value.terms})
        clauses.push({y: value.clauses})
    }
    var chart1 = new CanvasJS.Chart("expressionContainer", {
        animationEnabled: true,
        //theme: "light2",
        title:{
            text: "expressons per Probes"
        },
        data: [{        
            type: "spline",
              indexLabelFontSize: 16,
            dataPoints: expressons
        }]
    });
    chart1.render();

    var chart2 = new CanvasJS.Chart("termsContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "terms per Probes"
        },
        data: [{        
            type: "spline",
              indexLabelFontSize: 16,
            dataPoints: terms
        }]
    });
    chart2.render();

    var chart3 = new CanvasJS.Chart("clausesContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "clauses per Probes"
        },
        data: [{        
            type: "spline",
              indexLabelFontSize: 16,
            dataPoints: clauses
        }]
    });
    chart3.render();
}
