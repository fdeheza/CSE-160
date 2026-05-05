// shaders

const VSHADER_SOURCE = `
  precision mediump float;

  attribute vec4 a_Position;
  attribute vec2 a_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  varying vec2 v_UV;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;

  varying vec2 v_UV;

  uniform int   u_whichTexture;   // -2=color, 0-3=texture unit
  uniform vec4  u_BaseColor;
  uniform sampler2D u_Sampler0;   // sky
  uniform sampler2D u_Sampler1;   // grass/ground
  uniform sampler2D u_Sampler2;   // brick/wall
  uniform sampler2D u_Sampler3;   // coin

  void main() {
    if      (u_whichTexture == -2) { gl_FragColor = u_BaseColor; }
    else if (u_whichTexture ==  0) { gl_FragColor = texture2D(u_Sampler0, v_UV); }
    else if (u_whichTexture ==  1) { gl_FragColor = texture2D(u_Sampler1, v_UV); }
    else if (u_whichTexture ==  2) { gl_FragColor = texture2D(u_Sampler2, v_UV); }
    else if (u_whichTexture ==  3) { gl_FragColor = texture2D(u_Sampler3, v_UV); }
    else                           { gl_FragColor = vec4(v_UV, 1.0, 1.0); } // debug UVs
  }
`;


// Global GL Vars
let canvas, gl;

// Attribute locations
let a_Position, a_UV;

// Uniform locs
let u_ModelMatrix, u_ViewMatrix, u_ProjectionMatrix;
let u_BaseColor, u_whichTexture;
let u_Sampler0, u_Sampler1, u_Sampler2, u_Sampler3;

// Global cam
let camera;

let g_jumping = false;
let g_velY    = 0;
// let g_atYOffset = 0; // saves at.y - eye.y when jump starts
const GRAVITY       = -0.008;
const JUMP_FORCE    =  0.15;
const GROUND_HEIGHT =  1.5;

function getFloorHeight(x, z) {
  const tx = Math.floor(x);
  const tz = Math.floor(z);
  if (tx < 0 || tx >= 32 || tz < 0 || tz >= 32) return GROUND_HEIGHT;
  const wallHeight = map[tz][tx];
  return wallHeight > 0 ? wallHeight + GROUND_HEIGHT : GROUND_HEIGHT;
}


// World map 32 * 32
// 0 = empty, 1-4 = wall height
const map = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,4],
  [4,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4],
  [4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4],
  [4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4],
  [4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,4],
  [4,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];


// functions for set up 

function setupWebGL() {
  canvas = document.getElementById('webgl');
  const wrapper = document.getElementById('canvas-wrapper');
  canvas.width  = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;

  gl = canvas.getContext('webgl', { antialias: false });
  if (!gl) { console.log('fail; WebGL context'); return; }

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Fail ; init shaders');
    return;
  }

  // Attributes
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  a_UV       = gl.getAttribLocation(gl.program, 'a_UV');

  // Uni; matrices
  u_ModelMatrix      = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_ViewMatrix       = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');

  // Uni; color/texture
  u_BaseColor    = gl.getUniformLocation(gl.program, 'u_BaseColor');
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');

  // Uni;  samplers
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');

  // tell sampler wut texture unit to use (can set once and leave 4ever)
  gl.uniform1i(u_Sampler0, 0);
  gl.uniform1i(u_Sampler1, 1);
  gl.uniform1i(u_Sampler2, 2);
  gl.uniform1i(u_Sampler3, 3);

  // identity model matrix ; default
  let identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}



// loading texture 
function initTextures() {
  const textures = [
    { unit: gl.TEXTURE0, src: '../lib/textures/sky.png'   },
    { unit: gl.TEXTURE1, src: '../lib/textures/grass.png' },
    { unit: gl.TEXTURE2, src: '../lib/textures/brick.png' },
    { unit: gl.TEXTURE3, src: '../lib/textures/coin.png'  },
  ];

  textures.forEach(({ unit, src }) => {
    const image = new Image();
    const tex   = gl.createTexture();
    image.onload = () => {
      gl.activeTexture(unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    };
    image.src = src;
  });
}


// input 
const keys = {};

function setupInput() {
  document.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'f') addBlockAhead();
  if (e.key.toLowerCase() === 'r') removeBlockAhead();
  if (e.key === ' ' && !g_jumping) {
  g_jumping = true;
  g_velY    = JUMP_FORCE;
}
});

const overlay = document.getElementById('click-overlay');

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    overlay.classList.add('hidden');
    document.addEventListener('mousemove', onMouseMove);
  } else {
    overlay.classList.remove('hidden');
    document.removeEventListener('mousemove', onMouseMove);
  }
});

  document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
  });

  // Pointer lock ; click canvas to get mouse ; user escapes to release
canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    document.addEventListener('mousemove', onMouseMove);
  } else {
    document.removeEventListener('mousemove', onMouseMove);
  }
});

function onMouseMove(e) {
  camera.panMouse(-e.movementX, -e.movementY);
}
}

