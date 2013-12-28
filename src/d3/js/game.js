function makeMove(cell){
    if(!window.finished){
        window.lastMove = cell;
        cell.state = window.curTurn;
        window.movesLeft -= 1;
        if(window.movesLeft < 1){
            window.curTurn = 3 - window.curTurn;
            window.movesLeft = 2;
        }
        move = new Object();
        move.coordinates = [cell.x, cell.y, cell.z];
        move.state = cell.state;
        window.moveHistory.push(move);
    }
    updateStatus();
}

function stepBack(){
    if(window.finished && window.replayMoveNum >= 0){
        getCell(window.moveHistory[window.replayMoveNum].coordinates).state = 0;
        window.replayMoveNum -= 1;
    }
}

function stepForward(){
    if(window.finished && window.replayMoveNum < window.moveHistory.length - 1){
        getCell(window.moveHistory[window.replayMoveNum].coordinates).state = window.moveHistory[window.replayMoveNum].state;
        window.replayMoveNum -= 1;
    }
}

function rewind(){
    if(window.finished){
        forEveryCell(function(cell) {
            cell.state = 0;
        });
        window.replayMoveNum = -1;
    }
}

function fastForward(){
    if(window.finished){
        for(var i = 0; i < window.moveHistory.length; i++){
            var move = window.moveHistory[i];
            getCell(move.coordinates).state = move.state;
            window.replayMoveNum = window.moveHistory.length - 1;
        }
    }
}

function endGame(){
    window.finished = true;
    window.replayMoveNum = window.moveHistory.length - 1;
}

function pass(){
    if(window.passed){
        endGame();
    } else {
        window.passed = true;
        window.curTurn = 3 - window.curTurn;
        window.movesLeft = 2;
    }
}

function undoMove(){
    if(window.lastMove && !window.finished){
        var cell = window.lastMove;
        window.lastMove = null;
        if(cell.state == window.curTurn){
            window.movesLeft += 1;
        } else {
            window.curTurn = 3 - window.curTurn;
            window.movesLeft = 1;
        }
        cell.state = 0;
    }
}

function updateTime(){
    var now = Date.now();
    
    var timeEnd = [0, window.timeStarted + window.timeGiven[1], window.timeStarted + window.timeGiven[2]];
    var timeLeft = [0, timeEnd[1] - now, timeEnd[2] - now];
    $("#p1_time").text(Math.ceil(timeLeft[1]/1000));
}

function newGame(p1_name, p2_name, handicap, size){

    setInterval(updateTime, 100);

    if(window.justStarted){
        window.justStarted = false;
        addSVG();
    }
    
    window.boardSize = size;
    window.cellSize = 0.55*window.svgW/(window.boardSize*2+1);
    window.dataset = [];
    window.cellMap = new Object();
    window.passed = false;
    window.finished = false;
    window.mode = "game";
    window.moveHistory = [];
    
    //game related variables
    window.curTurn = 1;
    window.movesLeft = 1 + parseInt(handicap, 10);
    window.playerNames = ["", p1_name, p2_name];
    
    window.timeGiven = [0, 600000, 600000];
    window.timeStarted = Date.now();

    for(var i=-window.boardSize; i<=window.boardSize; i++){
        for(var j=-window.boardSize; j<=window.boardSize; j++){
            var k = -j-i;
            if(k <= window.boardSize && k >= -window.boardSize){
                //figure out the tiling colors
                var col = 0;
                if((i-j)%3 == 0){
                    col = 1;
                } else if((i-j-1) % 3 == 0){
                    col = 2;
                }

                var edge = false;
                if(Math.max(Math.abs(i), Math.abs(j), Math.abs(k)) == window.boardSize)
                    edge = true;

                //Push returns the length of the array; To get the index of the element, we subtract 1.
                window.cellMap['' + i + ':' + j + ':' + k] = window.dataset.push(
                   {"x": i, 
                    "y": j, 
                    "z": k, 
                    "state": 0, 
                    "patternCol": col,
                    "edge": edge, 
                    "marked": false, 
                    "bonus": false, 
                    "isCenter": false, 
                    "scoreState": 0,
                    "group": -1}) - 1;
            }
        }
    }
    
    getCell(0, 0, 0).isCenter = true;

    drawHexes();
    
    //mark the bonus cells
    var potentialBonusCells = randomSample(window.dataset, 6);
    numAdded = 0;
    for(var i = 0; i < potentialBonusCells.length; i++){
        var cell = potentialBonusCells[i];
        if(!cell.isCenter && numAdded < 5){
            cell.bonus = true;
            numAdded += 1;
        }
    }

    window.groups.on("click", function(d){
            if(d.state == 0 && !d.isCenter){
                d3.select(this).selectAll("polygon")
                    .attr("fill-opacity", 1.0);
                makeMove(d);
                redraw();
            }
        })
        .on("mouseover", function(d){
            if(d.state == 0 && !d.isCenter){
                d3.select(this).selectAll("polygon")
                    .attr("fill", window.playerColors[window.curTurn])
                    .attr("fill-opacity", 0.5);
            }
        })
        .on("mouseout", function(d){
            d3.select(this).selectAll("polygon")
                .attr("fill", function(d){
                    return properColor(d);
                })
                .attr("fill-opacity", 1.0);
        });

    redraw();
}

function updateStatus(){
    $("#status").text(window.playerNames[window.curTurn] + " has " + window.movesLeft + " move(s)");
}

$(function(){

    window.justStarted = true;
    $("#newGameModal").modal('show');

    $("#newGameModal").on("hidden.bs.modal", function(){
        if(window.justStarted)
            $("#newGameModal").modal('show');
    });

    $("#btn_score").click(function(){
        var score = calculateScore();
        var gameResult = "";
        gameResult += window.playerNames[1] + ": " + score.total[1] + " ";
        gameResult += window.playerNames[2] + ": " + score.total[2] + " ";

        $("#status").text(gameResult);
        window.mode = "score";
        redraw();
    });
    
    
    $("#btn_new").click(function() {
        $("#newGameModal").modal('show');
    });
    
    
    $("#btn_undo").click(function() {
        undoMove();
        redraw();
        updateStatus();
    });

    $("#btn_start").click(function() {
        var p1_name = $("#p1_name_inp").val();
        var p2_name = $("#p2_name_inp").val();
        newGame(p1_name, p2_name,  $("#handicap").val(), $("#boardsize").val());
        $("#newGameModal").modal('hide');
        $("#p1_name").text(p1_name).css("color", window.playerColors[1]);
        $("#p2_name").text(p2_name).css("color", window.playerColors[2]);
        updateStatus();
        redraw();
    });

    $("#btn_random").click(function() {
        forEveryCell(function(cell) {
            if(Math.random() < 0.5)
                cell.state = 1;
            else
                cell.state = 2;
        });
        redraw();
    });

});
