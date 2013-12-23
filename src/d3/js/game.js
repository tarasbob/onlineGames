window.playerColors = ['black', 'purple', 'green'];

window.svgW = $("#board").width();
window.svgH = Math.sqrt(3)*window.svgW/2;
window.cellSize = 0.55*window.svgW/(window.boardSize*2+1);
window.emptyCellColors = ["#d1d1d1", "#bababa", "#9c9c9c"];

var svg = d3.select("#board")
    .append("svg")
    .attr("width", window.svgW)
    .attr("height", window.svgH);

//add group elements
var groups = svg.selectAll("g")
    .data(window.dataset)
    .enter()
    .append("g");

//insert a polygon into every group
var hexes = groups.append("polygon")
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

function redraw(){
    //CIRCLE DRAWING
    //remove all the cirlces
    groups.selectAll("circle").remove();
    //bonus cells
    groups.filter(function(d){return d.bonus}).append("circle")
        .attr("r", window.cellSize/1.5)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; })
        .attr("fill-opacity", 0.0)
        .attr("stroke", "black")
        .attr("stroke-width", window.cellSize/20);


    //marked cells
    groups.filter(function(d){return d.marked}).append("circle")
        .attr("r", window.cellSize/4)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; })
        .attr("fill", "white")
        .attr("fill-opacity", 0.9);

    //edge cells
    groups.filter(function(d){return d.edge}).append("circle")
        .attr("r", window.cellSize/10)
        .attr("cx", function(d){ return getRealCoord(d.x, d.y, d.z).x; })
        .attr("cy", function(d){ return getRealCoord(d.x, d.y, d.z).y; });

    //STYLE THE HEXES
    hexes.attr("style", "stroke:#757575;stroke-width:1")
        .attr("fill", function(d){
            return properColor(d);
        });
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
        move = Object();
        move.coordinates = [cell.x, cell.y, cell.z];
        move.state = cell.state;
        window.moveHistory.push(move);
    }
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
        for(var move in window.moveHistory){
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

groups.on("click", function(d){
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

window.dataset[window.cellMap['0:0:0']].isCenter = true;
redraw();

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
    if(arguments.length == 4)
        return window.dataset[window.cellMap['' + arguments[0] + ':' + arguments[1] + ':' + arguments[2]]];
    else
        return window.dataset[window.cellMap['' + arguments[0][0] + ':' + arguments[0][1] + ':' + arguments[0][2]]];

function cellExists(i, j, k){
    return '' + i + ':' + j + ':' + k in window.cellMap;
}

function forEveryCell(func){
    /* Apply func to every cell */
    for(var i=-window.boardSize; i<=window.boardSize; i++){
        for(var j=-window.boardSize; j<=window.boardSize; j++){
            var k = -j-i;
            if(k <= window.boardSize && k >= -window.boardSize){
                func(getCell(i, j, k));
            }
        }
    }
}

function addCoordinates(c1, c2){
    /* Perform vector like addition of 2 arrays of coordinates */
    return [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
}

function combineArraysUnique(a1, a2){
    /* Return unique elements from both arrays */
    var out = [];
    for(var item in a1){
        if(out.indexOf(item) == -1) out.push(item);
    }
    for(var item in a2){
        if(out.indexOf(item) == -1) out.push(item);
    }
    return out;    
}

function getNeighborsSimple(coord){
    /* Given the coordinates of a cell, return an array of neighbor coordinates
     * Does not take into account board size, or the center cell */
    var offsets = [[1, -1, 0], [-1, 1, 0], [1, 0, -1], [-1, 0, 1], [0, 1, -1], [0, -1, 1]];
    var neighbors = [];
    for(var offset in offsets){
        neighbors.push(addCoordinates(coord, offset));
    }
    return neighbors;
}

function getNeighbors(cell){
    var neighbors = getNeighborsSimple([cell.x, cell.y, cell.z]);
    if(neighbors.indexOf([0, 0, 0]) != -1){
        neighbors = combineArraysUnique(neighbors, getNeighborsSimple([0, 0, 0]));
    }
    var neighborCells = [];
    for(var neighbor in neighbors){
        if(cellExists(neighbor[0], neighbor[1], neighbor[2]))
            neighborCells.push(getCell(neighbor[0], neighbor[1], neighbor[2]));
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
        for(var neighbor in neighbors){
            if(neighbor.group == -1 && neighbor.scoreState = curScoreState){
                neighbor.group = groupNum;
                stack.append(neighbor);
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
            if(cell.group == -1){
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
    }
    
    scores = Object();
    scores["edge"] = numEdges;
    scores["groups"] = numGroups;
    if(numMarked[1] > numMarked[2])
        scores["special"] = [0, 1, 0];
    else
        scores["special"] = [0, 0, 1];
    scores["total"] = [0, 0, 0];
    scores["total"][1] = scores["edge"][1] + scores["groups"][1] + scores["special"][1];
    scores["total"][2] = scores["edge"][2] + scores["groups"][2] + scores["special"][2];
    
    assert(scores.total[1] + scores.total[2] = window.boardSize * 6 + 1);
    
    return scores;
}

function randomSample(population, k){
    var sample = [];
    var numLeft = population.length;
    for(var e in population){
        if (Math.floor(Math.random() * numLeft) < k){
            sample.push(cell);
            k -= 1;
        }
    }
    numLeft -= 1;
    return output;
}

function assert(statement){
    if(!statement)
        console.log("Assert Error");
}

function newGame(p1_name, p2_name, handicap, size){

    window.dataset = [];
    window.cellMap = Object();
    window.boardSize = size;
    window.passed = false;
    window.finished = false;
    
    //game related variables
    window.curTurn = 1;
    window.movesLeft = 1 + handicap;
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
    
    //mark the bonus cells
    var potentialBonusCells = randomSample(window.dataset, 6);
    numAdded = 0;
    for(var cell in potentialBonusCells){
        if(!cell.isCenter && numAdded < 6){
            cell.bonus = true;
            numAdded += 1;
        }
    }
}














































































