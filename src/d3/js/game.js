

var updateMarkedMoves = function(){
    for(var i = 0; i < window.markedMoves.length; i++){
        window.markedMoves[i].marked = false;
    }
    for(var i = 0; i < window.nextMarkedMoves.length; i++){
        window.nextMarkedMoves[i].marked = true;
    }
    window.markedMoves = window.nextMarkedMoves;
    window.nextMarkedMoves = [];
    redraw();
}

function makeMove(cell){
    if(!window.finished && cell.state == 0){
        if(cell.isCenter){
            if(window.numPotentialMoves == window.movesLeft){
                forEveryCell(function(cell) {
                    if(cell.clickState == 1){
                        cell.state = window.curTurn;
                        window.nextMarkedMoves.push(cell);
                        cell.clickState = 0;
                        cell.marked = false;
                    }
                });
                window.movesLeft = 2;
                window.curTurn = 3 - window.curTurn;
                window.numPotentialMoves = 0;
                updateMarkedMoves();
                switchTime();
                window.passed = false;
            }
        } else {
            if(cell.clickState == 0){
                if(window.numPotentialMoves < window.movesLeft){
                    window.numPotentialMoves++;
                    cell.clickState = 1;
                    cell.marked = true;
                }
            } else {
                window.numPotentialMoves--;
                cell.clickState = 0;
                cell.marked = false;
            }
        }
    }
    updateStatus();
}

function switchTime(){
    var timeForCurPlayer = window.timeLeft[window.curTurn] - (Date.now() - window.timeStarted);
    window.timeLeft[window.curTurn] = timeForCurPlayer;
    window.timeLeft[3 - window.curTurn] += window.timeAdded;
    window.timeStarted = Date.now();
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
    forEveryCell(function(cell) {
        cell.marked = false;
    });
    $("#btn_pass").prop('disabled', true);
}

function displayScore(){
    var score = calculateScore();
    var gameResult = "";
    var winnerName = "";
    if(score.total[1] > score.total[2]){
        winnerName += "<p>" + window.playerNames[1] + " wins!</p>";
    } else {
        winnerName += "<p>" + window.playerNames[2] + " wins!</p>";
    }
    gameResult += "<h4>" + winnerName + "</h4>";
    gameResult += "<p><strong>Total Score:</strong></p>";
    gameResult += "<p>" + window.playerNames[1] + ": " + score.total[1] + "</p>";
    gameResult += "<p>" + window.playerNames[2] + ": " + score.total[2] + "</p>";
    gameResult += "<p><strong>Edge Cells Score:</strong></p>";
    gameResult += "<p>" + window.playerNames[1] + ": " + score.edge[1] + "</p>";
    gameResult += "<p>" + window.playerNames[2] + ": " + score.edge[2] + "</p>";
    gameResult += "<p><strong>Group Score:</strong></p>";
    gameResult += "<p>" + window.playerNames[1] + ": " + score.groups[1] + "</p>";
    gameResult += "<p>" + window.playerNames[2] + ": " + score.groups[2] + "</p>";
    gameResult += "<p><strong>Special Cells Score:</strong></p>";
    gameResult += "<p>" + window.playerNames[1] + ": " + score.special[1] + "</p>";
    gameResult += "<p>" + window.playerNames[2] + ": " + score.special[2] + "</p>";
    $("#score_status").html(gameResult);

    var modalText = "";
    modalText += "<h1>" + winnerName + "</h1>";
    modalText += "<h3>" + window.playerNames[1] + ": " + score.total[1] + "</h3>";
    modalText += "<h3>" + window.playerNames[2] + ": " + score.total[2] + "</h3>";
    $("#gameResultBody").html(modalText);
}

function playPass(){

    if(!window.finished){
        if(window.passed == true){
            endGame();
            displayScore();
            $("#gameResultModal").modal('show');
            window.mode = "score";
            redraw();
        } else {
            window.passed = true;
            updateMarkedMoves();
            switchTime();
            window.curTurn = 3 - window.curTurn;
            window.movesLeft = 2;
            move = new Object();
            move.pass = true;
            window.moveHistory.push(move);
            updateStatus();
        }
    }
}

function formatTime(milisecs){
    if(milisecs < 0){
        return "0:00";
    }
    var seconds = milisecs/1000;
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(seconds/3600);
    seconds = Math.floor(seconds) % 60;
    minutes = minutes % 60;

    result = "";
    if(hours > 0){
        result += hours + ":";
        if(minutes < 10) result += "0";
    }
    result += minutes + ":";
    if(seconds < 10) result += "0";
    result += seconds;
    return result;
}

