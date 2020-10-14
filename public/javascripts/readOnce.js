
  window.onload = function () {
    var results = JSON.parse(this.document.getElementById('results').value)
    let data1 = []
    let data2 = []
    for(const key in results){
        data1.push({y:  results[key].no /results[key].all, label:key })
        data2.push({y:results[key].yas/  results[key].all, label:key })
    }

    var chart = new CanvasJS.Chart("chartContainer",
    {
      title:{
        text: "readonce statistic"
      },
      data: [
      {
        showInLegend: true,
        legendText: "not read once",
        //type: "bar",
        dataPoints:data1
      },
      {
        legendText: "read once",
        showInLegend: true,
        //type: "bar",
        dataPoints:data2
      },
      
      ]
    });

chart.render();
}
