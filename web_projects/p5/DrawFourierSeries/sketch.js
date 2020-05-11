
const USER = 0;
const FOURIER = 1;

let x = [];
let y = [];
let fourierX;
let fourierY;
let time = 0;
let path = [];
let drawing = [];
let state = -1;

function mousePressed() {
  state = USER;
  drawing = [];
  x = [];
  y = [];
  time = 0;
  path = [];
}

function mouseReleased() {
  state = FOURIER;
  const skip = 1;
  for (let i = 0; i < drawing.length; i += skip) {
    x.push(drawing[i].x);
    y.push(drawing[i].y);
  }
  fourierX = dft(x);
  fourierY = dft(y);

  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
  
  console.log("X-axis: "+fourierX);
  console.log("Y-axis: "+fourierY);
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-div');
}

function epiCycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
	ellipse(prevx, prevy, 1);
	stroke(255, 100);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {
  background(0);
  fill(250);
  noStroke();
  textFont('monospace');
  textSize(25);
  text("Start Drawing", 80, 80);
 

  if (state == USER) {
    let point = createVector(mouseX - width / 2, mouseY - height / 2);
    drawing.push(point);
    stroke(255);
    noFill();
    beginShape();
    for (let v of drawing) {
      vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
  } else if (state == FOURIER) {
    let vx = epiCycles(width / 2, 100, 0, fourierX);
    let vy = epiCycles(100, height / 2, HALF_PI, fourierY);
    let v = createVector(vx.x, vy.y);
    path.unshift(v);
    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);

    beginShape();
    noFill();
	stroke(255);
	strokeWeight(2);
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();

    const dt = TWO_PI / fourierY.length;
    time += dt;

    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }
}