
// broken ; mid ; lowkirkenuinely just not good

// function addTri(color, vertices) {
//   var t = new Triangle();
//   t.color = color;
//   t.vertices = vertices;
//   g_shapesList.push(t);
// }

// function drawMyPicture() {
//   g_shapesList = [];

//   var OCEAN  = [0.85, 0.92, 1.0, 1.0];
//   var GRAY   = [0.65, 0.65, 0.65, 1.0];
//   var DARK   = [0.20, 0.20, 0.20, 1.0];
//   var WHITE  = [1.0, 1.0, 1.0, 1.0];
//   var BLACK  = [0.0, 0.0, 0.0, 1.0];
//   var ORANGE = [1.0, 0.65, 0.20, 1.0];
//   var YELLOW = [1.0, 0.90, 0.20, 1.0];

// 
//   addTri(OCEAN, [-1,-1, 1,-1, 1,1]);
//   addTri(OCEAN, [-1,-1, 1,1, -1,1]);

//   
//   addTri(GRAY, [-0.80, 0.18, 0.52, 0.18, 0.52,-0.18]);
//   addTri(GRAY, [-0.80, 0.18, 0.52,-0.18, -0.80,-0.18]);

//   
//   addTri(GRAY, [-0.80, 0.18, -1.03, 0.15, -0.80, 0.00]);
//   addTri(GRAY, [-0.80,-0.18, -0.80, 0.00, -1.03,-0.15]);

//   
//   addTri(WHITE, [-0.98, 0.17, -0.95, 0.13, -0.97, 0.08]);
//   addTri(WHITE, [-0.93, 0.14, -0.90, 0.10, -0.92, 0.05]);
//   addTri(WHITE, [-0.88, 0.11, -0.85, 0.07, -0.87, 0.02]);
//   addTri(WHITE, [-0.83, 0.08, -0.80, 0.04, -0.82,-0.01]);

//   
//   addTri(WHITE, [-0.98,-0.17, -0.95,-0.13, -0.97,-0.08]);
//   addTri(WHITE, [-0.93,-0.14, -0.90,-0.10, -0.92,-0.05]);
//   addTri(WHITE, [-0.88,-0.11, -0.85,-0.07, -0.87,-0.02]);
//   addTri(WHITE, [-0.83,-0.08, -0.80,-0.04, -0.82, 0.01]);

//   
//   addTri(BLACK, [-0.67, 0.08, -0.64, 0.08, -0.655, 0.04]);

//   
//   addTri(GRAY, [-0.12, 0.18, 0.00, 0.18, -0.05, 0.44]);

//   
//   addTri(GRAY, [-0.12,-0.18, 0.00,-0.18, -0.05,-0.44]);

//   
//   addTri(GRAY, [0.52, 0.18, 0.52,-0.18, 0.79, 0.00]);

//   
//   addTri(GRAY, [0.79, 0.00, 0.95, 0.28, 0.79, 0.12]);
//   addTri(GRAY, [0.79, 0.00, 0.95,-0.28, 0.79,-0.12]);

//   
//   addTri(ORANGE, [-0.74,-0.50, -0.63,-0.44, -0.63,-0.56]);
//   addTri(YELLOW, [-0.84,-0.50, -0.74,-0.44, -0.74,-0.56]);

//   renderAllShapes();
// }


















// current best code other got chopped 

function addTri(color, vertices) {
  var t = new Triangle();
  t.color = color;
  t.vertices = vertices;
  g_shapesList.push(t);
}

