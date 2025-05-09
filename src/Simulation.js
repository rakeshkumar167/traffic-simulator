class Simulation {
  constructor() {
    this.vehicles = [];
    this.spawnInterval = 60;
    this.frameCounter = 0;
    this.signalTimer = 0;
    this.greenDuration = 600; // Duration of green light
    this.yellowDuration = 150; // Duration of yellow light
    this.allRedDuration = 30; // Duration of all-red phase
    this.currentPhase = 0;
    this.phases = [
      { north: "green", south: "red", east: "red", west: "red" },    // Phase 1: North green
      { north: "yellow", south: "red", east: "red", west: "red" },   // Phase 2: North yellow
      { north: "red", south: "red", east: "red", west: "red" },      // Phase 3: All red
      { north: "red", south: "red", east: "green", west: "red" },    // Phase 4: East green
      { north: "red", south: "red", east: "yellow", west: "red" },   // Phase 5: East yellow
      { north: "red", south: "red", east: "red", west: "red" },      // Phase 6: All red
      { north: "red", south: "green", east: "red", west: "red" },    // Phase 7: South green
      { north: "red", south: "yellow", east: "red", west: "red" },   // Phase 8: South yellow
      { north: "red", south: "red", east: "red", west: "red" },      // Phase 9: All red
      { north: "red", south: "red", east: "red", west: "green" },    // Phase 10: West green
      { north: "red", south: "red", east: "red", west: "yellow" },   // Phase 11: West yellow
      { north: "red", south: "red", east: "red", west: "red" }       // Phase 12: All red
    ];
    this.phaseDurations = [
      this.greenDuration,
      this.yellowDuration,
      this.allRedDuration,
      this.greenDuration,
      this.yellowDuration,
      this.allRedDuration,
      this.greenDuration,
      this.yellowDuration,
      this.allRedDuration,
      this.greenDuration,
      this.yellowDuration,
      this.allRedDuration
    ];
    this.signal = this.phases[this.currentPhase];
  }

  update() {
    this.frameCounter++;
    this.signalTimer++;

    // Update traffic light phase
    if (this.signalTimer >= this.phaseDurations[this.currentPhase]) {
      this.signalTimer = 0;
      this.currentPhase = (this.currentPhase + 1) % this.phases.length;
      this.signal = this.phases[this.currentPhase];
    }

    if (this.frameCounter % this.spawnInterval === 0) {
      this.spawnVehicle();
    }

    for (let v of this.vehicles) {
      v.update(this.vehicles, this.signal);
    }

    // Remove vehicles that are out of bounds
    this.vehicles = this.vehicles.filter(v => 
      v.pos.x > -100 && v.pos.x < width + 100 && 
      v.pos.y > -100 && v.pos.y < height + 100
    );
  }

  draw() {
    for (let v of this.vehicles) {
      v.draw();
    }
  }

  spawnVehicle() {
    const dir = random(["north", "south", "east", "west"]);
    if (dir === "north") {
      const randomNumber = random(0, 1);
      if (randomNumber < 0.5) {
        this.vehicles.push(new Vehicle(340, height, 0, -1));
      } else {
        this.vehicles.push(new Vehicle(380, height, 0, -1));
      }
    } else if (dir === "south") {
      const randomNumber = random(0, 1);
      if (randomNumber < 0.5) {
        this.vehicles.push(new Vehicle(460, 0, 0, 1));
      } else {
        this.vehicles.push(new Vehicle(420, 0, 0, 1));
      }
    } else if (dir === "east") {
      const randomNumber = random(0, 1);
      if (randomNumber < 0.5) {
        this.vehicles.push(new Vehicle(0, 340, 1, 0));
      } else {
        this.vehicles.push(new Vehicle(0, 380, 1, 0));
      }
    } else if (dir === "west") {
      const randomNumber = random(0, 1);
      if (randomNumber < 0.5) {
        this.vehicles.push(new Vehicle(width, 460, -1, 0));
      } else {
        this.vehicles.push(new Vehicle(width, 420, -1, 0));
      }
    }
  }
} 