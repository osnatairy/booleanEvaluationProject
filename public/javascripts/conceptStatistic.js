
  window.onload = function () {
    var results = JSON.parse(this.document.getElementById('results').value)
    let data = []
    for(const key in results){
        data.push({y: results[key].sum /results[key].count , label:key })
    }

    var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "concept statistic"
      },
      data: [
      {
        showInLegend: true,
        //type: "bar",
        dataPoints:data
      },
      
      ]
    });

chart.render();
}
