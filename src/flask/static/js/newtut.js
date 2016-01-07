window.tutPosNum = 0;

window.playerColors = ["black", "teal", "orange"];
window.emptyCellColors = ["#d1d1d1", "#bababa", "#9c9c9c"];

window.svgW = $("#board").width();
window.svgH = Math.sqrt(3)*window.svgW/2;

window.svg = d3.select("#board")
    .append("svg")
    .attr("width", window.svgW)
    .attr("height", window.svgH);
    
newGame("Taras", "Peter", 0, 4);

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

function newGame(p1_name, p2_name, handicap, size){

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

    window.svg.selectAll("g").remove();

    //add group elements
    window.groups = window.svg.selectAll("g")
        .data(window.dataset)
        .enter()
        .append("g");

    //insert a polygon into every group
    window.hexes = window.groups.append("polygon")
        .attr("points", function(d){
            points = "";
            for(var i=0; i<6; i++){
                coord = getRealCoord(d.x, d.y, d.z);
                points += coord.x + window.cellSize*Math.sin(i*Math.PI/3);
                points += ",";
                points += coord.y + window.cellSize*Math.cos(i*Math.PI/3);
                points += " ";
            }
            return points;
        });
    
    //mark the bonus cells
    /*
    var potentialBonusCells = randomSample(window.dataset, 6);
    numAdded = 0;
    for(var i = 0; i < potentialBonusCells.length; i++){
        var cell = potentialBonusCells[i];
        if(!cell.isCenter && numAdded < 5){
            cell.bonus = true;
            numAdded += 1;
        }
    }
    */

    window.groups.on("click", function(d){
            if(window.tutState == "color"){
                d.state = (d.state + 1) % 3;
            } else if(window.tutState == "bonus"){
                if(d.bonus == true){
                    d.bonus = false;
                } else {
                    d.bonus = true;
                }
            } else {
                if(d.marked == true){
                    d.marked = false;
                } else {
                    d.marked = true;
                }
            }
            redraw();
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
    window.tutState = "color";
    
    $("#btn_printPos").click(function(){
        consoleOut = "";
        forEveryCell(function(cell){
            if(cell.state > 0)
                consoleOut += "getCell(" + cell.x + ", " + cell.y + ", " + cell.z + ").state = " + cell.state + ";\n"
        });
        
        forEveryCell(function(cell){
            if(cell.bonus)
                consoleOut += "getCell(" + cell.x + ", " + cell.y + ", " + cell.z + ").bonus = " + cell.bonus + ";\n"
        });
        
        forEveryCell(function(cell){
            if(cell.marked)
                consoleOut += "getCell(" + cell.x + ", " + cell.y + ", " + cell.z + ").marked = " + cell.marked + ";\n"
        });
        
        console.log(consoleOut);
    });
    $("#btn_bonus").click(function(){
        window.tutState = "bonus";
    });
    $("#btn_mark").click(function(){
        window.tutState = "mark";
    });
    $("#btn_next").click(function(){
        forEveryCell(function(cell) {
            cell.color = 0;
            cell.marked = false;
            cell.bonus = false;
        });
        window.posArray[window.tutPosNum]();
        window.tutPosNum += 1;
        redraw();
    });
    $("#btn_color").click(function(){
        window.tutState = "color";
    });
    $("#btn_random").click(function(){
        forEveryCell(function(cell) {
            if(Math.random() < 0.5)
                cell.state = 1;
            else
                cell.state = 2;
        });
        redraw();
    });
    
    



});
