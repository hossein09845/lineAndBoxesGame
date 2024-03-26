// players objects
let players = [
  {
    name: 'red',
    color: '#ff122e',
    coloredsBoxs: 0
  },
  {
    name: 'blue',
    color: '#1292ff',
    coloredsBoxs: 0
  },
  {
    name: 'yellow',
    color: '#ffb212',
    coloredsBoxs: 0
  },
  {
    name: 'green',
    color: '#1ccd02',
    coloredsBoxs: 0
  }
]

// variable
let columns = 5,
    rows = 5,
    playersCount = 4,
    currentPlayer = 2,
    gameEnd = false

let boxes = [];

// elements 
const board = document.getElementById('board');
const resetBn = document.getElementById('resetBn');
const redScore = document.querySelector('.score.red');
const blueScore = document.querySelector('.score.blue');
const yellowScore = document.querySelector('.score.yellow');
const greenScore = document.querySelector('.score.green');

const dialog = document.querySelector('[dialog]');
const dialogTitle= document.querySelector('[dialog-title]');
const dialogWinnerList = document.querySelector('[dialog-winner-list]');
const dialogBtn = document.querySelector('[dialog-btn]');;

// functions
function switchNextPlayer() {
  currentPlayer++;
  currentPlayer = currentPlayer % playersCount;
  
  document.querySelectorAll('.score').forEach((score) => score.classList.remove('active'));
  
  switch (currentPlayer) {
    case 0:
      redScore.classList.add('active');
      break;
    case 1:
      blueScore.classList.add('active');
      break;
    case 2:
      yellowScore.classList.add('active');
      break;
    case 3:
      greenScore.classList.add('active');
      break;
  }
}

function check() {
  let hasChange = false;
  boxes.forEach((box) => {
    if(box.topLine.hasAttribute('colord') &&
       box.bottomLine.hasAttribute('colord') &&
       box.leftLine.hasAttribute('colord') &&
       box.rightLine.hasAttribute('colord') &&
      !box.box.hasAttribute('colord')) {
    
    hasChange = true;
    document.createAttribute('colord');
    box.box.setAttribute('colord', '')
    box.box.style.background = players[currentPlayer].color;
    players[currentPlayer].coloredsBoxs++;
    
    checkGameEnd();
    }
  });
  
  if(!hasChange) {
    // switch to next player
    switchNextPlayer();
  }
  
  // change score
  redScore.textContent = players[0].coloredsBoxs.toString();
  blueScore.textContent = players[1].coloredsBoxs.toString();
  yellowScore.textContent = players[2].coloredsBoxs.toString();
  greenScore.textContent = players[3].coloredsBoxs.toString();
}

function reset() {
  // clear old board
  board.innerHTML = '';
  
  // set maximum rows and columns
  columns = Math.min(columns, 10);
  rows = Math.min(rows, 10);
  
  // set board grid
  board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
  board.style.gridTemplateRows = `repeat(${rows}, 1fr)`
  
  // reset settings
  currentPlayer = 0;
  gameEnd = false;

  // reset players score
  players.forEach((player) => {
    player.coloredsBoxs = 0;
  })
  
  // show players score
  redScore.textContent = players[0].coloredsBoxs.toString();
  blueScore.textContent = players[1].coloredsBoxs.toString();
  yellowScore.textContent = players[2].coloredsBoxs.toString();
  greenScore.textContent = players[3].coloredsBoxs.toString();
  
  // set maximum players
  playersCount = Math.min(playersCount, 4)
  
  // set players score showed
  if(playersCount < 1) redScore.style.display = 'none';
  if(playersCount < 2) blueScore.style.display = 'none';
  if(playersCount < 3) yellowScore.style.display = 'none';
  if(playersCount < 4) greenScore.style.display = 'none';
  
  // remove reset button
  resetBtn.style.display = 'none';
  
  // create box and line
  for (let i = 0; i < columns*(rows+1); i++) {
      let attr = 'org';
      let boxOb = {};
      
      const cell = document.createElement('div');
      const box = document.createElement('div');
      boxOb.cell = cell;
      boxOb.box = box;
      cell.className = 'cell';
      box.className = 'box';
      if(columns*rows-1 < i) {
        attr = 'temp';
        cell.style.width = '1';
      }else {
        cell.style.width = `${Math.floor(board.offsetWidth/columns)}px`;
      }
      document.createAttribute(attr);
      cell.setAttribute(attr, '');
      
      for (let j = 0; j < 4 && attr !== 'temp'; j++) {
        let canAppend = true;
        const line = document.createElement('div');
        line.className = 'line ';
        switch (j) {
          case 0:
            line.className += 't'
            if(i+1 > columns) canAppend = false;
            boxOb.topLine = canAppend ? line : boxes[i - columns].bottomLine;
            break;
          case 1:
            line.className += 'b'
            boxOb.bottomLine = line;
            break;
          case 2:
            line.className += 'l'
            if((i+1) % columns !== 1) canAppend = false;
            boxOb.leftLine = canAppend ? line : boxes[i-1].rightLine;
            break;
          case 3:
            line.className += 'r'
            boxOb.rightLine = line;
            break;
        }
        if(canAppend) cell.appendChild(line);
      }
      
      if(attr !== 'temp') {
        cell.appendChild(box);
        boxes.push(boxOb);
      }
      board.appendChild(cell);
      if(attr !== 'temp') var boardHeiht = board.offsetHeight;
    }
    
    // set board height
    board.style.height = `${boardHeiht}px`
    
    document.querySelectorAll('[org] .line').forEach((l, i, a) => {
      l.onclick = () => {
        a.forEach(l => l.classList.remove('focus'));
        if(!l.hasAttribute('colord')) {
          document.createAttribute('colord');
          l.setAttribute('colord', '');
          l.style.background = players[currentPlayer].color;
          l.classList.add('focus');
          
          check();
        }
      }
    });
}

function checkGameEnd() {
  let winnersArray = [];
  gameEnd = true;
  for(box of boxes) {
    if(!box.box.hasAttribute('colord')) {
      gameEnd = false;
      break;
    }
  }
  
  if (gameEnd) {
    let scores = {
      red: players[0].coloredsBoxs,
      blue: players[1].coloredsBoxs,
      yellow: players[2].coloredsBoxs,
      green: players[3].coloredsBoxs
    };
    
    let maxScore = Math.max(...Object.values(scores));
    winnersArray = Object.keys(scores).filter(player => scores[player] === maxScore);
    
    setTimeout(() => {
      console.log(winnersArray);
      dialogTitle.textContent = 'Wineers';
      players.forEach((player, index) => {
        dialogWinnerList.children[index].textContent = player.coloredsBoxs.toString();
        if (winnersArray.includes(player.name)) {
          dialogWinnerList.children[index].style.display = 'block';
        }
      });
      dialogBtn.onclick = () => {
        dialog.close();
        resetBtn.style.display = 'inline-block';
      }
      dialog.showModal();
    }, 1000);
  }
}

// control
resetBtn.onclick = () => {
  reset();
}

// start game
reset();