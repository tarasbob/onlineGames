window.playerColors = ["black", "teal", "orange"];
window.emptyCellColors = ["#d1d1d1", "#bababa", "#9c9c9c"];

window.svgW = $("#board").width();
window.svgH = Math.sqrt(3)*window.svgW/2;

window.svg = d3.select("#board")
    .append("svg")
    .attr("width", window.svgW)
    .attr("height", window.svgH);
    
newGame("Taras", "Peter", 0, 5);
redraw();

function redraw(){
    //CIRCLE DRAWING
    //remove all the cirlces
    window.groups.selectAll("circle").remove();
    //bonus cells
    window.groups.filter(function(d){return d.bonus}).append("circle")
        .attr("r", window.cellSize/1.5)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; })
        .attr("fill-opacity", 0.0)
        .attr("stroke", "black")
        .attr("stroke-width", window.cellSize/20);

    //marked cells
    window.groups.filter(function(d){return d.marked}).append("circle")
        .attr("r", window.cellSize/4)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; })
        .attr("fill", "white")
        .attr("fill-opacity", 0.9);

    //edge cells
    window.groups.filter(function(d){return d.edge}).append("circle")
        .attr("r", window.cellSize/10)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; });

    //STYLE THE HEXES
    window.hexes.attr("style", "stroke:#757575;stroke-width:1")
        .attr("fill", function(d){
            return properColor(d);
        });
        
    if(window.mode == "score"){
        window.groups.filter(function(d){return d.scoreState}).append("circle")
        .attr("r", window.cellSize/4)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; })
        .attr("fill", function(d){
            return window.playerColors[d.scoreState];
        })
        .attr("fill-opacity", 1.0);
    }
}

function properColor(d){
    if(d.isCenter) return "black";
    if(d.state == 0) return window.emptyCellColors[d.patternCol];
    return window.playerColors[d.state];
}

redraw();

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
    $("#status").text(window.playerNames[window.curTurn] + " has " + window.movesLeft + " move(s)");
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
    if(window.lastMove){
        var cell = window.lastMove;
        window.lastMove = null;
        if(cell.state == window.curTurn){
            window.movesLeft += 1;
        } else {
            window.curTurn = 3 - window.curTurn;
            window.movesLeft = 1;
        }
    }
}


function getRealCoord(x, y, z){
    coord = new Object();
    var centerX = window.svgW/2;
    var centerY = window.svgH/2;
    coord.x = centerX+window.cellSize*Math.sqrt(3)*(x+z/2);
    coord.y = centerY+(3/2)*z*window.cellSize;
    return coord;
}

function getCell(){
    /* Returns the cell at specified coordinates. */
    if(arguments.length == 3)
        return window.dataset[window.cellMap['' + arguments[0] + ':' + arguments[1] + ':' + arguments[2]]];
    else
        return window.dataset[window.cellMap['' + arguments[0][0] + ':' + arguments[0][1] + ':' + arguments[0][2]]];
}

function cellExists(i, j, k){
    if(arguments.length == 3)
        return ('' + arguments[0] + ':' + arguments[1] + ':' + arguments[2]) in window.cellMap;
    else
        return ('' + arguments[0][0] + ':' + arguments[0][1] + ':' + arguments[0][2]) in window.cellMap;
}

function forEveryCell(func){
    /* Apply func to every cell */
    for(var i=-window.boardSize; i<=window.boardSize; i++){
        for(var j=-window.boardSize; j<=window.boardSize; j++){
            var k = -j-i;
            if(k <= window.boardSize && k >= -window.boardSize){
                if(!(i == 0 && j == 0 && k == 0))
                    func(getCell(i, j, k));
            }
        }
    }
}

Array.prototype.remove = function(element) {
    for (var i = 0; i < this.length; i++) {
        if (element.compare) { 
            if (this[i].compare(element)){
                this.splice(i, 1);
                break;
            }
        } else if (this[i] === element){ 
            this.splice(i, 1);
            break;
        }
    }
}

Array.prototype.vectorAdd = function(otherArr) {
    if(this.length != otherArr.length) return null;
    var out = [];
    for (var i = 0; i < this.length; i++) {
        out.push(this[i]+otherArr[i]);
    }
    return out;
}

Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        } else if (this[i] !== testArr[i]){ 
            return false;
        }
    }
    return true;
}

Array.prototype.contains = function(element) {
    for (var i = 0; i < this.length; i++) {
        if (element.compare) { 
            if (this[i].compare(element)) return true;
        } else if (this[i] === element){ 
            return true;
        }
    }
    return false;
}

Array.prototype.extendUnique = function(otherArr) {
    for (var i = 0; i < otherArr.length; i++) {
        if (!this.contains(otherArr[i])) { 
            this.push(otherArr[i]);
        }
    }
}

