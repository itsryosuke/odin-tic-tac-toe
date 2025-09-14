function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
    for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const markSpace = (row, column, player) => {
    board[row][column].addToken(player)
  }

  const clearBoard = () => {
    board.forEach(row => {
        for (i = 0; i < 3; i++) {
            row[i] = Cell();
        }
    })
  }

  return { getBoard, markSpace, clearBoard };
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function gameController(playerOneName, playerTwoName) {
    const board = gameBoard();

    const players = [
        {name: playerOneName, token: 1},
        {name: playerTwoName, token: -1}
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  let gameOver = false;

  let displayMessage = `${getActivePlayer().name}'s turn...`;
  
  const getDisplayMessage = () => displayMessage;

  const playRound = (row, column) => {
    if (gameOver === true) return;

    if(board.getBoard()[row][column].getValue() === 0) {
        board.markSpace(row, column, getActivePlayer().token);

        if (checkForWinner() === false) {
            switchPlayerTurn();
            displayMessage = `${getActivePlayer().name}'s turn...`;
        }
        else if (checkForWinner() === true) {
            gameOver = true;
            displayMessage = `${getActivePlayer().name} won!`
        }
        else {
            gameOver = true;
            displayMessage = "It's a draw!";
        } 
    }
    else return
  }

  const getCurrentBoard = () => board.getBoard().map((row) => row.map((cell) => cell.getValue()));

  const checkForWinner = () => {
    const currentBoard = getCurrentBoard();
    for (i = 0; i < 3; i++) {
        let rowSum = 0;
        for (j = 0; j < 3; j++) {
            rowSum += currentBoard[i][j]
        }
        if (rowSum === 3) {
            console.log("Player One Won!");
            return true;
        }
        else if (rowSum === -3) {
            console.log("Player Two Won!");
            return true;
        }
    }
    for (i = 0; i < 3; i++) {
        let columnSum = 0;
        for (j = 0; j < 3; j++) {
            columnSum += currentBoard[j][i]
        }
        if (columnSum === 3) {
            console.log("Player One Won!");
            return true;
        }
        else if (columnSum === -3) {
            console.log("Player Two Won!");
            return true;
        }
    }
    if((currentBoard[0][0] + currentBoard[1][1] + currentBoard[2][2] === 3) || 
        (currentBoard[2][0] + currentBoard[1][1] + currentBoard[0][2] === 3)){
        console.log("Player One Won!");
        return true;
    }
    else if((currentBoard[0][0] + currentBoard[1][1] + currentBoard[2][2] === -3) || 
            (currentBoard[2][0] + currentBoard[1][1] + currentBoard[0][2] === -3)){
        console.log("Player Two Won!");
        return true;
    }
    else if (!currentBoard.flat().includes(0)) {
        console.log("It's a draw!");
        return "draw";
    }
    else return false;
  }

  const restartGame = () => {
    board.clearBoard();
    activePlayer = players[0];
    gameOver = false;
    displayMessage = `${getActivePlayer().name}'s turn...`;
  }

  return { playRound, getActivePlayer, getBoard: board.getBoard, restartGame, getDisplayMessage };
}

function userInputController() {
    const dialog = document.querySelector("dialog");
    const showButton = document.querySelector("dialog + button");
    const form = document.querySelector("form");

    showButton.addEventListener("click", () => {dialog.showModal()});

    const playerOneInput = document.querySelector("#playerOneName");
    const playerTwoInput = document.querySelector("#playerTwoName");
    let playerOneName;
    let playerTwoName;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        playerOneName = playerOneInput.value;
        playerTwoName = playerTwoInput.value;
        dialog.close();
    });

    const getPlayerOneName = () => playerOneName;
    const getPlayerTwoName = () => playerTwoName;

    return { getPlayerOneName, getPlayerTwoName };
}

function screenController(playerOne, playerTwo) {
    const game = gameController(playerOne, playerTwo);
    const display = document.querySelector("#display");
    const boardDiv = document.querySelector("#board");
    const restartButton = document.querySelector("#restart_button");

    const updateScreen = () => {
        boardDiv.textContent = "";
        const board = game.getBoard();
        display.textContent = game.getDisplayMessage();

        board.forEach((row, indexOne) => {
            row.forEach((cell, indexTwo) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("board_cell");
                cellButton.dataset.positionOne = indexOne;
                cellButton.dataset.positionTwo = indexTwo;
                if (cell.getValue() === 1){cellButton.textContent = "✗"}
                else if (cell.getValue() === -1){cellButton.textContent = "⭘"}
                else if (cell.getValue() === 0){cellButton.textContent = ""};
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const positionOne = e.target.dataset.positionOne;
        if (!positionOne) return;

        const positionTwo = e.target.dataset.positionTwo;
        if (!positionTwo) return;

        game.playRound(positionOne, positionTwo);
        updateScreen();
    }

    restartButton.addEventListener("click", () => {
        game.restartGame();
        updateScreen();
    });

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

function gameInit() {
    const userInput = userInputController();
    const form = document.querySelector("form");

    form.addEventListener("submit", () => {
        screenController(userInput.getPlayerOneName(), userInput.getPlayerTwoName())
    })
}
gameInit();