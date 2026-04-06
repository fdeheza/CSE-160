
class Circle {
  constructor() {
    this.position = [0.0, 0.0];
    this.color    = [1.0, 1.0, 1.0, 1.0];
    this.size     = 10.0;
    this.segments = 12;   
  }

  render() {
    var x    = this.position[0];
    var y    = this.position[1];
    var r    = this.size / 200.0;  
    var segs = this.segments;

    gl.uniform4f(u_FragColor,
      this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniform1f(u_Size, this.size);

    var verts = [];
    var angleStep = (2 * Math.PI) / segs;

    for (var i = 0; i < segs; i++) {
      var a1 = i       * angleStep;
      var a2 = (i + 1) * angleStep;

      verts.push(x, y);
      verts.push(x + r * Math.cos(a1), y + r * Math.sin(a1));
      verts.push(x + r * Math.cos(a2), y + r * Math.sin(a2));
    }

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Fail; buffer ; circle');
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, segs * 3);
  }
}