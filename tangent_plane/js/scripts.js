
let traceData = {};

function draw() {
  let errs = 0;
  let tr = {};
  try {
    $('.slidecontainer').empty();

    // compile the expression once
    tr.expr = math.parse($('#eq').val());

    // evaluate the expression repeatedly for different values of x and y
    tr.xmin = parseFloat($('#xmin').val());
    tr.xmax = parseFloat($('#xmax').val());
    tr.ymin = parseFloat($('#ymin').val());
    tr.ymax = parseFloat($('#ymax').val());

    tr.xValues = math.range(tr.xmin, tr.xmax, (tr.xmax-tr.xmin)/100).toArray();
    tr.yValues = math.range(tr.ymin, tr.ymax, (tr.ymax-tr.ymin)/100).toArray();
    tr.zValues = [];
    for (var i = 0; i < tr.yValues.length; i++)
    {
      zrow = []
      for (var j = 0; j < tr.xValues.length; j++)
      {
        zrow.push(tr.expr.eval({x: tr.xValues[j], y: tr.yValues[i]}));
      }
      tr.zValues.push(zrow); 
    }

    // render the plot using plotly
    tr.datas = [{
      type: 'surface',
      name: 'Function',
      showlegend: false,
      x: tr.xValues,
      y: tr.yValues,
      z: tr.zValues,
    }];

    tr.layout = {
      title: 'Plotted: ' + tr.expr.toString(),
      margin: {
        l: 65,
        r: 50,
        b: 65,
        t: 90,
      },
      hovermode:'closest',
    };
    tr.show_tplane = 0;

    Plotly.newPlot('myDiv', tr.datas, tr.layout);

  }
  catch (err) {
    console.error(err);
    alert(err);
    errs = 1;
  }
  if (errs === 0)
  {
    tr.dx = math.derivative(tr.expr, 'x');
    tr.dy = math.derivative(tr.expr, 'y');
    traceData = tr;
  }
}

$('#add_plot').on('click', draw);

function show_plot(){
  if (document.getElementById('myDiv').data != null)
  {
    let update = {opacity: 0.9, hoverinfo: 'all'};
    Plotly.restyle('myDiv', update, 0);
  }
  else
    alert("No plot is being shown");
}

$('#show_plot').on('click', show_plot);

function hide_plot(){
  if (document.getElementById('myDiv').data != null)
  {
    let update = {opacity: 0.4, hoverinfo: 'skip'};
    Plotly.restyle('myDiv', update, 0);
  }
  else
    alert("No plot is being shown");
}

$('#hide_plot').on('click', hide_plot);

function rm_plots(){
  $('.slidecontainer').empty();
  Plotly.purge('myDiv');
}

$('#rm_plots').on('click', rm_plots);

function diff_x(x0, y0){
  let tr = traceData;
  let d = (tr.xmax - tr.xmin) / 4;

  tr.dx_x = [x0 - d, x0 + d];
  tr.dx_y = [y0, y0];

  let z1 = tr.expr.eval({x: x0,y: y0,}) + tr.dx.eval({x: x0, y: y0})*(x0 - d - x0);
  let z2 = tr.expr.eval({x: x0,y: y0,}) + tr.dx.eval({x: x0, y: y0})*(x0 + d - x0);
  tr.dx_z = [z1, z2];

  const trace1 = {
    type: 'scatter3d',
    name: 'dx',
    showlegend: false,
    hovermode: 'closest',
    x: tr.dx_x,
    y: tr.dx_y,
    z: tr.dx_z,
  };

  return(trace1);
}

function diff_y(x0, y0){
  let tr = traceData;
  let d = (tr.ymax - tr.ymin) / 4;

  tr.dy_x = [x0, x0];
  tr.dy_y = [y0 - d, y0 + d];

  let z1 = tr.expr.eval({x: x0,y: y0,}) + tr.dy.eval({x: x0, y: y0})*(y0 - d - y0);
  let z2 = tr.expr.eval({x: x0,y: y0,}) + tr.dy.eval({x: x0, y: y0})*(y0 + d - y0);
  tr.dy_z = [z1, z2];

  const trace2 = {
    type: 'scatter3d',
    name: 'dy',
    showlegend: false,
    hovermode: 'closest',
    x: tr.dy_x,
    y: tr.dy_y,
    z: tr.dy_z,
  };

  return(trace2);
}

function rm_diff(){
  if (document.getElementById('myDiv').data[1] != null &&
    document.getElementById('myDiv').data[2] != null)
  {
    if (document.getElementById('myDiv').data[3] != null)
      Plotly.deleteTraces('myDiv', [1, 2, 3]);
    else
      Plotly.deleteTraces('myDiv', [1, 2]);
  }
}

