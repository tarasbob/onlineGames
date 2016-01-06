// get rid of pass, game is played unitl there is no more score differencial
// make center cell regular

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

var makeMove = function(cell){
    if(!window.finished && cell.state == 0){
        if(cell.isCenter){
            if(window.numPotentialMoves == window.movesLeft){
                // commit the move
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
                    // make a potential move (put a white dot)
                    window.numPotentialMoves++;
                    cell.clickState = 1;
                    cell.marked = true;
                }
            } else {
                // remove a white dot
                window.numPotentialMoves--;
                cell.clickState = 0;
                cell.marked = false;
            }
        }
    } else if(window.finished && window.scoring && !cell.isCenter){
        if(cell.state == 1){
            cell.state = 0;
        } else if(cell.state == 0){
            cell.state = 1;
        }
        //displayScore();
        calculateScore(1, 2);
    }
    updateStatus();
}

var switchTime = function(){
    var timeForCurPlayer = window.timeLeft[window.curTurn] - (Date.now() - window.timeStarted);
    window.timeLeft[window.curTurn] = timeForCurPlayer;
    window.timeLeft[3 - window.curTurn] += window.timeAdded;
    window.timeStarted = Date.now();
}

function endGame(){
    window.finished = true;
    forEveryCell(function(cell) {
        cell.marked = false;
    });
}

function displayScore(){
    var score = calculateScore(1, 2);
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
    clearClickState();
    if(!window.finished){
        if(window.passed == true){
            endGame();
            window.scoring = true;
            $("#btn_pass").html("Finish Scoring");
            calculateScore(1, 2);
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
            updateStatus();
        }
    } else if(window.finished && window.scoring){
        window.scoring = false;
        displayScore();
        $("#gameResultModal").modal('show');
        $("#btn_pass").prop('disabled', true);
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
    forEveryCell(function(cell) {
        if(cell.clickState > 0){
            cell.marked = false;
            cell.clickState = 0;
        }
    });
    window.numPotentialMoves = 0;
    redraw();
}

var updateTime = function(){
    // update time for each player on the board, end game if someone runs out of time
    if(!window.finished){
        var timeForCurPlayer = window.timeLeft[window.curTurn] - (Date.now() - window.timeStarted);

        if(window.curTurn == 1){
            $("#p1_time").text(formatTime(timeForCurPlayer));
            $("#p2_time").text(formatTime(window.timeLeft[2]));
        } else {
            $("#p1_time").text(formatTime(window.timeLeft[1]));
            $("#p2_time").text(formatTime(timeForCurPlayer));
        }

        if(timeForCurPlayer < 0){ 
            endGame();
            $("#btn_pass").prop('disabled', true);

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

var newGame = function(p1_name, p2_name, handicap, size, initTime, addedTime){

    // call updateTime every 100 ms
    setInterval(updateTime, 100);

    if(window.coldStart){
        window.coldStart = false;
        addSVG();
    }
    
    window.boardSize = size;
    // size of each cell is derived from board size
    window.cellSize = 0.55*window.svgW/(window.boardSize*2+1);
    // not contains all the cells, cellmap maps to this
    window.dataset = [];
    // contains all the cells in the game, map looks like i:j:k -> int (int points to element in window.dataset)
    window.cellMap = new Object();
    // whether a pass was played
    window.passed = false;
    // game finished because of time or pass, pass
    window.finished = false;
    // scoring is after the game is finished and before modal with final result is displayed
    window.scoring = false;
    // can be game or score
    window.mode = "game";
    // what is this
    window.markedMoves = [];
    // why do we need this??
    window.nextMarkedMoves = [];
    // number of white dots on the board
    window.numPotentialMoves = 0;

    $("#btn_pass").prop('disabled', false);
    $("#btn_pass").html("Pass");

    //game related variables
    window.curTurn = 1;
    window.movesLeft = 1 + parseInt(handicap, 10); // start the game with 1 move left
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
                if(Math.max(Math.abs(i), Math.abs(j), Math.abs(k)) == window.boardSize) edge = true;

                //Push returns the length of the array; To get the index of the element, we subtract 1.
                window.cellMap['' + i + ':' + j + ':' + k] = window.dataset.push(
                   {"x": i, 
                    "y": j, 
                    "z": k, 
                    "state": 0, // 0 means empty, 1 means player 1 has a stone here, 2 means player 2
                    "clickState": 0, // what is this?
                    "patternCol": col,
                    "edge": edge, 
                    "marked": false, // contains a white dot (potential move)
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

    $("#newGameModal").modal('hide');
    $("#score_status").text("");
    $("#p1_name").text(p1_name).css("color", window.playerColors[1]);
    $("#p2_name").text(p2_name).css("color", window.playerColors[2]);
    $("#p1_time").css("color", window.playerColors[1]);
    $("#p2_time").css("color", window.playerColors[2]);
    $("#p1_score_est").css("color", window.playerColors[1]);
    $("#p2_score_est").css("color", window.playerColors[2]);

    updateStatus();
    redraw();
}

var updateStatus = function(){
    // updates the status string on the page, so user knows what's going on
    if(window.finished){
        if(window.scoring){
            $("#status").text("Scoring");
        } else {
            $("#status").text("Game Over");
        }
    } else {
        var numMoves = window.movesLeft - window.numPotentialMoves;
        $("#status").text(window.playerNames[window.curTurn] + " has " + numMoves + " move(s)");

        var score_1 = calculateScore(1, 2);
        var score_2 = calculateScore(2, 1);
        var best_1 = score_1.total[1];
        var worst_2 = score_1.total[2];
        var best_2 = score_2.total[2];
        var worst_1 = score_2.total[1];
        $("#p1_score_est").text(worst_1 + " - " + best_1);
        $("#p2_score_est").text(worst_2 + " - " + best_2);
    }
}

$(function(){

    window.coldStart = true;
    $("#newGameModal").modal('show');

    $("#newGameModal").on("hidden.bs.modal", function(){
        if(window.coldStart)
            $("#newGameModal").modal('show');
    });

    $("#btn_new").click(function() {
        $("#newGameModal").modal('show');
    });

    $("#btn_pass").click(function(){
        playPass();
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
