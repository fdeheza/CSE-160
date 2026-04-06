
// chopped and mid 

/*
class Triangle {
  constructor() {
    this.position = [0.0, 0.0];
    this.color    = [1.0, 1.0, 1.0, 1.0];
    this.size     = 10.0;
  }

  render() {
    var x = this.position[0];
    var y = this.position[1];
    var d = this.size / 200.0;  

    gl.uniform4f(u_FragColor,
      this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniform1f(u_Size, this.size);

    drawTriangle([
      x,     y + d,      
      x - d, y - d,      
      x + d, y - d       
    ]);
  }
}

function drawTriangle(vertices) {
  var n = 3;
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Fail; buffer ; triangle');
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}
*/




class Triangle {
  constructor() {
    this.position = [0.0, 0.0];
    this.color    = [1.0, 1.0, 1.0, 1.0];
    this.size     = 10.0;
    this.vertices = null; 
  }

  render() {
    gl.uniform4f(u_FragColor,
      this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniform1f(u_Size, this.size);

    if (this.vertices) {
      drawTriangle(this.vertices);
    } else {
      var x = this.position[0];
      var y = this.position[1];
      var d = this.size / 200.0;
      drawTriangle([
        x,     y + d,
        x - d, y - d,
        x + d, y - d
      ]);
    }
  }
}

function drawTriangle(vertices) {
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Fail; buffer; triangle');
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}