
export type Player = 'X' | 'O' | null;

export interface BoardState {
  cells: Player[];
}

export interface MoveResult {
  index: number;
  score: number;
  nodesExplored: number;
  timeTaken: number;
}

export interface ComparisonData {
  algo: 'Minimax' | 'Alpha-Beta';
  nodes: number;
  time: number;
}
