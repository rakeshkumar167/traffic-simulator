import * as PIXI from 'pixi.js';

// Constants
const ROAD_WIDTH = 400;
const ROAD_HEIGHT = 400;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 20;
const CAR_SPEED = 2;
const SAFE_DISTANCE = CAR_WIDTH * 2;
const LANE_WIDTH = 40;

// Create the application
const app = new PIXI.Application({
    width: ROAD_WIDTH,
    height: ROAD_HEIGHT,
    backgroundColor: 0x333333,
});

document.body.appendChild(app.view);

// Create road graphics
const road = new PIXI.Graphics();

// Main road outline
road.lineStyle(2, 0xffffff);
road.drawRect(0, 0, ROAD_WIDTH, ROAD_HEIGHT);

// Draw lanes
road.lineStyle(1, 0xffffff, 0.5);
// Vertical lanes
road.moveTo(ROAD_WIDTH / 2 - LANE_WIDTH, 0);
road.lineTo(ROAD_WIDTH / 2 - LANE_WIDTH, ROAD_HEIGHT);
road.moveTo(ROAD_WIDTH / 2 + LANE_WIDTH, 0);
road.lineTo(ROAD_WIDTH / 2 + LANE_WIDTH, ROAD_HEIGHT);

// Horizontal lanes
road.moveTo(0, ROAD_HEIGHT / 2 - LANE_WIDTH);
road.lineTo(ROAD_WIDTH, ROAD_HEIGHT / 2 - LANE_WIDTH);
road.moveTo(0, ROAD_HEIGHT / 2 + LANE_WIDTH);
road.lineTo(ROAD_WIDTH, ROAD_HEIGHT / 2 + LANE_WIDTH);

app.stage.addChild(road);

// Vehicle class
class Vehicle {
    constructor(x, y, direction, color) {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(color);
        this.sprite.drawRect(0, 0, CAR_WIDTH, CAR_HEIGHT);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.direction = direction; // 'north', 'south', 'east', 'west'
        this.speed = CAR_SPEED;
        this.isMoving = true;

        // Rotate the car based on direction
        if (direction === 'east' || direction === 'west') {
            this.sprite.rotation = 0;
        } else {
            this.sprite.rotation = Math.PI / 2;
        }

        app.stage.addChild(this.sprite);
    }

    getLanePosition() {
        switch (this.direction) {
            case 'north':
                return ROAD_WIDTH / 2 + LANE_WIDTH / 2;
            case 'south':
                return ROAD_WIDTH / 2 - LANE_WIDTH / 2;
            case 'east':
                return ROAD_HEIGHT / 2 - LANE_WIDTH / 2;
            case 'west':
                return ROAD_HEIGHT / 2 + LANE_WIDTH / 2;
            default:
                return 0;
        }
    }

    update(vehicles) {
        if (!this.isMoving) return;

        // Check for vehicles ahead
        const vehiclesAhead = vehicles.filter(v => {
            if (v === this) return false;
            
            const distance = this.getDistanceToVehicle(v);
            if (distance === null) return false;
            
            return distance < SAFE_DISTANCE;
        });

        // Adjust speed based on vehicles ahead
        this.speed = vehiclesAhead.length > 0 ? CAR_SPEED * 0.5 : CAR_SPEED;

        // Move the vehicle
        switch (this.direction) {
            case 'north':
                this.sprite.y -= this.speed;
                if (this.sprite.y < -CAR_HEIGHT) {
                    this.sprite.y = ROAD_HEIGHT;
                }
                this.sprite.x = this.getLanePosition() - CAR_HEIGHT / 2;
                break;
            case 'south':
                this.sprite.y += this.speed;
                if (this.sprite.y > ROAD_HEIGHT) {
                    this.sprite.y = -CAR_HEIGHT;
                }
                this.sprite.x = this.getLanePosition() - CAR_HEIGHT / 2;
                break;
            case 'east':
                this.sprite.x += this.speed;
                if (this.sprite.x > ROAD_WIDTH) {
                    this.sprite.x = -CAR_WIDTH;
                }
                this.sprite.y = this.getLanePosition() - CAR_WIDTH / 2;
                break;
            case 'west':
                this.sprite.x -= this.speed;
                if (this.sprite.x < -CAR_WIDTH) {
                    this.sprite.x = ROAD_WIDTH;
                }
                this.sprite.y = this.getLanePosition() - CAR_WIDTH / 2;
                break;
        }
    }

    getDistanceToVehicle(other) {
        if (this.direction !== other.direction) return null;

        switch (this.direction) {
            case 'north':
                if (Math.abs(this.sprite.x - other.sprite.x) < CAR_WIDTH) {
                    const dist = this.sprite.y - other.sprite.y;
                    return dist > 0 ? dist : null;
                }
                break;
            case 'south':
                if (Math.abs(this.sprite.x - other.sprite.x) < CAR_WIDTH) {
                    const dist = other.sprite.y - this.sprite.y;
                    return dist > 0 ? dist : null;
                }
                break;
            case 'east':
                if (Math.abs(this.sprite.y - other.sprite.y) < CAR_HEIGHT) {
                    const dist = other.sprite.x - this.sprite.x;
                    return dist > 0 ? dist : null;
                }
                break;
            case 'west':
                if (Math.abs(this.sprite.y - other.sprite.y) < CAR_HEIGHT) {
                    const dist = this.sprite.x - other.sprite.x;
                    return dist > 0 ? dist : null;
                }
                break;
        }
        return null;
    }
}

// Create vehicles
const vehicles = [];
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

// Create vehicles for each direction
for (let i = 0; i < 3; i++) {
    // Northbound vehicles (right lane)
    vehicles.push(new Vehicle(
        ROAD_WIDTH / 2 + LANE_WIDTH / 2,
        ROAD_HEIGHT + i * SAFE_DISTANCE,
        'north',
        colors[i % colors.length]
    ));
    
    // Southbound vehicles (left lane)
    vehicles.push(new Vehicle(
        ROAD_WIDTH / 2 - LANE_WIDTH / 2,
        -CAR_HEIGHT - i * SAFE_DISTANCE,
        'south',
        colors[(i + 1) % colors.length]
    ));
    
    // Eastbound vehicles (left lane)
    vehicles.push(new Vehicle(
        -CAR_WIDTH - i * SAFE_DISTANCE,
        ROAD_HEIGHT / 2 - LANE_WIDTH / 2,
        'east',
        colors[(i + 2) % colors.length]
    ));
    
    // Westbound vehicles (right lane)
    vehicles.push(new Vehicle(
        ROAD_WIDTH + i * SAFE_DISTANCE,
        ROAD_HEIGHT / 2 + LANE_WIDTH / 2,
        'west',
        colors[(i + 3) % colors.length]
    ));
}

// Animation loop
app.ticker.add(() => {
    vehicles.forEach(vehicle => vehicle.update(vehicles));
}); 