import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Cpu, Users } from "lucide-react";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[];
type GameMode = "computer" | "two-player";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: Board): { winner: Player; line: number[] } | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  return null;
}

function isDraw(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const result = checkWinner(board);
  if (result) return result.winner === "O" ? 10 - depth : depth - 10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

interface Scores {
  X: number;
  O: number;
  draws: number;
}

export default function TicTacToe() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [scores, setScores] = useState<Scores>({ X: 0, O: 0, draws: 0 });
  const [gameOver, setGameOver] = useState(false);

  const result = useMemo(() => checkWinner(board), [board]);
  const draw = useMemo(() => !result && isDraw(board), [board, result]);

  const isPlayerTurn = currentPlayer === "X";
  const isComputerThinking = mode === "computer" && !isPlayerTurn && !gameOver;

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || gameOver) return;
      if (mode === "computer" && !isPlayerTurn) return;

      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    },
    [board, gameOver, mode, currentPlayer, isPlayerTurn],
  );

  // Computer move
  useEffect(() => {
    if (mode !== "computer" || isPlayerTurn || gameOver || result || draw) return;

    const timer = setTimeout(() => {
      const move = getBestMove([...board]);
      if (move !== -1) {
        const newBoard = [...board];
        newBoard[move] = "O";
        setBoard(newBoard);
        setCurrentPlayer("X");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [board, mode, isPlayerTurn, gameOver, result, draw]);

  // Check for end of game and update scores
  useEffect(() => {
    if (result) {
      setGameOver(true);
      setScores((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));
    } else if (draw) {
      setGameOver(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
  }, [result, draw]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameOver(false);
  };

  const resetScores = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const changeMode = (newMode: GameMode) => {
    setMode(newMode);
    resetScores();
  };

  const getStatusText = () => {
    if (result) {
      if (mode === "computer") {
        return result.winner === "X" ? "You win! 🎉" : "Computer wins";
      }
      return `Player ${result.winner} wins! 🎉`;
    }
    if (draw) return "It's a draw";
    if (mode === "computer") {
      return isPlayerTurn ? "Your turn — go for it!" : "Thinking…";
    }
    return `Player ${currentPlayer}'s turn`;
  };

  // Mode selector screen
  if (!mode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-12"
      >
        <div className="text-center">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-3">
            Choose your game
          </h2>
          <p className="text-xs text-muted-foreground/60">
            How would you like to play?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => changeMode("computer")}
            className="group flex flex-col items-center gap-4 px-10 py-8 border border-border/60 rounded-sm
                       hover:border-foreground/30 hover:bg-accent transition-all duration-200 cursor-pointer"
          >
            <Cpu className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="text-center">
              <div className="text-sm font-medium">vs Computer</div>
              <div className="text-[11px] text-muted-foreground/60 mt-1">
                Challenge the AI
              </div>
            </div>
          </button>

          <button
            onClick={() => changeMode("two-player")}
            className="group flex flex-col items-center gap-4 px-10 py-8 border border-border/60 rounded-sm
                       hover:border-foreground/30 hover:bg-accent transition-all duration-200 cursor-pointer"
          >
            <Users className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div className="text-center">
              <div className="text-sm font-medium">2 Players</div>
              <div className="text-[11px] text-muted-foreground/60 mt-1">
                Play with a friend
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Status */}
      <motion.div
        key={getStatusText()}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
      >
        {getStatusText()}
      </motion.div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-[3px] bg-border/60 p-[3px] rounded-sm">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i);
          const canClick = !cell && !gameOver && (mode === "two-player" || isPlayerTurn);
          return (
            <motion.button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={!canClick}
              className={`
                w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center
                bg-background rounded-sm cursor-pointer
                transition-colors duration-150
                disabled:cursor-default
                ${canClick ? "hover:bg-accent" : ""}
                ${isWinCell ? "bg-accent" : ""}
              `}
              whileTap={canClick ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {cell && (
                  <motion.span
                    key={`${i}-${cell}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className={`
                      text-3xl sm:text-4xl font-light select-none
                      ${cell === "X" ? "text-foreground" : "text-muted-foreground/50"}
                      ${isWinCell ? "text-foreground" : ""}
                    `}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm text-muted-foreground 
                     border border-border rounded-sm hover:text-foreground hover:border-foreground/30
                     transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New game
        </button>
        <button
          onClick={() => setMode(null)}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground 
                     transition-colors duration-200 cursor-pointer"
        >
          Change mode
        </button>
        <button
          onClick={resetScores}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground 
                     transition-colors duration-200 cursor-pointer"
        >
          Reset scores
        </button>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-8 text-center">
        <div>
          <div className="text-2xl font-light">{scores.X}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-1">
            {mode === "computer" ? "You" : "Player X"}
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <div className="text-2xl font-light">{scores.draws}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-1">
            Draws
          </div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <div className="text-2xl font-light">{scores.O}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-1">
            {mode === "computer" ? "Computer" : "Player O"}
          </div>
        </div>
      </div>
    </div>
  );
}
