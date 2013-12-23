var dataset = [];
window.boardSize = 4;
window.cellMap = Object();

//game related variables
window.curTurn = 1;
window.movesLeft = 1;

window.playerColors = ['black', 'purple', 'green'];


for(var i=-window.boardSize; i<=window.boardSize; i++){
    for(var j=-window.boardSize; j<=window.boardSize; j++){
        var k = -j-i;
        if(k <= window.boardSize && k >= -window.boardSize){
            var col = 0;
            if((i-j)%3 == 0){
                col = 1;
            } else if((i-j-1) % 3 == 0){
                col = 2;
            }

            var bonus = false;
            if((i == 2 && j == 1) 
                ||(i == 3 && j == 2)
                ||(i == -3 && j == 2)
                ||(i == -3 && j == -2)
                ||(i == 1 && j == -2))
                bonus = true;


            var marked = false
            if(i==2 && j == 1)
                marked = true;

            var isCenter = false;

            var edge = false;
            if(Math.max(Math.abs(i), Math.abs(j), Math.abs(k)) == window.boardSize)
                edge = true;

            //Push returns the length of the array; To get the index of the element, we subtract 1.
            window.cellMap['' + i + ':' + j + ':' + k] = dataset.push(
               {"x": i, 
                "y": j, 
                "z": k, 
                "state": 0, 
                "patternCol": col,
                "edge": edge, 
                "marked": marked, 
                "bonus": bonus, 
                "isCenter": isCenter, 
                "scoreState": 0,
                "group": -1}) - 1;
        }
    }
}	


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
    .data(dataset)
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

groups.on("click", function(d){
        if(d.state == 0 && !d.isCenter){
            d3.select(this).selectAll("polygon")
                .attr("fill-opacity", 1.0);
            d.state = window.curTurn;
            window.movesLeft -= 1;
            if(window.movesLeft < 1){
                window.curTurn = 3 - window.curTurn;
                window.movesLeft = 2;
            }
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

dataset[window.cellMap['0:0:0']].isCenter = true;
redraw();

function getRealCoord(x, y, z){
    coord = new Object();
    var centerX = window.svgW/2;
    var centerY = window.svgH/2;
    coord.x = centerX+window.cellSize*Math.sqrt(3)*(x+z/2);
    coord.y = centerY+(3/2)*z*window.cellSize;
    return coord;
}

function getCell(i, j, k){
    /* Returns the cell at specified coordinates. */
    return dataset[window.cellMap['' + i + ':' + j + ':' + k]];
}

function cellExists(i, j, k){
    return '' + i + ':' + j + ':' + k in window.cellMap;
}

function assignScoreState(){
    /* Set scoreState to correspond to the state of each cell.
     * Assign empty cells to the second player. */
    for(var i=-window.boardSize; i<=window.boardSize; i++){
        for(var j=-window.boardSize; j<=window.boardSize; j++){
            var k = -j-i;
            if(k <= window.boardSize && k >= -window.boardSize){
                var cell = getCell(i, j, k);
                if(cell.state == 1){
                    cell.scoreState = 1;
                } else {
                    cell.scoreState = 2;
                }
            }
        }
    }
}

function assignToBlankGroup(){
    /* Assign all cells to group -1 */
    for(var i=-window.boardSize; i<=window.boardSize; i++){
        for(var j=-window.boardSize; j<=window.boardSize; j++){
            var k = -j-i;
            if(k <= window.boardSize && k >= -window.boardSize){
                var cell = getCell(i, j, k);
                cell.group = -1;
            }
        }
    }
}

function getNeighbors(cell){
    var neighbors = [];
    if(cellExists(cell.i+1, cell.j-1, cell.k)) neighbors.push(getCell(cell.i+1, cell.j-1, cell.k));
    if(cellExists(cell.i+1, cell.j, cell.k-1)) neighbors.push(getCell(cell.i+1, cell.j, cell.k-1));
    if(cellExists(cell.i, cell.j+1, cell.k-1)) neighbors.push(getCell(cell.i, cell.j+1, cell.k-1));
    if(cellExists(cell.i-1, cell.j+1, cell.k)) neighbors.push(getCell(cell.i-1, cell.j+1, cell.k));
    if(cellExists(cell.i-1, cell.j, cell.k+1)) neighbors.push(getCell(cell.i-1, cell.j, cell.k+1));
    if(cellExists(cell.i, cell.j-1, cell.k+1)) neighbors.push(getCell(cell.i, cell.j-1, cell.k+1));

    return neighbors;
    

}

function floodFill(i, j, k){
    /* Assign the neighbors of the given cell to the same group as the cell */
    var cell = getCell(i, j, k);
    //which color we are adding to the group
    var curScoreState = cell.scoreState;
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
    assignScoreState();

    while(true){
        assignToBlankGroup();

    }


}
