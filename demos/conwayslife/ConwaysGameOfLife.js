/* Drag and Drop
  -----------------------
  iioEngine version 1.4.1
  -----------------------
*/
ConwaysGameOfLife = function( app, settings ){

  // Game Rules
  // -------------------------------------------------
  // Any live cell with fewer than two live neighbors dies
  // Any live cell with two or three live neighbors lives on to the next generation.
  // Any live cell with more than three live neighbors dies
  // Any dead cell with exactly three live neighbors becomes a live cell

  // Input Controls
  // -------------------------------------------------
  // Create New Cell: click anywhere
  // Pause: 'p' or 'space' keys
  // Step Forward: 'right arrow' if game is paused
  // Play Again After all Cells Die: 'space'

  // Settings
  // -------------------------------------------------
  // game settings
  var settings = settings || {};
  var maxCellsInRow = 18;
  var generation = 0;
  var simulationSpeed = 10;
  var currentCellGeneration = [];
  var toroidalGrid = true;
  var loopOnStart = true;
  var gridLines = false;
  var gameColor = new iio.Color(81, 255, 0, 1);

  // grid settings
  var grid;
  var gridLastRow;
  var gridLastColumn;
  var gridWidth = app.width;
  var gridHeight = app.height;
  var gridResolution = (gridWidth > gridHeight ? gridHeight : gridWidth) / maxCellsInRow;

  // app settings
  app.set({ color: 'black' });

  // Optional Initial Configurations (cool patterns)
  // -------------------------------------------------
  var createGlider = function(c, r) {
    spawnPattern([
      [c, r],
      [c + 2, r],
      [c + 1, r + 1],
      [c + 2, r + 1],
      [c + 1, r + 1],
      [c + 1, r + 2]
    ]);
  }

  var createPulsar = function(c, r) {
    var subPattern = function(offset) {
      return [
        [c + 2, r + offset], [c + offset, r + 2],
        [c + 3, r + offset], [c + offset, r + 3],
        [c + 4, r + offset], [c + offset, r + 4],
        [c + 8, r + offset], [c + offset, r + 8],
        [c + 9, r + offset], [c + offset, r + 9],
        [c + 10, r + offset], [c + offset, r + 10]
      ];
    };
    spawnPattern(subPattern(0));
    spawnPattern(subPattern(5));
    spawnPattern(subPattern(7));
    spawnPattern(subPattern(12));
  }

  // Initialization
  // -------------------------------------------------
  var init = function() {
    grid = createGrid();
    gridLastRow = Math.floor(grid.R - 1);
    gridLastColumn = Math.floor(grid.C - 1);

    // create optional starting patterns from settings
    if (settings.pulsar) {
      createPulsar(Math.floor(grid.C / 2) - 6, Math.floor(grid.R / 2) - 6);
    } else if (settings.glider) {
      createGlider(0, 0);
    }

    // start game
    if (loopOnStart)
      if (currentCellGeneration.length > 0)
        app.loop(simulationSpeed);
    else
      app.draw();
  }

  // Input Handling
  // -------------------------------------------------
  var onGridClick = function( grid, event, clickPos, cell ) {
    spawnInCurrentGeneration(cell);
    gameColor = iio.Color.random();
    app.draw();
  }

  app.onKeyUp = function(e, k) {
    // step one generation if app is paused
    if (k === 'right arrow') {
      if (app.paused)
        nextGeneration();
    }
    // handle pausing and restarts
    else if (k === 'space' || k === 'p') {
      if (app.paused) {
        app.unpause();
      } else {
        if (app.looping)
          app.unpause();
        else
          app.loop(simulationSpeed)
      }
    }
  }

  // Screen Resizes
  // -------------------------------------------------
  this.onResize = function(){
    // implement for dynamic screen sizes
  };

  // Object Management
  // -------------------------------------------------
  var createGrid = function() {
    return app.add( new iio.Grid({
      pos: app.center,
      width: gridWidth,
      height: gridHeight,
      color: gridLines ? 'white' : undefined,
      lineWidth: gridLines ? 2 : undefined,
      C: gridWidth / gridResolution,
      R: gridHeight / gridResolution,
      onClick: onGridClick,
      updateCellGeneration: updateCellGeneration,
      cellWillBeAlive: cellWillBeAlive
    }));
  }

  var spawn = function(cell) {
    if (cell.alive) return;
    cell.color = gameColor;
    cell.alive = true;
    return cell;
  };

  var spawnPattern = function(coordinates) {
    var vectors = createVectors(coordinates);
    var adjusted = adjustOutOfBoundsCoordinates(vectors);
    for (var i = 0; i < adjusted.length; i++) {
      spawnInCurrentGeneration(grid.cells[adjusted[i].x][adjusted[i].y])
    }
  }

  var spawnInCurrentGeneration = function(cell) {
    var newCell = spawn(cell);
    if (newCell)
      currentCellGeneration.push(newCell);
  }

  // Main Loop
  // -------------------------------------------------
  this.onUpdate = function() {
    nextGeneration();
    if (currentCellGeneration.length === 0)
      return false;
  }

  var nextGeneration = function() {
    generation++;
    console.log('generation: ' + generation + ', cells: ' + currentCellGeneration.length);

    var allCellsAndNeighborsMap = {}
    currentCellGeneration.forEach(function(cell) {
      if (!allCellsAndNeighborsMap['' + cell.c]) {
        allCellsAndNeighborsMap['' + cell.c] = {};
      }
      allCellsAndNeighborsMap['' + cell.c]['' + cell.r] = true;

      var neighborCoordinates = getNeighborCoordinates(cell);
      neighborCoordinates = adjustOutOfBoundsCoordinates(neighborCoordinates);

      neighborCoordinates.forEach(function(vector) {
        if (!allCellsAndNeighborsMap['' + vector.x]) {
          allCellsAndNeighborsMap['' + vector.x] = {};
        }
        allCellsAndNeighborsMap['' + vector.x]['' + vector.y] = true;
      });
    });

    var cellCoordinates = calculateNextGenerationCoordinates(allCellsAndNeighborsMap);
    currentCellGeneration = grid.updateCellGeneration(cellCoordinates);

    app.draw();
  };

  // Coordinate Helpers
  // -------------------------------------------------
  var createVectors = function(coordinates) {
    var vs = []
    for (var i = 0; i < coordinates.length; i++)
      vs.push(new iio.Vector(coordinates[i][0], coordinates[i][1]));
    return vs;
  }

  var getNeighborCoordinates = function(cell) {
    return createVectors([
      [cell.c - 1, cell.r - 1],
      [cell.c, cell.r - 1],
      [cell.c + 1, cell.r - 1],
      [cell.c - 1, cell.r],
      [cell.c + 1, cell.r],
      [cell.c - 1, cell.r + 1],
      [cell.c, cell.r + 1],
      [cell.c + 1, cell.r + 1]
    ]);
  }

  var adjustOutOfBoundsCoordinates = function(coordinates) {
    var adjusted = [];
    for (var i = 0; i < coordinates.length; i++) {
      var x = coordinates[i].x
      var y = coordinates[i].y

      if (toroidalGrid) {
        if (x < 0) x = gridLastColumn;
        if (y < 0) y = gridLastRow;
        if (x > gridLastColumn) x = 0
        if (y > gridLastRow) y = 0
      } else {
        if (x < 0) continue;
        if (y < 0) continue;
        if (x > gridLastColumn) continue;
        if (y > gridLastRow) continue;
      }
      adjusted.push(new iio.Vector(x, y))
    }
    return adjusted;
  }

  var calculateNextGenerationCoordinates = function(map) {
    var nextGenerationCoordinates = [];
    for (var column in map) {
      for (var row in map[column]) {
        var vector = new iio.Vector(parseInt(column, 10), parseInt(row, 10))
        var cell = grid.cells[vector.x][vector.y];
        if (grid.cellWillBeAlive(cell))
          nextGenerationCoordinates.push(new iio.Vector(cell.c, cell.r));
      }
    }
    return nextGenerationCoordinates;
  }

  // Custom Grid Functions
  // -------------------------------------------------
  var updateCellGeneration = function(coordinates) {
    this.clear(true);
    var nextCellGeneration = [];
    for (var i = 0; i < coordinates.length; i++) {
      var newCell = spawn(this.cells[coordinates[i].x][coordinates[i].y]);
      if (newCell)
        nextCellGeneration.push(newCell);
    }
    return nextCellGeneration;
  }

  var cellWillBeAlive = function(cell) {
    var lifeSum = 0;
    var neighborCoordinates = getNeighborCoordinates(cell)
    neighborCoordinates = adjustOutOfBoundsCoordinates(neighborCoordinates);

    if (cell.alive)
      lifeSum++;

    for (var i = 0; i < neighborCoordinates.length; i++) {
      var neighborCell = this.cells[neighborCoordinates[i].x][neighborCoordinates[i].y]
      if (neighborCell.alive)
        lifeSum++;   
    }

    if (lifeSum === 3)
      return true;
    if (lifeSum === 4 && cell.alive)
      return true;
    return false;
  }

  // start game
  // -------------------------------------------------
  init();
}
