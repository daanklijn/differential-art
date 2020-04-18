/* Differential art

Visualization of the slope fields of various differential equations made with p5.js.
For more information and examples visit: https://github.com/daanklijn/differential-art

*/

// Canvas dimensions
const CANVAS_HEIGHT = 400,
      CANVAS_WIDTH = 400;

// Dimensions of the slope field
const X_MIN = -3,
      X_MAX = 3,
      Y_MIN = -3,
      Y_MAX = 3,
      X_WIDTH = X_MAX - Y_MIN,
      Y_HEIGHT = Y_MAX - Y_MIN;

// Number of points used for each slope
const PATH_LENGTH = 50;

// Distance between the points in the slope
const STEP_SIZE = 0.05;

// Number of slopes
const SLOPES_COUNT = 400,
      SLOPES_PER_AXIS = Math.sqrt(SLOPES_COUNT);

// Colors and color decay used for the slopes and background
const WHITE = 255,
      BLACK = 0,
      COLOR_DECAY = 10;

// Differential equations used for slope field
const dx = (x, y) => 2 * Math.sin(y) * Math.cos(x),
      dy = (x, y) => 2 * Math.sin(x) * Math.cos(y);

// Functions that map the x and y values to the dimensions of the canvas
const xToCanvas = (x) => (CANVAS_WIDTH / X_WIDTH) * (x - X_MIN),
      yToCanvas = (y) => (CANVAS_HEIGHT / Y_HEIGHT) * (y - Y_MIN);

var t = 0,
    slopes = [];

function setup() {
    for (let x = X_MIN; x < X_MAX; x += (X_WIDTH / SLOPES_PER_AXIS)) {
        for (let y = Y_MIN; y < Y_MAX; y += (Y_HEIGHT / SLOPES_PER_AXIS)) {
            let slope = new Slope(x, y);
            slopes.push(slope);
        }
    }
    createCanvas(CANVAS_HEIGHT, CANVAS_WIDTH);
}

function draw() {
    background(BLACK);
    noFill();
    stroke(WHITE);
    for (let slope of slopes) {
        slope.draw();
    }
    t++;
}

class Slope {
    
    // Calculates all the points along the slope that starts at (x_0,y_0) and stores them in this.path.
    constructor(x_0, y_0) {
        this.offset = random() * WHITE;
        this.path = [];
        let x = x_0;
        let y = y_0;

        for (let i = 1; i < PATH_LENGTH; i++) {
            let y_i = y + dy(x, y) * STEP_SIZE;
            let x_i = x + dx(x, y) * STEP_SIZE;
            this.path.push([xToCanvas(x), yToCanvas(y), xToCanvas(x_i), yToCanvas(y_i)]);
            x = x_i;
            y = y_i;
        }
    }

    // Draws the lines between the points of the slope and gives them appropriate colours.
    draw() {
        let color = this.offset;
        for (let lin of this.path) {
            if (color < BLACK) {
                color = WHITE;
            }
            stroke(color);
            line(...lin);
            color -= COLOR_DECAY;
        }
        this.offset -= COLOR_DECAY;
        if (this.offset < BLACK) {
            this.offset = WHITE;
        }
    }

}
