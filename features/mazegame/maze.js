const grid = document.getElementById("grid");
const size = 10;
let start = { x: 0, y: 0 };
let end = { x: 9, y: 9 };
let cells = [];

function createGrid() {
  grid.innerHTML = "";
  cells = [];

  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      if (x === start.x && y === start.y) div.classList.add("start");
      if (x === end.x && y === end.y) div.classList.add("end");
      grid.appendChild(div);
      row.push(div);
    }
    cells.push(row);
  }
}

function generateMaze() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) {
        cells[y][x].className = "cell";
        if (x === start.x && y === start.y) cells[y][x].classList.add("start");
        if (x === end.x && y === end.y) cells[y][x].classList.add("end");
      } else {
        cells[y][x].className = "cell";
        if (Math.random() < 0.3) cells[y][x].classList.add("wall");
      }
    }
  }
  document.getElementById("pathLength").textContent = "";
}

function solveMaze() {
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const queue = [{ x: start.x, y: start.y, path: [] }];

  while (queue.length > 0) {
    const { x, y, path } = queue.shift();

    if (x < 0 || y < 0 || x >= size || y >= size) continue;
    if (visited[y][x]) continue;
    if (cells[y][x].classList.contains("wall")) continue;

    visited[y][x] = true;
    const newPath = [...path, { x, y }];

    if (x === end.x && y === end.y) {
      newPath.forEach(cell => {
        if (!(cell.x === start.x && cell.y === start.y) && !(cell.x === end.x && cell.y === end.y)) {
          cells[cell.y][cell.x].classList.add("path");
        }
      });
      document.getElementById("pathLength").textContent = `Path length: ${newPath.length}`;
      return;
    }

    queue.push({ x: x + 1, y, path: newPath });
    queue.push({ x: x - 1, y, path: newPath });
    queue.push({ x, y: y + 1, path: newPath });
    queue.push({ x, y: y - 1, path: newPath });
  }

  document.getElementById("pathLength").textContent = "No path found.";
}

createGrid();
generateMaze();
