$(document).ready(function() {
    const game = new Game ('#game')

$('.newgame').click(function() {
    game.restart();
})
});

$('.button').click(function() {
    alert('The aim for both players is to make a straight line of four own pieces; the line can be vertical, horizontal or diagonal. Before starting, players decide randomly which of them will be the beginner; moves are made alternatively, one by turn.');
});


