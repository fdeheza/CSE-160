class Cube {
  constructor() {
    this.color      = [1, 1, 1, 1]; // default white
    this.textureNum = -2;           // default solid color

    this.matrix = new Matrix4();    // model matrix
  }

  
  // Unit cube from 0,0,0 to 1,1,1
  // 6f × 2tri × 3 ver = 36 vertices
  // Each vertex; [x, y, z, u, v]
  static get VERTICES() {
    return new Float32Array([
      // front ; z=1
      0,0,1, 0,0,  1,0,1, 1,0,  1,1,1, 1,1,
      0,0,1, 0,0,  1,1,1, 1,1,  0,1,1, 0,1,
      // back; z=0
      1,0,0, 0,0,  0,0,0, 1,0,  0,1,0, 1,1,
      1,0,0, 0,0,  0,1,0, 1,1,  1,1,0, 0,1,
      // left ; x=0
      0,0,0, 0,0,  0,0,1, 1,0,  0,1,1, 1,1,
      0,0,0, 0,0,  0,1,1, 1,1,  0,1,0, 0,1,
      // right ; x=1
      1,0,1, 0,0,  1,0,0, 1,0,  1,1,0, 1,1,
      1,0,1, 0,0,  1,1,0, 1,1,  1,1,1, 0,1,
      // top ; y=1
      0,1,1, 0,0,  1,1,1, 1,0,  1,1,0, 1,1,
      0,1,1, 0,0,  1,1,0, 1,1,  0,1,0, 0,1,
      // bottom ; y=0
      0,0,0, 0,0,  1,0,0, 1,0,  1,0,1, 1,1,
      0,0,0, 0,0,  1,0,1, 1,1,  0,0,1, 0,1,
    ]);
  }

  // render
  render() {
    // push model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //pushing color and texture 
    gl.uniform4f(u_BaseColor, ...this.color);
    gl.uniform1i(u_whichTexture, this.textureNum);

    // Upload the vertex data ; positions + UVs 
    const verts = Cube.VERTICES;
    const FSIZE = verts.BYTES_PER_ELEMENT; // 4 bytes 
    const STRIDE = 5 * FSIZE;             // 5 floats 

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);

    // position ;first 3 floats
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, STRIDE, 0);
    gl.enableVertexAttribArray(a_Position);

    // UV ; last 2 floats
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, STRIDE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_UV);

    //Drawing all 36 vertices in one single call
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
}