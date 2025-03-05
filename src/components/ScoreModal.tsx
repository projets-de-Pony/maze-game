import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: #282c34;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  color: white;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 20px 0;
  border: 2px solid #4caf50;
  border-radius: 6px;
  background-color: #1e2127;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #45a049;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  margin: 10px;
  font-size: 1.1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &.primary {
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  }

  &.secondary {
    background-color: #2196f3;
    color: white;
    &:hover {
      background-color: #1976d2;
    }
  }
`;

const ScoreDetails = styled.div`
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;

  p {
    margin: 8px 0;
    font-size: 1.1rem;
  }

  .highlight {
    color: #4caf50;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

interface Props {
  score: number;
  moves: number;
  time: number;
  difficulty: string;
  onSave: (name: string) => void;
  onRestart: () => void;
}

const ScoreModal: React.FC<Props> = ({ score, moves, time, difficulty, onSave, onRestart }) => {
  const [playerName, setPlayerName] = useState('');

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          <h2>🎉 Félicitations !</h2>
          <ScoreDetails>
            <p>Difficulté : <span className="highlight">{difficulty}</span></p>
            <p>Score final : <span className="highlight">{score} points</span></p>
            <p>Temps : {time} secondes</p>
            <p>Mouvements : {moves}</p>
          </ScoreDetails>

          <Input
            type="text"
            placeholder="Entrez votre nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            autoFocus
          />

          <div>
            <Button className="primary" onClick={() => onSave(playerName || 'Anonyme')}>
              Sauvegarder le score
            </Button>
            <Button className="secondary" onClick={onRestart}>
              Nouvelle partie
            </Button>
          </div>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default ScoreModal; 