let originalBoard;
const human = 'X';
const computer = 'O';

var humanScore = 0;
var computerScore = 0;

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


const tiles = document.querySelectorAll('.tile');
startGame();

function startGame() {
    document.querySelector(".endGame").style.display = "none";
    originalBoard = Array.from(Array(9).keys());
    for(let i=0;i<tiles.length; i++) {
        tiles[i].innerHTML = '';
        tiles[i].style.removeProperty('background-color');
        tiles[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(tile) {
    if(typeof originalBoard[tile.target.id] == 'number') {
        turn(tile.target.id, human);
        if(!checkWin(originalBoard, human) && !checkTie()) turn(bestMove(), computer);
    }
    
}

function turn(tileId, player) {
    originalBoard[tileId] = player;
    document.getElementById(tileId).innerText = player;
    let gameWon = checkWin(originalBoard, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = [];
    for(let i=0;i<board.length; i++) {
        if(board[i] === player) {
            plays.push(i);
        }
    }
    let gameWon = null;
    for(let [index, win] of winCombos.entries()) {
        let flag = false;
        for(let i=0;i<win.length;i++){
            if(plays.indexOf(win[i]) == -1) {
                flag = true;
                break;
            }
        }
        if(!flag) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for(let index of winCombos[gameWon.index] ){
        document.getElementById(index).style.backgroundColor = gameWon.player == human ? "green" : "red";
    }

    for(let i=0;i<tiles.length; i++) {
        tiles[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You Win!" : "You Loose!");
}

function declareWinner(player) {
    document.querySelector(".endGame").style.display = "block";
    document.querySelector(".endGame .text").innerText = player;
    if(player == "You Win!") {
        humanScore++;
    }
    else if(player == "You Loose!") {
        computerScore++;
    }
    document.getElementById('score').innerText = "Human: "+humanScore+" | Computer "+computerScore;
}

function checkType(element) {
    return typeof element == 'number';
}

function findEmptyTiles(board) {
    return board.filter(checkType);
}

function bestMove() {
    return minimax(originalBoard, computer).index;
}

function checkTie() {
    if(findEmptyTiles(originalBoard).length == 0) {
        for(let i=0;i<tiles.length; i++) {
            tiles[i].style.backgroundColor = "blue";
            tiles[i].removeEventListener('click', turnClick, false);
        }
        declareWinner('Tie Game');
        return true;
    }
    return false;
}


function minimax(newBoard, player) {
    let availableSpots = findEmptyTiles(newBoard);
    if(checkWin(newBoard, human)) {
        return {score: -10};
    }
    else if(checkWin(newBoard, computer)) {
        return {score: 20};
    }
    else if(availableSpots.length == 0) {
        return {score: 0};
    }
    var moves = [];
    for(let i=0;i<availableSpots.length; i++) {
        let move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;
        if(player == computer) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, computer);
            move.score = result.score;
        }
        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }
    let bestPosition;
    if(player === computer) {
        var bestScore = -10000;
        for(let i=0; i<moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestPosition = i;
            }
        }
    }
    else {
        var bestScore = 10000;
        for(let i=0; i<moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestPosition = i;
            }
        }
    }
    return moves[bestPosition];
}