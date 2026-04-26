
/**
 * DETERMINISTIC GAME ENGINE: TIC-TAC-TOE
 * Implements Minimax with Alpha-Beta Pruning.
 * 
 * Invariants:
 * 1. The search tree is finite (max depth 9).
 * 2. The game is zero-sum.
 * 3. With perfect play, the result is always a draw.
 */

import { Player } from './types';

export const WIN_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]             // diags
];

export function checkWinner(cells: Player[]): Player | 'Draw' | null {
  for (const [a, b, c] of WIN_COMBINATIONS) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  if (cells.every(cell => cell !== null)) {
    return 'Draw';
  }
  return null;
}

let nodesCount = 0;

function evaluate(cells: Player[], aiPlayer: Player): number {
  const winner = checkWinner(cells);
  if (winner === aiPlayer) return 10;
  if (winner === (aiPlayer === 'O' ? 'X' : 'O')) return -10;
  return 0;
}

// Standard Minimax
export function minimax(cells: Player[], depth: number, isMaximizing: boolean, aiPlayer: Player): number {
  nodesCount++;
  const winner = checkWinner(cells);
  if (winner !== null) {
    if (winner === aiPlayer) return 10 - depth;
    if (winner === 'Draw') return 0;
    return depth - 10;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (cells[i] === null) {
        cells[i] = aiPlayer;
        const score = minimax(cells, depth + 1, false, aiPlayer);
        cells[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
    for (let i = 0; i < 9; i++) {
      if (cells[i] === null) {
        cells[i] = humanPlayer;
        const score = minimax(cells, depth + 1, true, aiPlayer);
        cells[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Alpha-Beta Pruning
export function alphaBeta(cells: Player[], depth: number, alpha: number, beta: number, isMaximizing: boolean, aiPlayer: Player): number {
  nodesCount++;
  const winner = checkWinner(cells);
  if (winner !== null) {
    if (winner === aiPlayer) return 10 - depth;
    if (winner === 'Draw') return 0;
    return depth - 10;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (cells[i] === null) {
        cells[i] = aiPlayer;
        const score = alphaBeta(cells, depth + 1, alpha, beta, false, aiPlayer);
        cells[i] = null;
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
    for (let i = 0; i < 9; i++) {
      if (cells[i] === null) {
        cells[i] = humanPlayer;
        const score = alphaBeta(cells, depth + 1, alpha, beta, true, aiPlayer);
        cells[i] = null;
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
    }
    return bestScore;
  }
}

export function getBestMove(cells: Player[], aiPlayer: Player, useAlphaBeta: boolean) {
  nodesCount = 0;
  const startTime = performance.now();
  
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (cells[i] === null) {
      cells[i] = aiPlayer;
      const score = useAlphaBeta 
        ? alphaBeta(cells, 0, -Infinity, Infinity, false, aiPlayer)
        : minimax(cells, 0, false, aiPlayer);
      cells[i] = null;
      
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  const endTime = performance.now();
  return {
    index: move,
    nodesExplored: nodesCount,
    executionTime: endTime - startTime
  };
}
