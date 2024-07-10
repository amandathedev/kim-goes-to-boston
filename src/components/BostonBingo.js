import React, { useState, useEffect } from 'react';
import './BostonBingo.scss';
import Tooltip from './Tooltip';
import useWindowSize from '../hooks/useWindowSize';
import { tasks } from '../utils/tasks';
import Confetti from 'react-confetti';

const generateBingoGrid = () => {
  const grid = Array(5).fill(null).map(() => Array(6).fill(null));
  let taskIndex = 0;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 6; col++) {
      if (taskIndex < tasks.length) {
        grid[row][col] = tasks[taskIndex++];
      }
    }
  }
  return grid;
};

const checkBingo = (completedTasks, bingoGrid) => {
  const rows = bingoGrid.length;
  const cols = bingoGrid[0].length;
  const completedBingos = [];

  // Check horizontal
  for (let row = 0; row < rows; row++) {
    if (bingoGrid[row].every(task => completedTasks.includes(task.id))) {
      completedBingos.push(bingoGrid[row].map(task => task.id));
    }
  }

  // Check vertical
  for (let col = 0; col < cols; col++) {
    const column = [];
    for (let row = 0; row < rows; row++) {
      column.push(bingoGrid[row][col]);
    }
    if (column.every(task => completedTasks.includes(task.id))) {
      completedBingos.push(column.map(task => task.id));
    }
  }

  return completedBingos.length > 0 ? completedBingos : null;
};

const BostonBingo = () => {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [bingos, setBingos] = useState([]);
  const [achievedBingos, setAchievedBingos] = useState(() => {
    const saved = localStorage.getItem('achievedBingos');
    return saved ? JSON.parse(saved) : [];
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    const bingoGrid = generateBingoGrid();
    const newBingos = checkBingo(completedTasks, bingoGrid);
    if (newBingos) {
      setBingos(newBingos);
      const newAchievedBingos = [...achievedBingos];
      let hasNewBingo = false;
      newBingos.forEach((bingo) => {
        const bingoKey = bingo.join('-');
        if (!newAchievedBingos.includes(bingoKey)) {
          newAchievedBingos.push(bingoKey);
          hasNewBingo = true;
        }
      });
      if (hasNewBingo) {
        setAchievedBingos(newAchievedBingos);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Show confetti for 5 seconds
      }
    } else {
      setBingos([]);
    }
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('achievedBingos', JSON.stringify(achievedBingos));
  }, [achievedBingos]);

  const handleTaskClick = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks((prev) => prev.filter(id => id !== taskId));
    } else {
      setCompletedTasks((prev) => [...prev, taskId]);
    }
  };

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId);
  const isTaskInBingo = (taskId) => bingos.some(bingo => bingo.includes(taskId));

  const bingoGrid = generateBingoGrid();
  const size = useWindowSize();

  const columnHeaders = ['B', 'O', 'S', 'T', 'O', 'N'];

  return (
    <div className="bingo-container">
      {showConfetti && <Confetti width={size.width} height={size.height} />}
      <div className="header">
        {columnHeaders.map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </div>
      {size.width <= 600 ? (
        <div className="mobile-column-container">
          {bingoGrid[0].map((_, colIndex) => (
            <div className="mobile-column" key={`mobile-column-${colIndex}`}>
              <div className="column-header">{columnHeaders[colIndex]}</div>
              {bingoGrid.map((row, rowIndex) => {
                const task = row[colIndex];
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`bingo-cell ${isTaskCompleted(task.id) ? 'completed' : ''} ${isTaskInBingo(task.id) ? 'bingo' : ''}`}
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <Tooltip text={task.text}>
                      <div className={isTaskCompleted(task.id) ? 'completed-task' : 'task'}>
                        {isTaskCompleted(task.id) ? '✓' : task.text}
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="bingo-grid">
          {bingoGrid.map((row, rowIndex) => (
            row.map((task, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`bingo-cell ${isTaskCompleted(task.id) ? 'completed' : ''} ${isTaskInBingo(task.id) ? 'bingo' : ''}`}
                onClick={() => handleTaskClick(task.id)}
              >
                <Tooltip text={task.text}>
                  <div className={isTaskCompleted(task.id) ? 'completed-task' : 'task'}>
                    {isTaskCompleted(task.id) ? '✓' : task.text}
                  </div>
                </Tooltip>
              </div>
            ))
          ))}
        </div>
      )}
      {bingos.length > 0 && <div className="success-indicator">Bingo!</div>}
    </div>
  );
};

export default BostonBingo;
