
// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from '../modules/Game.class.js';

const BOARD_SIZE = 4;
const SWIPE_THRESHOLD = 30;

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const field = document.querySelector('.game-field');
const moveByDirection = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

const cellIndex = (r, c) => r * BOARD_SIZE + c;

function render() {
  const state = game.getState();

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const i = cellIndex(r, c);
      const el = cells[i];
      const val = state[r][c];

      el.textContent = val === 0 ? '' : String(val);
      el.className = 'field-cell';

      if (val) {
        el.classList.add(`field-cell--${val}`);
      }
    }
  }

  scoreEl.textContent = String(game.getScore());

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    msgStart.classList.add('hidden');
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else {
    msgWin.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  } else {
    msgLose.classList.add('hidden');
  }
}

function applyMove(move) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (move()) {
    render();
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!moveByDirection[key]) {
    return;
  }

  e.preventDefault();
  applyMove(moveByDirection[key]);
});

let startX = 0;
let startY = 0;

function lockPageScroll() {
  document.body.classList.add('no-scroll');
}

function unlockPageScroll() {
  document.body.classList.remove('no-scroll');
}

field.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  startY = e.clientY;
});

field.addEventListener('mouseup', (e) => {
  handleSwipe(e.clientX - startX, e.clientY - startY);
});

field.addEventListener('touchstart', (e) => {
  const touch = e.changedTouches[0];

  e.preventDefault();
  startX = touch.clientX;
  startY = touch.clientY;
  lockPageScroll();
}, { passive: false });

field.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

field.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];

  e.preventDefault();
  handleSwipe(touch.clientX - startX, touch.clientY - startY);
  unlockPageScroll();
}, { passive: false });

field.addEventListener('touchcancel', () => {
  unlockPageScroll();
});

function handleSwipe(dx, dy) {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    applyMove(dx > 0 ? moveByDirection.ArrowRight : moveByDirection.ArrowLeft);
  } else {
    applyMove(dy > 0 ? moveByDirection.ArrowDown : moveByDirection.ArrowUp);
  }
}

render();
