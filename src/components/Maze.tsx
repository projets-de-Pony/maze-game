import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Position, MazeConfig, Difficulty, GameState, HighScore } from '../types';
import { generateMaze } from '../utils/mazeGenerator';
import DifficultyModal from './DifficultyModal';
import { motion } from 'framer-motion';
import ScoreModal from './ScoreModal';

const MazeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MazeGrid = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 30px);
  grid-template-rows: repeat(${props => props.size}, 30px);
  gap: 0;
  border: 2px solid white;
`;

interface CellProps {
  isPlayer: boolean;
  isExit: boolean;
  isBonus: boolean;
  isObstacle: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

const AnimatedCell = styled(motion.div)<CellProps>`
  width: 30px;
  height: 30px;
  background-color: ${props => {
    if (props.isPlayer) return '#ffeb3b';
    if (props.isExit) return '#4caf50';
    if (props.isBonus) return '#2196f3';
    if (props.isObstacle) return '#f44336';
    return 'transparent';
  }};
  border-top: ${props => (props.walls.top ? '2px solid white' : 'none')};
  border-right: ${props => (props.walls.right ? '2px solid white' : 'none')};
  border-bottom: ${props => (props.walls.bottom ? '2px solid white' : 'none')};
  border-left: ${props => (props.walls.left ? '2px solid white' : 'none')};
`;


const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const HighScores = styled.div`
  position: fixed;
  right: 20px;
  top: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

const TimeBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 10px;
  background-color: #444;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 1rem;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${props => (props.progress < 30 ? '#f44336' : '#4caf50')};
    transition: width 1s linear;
  }
`;

const MobileControls = styled.div`
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
  width: 200px;

  @media (max-width: 768px) {
    display: grid;
  }
`;

const DirectionButton = styled.button`
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:nth-child(1) { grid-column: 2; } /* Up */
  &:nth-child(2) { grid-column: 1; } /* Left */
  &:nth-child(3) { grid-column: 2; } /* Down */
  &:nth-child(4) { grid-column: 3; } /* Right */
`;

const Notice = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: white;
  text-align: center;
  font-size: 0.9rem;
`;

const difficultySettings = {
  easy: { size: 8, timeLimit: 120 },
  medium: { size: 12, timeLimit: 180 },
  hard: { size: 16, timeLimit: 300 },
};

