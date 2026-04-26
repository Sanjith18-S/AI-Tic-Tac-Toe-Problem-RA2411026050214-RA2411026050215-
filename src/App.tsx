/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Activity, Cpu, Zap, Trophy, User } from 'lucide-react';
import { Player, ComparisonData } from './types.ts';
import { checkWinner, getBestMove, WIN_COMBINATIONS } from './engine.ts';

const GRID_SIZE = 3;

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isHumanTurn, setIsHumanTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [stats, setStats] = useState<{
    minimax: { nodes: number; time: number };
    alphaBeta: { nodes: number; time: number };
  }>({
    minimax: { nodes: 0, time: 0 },
    alphaBeta: { nodes: 0, time: 0 },
  });

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsHumanTurn(true);
    setWinner(null);
    setWinningLine(null);
    setStats({
      minimax: { nodes: 0, time: 0 },
      alphaBeta: { nodes: 0, time: 0 },
    });
  };

  const handleAIMove = useCallback(() => {
    if (winner) return;

    // Run both for comparison stats
    const mmResult = getBestMove([...board], 'O', false);
    const abResult = getBestMove([...board], 'O', true);

    setStats({
      minimax: { nodes: mmResult.nodesExplored, time: mmResult.executionTime },
      alphaBeta: { nodes: abResult.nodesExplored, time: abResult.executionTime },
    });

    const newBoard = [...board];
    newBoard[abResult.index] = 'O';
    setBoard(newBoard);
    setIsHumanTurn(true);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'Draw') {
        const line = WIN_COMBINATIONS.find(combo => 
          newBoard[combo[0]] === gameWinner && 
          newBoard[combo[1]] === gameWinner && 
          newBoard[combo[2]] === gameWinner
        );
        if (line) setWinningLine(line);
      }
    }
  }, [board, winner]);

  useEffect(() => {
    if (!isHumanTurn && !winner) {
      const timer = setTimeout(handleAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isHumanTurn, winner, handleAIMove]);

  const handleCellClick = (index: number) => {
    if (board[index] || !isHumanTurn || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsHumanTurn(false);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'Draw') {
        const line = WIN_COMBINATIONS.find(combo => 
          newBoard[combo[0]] === gameWinner && 
          newBoard[combo[1]] === gameWinner && 
          newBoard[combo[2]] === gameWinner
        );
        if (line) setWinningLine(line);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col items-center py-12 px-4 md:px-8 font-sans relative overflow-hidden selection:bg-cyan-500/30">
      {/* Immersive Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 mb-12 text-center max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2"
        >
          Neural-Tic AI Engine
        </motion.h1>
        <p className="text-slate-400 text-sm tracking-[0.2em] uppercase">
          Comparison: Minimax vs. Alpha-Beta Pruning
        </p>
      </header>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-12 gap-8 items-start">
        {/* Game Area - Left Column (7/12) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col items-center justify-center space-y-8 bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl shadow-cyan-900/10">
          <div className="relative">
            <div className="grid grid-cols-3 gap-4 w-[280px] h-[280px] md:w-[400px] md:h-[400px]">
              {board.map((cell, i) => (
                <button
                  key={i}
                  disabled={!!cell || !isHumanTurn || !!winner}
                  onClick={() => handleCellClick(i)}
                  className={`flex items-center justify-center text-4xl md:text-6xl font-bold transition-all duration-300 relative
                    ${winningLine?.includes(i) ? 'border-cyan-500/50 border-2 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border border-slate-700'}
                    ${!cell && isHumanTurn && !winner ? 'hover:bg-slate-800/50 cursor-pointer' : 'cursor-default'}
                    bg-slate-950/80
                  `}
                >
                  <AnimatePresence mode="wait">
                    {cell === 'X' && (
                      <motion.span
                        key="x"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                      >
                        X
                      </motion.span>
                    )}
                    {cell === 'O' && (
                      <motion.span
                        key="o"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.3)]"
                      >
                        O
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              ))}

              {/* Status Overlay */}
              <AnimatePresence>
                {winner && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center border border-slate-700"
                  >
                    <Trophy className="w-12 h-12 text-cyan-400 mb-4" />
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {winner === 'Draw' ? "Draw" : `${winner} Dominates`}
                    </h2>
                    <p className="text-slate-400 mb-6 text-xs uppercase tracking-widest">
                      Search complete. {stats.alphaBeta.nodes} nodes evaluated.
                    </p>
                    <button
                      onClick={resetGame}
                      className="bg-cyan-500 text-slate-950 px-8 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 italic"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      Initialize Restart
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex space-x-12">
            <div className="text-center">
              <span className="block text-[10px] uppercase text-slate-500 mb-1 tracking-widest font-bold">Player (X)</span>
              <div className={`text-2xl font-black transition-colors ${isHumanTurn && !winner ? 'text-cyan-400' : 'text-slate-700'}`}>0{board.filter(c => c === 'X').length}</div>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase text-slate-500 mb-1 tracking-widest font-bold">AI Engine (O)</span>
              <div className={`text-2xl font-black transition-colors ${!isHumanTurn && !winner ? 'text-purple-400' : 'text-slate-700'}`}>0{board.filter(c => c === 'O').length}</div>
            </div>
          </div>
        </div>

        {/* Stats Column - Right Column (5/12) */}
        <aside className="col-span-12 lg:col-span-5 space-y-6">
          {/* Minimax Stats */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Standard Minimax</h2>
              <span className="px-2 py-0.5 bg-red-950 text-red-400 text-[10px] font-bold rounded uppercase">Brute Force</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Execution Time</span>
                <span className="font-mono text-white text-sm">{stats.minimax.time.toFixed(2)} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Nodes Explored</span>
                <span className="font-mono text-white text-sm">{stats.minimax.nodes.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Alpha-Beta Stats */}
          <div className="bg-cyan-950/20 border border-cyan-500/30 p-6 rounded-2xl backdrop-blur-md shadow-lg shadow-cyan-950/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">Alpha-Beta Optimized</h2>
              <span className="px-2 py-0.5 bg-cyan-400 text-cyan-950 text-[10px] font-bold rounded uppercase">Efficient</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-cyan-900/50 pb-2">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Execution Time</span>
                <span className="font-mono text-cyan-300 text-sm">{stats.alphaBeta.time.toFixed(2)} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-xs uppercase tracking-wider">Nodes Explored</span>
                <span className="font-mono text-cyan-300 text-sm">{stats.alphaBeta.nodes.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Performance Delta */}
          {stats.minimax.nodes > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Performance Delta</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl font-black text-white italic tracking-tighter">
                    {Math.round((1 - stats.alphaBeta.nodes / stats.minimax.nodes) * 100)}%
                  </div>
                  <div className="text-[10px] text-emerald-400 leading-tight uppercase font-bold">
                    Reduction in<br />Search Space
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((1 - stats.alphaBeta.nodes / stats.minimax.nodes) * 100)}%` }}
                    className="h-full bg-cyan-500"
                  />
                </div>
              </div>
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px]"></div>
            </div>
          )}

          {/* Log / Debug */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl font-mono text-[10px] leading-relaxed text-slate-500">
            <p className="flex justify-between"><span>ENGINE_STATUS:</span> <span className="text-emerald-400">NOMINAL</span></p>
            <p className="opacity-40">-- LAST_SEARCH: {stats.alphaBeta.nodes} NODES</p>
            <p className="opacity-40">-- PRUNING_STATE: ACTIVE</p>
          </div>
        </aside>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 mt-16 max-w-4xl w-full text-center border-t border-slate-800 pt-8 opacity-40">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold">
          Neural-Tic Laboratory // Powered by Alpha-Beta Optimization
        </p>
      </footer>
    </div>
  );
}
