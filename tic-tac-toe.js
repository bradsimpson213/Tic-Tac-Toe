//Global variables listed below
let player1 = "X";   //playerTurn = false
let player2 = "O";  //playerTurn = true

let playerTurn = false;
let gameStatus = '';
let AIPlay = false;

let board = ['','','','','','','','',''];

//Function declarations listed below
function clearGame () {  //resets game 
    board = ['','','','','','','','',''];
    playerTurn = false;
    gameStatus = '';
   
    document
        .getElementById("game-status")
        .innerHTML = gameStatus;
    document.getElementById("player-turn").innerHTML = "Player X turn";
    document
        .querySelectorAll(".square")
        .forEach( square => {
        square.innerHTML = '';
    });
}

function saveGameStatus() {
    localStorage.setItem("playerTurn", playerTurn);
    localStorage.setItem("gameStatus", gameStatus);
    localStorage.setItem("board", board);
}

function loadGameStatus() {
    if (localStorage.getItem("playerTurn") === null){
        return;
    }
    playerTurn = localStorage.getItem("playerTurn");
    gameStatus = localStorage.getItem("gameStatus");
    board = localStorage.getItem("board").split(",");   

    for (let i = 0; i < 9; i++) {
        if (board[i] !== '') {
            if (board[i] === "X") {
                let image = document.createElement("img");
                image.setAttribute("src", "images/player-x.svg");
                document
                    .getElementById(`square-${i}`)
                    .appendChild(image);
            }
            if (board[i] === "O") {
                let image = document.createElement("img");
                image.setAttribute("src", "images/player-o.svg");
                document
                    .getElementById(`square-${i}`)
                    .appendChild(image);
            }
        }
    }
    document.getElementById("game-status").innerHTML = gameStatus;
    if (gameStatus !== '') {
        document.getElementById("new-game").disabled = false;
        document.getElementById("give-up").disabled = true;
    }
}


function checkGameStatus (array) {       //checks for winner
    for(let i = 0; i < 9; i+=3){   //checks rows for winner
        if(array[i] === array[i+1] && array[i+1] === array[i+2]){
            if (array[i] === "X"){
                return "X";
            } else if (array[i] === "O") {
                return "O";
            }
        }
    }
    for(let i = 0; i < 3; i++){  //checks columns for winner 
        if(array[i] === array[i+3] && array[i+3] === array[i+6]){
            if(array[i] === 'X'){
                return "X";
            }else if (array[i] === 'O'){
                return "O";
            }
        }
    }
    if(array[0] === array[4] && array[4] === array[8] ||  //checks diagonals
        array[2] === array[4] && array[4] === array[6]) {
            if(array[4] === "X"){
                return "X";
            }else if (array[4] === "O"){
                return "O";
            }
    }
    if(gameStatus === ''){    //handles tie game
        if (array.every( element => element !== '')) {
            return "tie";
        }
    }
return null;
}

function humanPlayer(boolean, index, location){
    let boardPiece = '';
    let image = document.createElement("img");
    if (boolean === false) { // false is X is playing
        image.setAttribute("src", `images/player-${player1.toLowerCase()}.svg`);//dynamic
        boardPiece = player1;//dynamic
    }else if (boolean === true && AIPlay === false){  // true is O is playing
        image.setAttribute("src", `images/player-${player2.toLowerCase()}.svg`); // player O  //dynamic
        boardPiece = player2;//dynamic
    }
    playerTurn = !playerTurn
    location.appendChild(image);
    board[index]= boardPiece;
    if (AIPlay === true && !board.every( element => element !== '')) {
        artificialInt();    
    } 
}

function artificialInt(){
    let boardPiece = '';
    let image = document.createElement("img");

    index = bestMove(); // player X
    image.setAttribute("src", `images/player-${player2.toLowerCase()}.svg`)
    boardPiece = player2;//dynamic
    playerTurn = !playerTurn;
    document.getElementById(`square-${index}`).appendChild(image);
    board[index]= boardPiece;
}

window.addEventListener("DOMContentLoaded", event => {
    //loadGameStatus();
   
document
    .getElementById("tic-tac-toe-board")
    .addEventListener("click", event => {
        if(gameStatus !== ''){   //will not allow clicks after decided game
            return;
        }
        let clickTarget = event.target.id.slice(7);
                        
        if(board[clickTarget] === '') {
            humanPlayer(playerTurn, clickTarget, event.target);
                // artificialInt(clickTarget);
        }
                              
        if(playerTurn === false){
            document.getElementById("player-turn").innerHTML = "Player X turn";
        }else if (playerTurn === true){
            document.getElementById("player-turn").innerHTML = "Player O turn";
        }

        switch (checkGameStatus(board)){
            case "X": gameStatus = "Winner: X";
                document.getElementById('player-turn').innerHTML = "GAME OVER";
                break;
            case "O": gameStatus = "Winner: O";
                document.getElementById('player-turn').innerHTML = "GAME OVER";
                break;
            case 'tie': gameStatus = "Tie Game!";
                document.getElementById('player-turn').innerHTML = "GAME OVER";
                break;
            default:
                break; 
        } 
       
        //saveGameStatus();
        document
            .getElementById('game-status')
            .innerHTML = gameStatus;
        if(gameStatus !== ''){
            document.getElementById("new-game").disabled = false;
            document.getElementById("game-mode").disabled = false;
            document.getElementById('give-up').disabled = true;
        }
    });

    document        // handles new game button
        .getElementById("new-game")
        .addEventListener("click", event => {
            clearGame();
            document.getElementById("new-game").disabled = true;
            document.getElementById("game-mode").disabled = true;
            document.getElementById("give-up").disabled = false;  
        
                   
    });
    
    document        // handles AI mode checkbox
        .getElementById("game-mode")
        .addEventListener("change", event => {
            if(event.target.checked){
                AIPlay = true;
            }else {
                AIPlay = false;
            }
    });

    document        // handles give up button
        .getElementById("give-up")
        .addEventListener("click", event => {
        if(playerTurn === false){
            gameStatus = 'Winner: O';
        }  else {
            gameStatus = 'Winner: X';
        }  
        document.getElementById('game-status').innerHTML = gameStatus;
        document.getElementById("new-game").disabled = false;
        document.getElementById("game-mode").disabled = false;
        document.getElementById("give-up").disabled = true;

        });    

});


let ai = player2;
let human = player1;
let scores = {};
scores[player1] = -10;
scores[player2] = 10;
scores['tie'] = 0;
// COMPUTER AI CODE BELOW

function bestMove() {       // AI to make its turn
    
    let bestScore = -Infinity;
    let bestMove = null;
    board.forEach( (_, i) => {
        if (board[i] === '') {  
            board[i] = ai;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;                
            }
        }
    });
    return bestMove;    
}

function minimax(board, depth, isMaximizing) {
    let result = checkGameStatus(board);
    if (result !== null) {   //checks if move is winning (base case for recursion)
        return scores[result];
    }
    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach( (_,i) => {
             if (board[i] === '') {    
                board[i] = ai;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity; 
        board.forEach( (_,i) => {
            if (board[i] === '') {   
                board[i] = human;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

