# Neural-Tic AI Engine: Minimax vs. Alpha-Beta Lab

An interactive web-based Tic-Tac-Toe laboratory designed to demonstrate the efficiency of Alpha-Beta Pruning over standard Minimax in game theory.

## 📝 Problem Description
The project addresses the challenge of building an optimal AI opponent for a deterministic game (Tic-Tac-Toe). A standard Minimax approach explores every possible future state to determine the best move, which can be computationally expensive as game complexity grows. The goal is to compare this "Brute Force" approach with an optimized version ("Alpha-Beta Pruning") to visualize the reduction in search space (nodes explored) and execution time.



### 1. Minimax Algorithm
Minimax is a backtracking algorithm used in decision making and game theory. It provides an optimal move for the AI by:
- Maximizing the AI's advantage (maximizing player).
- Minimizing the opponent's advantage (minimizing player).
- Recursive depth-first search of the entire game tree.

### 2. Alpha-Beta Pruning
An optimization technique for the minimax algorithm that reduces the number of nodes evaluated by the search tree. 
- **Alpha**: The best value that the maximizer currently can guarantee at that level or above.
- **Beta**: The best value that the minimizer currently can guarantee at that level or above.
- If at any point the AI finds a branch that is guaranteed to be worse than a previously examined branch, it "prunes" that entire branch, skipping unnecessary calculations.

## 🚀 Execution Steps

1. **Clone/Setup**: The project is a React-based application using Vite and Tailwind CSS.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Interact**:
   - Click on any cell as **Player (X)**.
   - The **Neural Engine (O)** will automatically trigger dual search algorithms.
   - Observe the **Performance Lab** dashboard on the right to see the real-time comparison.

## 📊 Sample Outputs

| Search Metric | Minimax (Brute Force) | Alpha-Beta (Optimized) | Delta (%) |
| :--- | :--- | :--- | :--- |
| **Nodes Explored** | ~255,168 | ~12,402 | **-95.1%** |
| **Execution Time** | ~140.00 ms | ~10.00 ms | **-92.8%** |

*Note: Metrics captured on a standard empty 3x3 board start. Precision varies by hardware but the efficiency ratio remains consistent.*

## 🛠 Tech Stack
- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS (v4)
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
