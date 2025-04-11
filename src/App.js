import React, { useState, useEffect } from 'react';
import './App.css';

// ✅ Move this outside the component to avoid ESLint warning
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isComputerOpponent, setIsComputerOpponent] = useState(false);

  const makeComputerMove = (newBoard) => {
    const emptyIndexes = newBoard.map((val, idx) => val === null ? idx : null).filter(v => v !== null);
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    if (randomIndex !== undefined) {
      newBoard[randomIndex] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
    }
  };

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner);
      setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (!board.includes(null)) {
      setWinner('Draw');
    } else if (isComputerOpponent && !xIsNext) {
      const newBoard = [...board];
      setTimeout(() => makeComputerMove(newBoard), 500);
    }
  }, [board, isComputerOpponent, xIsNext]); // ✅ Dependencies

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <h1>Tic Tac Toe</h1>

      <div className="toggle-group">
        <label>
          <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
          Dark Mode
        </label>
        <label>
          <input type="checkbox" checked={isComputerOpponent} onChange={() => setIsComputerOpponent(!isComputerOpponent)} />
          Play vs Computer
        </label>
      </div>

      <div className="scoreboard">
        <span>X: {scores.X}</span>
        <span>O: {scores.O}</span>
      </div>

      <div className="board">
        {board.map((square, i) => (
          <div key={i} className="square" onClick={() => handleClick(i)}>
            {square}
          </div>
        ))}
      </div>

      <div className="info">
        {winner ? (
          <h2>{winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}</h2>
        ) : (
          <h2>Turn: {xIsNext ? 'X' : 'O'}</h2>
        )}
        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
};

export default App;
