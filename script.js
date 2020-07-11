var availableCells = [1, 2, 3, 4, 5, 6, 7, 8, 9]
var winningCombinations = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9],
		[1, 4, 7],
		[2, 5, 8],
		[3, 6, 9],
		[1, 5, 9],
		[3, 5, 7],
	]
var xCells = []
var oCells = []
var status = 'Ongoing'

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
};

Array.prototype.contains = function(element) {
    return $.inArray(element, this) !== -1
};

function winningMove() {
	for (var i = 0; i < winningCombinations.length; i++) {
		if (winningCombinations[i].diff(oCells).length === 1) {
			var move = winningCombinations[i].diff(oCells)[0]
			if (availableCells.contains(move)) {
				console.log('Winning move: ', move)
				return move
			} else {
				continue
			}
		}
	}
	return null;
}

function defensiveMove(n) {
	for (var i = 0; i < winningCombinations.length; i++) {
		if (winningCombinations[i].diff(xCells).length === n) {
			// debugger
			var move = winningCombinations[i].diff(xCells)[0]
			if (availableCells.contains(move)) {
				console.log('Defensive move: ', move)
				return move
			} else {
				continue
			}
		}
	}
	return null;
}

function nextMove() {
	for (var i = 0; i < winningCombinations.length; i++) {
		if (winningCombinations[i].diff(xCells).length === 3) {
			var possibleMoves = winningCombinations[i].diff(oCells)
			var move = possibleMoves.random()
			// if (oCells.length === 1) {
			// 	move = possibleMoves.diff([2, 4, 5, 6, 8]).random()
			// }
			if (availableCells.contains(move)) {
				if (oCells.length === 0) {
					if (availableCells.contains(5)) {
						return 5;
					} else {
						return [1, 3, 7, 9].random()
					}
				}
				console.log('Next move: ', move)
				return move
			} else {
				continue
			}
		}
	}
	var move = availableCells.random()
	if (availableCells.contains(move)) {
		move = availableCells.random()
	}
	console.log('Random move: ', move)
	return move;
}

function getNextMove() {
	if (winningMove() !== null) {
		return winningMove()
	}

	if (defensiveMove(1) !== null) {
		return defensiveMove(1)
	}

	return nextMove()
}

function calculateWinner(arr, who) {
	if ((arr.contains(1) && arr.contains(2) && arr.contains(3))
		 || (arr.contains(4) && arr.contains(5) && arr.contains(6))
		 || (arr.contains(7) && arr.contains(8) && arr.contains(9))
		 || (arr.contains(1) && arr.contains(4) && arr.contains(7))
		 || (arr.contains(2) && arr.contains(5) && arr.contains(8))
		 || (arr.contains(3) && arr.contains(6) && arr.contains(9))
		 || (arr.contains(3) && arr.contains(5) && arr.contains(7))
		 || (arr.contains(1) && arr.contains(5) && arr.contains(9))) {
		$('#game-board').append('<p>We have a winner: ' + who + '</p>')
		status = 'Done'
		// resetGame()
	}
	if (status === 'Ongoing' && availableCells.length === 0) {
		status = 'Done'
		$('#game-board').append('<p>Game over: Draw!!</p>')
	}
}

function resetGame() {
	availableCells = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	xCells = []
	oCells = []
	for (var i = 0; i < $('.cell').length; i++) {
		$($('.cell')[i]).html('<span class="cell-content"></span>')
	}
}

$(function() {
	$('.cell').click(function(e) {
		var cell = $(this)
		var number = cell.data('number')
		if (availableCells.contains(number) && status === 'Ongoing') {
			cell.html('<span class="cell-content x">X</span>')
			xCells.push(number)
			availableCells = $.grep(availableCells, function(value) {
			  return value != number;
			});

			calculateWinner(xCells, 'X')

			if (status === 'Done') return

			var nextIndex = getNextMove()
			
			var nextCell = $('.cell[data-number="' + nextIndex + '"]')
			nextCell.html('<span class="cell-content o">O</span>')
			oCells.push(nextIndex)
			availableCells = $.grep(availableCells, function(value) {
			  return value != nextIndex;
			});

			calculateWinner(oCells, 'O')
		}
	})

	$('button').click(function(e) {
		// e.preventDefault()
		// resetGame()
		window.location.reload()
	})	
})