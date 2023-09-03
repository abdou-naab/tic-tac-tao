const Player = (sign) => {
  const getSign = () => sign;
  let selectedFields = [];
  const addSelectedField = (i) => {
    selectedFields.push(i);
  };
  const reset = () => {
    selectedFields = [];
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
  return { getSign, addSelectedField, checkWin, reset };
};

const GameBoard = (() => {
  const gameBoard = ["", "", "", "", "", "", "", "", ""];
  const EmptyFields = [0, 1, 2, 3, 4, 5, 6, 7, 8];

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
    }
  };
  const render = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      let field = document.querySelector(`[data-index='${i}']`);
      field.textContent = gameBoard[i];
    }
  };

  return { render, setField, getEmptyFields, checkField };
})();

const PlayGame = (() => {
  let continueGame = true;
  let player1 = Player("X");
  let player2 = Player("O");
  let gameBoard = GameBoard;
  let currentPlayer = player1;
  const tie = () => {
    if (gameBoard.getEmptyFields().length === 0) {
      continueGame = false;
      console.log("It's a tie!");
    }
  };
  const win = (player) => {
    if (player.checkWin()) {
      continueGame = false;
      console.log(`${player.getSign()} wins!`);
      return true;
    }
  };
  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
  const playRound = (i) => {
    if (gameBoard.checkField(i)) {
      gameBoard.setField(i, currentPlayer.getSign());
      currentPlayer.addSelectedField(i);
      win(currentPlayer);
      tie();
      if (continueGame) {
        switchPlayer();
      }
    }
  };
  const getContinueGame = () => continueGame;
  return { playRound, getContinueGame };
})();

const fields = document.querySelectorAll(".field");

const handleClick = (e) => {
  const index = parseInt(e.target.getAttribute("data-index"));
  PlayGame.playRound(index);
  GameBoard.render();
  if (!PlayGame.getContinueGame()) {
    fields.forEach((field) => field.removeEventListener("click", handleClick));
  }
};

fields.forEach((field) =>
  field.addEventListener("click", handleClick, { once: true })
);
