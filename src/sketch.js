let simulation;

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('canvas-container');
  simulation = new Simulation();

  // Get the slider element and value display
  let spawnRateSlider = document.getElementById('spawnRateSlider');
  let spawnRateValue = document.getElementById('spawnRateValue');
  
  // Add event listener for slider changes
  spawnRateSlider.addEventListener('input', function() {
    // Reverse the value (120 - value) so lower slider = lower spawn rate
    const reversedValue = 120 - parseInt(this.value);
    simulation.spawnInterval = reversedValue;
    spawnRateValue.textContent = reversedValue;
  });
}

function draw() {
  background(86, 125, 70); // #567d46 for grass
  drawRoad();
  simulation.update();
  simulation.draw();
  
  // Add tick marks on both axes
  stroke(0); // Black color for lines
  strokeWeight(1);
  textSize(12);
  textAlign(CENTER, CENTER);
  fill(0); // Black color for text
  
  // X-axis ticks (bottom)
  for (let x = 0; x <= width; x += 100) {
    line(x, height - 5, x, height);
    push();
    translate(x, height + 15);
    text(`${x}px`, 0, 0);
    pop();
    push();
    translate(x, height + 30);
    text(`(${x},0)`, 0, 0);
    pop();
  }
  
  // Y-axis ticks (left)
  for (let y = 0; y <= height; y += 100) {
    line(0, y, 5, y);
    push();
    translate(-40, y);
    text(`${y}px`, 0, 0);
    pop();
    push();
    translate(-80, y);
    text(`(0,${y})`, 0, 0);
    pop();
  }
}

function drawRoad() {
  // Draw central vertical and horizontal black road
  fill(0);
  rect(320, 0, 160, height); // Vertical road (wider)
  rect(0, 320, width, 160); // Horizontal road (wider)

  // Lane markings - vertical
  stroke(150);
  strokeWeight(2);
  for (let y = 0; y < height; y += 60) {
    if (y < 320 || y > 480) { // Skip intersection area
      //line(340, y, 340, y + 20);
      line(360, y, 360, y + 20);
      line(440, y, 440, y + 20);
      //line(460, y, 460, y + 20);
    }
  }
  // Lane markings - horizontal
  for (let x = 0; x < width; x += 60) {
    if (x < 320 || x > 480) { // Skip intersection area
      //line(x, 340, x + 20, 340);
      line(x, 360, x + 20, 360);
      line(x, 440, x + 20, 440);
      //line(x, 460, x + 20, 460);
    }
  }
  // Continuous center lines until intersection
  stroke(150);
  strokeWeight(2);
  // Vertical center line segments
  line(400, 0, 400, 320);
  line(400, 480, 400, height);
  // Horizontal center line segments
  line(0, 400, 320, 400);
  line(480, 400, width, 400);
  noStroke();

  // Zebra crossings - extended across entire road
  fill(255);
  // North zebra crossing
  for (let i = 0; i < 32; i++) {
    rect(320 + i * 5, 315, 2, 10);
  }
  // South zebra crossing
  for (let i = 0; i < 32; i++) {
    rect(320 + i * 5, 475, 2, 10);
  }
  // East zebra crossing
  for (let i = 0; i < 32; i++) {
    rect(315, 320 + i * 5, 10, 2);
  }
  // West zebra crossing
  for (let i = 0; i < 32; i++) {
    rect(475, 320 + i * 5, 10, 2);
  }

  // Draw traffic light backgrounds and bulbs
  drawTrafficLight(290, 280, simulation.signal.east, false, "2");  // East moved to North's position
  drawTrafficLight(280, 510, simulation.signal.north, true, "1");  // North moved to West's position
  drawTrafficLight(520, 290, simulation.signal.south, true, "3");  // South moved to East's position and rotated
  drawTrafficLight(510, 520, simulation.signal.west, false, "4");    // West moved to South's position and rotated
}

function drawTrafficLight(x, y, state, horizontal = false, signalNumber) {
  push();
  translate(x, y);
  if (horizontal) {
    rotate(-PI / 2);
  }
  rectMode(CENTER);
  fill(50);
  rect(0, 0, 20, 50, 5);

  // Red light
  fill(state === "red" ? "red" : "darkgrey");
  ellipse(0, -10, 10);

  // Yellow light
  fill(state === "yellow" ? "yellow" : "darkgrey");
  ellipse(0, 0, 10);

  // Green light
  fill(state === "green" ? "lime" : "darkgrey");
  ellipse(0, 10, 10);

  // Add signal number label
  fill(255);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(signalNumber, 0, -30);
  pop();
} 