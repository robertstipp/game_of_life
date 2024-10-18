import "./style.css";

const my_canvas = document.getElementById("my_canvas") as HTMLCanvasElement;

if (!my_canvas) {
  throw new Error("No Canvas");
}

const ctx = my_canvas.getContext("2d");

if (!my_canvas) {
  throw new Error("No Context");
}

const width = my_canvas.width;
const height = my_canvas.height;

const imageData = ctx?.createImageData(width, height);
const data = imageData?.data;

const rows = height;
const cols = width;
const gridSize = width * height;

let currentGrid = new Uint8Array(gridSize);
let nextGrid = new Uint8Array(gridSize);

for (let i = 0; i < gridSize; i++) {
  currentGrid[i] = Math.random() > 0.5 ? 1 : 0;
}

const processGrid = (grid: Uint8Array, newGrid: Uint8Array) => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      let count = 0;

      // Calculate neighbor indices

      for (let i = -1; i <= 1; i++) {
        const currentRow = row + i;
        if (currentRow < 0 || currentRow >= rows) continue;
        for (let j = -1; j <= 1; j++) {
          const currentCol = col + j;
          if (currentCol < 0 || currentCol >= cols) continue;
          if (i === 0 && j === 0) continue;
          const neighborIdx = currentRow * cols + currentCol;
          count += grid[neighborIdx];
        }
      }

      if (grid[idx] === 0 && count === 3) {
        newGrid[idx] = 1;
      } else if (grid[idx] === 1 && (count > 3 || count < 2)) {
        newGrid[idx] = 0;
      } else {
        newGrid[idx] = grid[idx];
      }
    }
  }
};

const updateCanvas = (grid: Uint8Array) => {
  for (let i = 0; i < gridSize; i++) {
    const color = grid[i] === 1 ? 0 : 255;
    const pixelIndex = i * 4;
    if (data) {
      data[pixelIndex] = color;
      data[pixelIndex + 1] = color;
      data[pixelIndex + 2] = color;
      data[pixelIndex + 3] = 255;
    }
  }
  if (ctx && imageData) {
    ctx.putImageData(imageData, 0, 0);
  }
};

let count = 0;
const update = () => {
  count++;
  processGrid(currentGrid, nextGrid);
  updateCanvas(currentGrid);

  [currentGrid, nextGrid] = [nextGrid, currentGrid];
  requestAnimationFrame(update);
};

update();

// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
