import "./style.css";

const my_canvas = document.getElementById("my_canvas") as HTMLCanvasElement;
const ctx = my_canvas.getContext("2d");

let colorValue = 0;
const changeColorSpeed = 1;

const width = my_canvas.width;
const height = my_canvas.height;

const rows = 20;
const cols = 20;

const cellWidth = width / cols;
const cellHeight = height / cols;

const grid = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : 0))
);

const updateColor = () => {
  colorValue = (colorValue + changeColorSpeed) % 360;

  if (ctx) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xPos = col * cellWidth;
        const yPos = row * cellHeight;
        ctx.fillStyle = grid[row][col] ? "black" : "white";
        ctx.fillRect(xPos, yPos, cellWidth, cellHeight);
      }
    }
  }

  requestAnimationFrame(updateColor);
};

updateColor();

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
