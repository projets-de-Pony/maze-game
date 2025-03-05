import Maze from './components/Maze';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #282c34;
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <Maze />
    </AppContainer>
  );
}

export default App; 