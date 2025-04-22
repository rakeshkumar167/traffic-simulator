class Vehicle {
  constructor(x, y, dirX, dirY) {
    this.pos = createVector(x, y);
    this.dir = createVector(dirX, dirY).normalize();
    this.speed = 2;
    this.width = 18;
    this.length = 36;
    // Common car colors
    const carColors = [
      color(255, 255, 255),  // White
      color(100, 100, 100),  // Gray
      color(200, 0, 0),      // Red
      color(0, 0, 150),      // Blue
      color(0, 100, 0),      // Green
      color(150, 100, 0),    // Brown
      color(200, 200, 0),    // Yellow
      color(255, 100, 0),    // Orange
      color(255, 0, 255),    // Magenta
      color(0, 255, 255),    // Cyan
      color(255, 100, 255),  // Pink
      color(100, 255, 0)     // Lime
    ];
    this.color = random(carColors);
    this.initialDir = this.dir.copy();
    this.stoppingDistance = 30;
    this.buffer = 5;
    this.zebraCrossingDistance = 5;
    this.lane = random([0, 1]); // 0 for left lane, 1 for right lane
  }

  update(vehicles, signal) {
    if (this.shouldStopBeforeIntersection(signal, vehicles)) {
      this.speed = 0;
      return;
    }

    for (let other of vehicles) {
      if (other === this) continue;
      let distance = p5.Vector.dist(this.pos, other.pos);
      if (distance < this.length * 1.5 && this.isAheadOf(other)) {
        this.speed = 0;
        return;
      }
    }

    this.speed = 2;
    this.pos.add(p5.Vector.mult(this.dir, this.speed));
  }

  isAtIntersection() {
    return this.pos.x > 330 && this.pos.x < 470 && this.pos.y > 330 && this.pos.y < 470;
  }

  shouldStopBeforeIntersection(signal, vehicles) {
    const distanceToZebra = this.getDistanceToZebraCrossing();
    if (distanceToZebra > this.stoppingDistance + this.buffer) {
      return false;
    }

    const lightState = this.getRelevantLightState(signal);
    if (lightState === "green") {
      return false;
    } else if (lightState === "yellow") {
      return distanceToZebra > this.buffer;
    } else { // red
      return distanceToZebra > this.zebraCrossingDistance;
    }
  }

  getDistanceToZebraCrossing() {
    if (this.initialDir.y < 0) { // North
      return this.pos.y - 455;
    } else if (this.initialDir.y > 0) { // South
      return 335 - this.pos.y;
    } else if (this.initialDir.x < 0) { // West
      return this.pos.x - 455;
    } else { // East
      return 335 - this.pos.x;
    }
  }

  getRelevantLightState(signal) {
    if (this.initialDir.y < 0) { // North
      return signal.north;
    } else if (this.initialDir.y > 0) { // South
      return signal.south;
    } else if (this.initialDir.x < 0) { // West
      return signal.west;
    } else { // East
      return signal.east;
    }
  }

  isAheadOf(other) {
    let future = p5.Vector.add(this.pos, this.dir);
    let toOther = p5.Vector.sub(other.pos, this.pos);
    return this.dir.dot(toOther) > 0 && abs(this.dir.angleBetween(toOther)) < PI / 4;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.dir.heading());
    
    // Car body
    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, this.length, this.width, 4);
    
    // Windows
    fill(0, 0, 0, 200); // Light blue with transparency
    // Front window
    rect(-this.length/4, 0, this.length/7, this.width/1.5, 2);
    // Back window
    rect(this.length/8, 0, this.length/5, this.width/1.5, 2);
    
    // ORVMs (Outside Rear View Mirrors)
    fill(this.color);
    // Left mirror
    rect(this.length/5, -this.width/2 - 2, 6, 2, 1);
    // Right mirror
    rect(this.length/5, this.width/2 + 2, 6, 2, 1);
    
    pop();
  }
} 