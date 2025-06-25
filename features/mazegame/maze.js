const grid = document.getElementById("grid");
let cols, rows;
let start, end;
let cells = [];

function getResponsiveCols() {
  const targetCellSize = 24;
  const marginRatio = Math.min(0.2, Math.max(0.03, 0.2 - (window.innerWidth / 3000)));
  const usableWidth = window.innerWidth * (1 - marginRatio * 2);
  const estimatedCols = Math.floor(usableWidth / targetCellSize);
  return Math.min(Math.max(estimatedCols, 5), 50);
}

function getResponsiveRows() {
  const targetCellSize = 24;
  const headerOffset = 250; // account for h1/h2/buttons
  const usableHeight = window.innerHeight - headerOffset;
  const estimatedRows = Math.floor(usableHeight / targetCellSize);
  return Math.min(Math.max(estimatedRows, 5), 100);
}

function applyResponsiveLayout() {
  cols = getResponsiveCols();
  rows = getResponsiveRows();

  document.documentElement.style.setProperty('--cols', cols);

  const marginRatio = Math.min(0.2, Math.max(0.03, 0.2 - (window.innerWidth / 3000)));
  const marginPercent = marginRatio * 100;
  grid.style.marginLeft = `${marginPercent}vw`;
  grid.style.marginRight = `${marginPercent}vw`;

  start = { x: 0, y: 0 };
  end = { x: cols - 1, y: rows - 1 };

  createGrid();
}

function createGrid() {
  grid.innerHTML = "";
  cells = [];

  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      div.addEventListener("click", () => toggleWall(x, y));
      if (x === start.x && y === start.y) div.classList.add("start");
      if (x === end.x && y === end.y) div.classList.add("end");
      grid.appendChild(div);
      row.push(div);
    }
    cells.push(row);
  }
}

function toggleWall(x, y) {
  if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) return;
  cells[y][x].classList.toggle("wall");
}

function clearObstacles() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!(x === start.x && y === start.y) && !(x === end.x && y === end.y)) {
        cells[y][x].classList.remove("wall");
      }
    }
  }
}

function clearPath() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells[y][x].classList.remove("path");
    }
  }
  document.getElementById("pathLength").textContent = "";
}

function generateMaze() {
  let solvable = false;
  while (!solvable) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        cells[y][x].className = "cell";
        if (x === start.x && y === start.y) cells[y][x].classList.add("start");
        else if (x === end.x && y === end.y) cells[y][x].classList.add("end");
        else if (Math.random() < 0.3) cells[y][x].classList.add("wall");
      }
    }
    solvable = testMazeSolvability();
  }
  clearPath();
}

function testMazeSolvability() {
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [{ x: start.x, y: start.y }];

  while (queue.length > 0) {
    const { x, y } = queue.shift();

    if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
    if (visited[y][x]) continue;
    if (cells[y][x].classList.contains("wall")) continue;

    visited[y][x] = true;
    if (x === end.x && y === end.y) return true;

    queue.push({ x: x + 1, y });
    queue.push({ x: x - 1, y });
    queue.push({ x, y: y + 1 });
    queue.push({ x, y: y - 1 });
  }
  return false;
}

function solveMaze() {
  clearPath();
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [{ x: start.x, y: start.y, path: [] }];

  while (queue.length > 0) {
    const { x, y, path } = queue.shift();

    if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
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

// Initial load and responsive update
window.addEventListener('DOMContentLoaded', applyResponsiveLayout);
window.addEventListener('resize', applyResponsiveLayout);
