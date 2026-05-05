class Camera {
  constructor() {
    this.fov = 60;
    this.eye = new Vector3([16, 1.5, 16]); // start near center of map
    this.at  = new Vector3([16, 1.5, 15]); // looking toward -Z
    this.up  = new Vector3([0, 1, 0]);

    this.viewMatrix       = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.speed = 0.15;

    this._updateMatrices();
  }

  _updateMatrices() {
    this.viewMatrix.setLookAt(
      this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
      this.at.elements[0],  this.at.elements[1],  this.at.elements[2],
      this.up.elements[0],  this.up.elements[1],  this.up.elements[2]
    );
    this.projectionMatrix.setPerspective(
      this.fov,
      canvas.width / canvas.height,
      0.1, 1000
    );
  }


  moveForward() {
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  f.elements[1] = 0; // flatten ; no vertical movement
  f.normalize();
  f.mul(this.speed);
  this.eye.add(f);
  this.at.add(f);
  this._updateMatrices();
}

moveBackwards() {
  let b = new Vector3(this.eye.elements);
  b.sub(this.at);
  b.elements[1] = 0; // flatten ; no vertical movement
  b.normalize();
  b.mul(this.speed);
  this.eye.add(b);
  this.at.add(b);
  this._updateMatrices();
}

  // looks down when going forward and looks up when walking backwards 
  // moveForward() {
  //   let f = new Vector3(this.at.elements);
  //   f.sub(this.eye);
  //   f.normalize();
  //   f.mul(this.speed);
  //   this.eye.add(f);
  //   this.at.add(f);
  //   this._updateMatrices();
  // }

  // moveBackwards() {
  //   let b = new Vector3(this.eye.elements);
  //   b.sub(this.at);
  //   b.normalize();
  //   b.mul(this.speed);
  //   this.eye.add(b);
  //   this.at.add(b);
  //   this._updateMatrices();
  // }

  moveLeft() {
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  f.elements[1] = 0; 
  let s = Vector3.cross(this.up, f);
  s.normalize();
  s.mul(this.speed);
  this.eye.add(s);
  this.at.add(s);
  this._updateMatrices();
}

moveRight() {
  let f = new Vector3(this.at.elements);
  f.sub(this.eye);
  f.elements[1] = 0;
  let s = Vector3.cross(f, this.up);
  s.normalize();
  s.mul(this.speed);
  this.eye.add(s);
  this.at.add(s);
  this._updateMatrices();
}

  panLeft(alpha = 3) {
    let f = new Vector3(this.at.elements);
    f.sub(this.eye);
    let rot = new Matrix4();
    rot.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    let f_prime = rot.multiplyVector3(f);
    this.at = new Vector3([
      this.eye.elements[0] + f_prime.elements[0],
      this.eye.elements[1] + f_prime.elements[1],
      this.eye.elements[2] + f_prime.elements[2],
    ]);
    this._updateMatrices();
  }

  panRight(alpha = 3) {
    this.panLeft(-alpha);
  }

  // Mouse rotation 
  panMouse(dx, dy) {
    // Horizontal ;rotate around up
    this.panLeft(dx * 0.2);

    // Vertical ; rotate around the side vector
    let f = new Vector3(this.at.elements);
    f.sub(this.eye);
    let side = Vector3.cross(f, this.up);
    side.normalize();

    let rot = new Matrix4();
    rot.setRotate(dy * 0.2, side.elements[0], side.elements[1], side.elements[2]);
    let f_prime = rot.multiplyVector3(f);
    this.at = new Vector3([
      this.eye.elements[0] + f_prime.elements[0],
      this.eye.elements[1] + f_prime.elements[1],
      this.eye.elements[2] + f_prime.elements[2],
    ]);
    this._updateMatrices();
  }
}