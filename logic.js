const Player = (sign) => {
  let score = 0;
  const getSign = () => sign;
  let selectedFields = [];
  const addSelectedField = (i) => {
    selectedFields.push(i);
  };
  const reset = () => {
    selectedFields = [];
    resetScore();
  };
  const winingPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
  ];
  const checkWin = () => {
    return winingPatterns.some((pattern) =>
      pattern.every((field) => selectedFields.includes(field))
    );
  };
  const updateScore = () => {
    score++;
  };
  const resetScore = () => {
    score = 0;
  };
  const getScore = () => score;

  return {
    getSign,
    addSelectedField,
    checkWin,
    reset,
    updateScore,
    resetScore,
    getScore,
  };
};

const GameBoard = (() => {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  let EmptyFields = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const removeEmptyField = (i) => {
    EmptyFields.splice(EmptyFields.indexOf(i), 1);
  };
  const setField = (i, sign) => {
    removeEmptyField(i);
    return (gameBoard[i] = sign);
  };

  const getEmptyFields = () => {
    return EmptyFields;
  };
  const checkField = (i) => {
    return EmptyFields.includes(i);
  };
  const reset = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = "";
      render();
    }
    EmptyFields = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  };
  const render = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      let field = document.querySelector(`[data-index='${i}']`);
      field.textContent = gameBoard[i];
    }
  };

  return { render, setField, getEmptyFields, checkField, reset };
})();

const PlayGame = (() => {
  let continueGame = true;
  let player1 = Player("X");
  let player2 = Player("O");
  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;
  let gameBoard = GameBoard;
  let currentPlayer = player1;
  const tie = (elm) => {
    if (
      gameBoard.getEmptyFields().length === 0 &&
      !player1.checkWin() &&
      !player2.checkWin()
    ) {
      continueGame = false;
      elm.textContent = "It's a tie!";
    }
  };
  const win = (player, elm) => {
    if (player.checkWin()) {
      player.updateScore();
      continueGame = false;
      elm.textContent = `Player ${player.getSign()} wins!`;
    }
  };
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const currentPlayerSign = () => {
    if (currentPlayer === player1) {
      return "X";
    } else {
      return "O";
    }
  };
  const resetAll = () => {
    player1.reset();
    player2.reset();
    gameBoard.reset();
    continueGame = true;
  };
  const playRound = (i) => {
    if (gameBoard.checkField(i)) {
      gameBoard.setField(i, currentPlayer.getSign());
      currentPlayer.addSelectedField(i);
      win(currentPlayer, cmnts);
      tie(cmnts);
      if (continueGame) {
        switchPlayer();
      }
    }
  };
  const getContinueGame = () => continueGame;
  return {
    playRound,
    getContinueGame,
    getPlayer1,
    getPlayer2,
    resetAll,
    currentPlayerSign,
  };
})();

const fields = document.querySelectorAll(".field");
const cmnts = document.querySelector(".cmnts");
const restartBtn = document.querySelector(".restart");

const handleClick = (e) => {
  const index = parseInt(e.target.getAttribute("data-index"));
  PlayGame.playRound(index);
  GameBoard.render();
  if (!PlayGame.getContinueGame()) {
    fields.forEach((field) => field.removeEventListener("click", handleClick));
  } else {
    cmnts.textContent = "player " + PlayGame.currentPlayerSign() + " turn";
  }
};

fields.forEach((field) =>
  field.addEventListener("click", handleClick, { once: true })
);
restartBtn.addEventListener("click", () => {
  PlayGame.resetAll();
  fields.forEach((field) =>
    field.addEventListener("click", handleClick, { once: true })
  );
});
