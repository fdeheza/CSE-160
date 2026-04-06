

var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  } 
    // shade
`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

// globe
var gl;
var canvas;
var a_Position;
var u_FragColor;
var u_Size;

// ui state
var g_selectedColor = [1.0, 1.0, 1.0, 1.0];
var g_selectedSize  = 10.0;
var g_selectedShape = 'point';
var g_segments      = 12;

// scene list 
var g_shapesList = [];

// enter 
function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // click drag 
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {
    if (ev.buttons === 1) click(ev);
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// webGL setup 
function setupWebGL() {
  canvas = document.getElementById('webgl');

  //console.log('canvas:', canvas);
  //console.log('gl:', gl);

gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || 
    canvas.getContext('experimental-webgl', { preserveDrawingBuffer: true });
    // console.log('gl is:', gl);
  if (!gl) {
    console.log('Fail; WebGL context');
    return;
  }
}

// connect vars 
function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Fail;  initialize shaders');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Fail; a_Position');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Fail; u_FragColor');
    return;
  }

  // size uniform

/*   if (!u_Size) {
    console.log('Failed to get u_Size');
    return;
}
*/

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (u_Size === undefined) {
        console.log('Fail;u_Size');
        return;
}
}

// render shapes
function renderAllShapes() {
  var start = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT);

  for (var i = 0; i < g_shapesList.length; i++) {
    g_shapesList[i].render();
  }

  var elapsed = performance.now() - start;
}


function click(ev) {
  var coords = eventToGLCoords(ev);
  var x = coords[0];
  var y = coords[1];

  var shape;
  if (g_selectedShape === 'point') {
    shape = new Point();
  } else if (g_selectedShape === 'triangle') {
    shape = new Triangle();
  } else {
    shape = new Circle();
    shape.segments = g_segments; 
  }

  shape.position = [x, y];
  shape.color    = g_selectedColor.slice();  
  shape.size     = g_selectedSize;

  g_shapesList.push(shape);
  renderAllShapes();
}

function eventToGLCoords(ev) {
  var rect = ev.target.getBoundingClientRect();
  var x = ((ev.clientX - rect.left) - canvas.width  / 2) / (canvas.width  / 2);
  var y = (canvas.height / 2 - (ev.clientY - rect.top))  / (canvas.height / 2);
  return [x, y];
}

// RGB sliders 
/*
function updateColor() {
  var r = document.getElementById('slider-r').value / 100;
  var g = document.getElementById('slider-g').value / 100;
  var b = document.getElementById('slider-b').value / 100;
  document.getElementById('r-val').textContent = r.toFixed(2);
  document.getElementById('g-val').textContent = g.toFixed(2);
  document.getElementById('b-val').textContent = b.toFixed(2);
  g_selectedColor = [r, g, b, 1.0];
}
*/ 
function updateColor() {
  var r = document.getElementById('slider-r').value / 100;
  var g = document.getElementById('slider-g').value / 100;
  var b = document.getElementById('slider-b').value / 100;
  g_selectedColor = [r, g, b, 1.0];
}

// size 
//function updateSize() {
  //g_selectedSize = parseFloat(document.getElementById('slider-size').value);
  //document.getElementById('size-val').textContent = g_selectedSize;
//}

function updateSize() {
  g_selectedSize = parseFloat(document.getElementById('slider-size').value);
}


// clear 
function clearCanvas() {
  g_shapesList = [];
  renderAllShapes();
}

// shape selection 
function setShape(type) {
  g_selectedShape = type;
  document.getElementById('btn-point').classList.toggle('active',    type === 'point');
  document.getElementById('btn-triangle').classList.toggle('active', type === 'triangle');
  document.getElementById('btn-circle').classList.toggle('active',   type === 'circle');
}

// segments 
// function updateSegments() {
//   g_segments = parseInt(document.getElementById('slider-seg').value);
//   document.getElementById('seg-val').textContent = g_segments;
// }

function updateSegments() {
  g_segments = parseInt(document.getElementById('slider-seg').value);
}