var clearClickState = function(){
    window.clickProtectionState = 0;
    forEveryCell(function(cell) {
        if(cell.clickState > 0){
            cell.marked = false;
            cell.clickState = 0;
        }
    });
    redraw();
}

function updateTime(){
    if(!window.finished){
        var timeForCurPlayer = window.timeLeft[window.curTurn] - (Date.now() - window.timeStarted);

        if(window.curTurn == 1){
            $("#p1_time").text(formatTime(timeForCurPlayer));
            $("#p2_time").text(formatTime(window.timeLeft[2]));
        } else {
            $("#p1_time").text(formatTime(window.timeLeft[1]));
            $("#p2_time").text(formatTime(timeForCurPlayer));
        }

        if(window.clickProtectionState > 0){
            window.clickProtectionState++;
            if(window.clickProtectionState > 20){
                clearClickState();
            }
        }

        if(timeForCurPlayer < 0){ 
            endGame();

            var modalText = "";
            modalText += "<h1>" + window.playerNames[3 - window.curTurn] + " wins on time.</h1>";
            $("#gameResultBody").html(modalText);

            var gameResult = "";
            gameResult += "<h4>" + window.playerNames[3 - window.curTurn] + " wins on time.</h4>";
            $("#score_status").html(gameResult);

            $("#gameResultModal").modal('show');
        }
    }
    updateStatus();
}

function newGame(p1_name, p2_name, handicap, size, initTime, addedTime){

    setInterval(updateTime, 100);

    if(window.coldStart){
        window.coldStart = false;
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
    window.markedMoves = [];
    window.nextMarkedMoves = [];
    window.numPotentialMoves = 0;

    $("#btn_pass").prop('disabled', false);

    window.clickProtection = $("#chk_protection").is(":checked");
    window.clickProtectionState = 0;

    //game related variables
    window.curTurn = 1;
    window.movesLeft = 1 + parseInt(handicap, 10);
    window.playerNames = ["", p1_name, p2_name];
    
    window.timeAdded = addedTime*1000;
    window.timeInitial = initTime*1000;
    window.timeLeft = [0, window.timeInitial, window.timeInitial];
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
                    "clickState": 0, 
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
            makeMove(d);
            redraw();
        });
        /*
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
        */

    $("#newGameModal").modal('hide');
    $("#score_status").text("");
    $("#p1_name").text(p1_name).css("color", window.playerColors[1]);
    $("#p2_name").text(p2_name).css("color", window.playerColors[2]);
    $("#p1_time").css("color", window.playerColors[1]);
    $("#p2_time").css("color", window.playerColors[2]);
    updateStatus();
    redraw();
}

function updateStatus(){
    if(window.finished){
        $("#status").text("Game Over");
    } else {
        var numMoves = window.movesLeft - window.numPotentialMoves;
        $("#status").text(window.playerNames[window.curTurn] + " has " + numMoves + " move(s)");
    }
}

$(function(){

    window.coldStart = true;
    $("#newGameModal").modal('show');

    $("#newGameModal").on("hidden.bs.modal", function(){
        if(window.coldStart)
            $("#newGameModal").modal('show');
    });

    /*
    $("#btn_score").click(function(){
        window.finished = true;
        var score = calculateScore();
        var gameResult = "";
        gameResult += window.playerNames[1] + ": " + score.total[1] + " ";
        gameResult += window.playerNames[2] + ": " + score.total[2] + " ";

        $("#score_status").text(gameResult);
        window.mode = "score";
        redraw();
    });
    */
    
    
    $("#btn_new").click(function() {
        $("#newGameModal").modal('show');
    });

    $("#btn_pass").click(function(){
        playPass();
    });
    

    $("#chk_protection").click(function(){
        if(window.clickProtection == true){
            clearClickState();
            window.clickProtection = false;
        } else {
            window.clickProtection = true;
        }
    });

    $("#btn_start").click(function() {
        var p1_name = $("#p1_name_inp").val();
        var p2_name = $("#p2_name_inp").val();
        var boardsize = $("#boardsize").val();
        var handicap = $("#handicap").val();
        var time_init = $("#time_init").val();
        var time_added = $("#time_added").val();

        if(!(2 < boardsize && boardsize < 16)){
            boardsize = 11;
        }
        
        if(!(0 < handicap && handicap < 100)){
            handicap = 0;
        }

        if(!(0 < time_init && time_init < 2000)){
            time_init = 30;
        }

        if(!(0 <= time_added && time_added < 2000)){
            time_added = 30;
        }

        newGame(p1_name, p2_name, handicap, boardsize, time_init*60, time_added);
    });

});
