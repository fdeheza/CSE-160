//Francisco Deheza
//fdeheza@ucsc.edu 

// https://claude.ai/share/9a6e2cb7-9c72-443e-aba2-71f53eaaee28



// asg0.js
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var v1 = new Vector3([2.25, 2.25, 0]);

  drawVector(v1, "red");
}

function drawVector(v, color) {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(centerX, centerY);
  // Scale by 20, and flip Y axis since canvas Y goes downward
  ctx.lineTo(centerX + v.elements[0] * 20, centerY - v.elements[1] * 20);
  ctx.stroke();
}

function handleDrawEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var x1 = parseFloat(document.getElementById('x1').value);
  var y1 = parseFloat(document.getElementById('y1').value);
  var v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, "red");

  var x2 = parseFloat(document.getElementById('x2').value);
  var y2 = parseFloat(document.getElementById('y2').value);
  var v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Read v1 and v2
    var x1 = parseFloat(document.getElementById('x1').value);
    var y1 = parseFloat(document.getElementById('y1').value);
    var v1 = new Vector3([x1, y1, 0]);
    drawVector(v1, "red");

    var x2 = parseFloat(document.getElementById('x2').value);
    var y2 = parseFloat(document.getElementById('y2').value);
    var v2 = new Vector3([x2, y2, 0]);
    drawVector(v2, "blue");

    // Read operation and scalar
    var op = document.getElementById('operation').value;
    var s = parseFloat(document.getElementById('scalar').value);

    if (op === 'add') {
        var v3 = new Vector3([x1, y1, 0]);
        v3.add(v2);
        drawVector(v3, "green");
    } else if (op === 'sub') {
        var v3 = new Vector3([x1, y1, 0]);
        v3.sub(v2);
        drawVector(v3, "green");
    } else if (op === 'mul') {
        var v3 = new Vector3([x1, y1, 0]);
        v3.mul(s);
        drawVector(v3, "green");
        var v4 = new Vector3([x2, y2, 0]);
        v4.mul(s);
        drawVector(v4, "green");
    } else if (op === 'div') {
        var v3 = new Vector3([x1, y1, 0]);
        v3.div(s);
        drawVector(v3, "green");
        var v4 = new Vector3([x2, y2, 0]);
        v4.div(s);
        drawVector(v4, "green");
    } else if (op === 'magnitude') {
        console.log("Magnitude of v1: " + v1.magnitude());
        console.log("Magnitude of v2: " + v2.magnitude());
    } else if (op === 'normalize') {
        var v3 = new Vector3([x1, y1, 0]);
        v3.normalize();
        drawVector(v3, "green");
        var v4 = new Vector3([x2, y2, 0]);
        v4.normalize();
        drawVector(v4, "green");
    } else if (op === 'angle') {
        var angle = angleBetween(v1, v2);
        console.log("Angle: " + angle);
    } else if (op === 'area') {
        var area = areaTriangle(v1, v2);
        console.log("Area of triangle: " + area);
    }
}

function angleBetween(v1, v2) {
    var dot = Vector3.dot(v1, v2);
    var mag1 = v1.magnitude();
    var mag2 = v2.magnitude();
    var cosAngle = dot / (mag1 * mag2);
    cosAngle = Math.min(1, Math.max(-1, cosAngle));  // saftey measure ; floating point
    var angle = Math.acos(cosAngle);
    return angle * (180 / Math.PI); // degs 
}

function areaTriangle(v1, v2) {
    var cross = Vector3.cross(v1, v2);
    return cross.magnitude() / 2;
}

/* DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)'; // Set color to blue
  ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color
}
*/