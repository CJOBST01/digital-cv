
const grid = document.getElementById("grid");
const size = 30;
let start = { x: 0, y: 0 };
let end = { x: size - 1, y: size - 1 };
let cells = [];

function createGrid() {
  grid.innerHTML = "";
  cells = [];

  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
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
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!(x === start.x && y === start.y) && !(x === end.x && y === end.y)) {
        cells[y][x].classList.remove("wall");
      }
    }
  }
}

function clearPath() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      cells[y][x].classList.remove("path");
    }
  }
  document.getElementById("pathLength").textContent = "";
}

function generateMaze() {
  let solvable = false;
  while (!solvable) {
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
    solvable = testMazeSolvability();
  }
  clearPath();
}

function testMazeSolvability() {
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const queue = [{ x: start.x, y: start.y }];

  while (queue.length > 0) {
    const { x, y } = queue.shift();

    if (x < 0 || y < 0 || x >= size || y >= size) continue;
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
