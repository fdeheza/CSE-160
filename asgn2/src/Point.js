
class Point {
  constructor() {
    this.position = [0.0, 0.0];
    this.color    = [1.0, 1.0, 1.0, 1.0];
    this.size     = 10.0;
  }

  render() {
    gl.disableVertexAttribArray(a_Position); // fixed error; point appearing on top of triangles ; and coulndt switch back to point mode
    gl.uniform4f(u_FragColor,
      this.color[0], this.color[1], this.color[2], this.color[3]);

    gl.uniform1f(u_Size, this.size);

    gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}