function add_diff(){
  let tr = traceData;

  if (tr.show_tplane == 0)
    Plotly.addTraces('myDiv', [diff_x(x0, y0), diff_y(x0, y0)], [1,2]);
  else
    Plotly.addTraces('myDiv', [diff_x(x0, y0), diff_y(x0, y0), diff_tplane()], [1,2,3]);
}

function check_boundaries(){
  let tr = traceData;

  if (x0 < tr.xmin)
  {
    x0 = tr.xmin;
    alert('Function range exceeded');
  }
  if (x0 > tr.xmax)
  {
    x0 = tr.xmax;
    alert('Function range exceeded');
  }
  if (y0 < tr.ymin)
  {
    y0 = tr.ymin;
    alert('Function range exceeded');
  }
  if (y0 > tr.ymax)
  {
    y0 = tr.ymax
    alert('Function range exceeded');
  }
}

function differentiate(){
  let tr = traceData;

  if (document.getElementById('dx_disp') != null)
    return;

  x0 = (tr.xmax + tr.xmin) / 2;
  y0 = (tr.ymax + tr.ymin) / 2;

  $('.slidecontainer').append('<p>dz/dx = '+tr.dx.toString()+'<br>Evaluate at x0: <button type="button" id="dx_minus">-</button>'+
    '<input type="text" id="dx_disp" value=""/><button type="button" id="dx_plus">+</button></p>');
  let dx_output = document.getElementById("dx_disp");
  let dx_plus = document.getElementById("dx_plus");
  let dx_minus = document.getElementById("dx_minus");

  $('.slidecontainer').append('<p>dz/dy = '+tr.dy.toString()+'<br>Evaluate at y0: <button type="button" id="dy_minus">-</button>'+
    '<input type="text" id="dy_disp" value=""/><button type="button" id="dy_plus">+</button></p>');
  let dy_output = document.getElementById("dy_disp");
  let dy_plus = document.getElementById("dy_plus");
  let dy_minus = document.getElementById("dy_minus");

  dx_output.value = x0; // Display the default slider value
  dy_output.value = y0; // Display the default slider value
  Plotly.addTraces('myDiv', [diff_x(x0, y0), diff_y(x0, y0)], [1,2]);

  // Update the current slider value (each time you drag the slider handle)
  dx_plus.onclick = function() {
    x0 += (tr.xmax - tr.xmin) / 20;
    check_boundaries();
    dx_output.value = x0;

    rm_diff();
    add_diff();
  }

  dx_minus.onclick = function() {
    x0 -= (tr.xmax - tr.xmin) / 20;
    check_boundaries()
    dx_output.value = x0;
    
    rm_diff();
    add_diff();
  }

  dy_plus.onclick = function() {
    y0 += (tr.ymax - tr.ymin) / 20;
    check_boundaries()
    dy_output.value = y0;
    
    rm_diff();
    add_diff();
  }

  dy_minus.onclick = function() {
    y0 -= (tr.ymax - tr.ymin) / 20;
    check_boundaries()
    dy_output.value = y0;
    
    rm_diff();
    add_diff();
  }

  $("#dx_disp").keyup(function(event) {
    if (event.keyCode === 13) {
      x0 = parseFloat(dx_output.value);
      check_boundaries()
      dx_output.value = x0;
      rm_diff();
      add_diff();
    }
  });

  $("#dy_disp").keyup(function(event) {
    if (event.keyCode === 13) {
      y0 = parseFloat(dy_output.value);
      check_boundaries()
      dy_output.value = y0;
      rm_diff();
      add_diff();
    }
  });

}

$('#differentiate').on('click', differentiate);

function diff_tplane(){
  let tr = traceData;

  const trace3 = {
    type: 'mesh3d',
    name: 'Linear_approximation',
    showlegend: false,
    x: [tr.dx_x[0], tr.dy_x[0], tr.dx_x[1], tr.dy_x[1]],
    y: [tr.dx_y[0], tr.dy_y[0], tr.dx_y[1], tr.dy_y[1]],
    z: [tr.dx_z[0], tr.dy_z[0], tr.dx_z[1], tr.dy_z[1]],
  }

  return (trace3);
}

function show_tplane(){
  let tr = traceData;

  if (document.getElementById('dx_disp') == null)
  {
    alert('Function has not been differentated yet');
    return ;
  }

  if (tr.show_tplane == 0)
    Plotly.addTraces('myDiv', [diff_tplane()], 3);
  tr.show_tplane = 1;
}

$('#show_tplane').on('click', show_tplane);

function rm_tplane(){
  let tr = traceData;

  if (document.getElementById('myDiv').data[3] != null)
  {
    tr.show_tplane = 0;
    Plotly.deleteTraces('myDiv', 3);
  }
}

$('#rm_tplane').on('click', rm_tplane)

draw()