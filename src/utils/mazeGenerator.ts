import { MazeCell, MazeConfig } from '../types';

type Direction = 'top' | 'right' | 'bottom' | 'left';
type Neighbor = {
  x: number;
  y: number;
  direction: Direction;
};

const createEmptyMaze = (width: number, height: number): MazeConfig => {
  const cells: MazeCell[][] = Array(height)
    .fill(null)
    .map(() =>
      Array(width)
        .fill(null)
        .map(() => ({
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        }))
    );

  return { width, height, cells };
};

const getNeighbors = (x: number, y: number, maze: MazeConfig): Neighbor[] => {
  const neighbors: Neighbor[] = [];
  const directions: { [key: string]: [number, number, Direction] } = {
    top: [0, -1, 'top'],
    right: [1, 0, 'right'],
    bottom: [0, 1, 'bottom'],
    left: [-1, 0, 'left'],
  };

  for (const [dx, dy, direction] of Object.values(directions)) {
    const newX = x + dx;
    const newY = y + dy;

    if (
      newX >= 0 &&
      newX < maze.width &&
      newY >= 0 &&
      newY < maze.height &&
      !maze.cells[newY][newX].visited
    ) {
      neighbors.push({ x: newX, y: newY, direction });
    }
  }

  return neighbors;
};

const removeWalls = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  direction: keyof MazeCell['walls'],
  maze: MazeConfig
) => {
  const oppositeWalls: { [key: string]: keyof MazeCell['walls'] } = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  };

  maze.cells[y1][x1].walls[direction] = false;
  maze.cells[y2][x2].walls[oppositeWalls[direction]] = false;
};

export const generateMaze = (width: number, height: number): MazeConfig => {
  const maze = createEmptyMaze(width, height);
  const stack: [number, number][] = [];
  let currentX = 0;
  let currentY = 0;

  maze.cells[currentY][currentX].visited = true;
  stack.push([currentX, currentY]);

  while (stack.length > 0) {
    const neighbors = getNeighbors(currentX, currentY, maze);

    if (neighbors.length > 0) {
      const { x, y, direction } = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push([currentX, currentY]);
      removeWalls(currentX, currentY, x, y, direction, maze);
      currentX = x;
      currentY = y;
      maze.cells[currentY][currentX].visited = true;
    } else if (stack.length > 0) {
      [currentX, currentY] = stack.pop()!;
    }
  }

  // Réinitialiser la propriété visited pour une utilisation ultérieure
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      maze.cells[y][x].visited = false;
    }
  }

  return maze;
}; 