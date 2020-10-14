/*
window.onload = function () {
  var results = JSON.parse(this.document.getElementById('results').value)
  var chart50 = new CanvasJS.Chart("chartContainer50",
  {
    title:{
      text: "Probes Per Query for 100 rows"
    },
    data: results["100"]
  });

  chart50.render();

  var chart50 = new CanvasJS.Chart("chartContainer100",
  {
    title:{
      text: "Probes Per Query for 100_noReadOnce rows"
    },
    data: results["100_noReadOnce"]
  });

  chart50.render();

  var chart50 = new CanvasJS.Chart("chartContainer500",
  {
    title:{
      text: "Probes Per Query for 100_ReadOnce rows"
    },
    data: results["100_ReadOnce"]
  });

  chart50.render();

  var chart50 = new CanvasJS.Chart("chartContainer1000",
  {
    title:{
      text: "Probes Per Query for 1000 rows"
    },
    data: results["1000"]
  });

  chart50.render();
}

*/
window.onload = function () {
    var results = JSON.parse(this.document.getElementById('results').value)
    var chart50 = new CanvasJS.Chart("chartContainer50",
    {
      title:{
        text: "Probes Per Query for 50 rows"
      },
      data: results["50"]
    });

    chart50.render();

    var chart50 = new CanvasJS.Chart("chartContainer100",
    {
      title:{
        text: "Probes Per Query for 100 rows"
      },
      data: results["100"]
    });

    chart50.render();

    var chart50 = new CanvasJS.Chart("chartContainer500",
    {
      title:{
        text: "Probes Per Query for 500 rows"
      },
      data: results["500"]
    });

    chart50.render();

    var chart50 = new CanvasJS.Chart("chartContainer1000",
    {
      title:{
        text: "Probes Per Query for 1000 rows"
      },
      data: results["1000"]
    });

    chart50.render();
}
