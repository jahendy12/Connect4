// According to my reserch, JQuery seemed to be an easier, less hacky way to create this board as opposed to vanilla JS

let redPlayer = 0;
let bluePlayer = 0;

class Game {
    constructor(selector) {
        this.rows = 6;
        this.columns = 7;
        this.player = 'red';
        this.redScore = 0; 
        this.blueScore = 0;
        this.selector = selector;
        this.isGameDecided = false;
        this.createGame();  
        this.setupEventListeners();
    }
    // Declaring class to be used in main file 


    createGame() {
        const $game = $(this.selector);
        $game.empty();
        this.isGameDecided = false; 
        this.player = 'red';
        for (let row = 0; row < this.rows; row++) {
             const $row = $('<div>')
                .addClass('row');
                // Creates nested rows on game board
            for (let col = 0; col < this.columns; col++) {
                const $col = $('<div>')
                .addClass('col empty')
                // Creates nested columns on game board, make empty so it can determine whether there is a token inside of it
                .attr('data-col', col)
                .attr('data-row', row);
                // Allows us to add attribute to different columns and rows
              $row.append($col);  
            }          
            $game.append($row);
        }
    }

    setupEventListeners() {
        const $game = $(this.selector);
        const that = this;

        // This portion is made to drop different, alternating colors in the grid we have created //

        // the purpose of using "that" right here is because this frequently changes when you change the scope by calling a new function, you can't access the original value by using it. Aliasing it to that allows you still to access the original value of this. //

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }

        // loops over backwards, gets last empty cell in column 

        $game.on('mouseenter', '.col.empty', function() {
            if (that.isGameDecided) return;
            console.log('here', this);
            const col = $(this).data('col');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.addClass(`next-${that.player}`);          
        });
        // As the cells are hovered over, the last empty cell is highlighted, also accounts for whose turn it is with ${that.player}. Also adds a class. 

        $game.on('mouseleave', '.col', function() {
            $('.col').removeClass(`next-${that.player}`);
        });

        // this code removes the class 

        
        $game.on('click', '.col.empty', function() {
            if (that.isGameDecided) return;
            const col = $(this).data('col');
            const row = $(this).data('row');
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);
            if (that.player === 'red') {
                redPlayer++
            } else if (that.player === 'blue') {
                bluePlayer++
            }
                

            // this places the appropriate players token in the last empty cell in the column
            // $lastEmptyCell.data('player', that.player) checks what cell is set to what player in the game

            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'), 
                $lastEmptyCell.data('col'), 
                ) 
            if (winner) {
                if (winner === 'red') {
                    $(".playerRedWins").text(`Red Player Games won: ${that.redScore+=1}`); 
                } else if (winner === 'blue') {
                    $(".playerBlueWins").text(`Blue Player Games won: ${that.blueScore+=1}`); 
                }  
                that.isGameDecided = true;
                alert(`Player ${that.player} has won the game!`);
                return;
            }  

            // this checks to see if the game is over at any given turn, gives an alert if game has been completed referring to the player who wins, also updates scoreboard on bottom

            that.player = (that.player === 'red') ? 'blue' : 'red';
            $(this).trigger('mouseenter');
            // alternates between red and blue players getting a turn
        });
    }

    checkForWinner(row, col) {
        // parameters of this are the row and column you just clicked
        const that = this;

        function $getCell(i, j) {
            return $(`.col[data-row='${i}'][data-col='${j}']`);
        }


        function checkDirection(direction) {
            let total = 0; 
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 && 
                i < that.rows &&
                j >= 0 && 
                j < that.columns && 
                $next.data('player') === that.player) {
                    total++; 
                    i += direction.i;
                    j += direction.j;
                    $next = $getCell(i, j);
                }
                return total;
        }

        // this logic checks the different directions being done when a player goes on their turn and is used below in the checkWin function to calculate a winner if a player has four in a row 

        function checkWin(directionA, directionB) {
            const total = 1 +
            checkDirection(directionA) + 
            checkDirection(directionB);
          if (total >= 4)  {           
              return that.player;
          } else {
              return null;
          }
        }

        // checkWin is responsible for checking if a players total in a row is greater than or equal to 4, if neither of the players is at 4 in a row, it doesn't return anything 

        function checkDiagonalBLtoTR() {
            return checkWin({i: 1, j: -1}, {i: 1, j:1});
        }

        function checkDiagonalTLtoBR() {
            return checkWin({i: 1, j: 1}, {i: -1, j: -1});
        }

        function checkVerticals() {
            return checkWin({i: -1, j:0}, {i: 1, j:0});
        }

        function checkHorizontals() {
            return checkWin({i: 0, j: -1}, {i: 0, j: 1});
        }

        return checkVerticals() ||
        checkHorizontals() ||
        checkDiagonalBLtoTR() ||
        checkDiagonalTLtoBR()
        // checks if either player has won in any of the directions
    }
    restart() {
        this.createGame();

        // restart button under game board
    }
}

