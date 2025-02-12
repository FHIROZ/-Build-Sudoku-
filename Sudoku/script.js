const gridContainer = document.getElementById('sudoku-grid');
const solveButton = document.getElementById('solve-button');
const clearButton = document.getElementById('clear-button');
const hintButton = document.getElementById('hint-button');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const difficultySelector = document.getElementById('difficulty');

let puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];
let solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

let initialPuzzle; // Store the initial state of the puzzle
let timerInterval;
let startTime;
let score = 0;
let isGameCompleted = false;
let hintCount = 3; // Limit the number of hints

// Helper function to format time
function formatTime(milliseconds) {
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
}

// Start Timer Function
function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(function () {
        let currentTime = new Date().getTime();
        let elapsedTime = currentTime - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);

        // Highlight the timer every 10 seconds
        if (Math.floor(elapsedTime / 1000) % 10 === 0) {
            timerDisplay.classList.add('highlight');
            setTimeout(() => {
                timerDisplay.classList.remove('highlight');
            }, 1000); // Remove highlight after 1 second
        }
    }, 1000);
}

// Stop Timer Function
function stopTimer() {
    clearInterval(timerInterval);
}

// Update Score Function
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = "Score: " + score;
}

// Function to display message
function displayMessage(message, duration = 3000) {
    messageDisplay.textContent = message;
    messageDisplay.style.display = 'block';
    setTimeout(() => {
        messageDisplay.style.display = 'none';
    }, duration);
}

function createGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let input = document.createElement('input');
            input.type = 'number';
            input.min = '1';
            input.max = '9';
            input.value = puzzle[i][j] === 0 ? '' : puzzle[i][j];
            input.disabled = puzzle[i][j] !== 0;
            input.dataset.row = i; // Store row index
            input.dataset.col = j; // Store column index
            input.addEventListener('input', () => {
                if (isGameCompleted) return;
                let value = parseInt(input.value) || 0;
                if (value >= 1 && value <= 9) {
                    puzzle[i][j] = value;
                    if (value === solution[i][j]) {
                        updateScore(10);
                        input.classList.remove('error-input');
                        input.classList.add('correct-input');
                        setTimeout(() => input.classList.remove('correct-input'), 500);
                        // Check if the game is completed
                        if (checkIfGameIsCompleted()) {
                            gameCompleted();
                        }
                    } else {
                        updateScore(-5);
                        input.classList.remove('correct-input');
                        input.classList.add('error-input');
                        setTimeout(() => input.classList.remove('error-input'), 500);
                    }
                } else {
                    puzzle[i][j] = 0;
                    input.value = '';
                    input.classList.remove('correct-input');
                    input.classList.remove('error-input');
                }
            });
            gridContainer.appendChild(input);
        }
    }
}

// Function to check if the game is completed
function checkIfGameIsCompleted() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (puzzle[i][j] !== solution[i][j]) {
                return false;
            }
        }
    }
    return true;
}

// Function to handle game completion
function gameCompleted() {
    isGameCompleted = true;
    stopTimer();
    displayMessage("Congratulations! You solved the Sudoku!");
    let endTime = new Date().getTime();
    let timeTaken = endTime - startTime;
    // Award bonus points if completed within a certain time
    if (timeTaken <= 300000) { // 5 minutes
        updateScore(200);
        displayMessage("Bonus Points: You completed it under 5 minutes!");
    } else {
        displayMessage("Good job! Keep practicing to improve your time.");
    }
}

function isValidMove(board, row, col, num) {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) {
            return false;
        }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) {
            return false;
        }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudoku(board)) {
                            return true; // Solution found
                        } else {
                            board[row][col] = 0; // Backtrack
                        }
                    }
                }
                return false; // No solution exists
            }
        }
    }
    return true; // Puzzle is solved
}

function solvePuzzle() {
    // Make a copy of the initial puzzle to solve
    let boardCopy = puzzle.map(row => [...row]);

    if (solveSudoku(boardCopy)) {
        // Update the puzzle with the solved board
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                puzzle[i][j] = boardCopy[i][j];
            }
        }
        createGrid(); // Re-render the grid with the solved puzzle
    } else {
        displayMessage("No solution exists for this puzzle!");
    }
}

function clearGrid() {
    puzzle = initialPuzzle.map(row => [...row]); // Reset to initial puzzle
    createGrid();
    score = 0;
    scoreDisplay.textContent = "Score: " + score;
    isGameCompleted = false;
    startTimer();
}

// Hint functionality
function provideHint() {
    if (hintCount > 0) {
        let foundHint = false;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j] === 0) {
                    puzzle[i][j] = solution[i][j];
                    hintCount--;
                    updateScore(50); // Award points for using a hint
                    createGrid();
                    foundHint = true;
                    displayMessage(`Hint provided! ${hintCount} hints remaining.`);
                    break;
                }
            }
            if (foundHint) break;
        }
        if (!foundHint) {
            displayMessage("No more hints available for empty cells.");
        }
    } else {
        displayMessage("No more hints available.");
    }
}

//Difficulty Settings
function generateSudoku(difficulty) {
    // Start with a solved puzzle
    let newPuzzle = solution.map(row => [...row]);

    // Remove numbers based on difficulty
    let cellsToRemove;
    switch (difficulty) {
        case 'easy':
            cellsToRemove = 40;
            break;
        case 'medium':
            cellsToRemove = 50;
            break;
        case 'hard':
            cellsToRemove = 60;
            break;
        default:
            cellsToRemove = 40;
    }

    // Randomly remove cells
    for (let i = 0; i < cellsToRemove; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (newPuzzle[row][col] === 0); // Ensure cell is not already empty
        newPuzzle[row][col] = 0;
    }

    return newPuzzle;
}

function initializeGame() {
    let difficulty = difficultySelector.value;
    puzzle = generateSudoku(difficulty);
    initialPuzzle = puzzle.map(row => [...row]); // Store the initial puzzle state
    createGrid();
    startTimer();
    updateScore(0);
    isGameCompleted = false;
    hintCount = 3; // Reset hint count
}


solveButton.addEventListener('click', solvePuzzle);
clearButton.addEventListener('click', clearGrid);
hintButton.addEventListener('click', provideHint);
difficultySelector.addEventListener('change', initializeGame);

// Initialize the game on page load
initializeGame();
