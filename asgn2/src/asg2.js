
// GLSL Shaders
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotation;
  void main() {
    gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
  }
`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

// global WebGl 
var gl;
var a_Position;
var u_FragColor;
var u_ModelMatrix;
var u_GlobalRotation;

var g_globalRotMat = new Matrix4();  

// joint angle states 
var g_globalAngleY = 180;
var g_globalAngleX = -10;
var g_armAngle     =  30;   
var g_elbowAngle   =  25;   
var g_legAngle     =  30;   
var g_kneeAngle    =  20;  

// animating state
var g_animating = true;
var g_startTime = performance.now() / 1000.0;
var g_seconds   = 0;

var g_aArmL   = 0;
var g_aArmR   = 0;
var g_aElbowL = 0;
var g_aElbowR = 0;
var g_aLegL   = 0;
var g_aLegR   = 0;
var g_aKneeL  = 0;
var g_aKneeR  = 0;

// mouse rotation
var g_mouseDown  = false;
var g_lastMouseX = 0;
var g_lastMouseY = 0;

// performance
var g_frameCount  = 0;
var g_fpsLastTime = performance.now();

// colors
var C_RED   = [0.88, 0.10, 0.10, 1.0];
var C_SKIN  = [0.96, 0.74, 0.53, 1.0];
var C_BLUE  = [0.18, 0.32, 0.82, 1.0];
var C_BROWN = [0.48, 0.26, 0.06, 1.0];
var C_WHITE = [0.95, 0.95, 0.93, 1.0];
var C_GOLD  = [0.95, 0.78, 0.10, 1.0];

// main
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  initCubeBuffer();
  gl.clearColor(0.34, 0.57, 0.92, 1.0);
  requestAnimationFrame(tick);
}

// WebGL
function setupWebGL() {
  var canvas = document.getElementById('webgl');
  gl = getWebGLContext(canvas);
  if (!gl) { console.error('Fail; WebGL context'); return; }
  gl.enable(gl.DEPTH_TEST);
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error('Fail; init shaders');
  }
}

function connectVariablesToGLSL() {
  a_Position       = gl.getAttribLocation (gl.program, 'a_Position');
  u_FragColor      = gl.getUniformLocation(gl.program, 'u_FragColor');
  u_ModelMatrix    = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  if (a_Position < 0 || !u_FragColor || !u_ModelMatrix || !u_GlobalRotation) {
    console.error('Fail; shader variable locations');
  }
}

// HTML UI 
function addActionsForHtmlUI() {
  function bindSlider(id, displayId, onInput) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () {
      document.getElementById(displayId).textContent = this.value + '\u00B0';
      onInput(parseFloat(this.value));
    });
  }

  bindSlider('globalRotY', 'globalRotYVal', function (v) { g_globalAngleY = v; if (!g_animating) renderScene(); });
  bindSlider('globalRotX', 'globalRotXVal', function (v) { g_globalAngleX = v; if (!g_animating) renderScene(); });
  bindSlider('armAngle',   'armAngleVal',   function (v) { g_armAngle   = v; if (!g_animating) renderScene(); });
  bindSlider('elbowAngle', 'elbowAngleVal', function (v) { g_elbowAngle = v; if (!g_animating) renderScene(); });
  bindSlider('legAngle',   'legAngleVal',   function (v) { g_legAngle   = v; if (!g_animating) renderScene(); });
  bindSlider('kneeAngle',  'kneeAngleVal',  function (v) { g_kneeAngle  = v; if (!g_animating) renderScene(); });

  var animBtn = document.getElementById('animBtn');
  animBtn.addEventListener('click', function () {
    g_animating = !g_animating;
    if (g_animating) {
      animBtn.textContent = 'Stop Animation';
      animBtn.style.background = '#e74c3c';
      g_startTime = performance.now() / 1000.0 - g_seconds;
      requestAnimationFrame(tick);
    } else {
      animBtn.textContent = 'Start Animation';
      animBtn.style.background = '#2ecc71';
    }
  });

  var canvas = document.getElementById('webgl');
  canvas.addEventListener('mousedown', function (e) {
    g_mouseDown  = true;
    g_lastMouseX = e.clientX;
    g_lastMouseY = e.clientY;
  });
  canvas.addEventListener('mousemove', function (e) {
    if (!g_mouseDown) return;
    g_globalAngleY += (e.clientX - g_lastMouseX) * 0.5;
    g_globalAngleX  = Math.max(-85, Math.min(85, g_globalAngleX + (e.clientY - g_lastMouseY) * 0.5));
    g_lastMouseX    = e.clientX;
    g_lastMouseY    = e.clientY;
    document.getElementById('globalRotYVal').textContent = Math.round(g_globalAngleY) + '\u00B0';
    document.getElementById('globalRotXVal').textContent = Math.round(g_globalAngleX) + '\u00B0';
    if (!g_animating) renderScene();
  });
  canvas.addEventListener('mouseup',    function () { g_mouseDown = false; });
  canvas.addEventListener('mouseleave', function () { g_mouseDown = false; });
}

// tick 
function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  updateAnimationAngles();
  renderScene();
  updateFPS();
  if (g_animating) requestAnimationFrame(tick);
}

// animation 
function updateAnimationAngles() {
  if (!g_animating) return;
  var t   = g_seconds;
  var spd = 5.0;

  g_aArmL   =  38 * Math.sin(t * spd);
  g_aArmR   = -38 * Math.sin(t * spd);

  g_aElbowL =  28 + 22 * Math.sin(t * spd + 0.8);
  g_aElbowR =  28 - 22 * Math.sin(t * spd + 0.8);

  g_aLegL   = -40 * Math.sin(t * spd);
  g_aLegR   =  40 * Math.sin(t * spd);

  g_aKneeL  =  30 + 28 * Math.max(0,  Math.sin(t * spd));
  g_aKneeR  =  30 + 28 * Math.max(0, -Math.sin(t * spd));
}

// fps 
function updateFPS() {
  g_frameCount++;
  var now     = performance.now();
  var elapsed = now - g_fpsLastTime;
  if (elapsed >= 500) {
    document.getElementById('fps').textContent = 'FPS: ' + (g_frameCount / elapsed * 1000).toFixed(1);
    g_frameCount  = 0;
    g_fpsLastTime = now;
  }
}

// rendering
function renderScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  g_globalRotMat.setRotate(g_globalAngleY, 0, 1, 0);
  g_globalRotMat.rotate(g_globalAngleX, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, g_globalRotMat.elements);
  drawMario();
}

// Part list (19 total):
//   1  Torso (overalls)
//   2  Head
//   3  Hat brim
//   4  Hat top
//   5  Mustache
//   6  Button left  
//   7  Button right 
//   8  Left upper arm     
//   9  Left forearm      
//  10  Left glove/fist    
//  11  Right upper arm    
//  12  Right forearm
//  13  Right glove/fist
//  14  Left thigh         
//  15  Left shin          
//  16  Left shoe          
//  17  Right thigh
//  18  Right shin
//  19  Right shoe

function drawMario() {
  var aArmL   = g_animating ? g_aArmL   :  g_armAngle;
  var aArmR   = g_animating ? g_aArmR   : -g_armAngle;
  var aElbowL = g_animating ? g_aElbowL :  g_elbowAngle;
  var aElbowR = g_animating ? g_aElbowR :  g_elbowAngle;
  var aLegL   = g_animating ? g_aLegL   : -g_legAngle;
  var aLegR   = g_animating ? g_aLegR   :  g_legAngle;
  var aKneeL  = g_animating ? g_aKneeL  :  g_kneeAngle;
  var aKneeR  = g_animating ? g_aKneeR  :  g_kneeAngle;

  var M;

  // torso
  M = new Matrix4();
  M.setScale(0.40, 0.44, 0.30);
  drawCube(M, C_BLUE);

  // head
  M = new Matrix4();
  M.setTranslate(0.0, 0.40, 0.0);
  M.scale(0.36, 0.36, 0.32);
  drawCube(M, C_SKIN);

  // brim ; hat 
  M = new Matrix4();
  M.setTranslate(0.0, 0.60, 0.04);
  M.scale(0.46, 0.06, 0.42);
  drawCube(M, C_RED);

  //  top ; hat 
  M = new Matrix4();
  M.setTranslate(0.0, 0.76, -0.01);
  M.scale(0.36, 0.24, 0.34);
  drawCube(M, C_RED);

  // mustache
  M = new Matrix4();
  M.setTranslate(0.0, 0.33, 0.18);
  M.scale(0.26, 0.07, 0.04);
  drawCube(M, C_BROWN);

  // buttons 
  M = new Matrix4();
  M.setTranslate(-0.09, 0.08, 0.16);
  M.scale(0.05, 0.05, 0.02);
  drawCube(M, C_GOLD);

  M = new Matrix4();
  M.setTranslate( 0.09, 0.08, 0.16);
  M.scale(0.05, 0.05, 0.02);
  drawCube(M, C_GOLD);

  
  // arm chain 
  
  var LAX = -0.23, LAY = 0.16;
  var RAX =  0.23, RAY = 0.16;

  // aupper arm ; left 
  M = new Matrix4();
  M.setTranslate(LAX, LAY, 0.0);
  M.rotate(aArmL, 1, 0, 0);
  M.translate(0.0, -0.10, 0.0);
  M.scale(0.13, 0.20, 0.13);
  drawCube(M, C_RED);

  // forearm ; left 
  M = new Matrix4();
  M.setTranslate(LAX, LAY, 0.0);
  M.rotate(aArmL, 1, 0, 0);
  M.translate(0.0, -0.20, 0.0);   // to elbow
  M.rotate(aElbowL, 1, 0, 0);
  M.translate(0.0, -0.08, 0.0);   // half of forearm height
  M.scale(0.12, 0.16, 0.12);
  drawCube(M, C_SKIN);

  // glove ; left 
  M = new Matrix4();
  M.setTranslate(LAX, LAY, 0.0);
  M.rotate(aArmL, 1, 0, 0);
  M.translate(0.0, -0.20, 0.0);   
  M.rotate(aElbowL, 1, 0, 0);
  M.translate(0.0, -0.16, 0.0);  
  M.scale(0.15, 0.15, 0.15);
  drawCube(M, C_WHITE);

  // upper arm ; right 
  M = new Matrix4();
  M.setTranslate(RAX, RAY, 0.0);
  M.rotate(aArmR, 1, 0, 0);
  M.translate(0.0, -0.10, 0.0);
  M.scale(0.13, 0.20, 0.13);
  drawCube(M, C_RED);

  // forearm ; right 
  M = new Matrix4();
  M.setTranslate(RAX, RAY, 0.0);
  M.rotate(aArmR, 1, 0, 0);
  M.translate(0.0, -0.20, 0.0);
  M.rotate(aElbowR, 1, 0, 0);
  M.translate(0.0, -0.08, 0.0);
  M.scale(0.12, 0.16, 0.12);
  drawCube(M, C_SKIN);

  // glove ; right 
  M = new Matrix4();
  M.setTranslate(RAX, RAY, 0.0);
  M.rotate(aArmR, 1, 0, 0);
  M.translate(0.0, -0.20, 0.0);
  M.rotate(aElbowR, 1, 0, 0);
  M.translate(0.0, -0.16, 0.0);
  M.scale(0.15, 0.15, 0.15);
  drawCube(M, C_WHITE);

  // leg chain
  
  var LLX = -0.11, LLY = -0.22;
  var RLX =  0.11, RLY = -0.22;

  // thigh ; left 
  M = new Matrix4();
  M.setTranslate(LLX, LLY, 0.0);
  M.rotate(aLegL, 1, 0, 0);
  M.translate(0.0, -0.11, 0.0);
  M.scale(0.15, 0.22, 0.16);
  drawCube(M, C_BLUE);

  // shin ; left
  M = new Matrix4();
  M.setTranslate(LLX, LLY, 0.0);
  M.rotate(aLegL, 1, 0, 0);
  M.translate(0.0, -0.22, 0.0);   // to knee joint
  M.rotate(aKneeL, 1, 0, 0);
  M.translate(0.0, -0.10, 0.0);
  M.scale(0.13, 0.20, 0.14);
  drawCube(M, C_BLUE);

  // shoe ; left 
  M = new Matrix4();
  M.setTranslate(LLX, LLY, 0.0);
  M.rotate(aLegL, 1, 0, 0);
  M.translate(0.0, -0.22, 0.0);   // to knee
  M.rotate(aKneeL, 1, 0, 0);
  M.translate(0.0, -0.20, 0.0);   // to ankle
  M.translate(0.0, -0.04, 0.04);  // shift center down + slightly forward
  M.scale(0.16, 0.09, 0.26);
  drawCube(M, C_BROWN);

  // thigh ; right 
  M = new Matrix4();
  M.setTranslate(RLX, RLY, 0.0);
  M.rotate(aLegR, 1, 0, 0);
  M.translate(0.0, -0.11, 0.0);
  M.scale(0.15, 0.22, 0.16);
  drawCube(M, C_BLUE);

  // shin ; right 
  M = new Matrix4();
  M.setTranslate(RLX, RLY, 0.0);
  M.rotate(aLegR, 1, 0, 0);
  M.translate(0.0, -0.22, 0.0);
  M.rotate(aKneeR, 1, 0, 0);
  M.translate(0.0, -0.10, 0.0);
  M.scale(0.13, 0.20, 0.14);
  drawCube(M, C_BLUE);

  // shoe ; right 
  M = new Matrix4();
  M.setTranslate(RLX, RLY, 0.0);
  M.rotate(aLegR, 1, 0, 0);
  M.translate(0.0, -0.22, 0.0);
  M.rotate(aKneeR, 1, 0, 0);
  M.translate(0.0, -0.20, 0.0);
  M.translate(0.0, -0.04, 0.04);
  M.scale(0.16, 0.09, 0.26);
  drawCube(M, C_BROWN);
}

