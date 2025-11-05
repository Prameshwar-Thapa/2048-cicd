class Game2048 {
  constructor() {
    this.size = 4;
    this.grid = [];
    this.score = 0;
    this.best = localStorage.getItem('bestScore') || 0;
    this.gameWon = false;
    this.gameTerminated = false;
    
    this.init();
    this.bindEvents();
  }

  init() {
    this.setupGrid();
    this.addRandomTile();
    this.addRandomTile();
    this.updateDisplay();
  }

  setupGrid() {
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.grid[i][j] = 0;
      }
    }
  }

  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          emptyCells.push({x: i, y: j});
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    if (this.gameTerminated) return;

    let moved = false;
    const previousGrid = this.grid.map(row => [...row]);

    switch (direction) {
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.addRandomTile();
      this.updateDisplay();
      
      if (this.isGameWon() && !this.gameWon) {
        this.gameWon = true;
        this.showMessage('You Win!', 'keep-playing-button');
      } else if (this.isGameOver()) {
        this.gameTerminated = true;
        this.showMessage('Game Over!', 'retry-button');
      }
    }
  }

  moveLeft() {
    let moved = false;
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i].filter(val => val !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < this.size) {
        row.push(0);
      }
      if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) {
        moved = true;
      }
      this.grid[i] = row;
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i].filter(val => val !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j - 1, 1);
          j--;
        }
      }
      while (row.length < this.size) {
        row.unshift(0);
      }
      if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) {
        moved = true;
      }
      this.grid[i] = row;
    }
    return moved;
  }

  moveUp() {
    let moved = false;
    for (let j = 0; j < this.size; j++) {
      const column = [];
      for (let i = 0; i < this.size; i++) {
        if (this.grid[i][j] !== 0) {
          column.push(this.grid[i][j]);
        }
      }
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
        }
      }
      while (column.length < this.size) {
        column.push(0);
      }
      for (let i = 0; i < this.size; i++) {
        if (this.grid[i][j] !== column[i]) {
          moved = true;
        }
        this.grid[i][j] = column[i];
      }
    }
    return moved;
  }

  moveDown() {
    let moved = false;
    for (let j = 0; j < this.size; j++) {
      const column = [];
      for (let i = 0; i < this.size; i++) {
        if (this.grid[i][j] !== 0) {
          column.push(this.grid[i][j]);
        }
      }
      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i - 1, 1);
          i--;
        }
      }
      while (column.length < this.size) {
        column.unshift(0);
      }
      for (let i = 0; i < this.size; i++) {
        if (this.grid[i][j] !== column[i]) {
          moved = true;
        }
        this.grid[i][j] = column[i];
      }
    }
    return moved;
  }

  isGameWon() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  }

  isGameOver() {
    // Check for empty cells
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === 0) {
          return false;
        }
      }
    }

    // Check for possible merges
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.grid[i][j];
        if ((i < this.size - 1 && this.grid[i + 1][j] === current) ||
            (j < this.size - 1 && this.grid[i][j + 1] === current)) {
          return false;
        }
      }
    }

    return true;
  }

  updateDisplay() {
    const tileContainer = document.querySelector('.tile-container');
    tileContainer.innerHTML = '';

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] !== 0) {
          const tile = document.createElement('div');
          tile.className = `tile tile-${this.grid[i][j]}`;
          tile.textContent = this.grid[i][j];
          tile.style.transform = `translate(${j * 121.25}px, ${i * 121.25}px)`;
          tileContainer.appendChild(tile);
        }
      }
    }

    document.querySelector('.score-container').textContent = this.score;
    
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem('bestScore', this.best);
    }
    document.querySelector('.best-container').textContent = this.best;
  }

  showMessage(text, buttonClass) {
    const messageContainer = document.querySelector('.game-message');
    const messageText = messageContainer.querySelector('p');
    const button = messageContainer.querySelector(`.${buttonClass}`);
    
    messageText.textContent = text;
    button.style.display = 'inline-block';
    messageContainer.style.display = 'block';
  }

  hideMessage() {
    document.querySelector('.game-message').style.display = 'none';
  }

  restart() {
    this.score = 0;
    this.gameWon = false;
    this.gameTerminated = false;
    this.hideMessage();
    this.setupGrid();
    this.addRandomTile();
    this.addRandomTile();
    this.updateDisplay();
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.move('down');
          break;
      }
    });

    document.querySelector('.restart-button').addEventListener('click', () => {
      this.restart();
    });

    document.querySelector('.retry-button').addEventListener('click', () => {
      this.restart();
    });

    document.querySelector('.keep-playing-button').addEventListener('click', () => {
      this.hideMessage();
    });

    // Touch events for mobile
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          this.move('left');
        } else {
          this.move('right');
        }
      } else {
        if (diffY > 0) {
          this.move('up');
        } else {
          this.move('down');
        }
      }

      startX = null;
      startY = null;
    });
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Game2048();
});
