let simulation;

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('canvas-container');
  simulation = new Simulation();

  // Get the slider element
  let spawnRateSlider = document.getElementById('spawnRateSlider');
  
  // Add event listener for slider changes
  spawnRateSlider.addEventListener('input', function() {
    simulation.spawnInterval = parseInt(this.value);
  });
}

function draw() {
  background(86, 125, 70); // #567d46 for grass
  drawRoad();
  simulation.update();
  simulation.draw();
}

function drawRoad() {
  // Draw central vertical and horizontal black road
  fill(0);
  rect(340, 0, 120, height); // Vertical road (wider)
  rect(0, 340, width, 120); // Horizontal road (wider)

  // Lane markings - vertical
  stroke(150);
  strokeWeight(2);
  for (let y = 0; y < height; y += 40) {
    if (y < 340 || y > 460) { // Skip intersection area
      line(360, y, 360, y + 20);
      line(380, y, 380, y + 20);
      line(420, y, 420, y + 20);
      line(440, y, 440, y + 20);
    }
  }
  // Lane markings - horizontal
  for (let x = 0; x < width; x += 40) {
    if (x < 340 || x > 460) { // Skip intersection area
      line(x, 360, x + 20, 360);
      line(x, 380, x + 20, 380);
      line(x, 420, x + 20, 420);
      line(x, 440, x + 20, 440);
    }
  }
  // Continuous center lines until intersection
  stroke(150);
  strokeWeight(2);
  // Vertical center line segments
  line(400, 0, 400, 340);
  line(400, 460, 400, height);
  // Horizontal center line segments
  line(0, 400, 340, 400);
  line(460, 400, width, 400);
  noStroke();

  // Zebra crossings - extended across entire road
  fill(255);
  // North zebra crossing
  for (let i = 0; i < 24; i++) {
    rect(340 + i * 5, 335, 2, 10);
  }
  // South zebra crossing
  for (let i = 0; i < 24; i++) {
    rect(340 + i * 5, 455, 2, 10);
  }
  // East zebra crossing
  for (let i = 0; i < 24; i++) {
    rect(335, 340 + i * 5, 10, 2);
  }
  // West zebra crossing
  for (let i = 0; i < 24; i++) {
    rect(455, 340 + i * 5, 10, 2);
  }

  // Draw traffic light backgrounds and bulbs
  drawTrafficLight(490, 300, simulation.signal.north, true);
  drawTrafficLight(310, 500, simulation.signal.south, true);
  drawTrafficLight(500, 490, simulation.signal.east);
  drawTrafficLight(300, 310, simulation.signal.west);
}

function drawTrafficLight(x, y, state, horizontal = false) {
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
  pop();
} 