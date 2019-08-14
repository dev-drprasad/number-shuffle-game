

const state = {
  grid: [],
  swaps: 0,
  boardSize: 0,
  playerName: '',
  isWin: false,

};

function randomizeArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initGrid(boardSize) {
  state.grid = [];
  state.swaps = 0;

  const cellValues = [null];

  // from 1 to n*n - 1
  for (let i = 1; i < (boardSize * boardSize); i++) {
    cellValues.push(i);
  }
  const randomizedCellValues = randomizeArray(cellValues);

  let cellIndex = 0;
  for (let rowId = 0; rowId < boardSize; rowId++) {
    const cols = [];
    for (let colId = 0; colId < boardSize; colId++) {
      cols.push(randomizedCellValues[cellIndex]);
      cellIndex += 1;
    }
    state.grid.push(cols);
    console.log('state.grid :', state.grid);
  }
}

function render() {
  const gridEl = document.getElementById("grid");
  grid.style.gridTemplateRows = Array.from({ length: state.boardSize }).map(() => '100px').join(" ");
  grid.style.gridTemplateColumns = Array.from({ length: state.boardSize }).map(() => '100px').join(" ");

  gridEl.innerHTML = '';
  for (let rowId = 0; rowId < state.boardSize; rowId++) {
    for (let colId = 0; colId < state.boardSize; colId++) {
      const cellValue = state.grid[rowId][colId];
      gridEl.innerHTML += `<div class="grid-cell ${!cellValue ? 'empty' : ''}" row-id="${rowId}" col-id="${colId}">${cellValue || ''}</div>`; 
    }
  }

  const swapCountEl = document.getElementById("no-swaps");
  swapCountEl.textContent = state.swaps;
  const playerNameEl = document.getElementById("player-name");
  playerNameEl.textContent = state.playerName
  if (state.isWin) document.getElementById("result").textContent = "You won!"
}

function checkWin(grid) {
  const sequence = [];
  for (let rowId = 0; rowId < grid.length; rowId++) {
    for (let colId = 0; colId < grid.length; colId++) {
    sequence.push(grid[rowId][colId] ? grid[rowId][colId] : " ");
    }
  }
  const resultExpectedToWin = Array.from({ length: (grid.length ** 2 - 1) }).map((_, i) => i + 1);
  console.log('resultExpectedToWin :', resultExpectedToWin);
  console.log('sequence :', sequence);
  return sequence.join("").replace(/\s+$/, '') === resultExpectedToWin.join("");
}

function onBoxClick(element) {
  const rowId = Number(element.getAttribute("row-id"));
  const colId = Number(element.getAttribute("col-Id"));
  const currentCellValue = state.grid[rowId][colId];

  // check right
  if (colId < state.boardSize - 1) {
    const toBePositionValue = state.grid[rowId][colId + 1];
    if (toBePositionValue === null) {
      state.grid[rowId][colId + 1] = currentCellValue;
      state.grid[rowId][colId] = null;
      state.swaps += 1;
      const isWin = checkWin(state.grid);
      if (isWin) {
        state.isWin = true;
        removeEventListeners();
      };
      render();
      return;
    }
  }
  // check bottom
  if (rowId < state.boardSize - 1) {
    const toBePositionValue = state.grid[rowId + 1][colId];
    if (toBePositionValue === null) {
      state.grid[rowId + 1][colId] = currentCellValue;
      state.grid[rowId][colId] = null;
      state.swaps += 1;
      const isWin = checkWin(state.grid);
      if (isWin) {
        state.isWin = true;
        removeEventListeners();
      };
      render();
      return;
    }
  }
  // check left
  if (colId > 0) {
    const toBePositionValue = state.grid[rowId][colId - 1];
    if (toBePositionValue === null) {
      state.grid[rowId][colId - 1] = currentCellValue;
      state.grid[rowId][colId] = null;
      state.swaps += 1;
      const isWin = checkWin(state.grid);
      if (isWin) {
        state.isWin = true;
        removeEventListeners();
      };
      render();
      return;
    }
  }
  // check top
  if (rowId > 0) {
    const toBePositionValue = state.grid[rowId - 1][colId];
    if (toBePositionValue === null) {
      state.grid[rowId - 1][colId] = currentCellValue;
      state.grid[rowId][colId] = null;
      state.swaps += 1;
      const isWin = checkWin(state.grid);
      if (isWin) {
        state.isWin = true;
        removeEventListeners();
      };
      render();
      return;
    }
  }
}

function handleGridClick(event) {
  const gridEl = document.getElementById("grid");
  if (event.target.parentElement === gridEl) {
    onBoxClick(event.target);
  }
}

function addEventListeners() {
  const gridEl = document.getElementById("grid");
  gridEl.addEventListener('click', handleGridClick);
}

function removeEventListeners() {
  const gridEl = document.getElementById("grid");
  gridEl.removeEventListener('click', handleGridClick);
}

function showError(message) {
  document.getElementById("error").textContent = message;
}

document.getElementById("input-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const name = event.target.elements.name.value;
  const boardSize = Number(event.target.elements.boardSize.value);
  
  state.boardSize = boardSize;
  state.playerName = name;

  if (state.boardSize >= 3) {
    initGrid(boardSize);
    showError("");
    render();
    removeEventListeners();
    addEventListeners();
  } else {
    showError("boardSize must be greater than or equal to 3");
  }
  document.getElementById("result").textContent = "";

});

document.getElementById("reset-form").addEventListener("submit", function(event) {
  event.preventDefault();
  initGrid(state.boardSize);
  render();
  removeEventListeners();
  addEventListeners();
  
  document.getElementById("result").textContent = "";

});





