// performance optimizing by pre allo webGL buffer for cube geometry 
// all calls resue this one buffer instead of reallocating 

var g_cubeBuffer = null;


// 6 faces × 2 triangles × 3 vertices = 36 vertices, 108 floats.
var CUBE_VERTS = new Float32Array([
  // face ; front

  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5,   0.5, 0.5, 0.5,
  -0.5,-0.5, 0.5,   0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,
  // face ; back 

   0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,
   0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5,
  // face ; left

  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5,  -0.5, 0.5, 0.5,
  -0.5,-0.5,-0.5,  -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,
  // face ; right 

   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5,
   0.5,-0.5, 0.5,   0.5, 0.5,-0.5,   0.5, 0.5, 0.5,
  // face ; top

  -0.5, 0.5, 0.5,   0.5, 0.5, 0.5,   0.5, 0.5,-0.5,
  -0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,
  // face ; bottom
  -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,
  -0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5,
]);

// Call once in main() after getting the WebGL context.
function initCubeBuffer() {
  g_cubeBuffer = gl.createBuffer();
  if (!g_cubeBuffer) { console.error('Fail; create cube buffer'); return; }
  gl.bindBuffer(gl.ARRAY_BUFFER, g_cubeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, CUBE_VERTS, gl.STATIC_DRAW);
}


function drawCube(M, color) {
  // Upload color and model matrix as uniforms
  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

  // pre-allocated buffer and configure the attribute pointer
  gl.bindBuffer(gl.ARRAY_BUFFER, g_cubeBuffer);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Draw 12 triangles 
  gl.drawArrays(gl.TRIANGLES, 0, 36);
}