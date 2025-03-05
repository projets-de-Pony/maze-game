import styled from 'styled-components';
import { Difficulty } from '../types';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #282c34;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  color: white;
  max-width: 500px;
  width: 90%;
`;

const DifficultyButton = styled.button`
  padding: 1rem 2rem;
  margin: 0.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  width: 200px;

  &:hover {
    transform: scale(1.05);
  }

  &.easy {
    background-color: #4caf50;
    color: white;
  }

  &.medium {
    background-color: #ff9800;
    color: white;
  }

  &.hard {
    background-color: #f44336;
    color: white;
  }
`;

interface Props {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyModal: React.FC<Props> = ({ onSelectDifficulty }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Choisissez votre niveau de difficulté</h2>
        <p style={{ marginBottom: '2rem' }}>
          Plus le niveau est difficile, plus le labyrinthe sera grand et le temps limité.
        </p>
        <div>
          <DifficultyButton className="easy" onClick={() => onSelectDifficulty('easy')}>
            Facile
          </DifficultyButton>
          <DifficultyButton className="medium" onClick={() => onSelectDifficulty('medium')}>
            Moyen
          </DifficultyButton>
          <DifficultyButton className="hard" onClick={() => onSelectDifficulty('hard')}>
            Difficile
          </DifficultyButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DifficultyModal; 