function getNeighborsSimple(coord){
    /* Given the coordinates of a cell, return an array of neighbor coordinates
     * Does not take into account board size, or the center cell */
    var offsets = [[1, -1, 0], [-1, 1, 0], [1, 0, -1], [-1, 0, 1], [0, 1, -1], [0, -1, 1]];
    var neighbors = [];
    for(var i = 0; i < offsets.length; i++){
        var offset = offsets[i];
        neighbors.push(coord.vectorAdd(offset));
    }
    return neighbors;
}

function getNeighbors(cell){
    var neighbors = getNeighborsSimple([cell.x, cell.y, cell.z]);
    if(neighbors.contains([0, 0, 0])){
        neighbors.extendUnique(getNeighborsSimple([0, 0, 0]));
        neighbors.remove([0, 0, 0]);
        neighbors.remove([cell.x, cell.y, cell.z]);
    }
    var neighborCells = [];
    for(var i = 0; i < neighbors.length; i++){
        var neighbor = neighbors[i];
        if(cellExists(neighbor))
            neighborCells.push(getCell(neighbor));
    }
    return neighborCells;
}

function floodFill(cell){
    /* Assign the neighbors of the given cell to the same group as the cell */
    var curScoreState = cell.scoreState;  //which color we are adding to the group
    var groupNum = cell.group;
    var stack = [];
    stack.push(cell);
    while(stack.length > 0){
        cell = stack.pop();
        var neighbors = getNeighbors(cell);
        for(var i = 0; i < neighbors.length; i++){
            var neighbor = neighbors[i];
            if(neighbor.group == -1 && neighbor.scoreState == curScoreState && !neighbor.isCenter){
                neighbor.group = groupNum;
                stack.push(neighbor);
            }
        }
    }
}

function calculateScore(){
    forEveryCell(function(cell) {
        if(cell.state == 1)
            cell.scoreState = 1; 
        else
            cell.scoreState = 2;
    });

    var done = false;
    var iters = 0;
    var numGroups = [0, 0, 0];
    while(!done && iters < 1000){
        done = true;
        iters += 1;
        forEveryCell(function(cell) {cell.group = -1;});
        numGroups = [0, 0, 0];
        //assign all cells to a group
        forEveryCell(function(cell) {
            if(cell.group == -1 && !cell.isCenter){
                cell.group = numGroups[cell.scoreState];
                floodFill(cell);
                numGroups[cell.scoreState] += 1;
            }
        });
        
        var numEdgeNodes = [[], [], []];
        for(var j = 1; j < 3; j++){
            for(var i = 0; i < numGroups[j]; i++){
                numEdgeNodes[j].push(0);
            }
        }
        
        //determine the number of edge cells in each group
        forEveryCell(function(cell) {
            if(cell.edge){
                numEdgeNodes[cell.scoreState][cell.group] += 1;
            }
        });
        
        //for every group that has less than 2 edge cells, switch the color
        forEveryCell(function(cell) {
            if(numEdgeNodes[cell.scoreState][cell.group] < 2){
                cell.scoreState = 3 - cell.scoreState;
                done = false;
            }
        });
    }

    assert(done);
    
    //calculate the final score
    numEdges = [0, 0, 0];
    numMarked = [0, 0, 0];
    forEveryCell(function(cell) {
        if(cell.edge)
            numEdges[cell.scoreState] += 1;
        if(cell.marked)
            numMarked[cell.scoreState] += 1;
    });
    
    scores = new Object();
    scores["edge"] = numEdges;
    scores["groups"] = [0, 2*(numGroups[2] - numGroups[1]), 2*(numGroups[1] - numGroups[2])];
    if(numMarked[1] > numMarked[2])
        scores["special"] = [0, 1, 0];
    else
        scores["special"] = [0, 0, 1];
    scores["total"] = [0, 0, 0];
    scores["total"][1] = scores["edge"][1] + scores["groups"][1] + scores["special"][1];
    scores["total"][2] = scores["edge"][2] + scores["groups"][2] + scores["special"][2];
    
    assert(scores.total[1] + scores.total[2] == window.boardSize * 6 + 1);
    
    return scores;
}

function randomSample(population, k){
    var sample = [];
    var numLeft = population.length;
    for(var i = 0; i < population.length; i++){
        var e = population[i];
        if (Math.floor(Math.random() * (numLeft+1)) < k){
            sample.push(e);
            k -= 1;
        }
        numLeft -= 1;
    }
    return sample;
}

function assert(statement){
    if(!statement)
        console.log("Assert Error");
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


$(function(){
    $("#newGameModal").modal('show');
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

    $("#btn_start").click(function() {
        var p1_name = $("#p1_name_inp").val();
        var p2_name = $("#p2_name_inp").val();
        newGame(p1_name, p2_name,  $("#handicap").val(), $("#boardsize").val());
        $("#newGameModal").modal('hide');
        $("#p1_name").text(p1_name).css("color", window.playerColors[1]);
        $("#p2_name").text(p2_name).css("color", window.playerColors[2]);
        $("#status").text(window.playerNames[window.curTurn] + " has " + window.movesLeft + " move(s)");
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