function drawMyPicture() {
  g_shapesList = [];

  var WATER = [0.85, 0.92, 1.0, 1.0];
  var GRAY  = [0.6, 0.6, 0.6, 1.0];
  var DARK  = [0.1, 0.1, 0.1, 1.0];
  var WHITE = [1, 1, 1, 1];
  var BLACK = [0, 0, 0, 1];
  


  // water 
  addTri(WATER, [-1,-1, 1,-1, 1,1]);
  addTri(WATER, [-1,-1, 1,1, -1,1]);

  // body 
  addTri(GRAY, [-0.5, 0.3, 0.5, 0.3, 0.5,-0.3]);
  addTri(GRAY, [-0.5, 0.3, 0.5,-0.3, -0.5,-0.3]);

// mouth 
addTri(GRAY, [-0.50, 0.30, -0.73, 0.15, -0.50, 0.00]);
addTri(GRAY, [-0.50,-0.30, -0.50, 0.00, -.73,-0.15]);

// ── teeth upper 
addTri(WHITE, [-0.72, 0.16, -0.70, 0.13, -0.71, 0.08]); 
addTri(WHITE, [-0.68, 0.13, -0.66, 0.11, -0.67, 0.05]);  
addTri(WHITE, [-0.64, 0.10, -0.62, 0.07, -0.63, 0.02]);  
addTri(WHITE, [-0.60, 0.07, -0.58, 0.05, -0.59, -0.01]); 
addTri(WHITE, [-0.56, 0.04, -0.54, 0.03, -0.55, -0.04]); 

// teeth lower 
addTri(WHITE, [-0.72, -0.16, -0.70, -0.13, -0.71, -0.08]);
addTri(WHITE, [-0.68, -0.13, -0.66, -0.11, -0.67, -0.05]);
addTri(WHITE, [-0.64, -0.10, -0.62, -0.07, -0.63, -0.02]);
addTri(WHITE, [-0.60, -0.07, -0.58, -0.05, -0.59, 0.01]);  
addTri(WHITE, [-0.56, -0.04, -0.54, -0.03, -0.55, 0.04]);  





  // eye 
  addTri(BLACK, [-0.35, 0.10, -0.30, 0.10, -0.325, 0.05]);

  // top fin 
  addTri(GRAY, [-0.1, 0.3, 0.1, 0.3, 0.0, 0.6]);

  // bottom fin 
  addTri(GRAY, [-0.1,-0.3, 0.1,-0.3, 0.0,-0.6]);

  // Tail connection
  addTri(GRAY, [0.5, 0.3, 0.5,-0.3, 0.75, 0]);

// tail 
  addTri(GRAY, [0.75, 0, 0.95, 0.4, 0.75, 0.2]);
  addTri(GRAY, [0.75, 0, 0.95,-0.4, 0.75,-0.2]);

  // F 
  addTri(DARK, [-0.1, 0.2, -0.05, 0.2, -0.1,-0.2]);
  addTri(DARK, [-0.05, 0.2, -0.05,-0.2, -0.1,-0.2]);

  addTri(DARK, [-0.1, 0.2, 0.1, 0.2, 0.1, 0.15]);
  addTri(DARK, [-0.1, 0.2, 0.1, 0.15, -0.1, 0.15]);

  addTri(DARK, [-0.1, 0.05, 0.05, 0.05, 0.05, 0.0]);
  addTri(DARK, [-0.1, 0.05, 0.05, 0.0, -0.1, 0.0]);

  // D 
  addTri(DARK, [0.15, 0.2, 0.2, 0.2, 0.15,-0.2]);
  addTri(DARK, [0.2, 0.2, 0.2,-0.2, 0.15,-0.2]);

  addTri(DARK, [0.15, 0.2, 0.35, 0.2, 0.35, 0.15]);
  addTri(DARK, [0.15, 0.2, 0.35, 0.15, 0.15, 0.15]);

  addTri(DARK, [0.15,-0.15, 0.35,-0.15, 0.35,-0.2]);
  addTri(DARK, [0.15,-0.15, 0.35,-0.2, 0.15,-0.2]);

  addTri(DARK, [0.35, 0.15, 0.45, 0, 0.35,-0.15]);

  // Small fishes 
  var ORANGE = [1.0, 0.65, 0.20, 1.0];
  var YELLOW = [1.0, 0.90, 0.20, 1.0];
  addTri(ORANGE, [-0.74,-0.50, -0.63,-0.44, -0.63,-0.56]);
  addTri(YELLOW, [-0.84,-0.50, -0.74,-0.44, -0.74,-0.56]);

  addTri(ORANGE, [0.30, -0.45, 0.37, -0.41, 0.37, -0.49]);
  addTri(YELLOW, [0.23, -0.45, 0.30, -0.41, 0.30, -0.49]);

  addTri(ORANGE, [-0.85, -0.20, -0.78, -0.16, -0.78, -0.24]);
  addTri(YELLOW, [-0.92, -0.20, -0.85, -0.16, -0.85, -0.24]);

  addTri(ORANGE, [-0.85, -0.05, -0.78, -0.01, -0.78, -0.09]);
  addTri(YELLOW, [-0.92, -0.05, -0.85, -0.01, -0.85, -0.09]);
  renderAllShapes();

}











