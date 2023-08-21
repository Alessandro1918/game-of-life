let generationCounter = 0
const green = "\x1b[32m"
const white = "\x1b[0m"

//Init current generation grid; "n" by "n" matrix of zeros or ones.
//V1:
//Usage: node gameOfLife.js
// const GRID_SIZE = 10
// const grid = [
//   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
//   [0, 1, 1, 0, 0, 0, 0, 1, 0, 0],
//   [0, 1, 1, 0, 0, 0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// ]
//V2:
//Read data from a .txt file with "n" lines and "n" collumns of "0"s and "1"s separated by a comma.
//Usage: node gameOfLife.js blinker.txt
if (process.argv.length == 2) {
  console.log("Usage: node gameOfLife.js your-grid-file-from-'boards'-folder")
  console.log("Ex: node gameOfLife.js random.txt")
  return
}
const fs = require('fs')
const data = fs.readFileSync(
  `./boards/${process.argv[2]}`, 
  { encoding: 'utf8', flag: 'r' }
)
// console.log(data)
const rows = data.split("\n")
const GRID_SIZE = rows.length
const grid = []
for (var i = 0; i < GRID_SIZE; i++) {
  const row = []
  for (var j = 0; j < GRID_SIZE; j++) {
    const cell = Number(rows[i].split(",")[j])
    row.push(cell)
  }
  grid.push(row)
}

//Print the grid, cell by cell.
function printGrid(grid) {
  console.clear()
  process.stdout.moveCursor(0, -(GRID_SIZE + 1))  //moves cursor up "n" lines (+1 because of the "console.log(genCounter)")
  process.stdout.clearLine(1)                     //clear from cursor to end
  console.log("Generation:", generationCounter)
  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j]) {
        process.stdout.write(green + "██" + white)
      } else {
        process.stdout.write("--")
      }
    }
    process.stdout.write("\n")
  }
}

//Each cell has to have 8 neighbors, border cells included. Consider "not on the board" as "0".
function getCellValue(i, j) {
  if (i < 0 || i == GRID_SIZE) return 0
  if (j < 0 || j == GRID_SIZE) return 0
  return grid[i][j]
}

//Get how many alive cells this cell has around it.
function getNeighborsCount(i, j) {
  return (
    getCellValue(i-1, j-1) +
    getCellValue(i-1, j) +
    getCellValue(i-1, j+1) +
    getCellValue(i, j-1) +
    getCellValue(i, j+1) +
    getCellValue(i+1, j-1) +
    getCellValue(i+1, j) +
    getCellValue(i+1, j+1)
  )
}

//Determines if the cell will be alive or dead on the next generation based on its current status and its neighbor count.
function getCelllNextGenValue(i, j) {
  if (grid[i][j] == 0) {                    //Cell is dead
    if (getNeighborsCount(i, j) == 3) {
      return 1                              //Will be born
    } else {
      return 0                              //Remains dead
    }
  } else {                                  //Cell is alive
    if ((getNeighborsCount(i, j) < 2) ||    //Isolation
        (getNeighborsCount(i, j) > 3)) {    //Overpopulation
      return 0                              //Dies
    } else {
      return 1                              //Remains alive
    }
  }
}

printGrid(grid)

const timer = setInterval(() => {
  
  //Init grid's next generation "n" by "n" grid
  const nextGeneration = []
  for (var i = 0; i < GRID_SIZE; i++) {
    const row = []
    for (var j = 0; j < GRID_SIZE; j++) {
      row.push(0)
    }
    nextGeneration.push(row)
  }

  //Get board's next generation value (do not update old generation yet)
  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      nextGeneration[i][j] = getCelllNextGenValue(i, j)
    }
  }

  //Update old generation with new generation
  let isChange = false
  for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
      //Check if things changed
      if (nextGeneration[i][j] != grid[i][j]) {
        isChange = true
      }
      grid[i][j] = nextGeneration[i][j]
    }
  }

  if (isChange) {
    generationCounter = generationCounter + 1
    printGrid(grid)
  } else {
    clearInterval(timer)
  }
}, 500) //ms