function processKeys() {
  const saveEye = new Vector3(camera.eye.elements);
  const saveAt  = new Vector3(camera.at.elements);

  if (keys['w']) camera.moveForward();
  if (keys['s']) camera.moveBackwards();
  if (keys['a']) camera.moveLeft();
  if (keys['d']) camera.moveRight();
  if (keys['q']) camera.panLeft();
  if (keys['e']) camera.panRight();

  //  weird glitch where we had to revert horizontal movement if inside a wall
  if (isInsideWall(camera.eye.elements[0], camera.eye.elements[2])) {
    camera.eye = saveEye;
    camera.at  = saveAt;
    camera._updateMatrices();
  }

  const floor = getFloorHeight(camera.eye.elements[0], camera.eye.elements[2]);

  if (g_jumping) {
    // apply gravity and move vertically
    g_velY += GRAVITY;
    camera.eye.elements[1] += g_velY;
    camera.at.elements[1]  += g_velY;

    // Land — only set eye.y, leave at.y alone so mouse look is preserved
if (camera.eye.elements[1] <= floor) {
  const atEyeDiff = camera.at.elements[1] - camera.eye.elements[1];
  camera.eye.elements[1] = floor;
  camera.at.elements[1]  = floor + atEyeDiff; // preserve exact looking angle at landing
  g_jumping = false;
  g_velY    = 0;
}
  } else {
    if (camera.eye.elements[1] > floor + 0.01) {
      // walked off a block edge ;start falling
      g_jumping = true;
      g_velY    = 0;
    } else {
      //on the ground or top of a block
      camera.eye.elements[1] = floor;
    }
  }

  camera._updateMatrices();
}



// add/delete Blocks ; F = add,  R = remove
function getBlockAhead() {
  let f = new Vector3(camera.at.elements);
  f.sub(camera.eye);
  f.normalize();

  const tx = Math.floor(camera.eye.elements[0] + f.elements[0] * 1.5);
  const tz = Math.floor(camera.eye.elements[2] + f.elements[2] * 1.5);

  if (tx < 0 || tx >= 32 || tz < 0 || tz >= 32) return null;
  return { tx, tz };
}

function addBlockAhead() {
  const pos = getBlockAhead();
  if (!pos) return;
  if (map[pos.tz][pos.tx] < 4) map[pos.tz][pos.tx]++;
}

function removeBlockAhead() {
  const pos = getBlockAhead();
  if (!pos) return;
  if (map[pos.tz][pos.tx] > 0) map[pos.tz][pos.tx]--;
}


// Rendering
function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // pushing matrices to GPU once per frame
  gl.uniformMatrix4fv(u_ViewMatrix,       false, camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projectionMatrix.elements);

  // sky
gl.disable(gl.CULL_FACE);
let sky = new Cube();
sky.color      = [0.3, 0.6, 1.0, 1.0];
sky.textureNum = -2;
sky.matrix.setTranslate(-500, -500, -500);
sky.matrix.scale(1000, 1000, 1000);
sky.render();
gl.enable(gl.CULL_FACE);

  // ground ;flat cube, grass texture
  let ground = new Cube();
  ground.textureNum = 1;
  ground.matrix.setTranslate(0, -0.02, 0);
  ground.matrix.scale(32, 0.02, 32);
  ground.render();

  // walls ; read heights from map, stack cubes
  for (let x = 0; x < 32; x++) {
    for (let z = 0; z < 32; z++) {
      const h = map[z][x];
      for (let y = 0; y < h; y++) {
        let wall = new Cube();
        wall.textureNum = 2; // brick
        wall.matrix.setTranslate(x, y, z);
        wall.render();
      }
    }
  }




}


// as the name states


function isInsideWall(x, z) {
  const buffer = 0.3;
  const corners = [
    [x + buffer, z + buffer],
    [x + buffer, z - buffer],
    [x - buffer, z + buffer],
    [x - buffer, z - buffer],
  ];
  for (let [cx, cz] of corners) {
    const tx = Math.floor(cx);
    const tz = Math.floor(cz);
    if (tx < 0 || tx >= 32 || tz < 0 || tz >= 32) return true;
    const wallHeight = map[tz][tx];
    // only block if the wall is taller than where the user currently is
    // camera.eye.elements[1] ; GROUND_HEIGHT gives how high above ground we are
    if (wallHeight > 0 && camera.eye.elements[1] < wallHeight + GROUND_HEIGHT - 0.1) {
      return true;
    }
  }
  return false;
}

// functio got chopped ; use other one

// function isInsideWall(x, z) {
//   const buffer = 0.3;
//   const corners = [
//     [x + buffer, z + buffer],
//     [x + buffer, z - buffer],
//     [x - buffer, z + buffer],
//     [x - buffer, z - buffer],
//   ];
//   for (let [cx, cz] of corners) {
//     const tx = Math.floor(cx);
//     const tz = Math.floor(cz);
//     if (tx < 0 || tx >= 32 || tz < 0 || tz >= 32) return true;
//     if (map[tz][tx] > 0) return true;
//   }
//   return false;
// }


// main
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  initTextures();

  camera = new Camera();
  setupInput();

  requestAnimationFrame(tick);
}

function tick() {
  processKeys();
  renderAllShapes();
  requestAnimationFrame(tick);
}


function tick() {
  processKeys();
  renderAllShapes();
  updateFPS();
  requestAnimationFrame(tick);
}

// FPS tracking globals ; dont forget to add these near other globals
let g_frameCount  = 0;
let g_fpsLastTime = performance.now();

function updateFPS() {
  g_frameCount++;
  const now     = performance.now();
  const elapsed = now - g_fpsLastTime;
  if (elapsed >= 500) {
    document.getElementById('fps').textContent =
      (g_frameCount / elapsed * 1000).toFixed(1);
    g_frameCount  = 0;
    g_fpsLastTime = now;
  }
}

main();