const Maze: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [maze, setMaze] = useState<MazeConfig>(() => generateMaze(difficultySettings.easy.size, difficultySettings.easy.size));
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    timeElapsed: 0,
    moves: 0,
    hasWon: false,
    score: 0,
    timeLimit: difficultySettings.easy.timeLimit
  });
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const saveScore = useCallback((playerName: string) => {
    const newScore: HighScore = {
      playerName,
      difficulty,
      score: gameState.score,
      time: gameState.timeElapsed,
      moves: gameState.moves,
      date: new Date().toISOString()
    };
    
    setHighScores(prev => [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10));
    setShowScoreModal(false);
    setShowModal(true);
  }, [difficulty, gameState]);

  const checkWin = useCallback((pos: Position) => {
    if (maze.cells[pos.y][pos.x].isExit) {
      setGameState(prev => ({ ...prev, hasWon: true, isPlaying: false }));
      setShowScoreModal(true);
    }
  }, [maze]);

  const canMove = (currentX: number, currentY: number, direction: keyof MazeConfig['cells'][0][0]['walls']): boolean => {
    return !maze.cells[currentY][currentX].walls[direction];
  };

  const handleCellEffect = useCallback((pos: Position) => {
    const cell = maze.cells[pos.y][pos.x];
    if (cell.isBonus) {
      setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      maze.cells[pos.y][pos.x].isBonus = false;
    } else if (cell.isObstacle) {
      setGameState(prev => ({ ...prev, score: prev.score - 1 }));
      maze.cells[pos.y][pos.x].isObstacle = false;
    }
  }, [maze]);

  const initializeGame = useCallback((diff: Difficulty) => {
    const size = difficultySettings[diff].size;
    setDifficulty(diff);
    const newMaze = generateMaze(size, size);
    
    // Ajouter des bonus et obstacles
    for (let i = 0; i < size * 2; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (x !== 0 && y !== 0 && x !== size - 1 && y !== size - 1) {
        newMaze.cells[y][x].isBonus = Math.random() > 0.5;
        newMaze.cells[y][x].isObstacle = !newMaze.cells[y][x].isBonus;
      }
    }
    
    newMaze.cells[size - 1][size - 1].isExit = true;
    
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setGameState({
      isPlaying: true,
      timeElapsed: 0,
      moves: 0,
      hasWon: false,
      score: 0,
      timeLimit: difficultySettings[diff].timeLimit
    });
    setShowModal(false);
  }, []);

  useEffect(() => {
    let timer: number;
    if (gameState.isPlaying && !gameState.hasWon) {
      timer = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [gameState.isPlaying, gameState.hasWon]);

  useEffect(() => {
    if (gameState.isPlaying && gameState.timeElapsed >= gameState.timeLimit) {
      setGameState(prev => ({ ...prev, isPlaying: false }));
      alert('Temps écoulé !');
    }
  }, [gameState.timeElapsed, gameState.timeLimit]);

  const handleMove = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    if (!gameState.isPlaying || gameState.hasWon) return;

    setPlayerPosition(prev => {
      const newPosition = { ...prev };
      
      switch (direction) {
        case 'ArrowUp':
          if (prev.y > 0 && canMove(prev.x, prev.y, 'top')) {
            newPosition.y--;
          }
          break;
        case 'ArrowDown':
          if (prev.y < maze.height - 1 && canMove(prev.x, prev.y, 'bottom')) {
            newPosition.y++;
          }
          break;
        case 'ArrowLeft':
          if (prev.x > 0 && canMove(prev.x, prev.y, 'left')) {
            newPosition.x--;
          }
          break;
        case 'ArrowRight':
          if (prev.x < maze.width - 1 && canMove(prev.x, prev.y, 'right')) {
            newPosition.x++;
          }
          break;
      }

      if (newPosition.x !== prev.x || newPosition.y !== prev.y) {
        setGameState(prev => ({ ...prev, moves: prev.moves + 1 }));
        handleCellEffect(newPosition);
        checkWin(newPosition);
      }
      
      return newPosition;
    });
  }, [gameState.isPlaying, gameState.hasWon, maze, checkWin, handleCellEffect]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      handleMove(event.key as 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight');
    }
  }, [handleMove]);

  const renderMaze = () => {
    const cells = [];
    for (let y = 0; y < maze.height; y++) {
      for (let x = 0; x < maze.width; x++) {
        cells.push(
          <AnimatedCell 
            key={`${x}-${y}`}
            isPlayer={playerPosition.x === x && playerPosition.y === y}
            isExit={maze.cells[y][x].isExit || false}
            isBonus={maze.cells[y][x].isBonus || false}
            isObstacle={maze.cells[y][x].isObstacle || false}
            walls={maze.cells[y][x].walls}
          />
        );
      }
    }
    return cells;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <MazeContainer>
      {showModal && <DifficultyModal onSelectDifficulty={initializeGame} />}
      {showScoreModal && (
        <ScoreModal
          score={gameState.score}
          moves={gameState.moves}
          time={gameState.timeElapsed}
          difficulty={difficulty}
          onSave={saveScore}
          onRestart={() => {
            setShowScoreModal(false);
            setShowModal(true);
          }}
        />
      )}
      
      <h1>Labyrinthe de PONY</h1>

      <Notice>
        🎮 Comment jouer :
        <br />
        ⭐ Bonus bleus : +1 point
        <br />
        ⚠️ Obstacles rouges : -1 point
        <br />
        🎯 Objectif : Atteindre la sortie verte
      </Notice>
      
      <TimeBar progress={(1 - gameState.timeElapsed / gameState.timeLimit) * 100} />
      
      <Stats>
        <div>Temps: {gameState.timeElapsed}s / {gameState.timeLimit}s</div>
        <div>Mouvements: {gameState.moves}</div>
        <div>Score: {gameState.score}</div>
        <div>Difficulté: {difficulty}</div>
      </Stats>

      {gameState.hasWon && (
        <div style={{ color: '#4caf50', marginBottom: '10px' }}>
          Félicitations ! Score final : {gameState.score} points
        </div>
      )}

      <MazeGrid size={maze.width}>
        {renderMaze()}
      </MazeGrid>

      <MobileControls>
        <DirectionButton onClick={() => handleMove('ArrowUp')}>↑</DirectionButton>
        <DirectionButton onClick={() => handleMove('ArrowLeft')}>←</DirectionButton>
        <DirectionButton onClick={() => handleMove('ArrowDown')}>↓</DirectionButton>
        <DirectionButton onClick={() => handleMove('ArrowRight')}>→</DirectionButton>
      </MobileControls>

      <HighScores>
        <h3>Meilleurs scores</h3>
        {highScores.map((score, index) => (
          <div key={index}>
            {score.playerName}: {score.score} pts ({score.difficulty})
          </div>
        ))}
      </HighScores>
    </MazeContainer>
  );
};

export default Maze; 