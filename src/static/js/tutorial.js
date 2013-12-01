 $('document').ready(function() {
    window.c=document.getElementById("myCanvas");
    window.context=c.getContext("2d");

    window.colw = "ff6400";
    window.colb= "00a383";
    window.colBlank = "fffa73";
    window.background_col = "2e2337";
	
    window.canvSizeCoeff = 1.0;

    window.cellSize = 10;
    window.selectedCells = [];
	
	window.boardSize = 4;
    window.view = "normal"

    window.curStep = 1;

    window.marks = [];
	
    function emptyGrid(){
        window.grid = {};
        for(var i=-window.boardSize; i<=window.boardSize; i++){
            for(var j=-window.boardSize; j<=window.boardSize; j++){
                
                var k = -j-i;
                if(k <= window.boardSize && k >= -window.boardSize){
                    d = {};
                    if(Math.abs(i) == window.boardSize || Math.abs(j) == window.boardSize || Math.abs(k) == window.boardSize){
                        d['edge'] = 1;
                    } else {
                        d['edge'] = 0;
                    }
                    
                    if(i == 0 && j == 0 && k == 0){
                        d['center'] = 1;
                    } else {
                        d['center'] = 0;
                    }
                    
                    if(i == 2 && j == 1 && k == -3){
                        d['special'] = 1;
                    } else {
                        d['special'] = 0;
                    }
                    
                    d['state'] = 0;
                    
                    window.grid[''+i+':'+j] = d;
                }
            }
        }
    }
    emptyGrid();

    function nextStep(){
        if(window.curStep == 1){
            emptyGrid();
            $("#status").html("<p> Edge Connect is played on a hexagonal grid. Players claim any 2 unclaimed cells per move, except the specially marked center cell which already belongs to both players from the start</p>");
        }else if(window.curStep == 2){
            emptyGrid();
            $("#status").html("<p>The game begins with the first player claiming only one cell</p>");
            window.grid["1:2"].state=1;
        }else if(window.curStep == 3){
            $("#status").html("<p>After the first move, both players can claim 2 cells per turn</p>");
            window.grid["-1:2"].state=2;
            window.grid["-2:2"].state=2;
        }else if(window.curStep == 4){
            $("#status").html("<p>It's the first player's turn again, he claims 2 cells. Only empty cells can be claimed</p>");
            window.grid["-1:3"].state=1;
            window.grid["2:-2"].state=1;
        }else if(window.curStep == 5){
            $("#status").html("<p>The game ends when all cells have been claimed and the board is filled up</p>");
        }else if(window.curStep == 6){
            $("#status").html("<p>At the end of the the board is divided up into groups of adjacent same colored cells.</p>");
            window.grid["4:0"].state = 1; 
            window.grid["3:0"].state = 1; 
            window.grid["2:0"].state = 1; 
            window.grid["1:0"].state = 1;
            window.grid["1:-1"].state = 1;
            window.grid["0:-1"].state = 1;
            window.grid["0:-2"].state = 1;
            window.grid["0:-3"].state = 1;
            window.grid["0:-4"].state = 1;
            window.grid["-1:1"].state = 1;
            window.grid["-1:0"].state = 1;
            window.grid["-2:2"].state = 1;
            window.grid["-3:3"].state = 1;
            window.grid["-4:4"].state = 1;
            window.grid["-4:3"].state = 1;
            window.grid["-3:2"].state = 1;
            window.grid["-2:1"].state = 1;
            window.grid["1:-2"].state = 1;
            window.grid["2:-2"].state = 1;
            window.grid["4:-1"].state = 1;
            window.grid["3:1"].state = 1;
            window.grid["2:1"].state = 1;
            window.grid["1:-4"].state = 1;
            window.grid["1:-3"].state = 1;
            window.grid["-1:-3"].state = 1;
            window.grid["-2:3"].state = 1;
            window.grid["-1:3"].state = 1;
            window.grid["3:-3"].state = 1;
            window.grid["-2:0"].state = 1;
            window.grid["-3:1"].state = 1;
            window.grid["1:2"].state = 2;
            window.grid["-3:0"].state = 2;
            window.grid["3:-2"].state = 2;
            window.grid["-2:-1"].state = 2;
            window.grid["-1:2"].state = 2;
            window.grid["0:1"].state = 2;
            window.grid["-4:2"].state = 2;
            window.grid["-4:0"].state = 2;
            window.grid["-3:-1"].state = 2;
            window.grid["-2:-2"].state = 2;
            window.grid["-1:-2"].state = 2;
            window.grid["-1:-1"].state = 2;
            window.grid["-4:1"].state = 2;
            window.grid["2:-4"].state = 2;
            window.grid["3:-4"].state = 2;
            window.grid["3:-4"].state = 2;
            window.grid["4:-4"].state = 2;
            window.grid["4:-3"].state = 2;
            window.grid["4:-2"].state = 2;
            window.grid["3:-1"].state = 2;
            window.grid["2:-1"].state = 2;
            window.grid["2:-3"].state = 2;
            window.grid["1:1"].state = 2;
            window.grid["0:2"].state = 2;
            window.grid["-3:4"].state = 2;
            window.grid["-2:4"].state = 2;
            window.grid["-1:4"].state = 2;
            window.grid["0:3"].state = 2;
            window.grid["0:4"].state = 2;
            window.grid["1:3"].state = 2;
            window.grid["2:2"].state = 2; 
        }else if(window.curStep == 7){
            $("#status").html("<p>In this example, the Orange player has 3 groups, and the Blue player has only one group because all Blue cells are connected.</p>");

        }else if(window.curStep == 8){
            $("#status").html("<p>How many groups does each player have in this position?</p>");
            window.grid["-1:1"].state = 1;
            window.grid["1:-1"].state = 1;
            window.grid["-2:2"].state = 1;
            window.grid["-3:3"].state = 1;
            window.grid["-4:3"].state = 1;
            window.grid["2:-2"].state = 1;
            window.grid["3:-3"].state = 1;
            window.grid["3:-4"].state = 1;
            window.grid["-4:4"].state = 1;
            window.grid["-3:4"].state = 1;
            window.grid["-2:4"].state = 1;
            window.grid["-4:2"].state = 1;
            window.grid["-4:1"].state = 1;
            window.grid["4:-4"].state = 1;
            window.grid["4:-3"].state = 1;
            window.grid["4:-2"].state = 1;
            window.grid["2:-4"].state = 1;
            window.grid["1:-4"].state = 1;
            window.grid["2:-3"].state = 1;
            window.grid["1:-3"].state = 1;
            window.grid["3:-2"].state = 1;
            window.grid["4:-1"].state = 1;
            window.grid["3:-1"].state = 1;
            window.grid["3:0"].state = 1;
            window.grid["2:0"].state = 1;
            window.grid["2:-1"].state = 1;
            window.grid["1:-2"].state = 1;
            window.grid["0:-2"].state = 1;
            window.grid["0:-3"].state = 1;
            window.grid["0:-4"].state = 1;
            window.grid["-4:0"].state = 1;
            window.grid["-3:3"].state = 1;
            window.grid["-3:2"].state = 1;
            window.grid["-2:3"].state = 1;
            window.grid["-1:3"].state = 1;
            window.grid["-1:4"].state = 1;
            window.grid["0:4"].state = 2;
            window.grid["0:3"].state = 2;
            window.grid["-1:2"].state = 2;
            window.grid["-2:1"].state = 2;
            window.grid["-3:1"].state = 2;
            window.grid["-3:0"].state = 2;
            window.grid["-3:-1"].state = 2;
            window.grid["1:3"].state = 2;
            window.grid["4:0"].state = 2;
            window.grid["3:1"].state = 2;
            window.grid["2:1"].state = 2;
            window.grid["1:1"].state = 2;
            window.grid["1:0"].state = 2;
            window.grid["0:-1"].state = 2;
            window.grid["-1:-1"].state = 2;
            window.grid["-1:-2"].state = 2;
            window.grid["-1:-3"].state = 2;
            window.grid["-2:-2"].state = 2;
            window.grid["-2:-1"].state = 2;
            window.grid["-2:0"].state = 2;
            window.grid["-1:0"].state = 2;
            window.grid["0:1"].state = 2;
            window.grid["0:2"].state = 2;
            window.grid["1:2"].state = 2;
            window.grid["2:2"].state = 2; 
        }else if(window.curStep == 9){
            $("#status").html("<p>If your answer is that both players have 2 groups, you're close not not quite correct.</p>");
        }else if(window.curStep == 10){
            $("#status").html("<p>Both players have only one group. Remember that the center cell is special and belongs to Both players</p>");
        }else if(window.curStep == 11){
            $("#status").html("<p>The cells on the perimeter of the board play an important role. They are specially marked</p>");
            emptyGrid();
        }else if(window.curStep == 12){
            $("#status").html("<p>There are 24 perimeter cells on this board</p>");
        }else if(window.curStep == 13){
            $("#status").html("<p>At the end of the game, if there is a group on the board that contains less than 2 cells on the perimieter of the board, the entire group is given to the opponent</p>");
            window.grid["-4:4"].state = 1;
            window.grid["-3:3"].state = 1;
            window.grid["-2:3"].state = 1;
            window.grid["-1:3"].state = 1;
            window.grid["-1:2"].state = 1;
            window.grid["0:2"].state = 1;
            window.grid["-4:1"].state = 1;
            window.grid["-3:0"].state = 1;
            window.grid["-2:0"].state = 1;
            window.grid["-1:-1"].state = 1;
            window.grid["-1:-2"].state = 1;
            window.grid["0:-2"].state = 1;
            window.grid["4:0"].state = 1;
            window.grid["3:0"].state = 1;
            window.grid["4:-1"].state = 1;
            window.grid["4:-2"].state = 1;
            window.grid["4:-3"].state = 1;
            window.grid["4:-4"].state = 1;
            window.grid["3:-3"].state = 1;
            window.grid["3:-2"].state = 1;
            window.grid["3:-1"].state = 1;
            window.grid["2:0"].state = 1;
            window.grid["2:-1"].state = 1;
            window.grid["2:-2"].state = 1;
            window.grid["3:1"].state = 1;
            window.grid["3:-4"].state = 1;
            window.grid["-2:2"].state = 1;
            window.grid["-2:-1"].state = 1;
            window.grid["0:-3"].state = 2;
            window.grid["-3:1"].state = 2;
            window.grid["-1:0"].state = 2;
            window.grid["2:1"].state = 2;
            window.grid["2:2"].state = 2;
            window.grid["1:3"].state = 2;
            window.grid["1:-3"].state = 2;
            window.grid["-4:0"].state = 2;
            window.grid["-3:-1"].state = 2;
            window.grid["-2:-2"].state = 2;
            window.grid["-1:-3"].state = 2;
            window.grid["0:-4"].state = 2;
            window.grid["1:-4"].state = 2;
            window.grid["2:-4"].state = 2;
            window.grid["2:-3"].state = 2;
            window.grid["1:-2"].state = 2;
            window.grid["0:-1"].state = 2;
            window.grid["-4:2"].state = 2;
            window.grid["-4:3"].state = 2;
            window.grid["-3:2"].state = 2;
            window.grid["-2:1"].state = 2;
            window.grid["-1:1"].state = 2;
            window.grid["1:-1"].state = 2;
            window.grid["1:0"].state = 2;
            window.grid["0:1"].state = 2;
            window.grid["1:1"].state = 2;
            window.grid["1:2"].state = 2;
            window.grid["0:3"].state = 2;
            window.grid["0:4"].state = 2;
            window.grid["-1:4"].state = 2;
            window.grid["-2:4"].state = 2;
            window.grid["-3:4"].state = 2;
        }else if(window.curStep == 14){
            $("#status").html("<p>Therefore, it is important to make sure that each group contains at least 2 cells on the perimeter</p>");
        }else if(window.curStep == 15){
            $("#status").html("<p>In this case, Blue has 2 groups with fewer than 2 perimeter cells</p>");
        }else if(window.curStep == 16){
            $("#status").html("<p>Both groups have one cell on the perimeter</p>");
            window.marks.push([-4, 4, 0]);
            window.marks.push([-4, 1, 3]);
        }else if(window.curStep == 17){
            $("#status").html("<p>These groups will be given to the opponent</p>");
        }else if(window.curStep == 18){
            $("#status").html("<p>Again, it is important to make sure that each group has at least 2 perimeter cells</p>");
            window.marks = [];
            window.grid["-4:1"].state = 2;
            window.grid["-3:0"].state = 2;
            window.grid["-2:-1"].state = 2;
            window.grid["-1:-2"].state = 2;
            window.grid["0:-2"].state = 2;
            window.grid["-1:-1"].state = 2;
            window.grid["-2:0"].state = 2;
            window.grid["-4:4"].state = 2;
            window.grid["-3:3"].state = 2;
            window.grid["-2:2"].state = 2;
            window.grid["-1:2"].state = 2;
            window.grid["0:2"].state = 2;
            window.grid["-1:3"].state = 2;
            window.grid["-2:3"].state = 2;
        }else if(window.curStep == 19){
            $("#status").html("<p>We are ready to learn how to calculate the score at the end of the game</p>");
            window.grid["0:-4"].state = 1;
            window.grid["2:-4"].state = 1;
            window.grid["3:-4"].state = 1;
            window.grid["4:-4"].state = 1;
            window.grid["-1:-3"].state = 1;
            window.grid["-4:3"].state = 1;
            window.grid["-4:4"].state = 1;
            window.grid["-3:4"].state = 1;
            window.grid["1:3"].state = 1;
            window.grid["2:2"].state = 1;
            window.grid["3:1"].state = 1;
            window.grid["4:0"].state = 1;
            window.grid["4:-1"].state = 1;
            window.grid["-3:3"].state = 1;
            window.grid["-3:2"].state = 1;
            window.grid["-3:1"].state = 1;
            window.grid["0:-2"].state = 1;
            window.grid["1:-2"].state = 1;
            window.grid["1:-3"].state = 1;
            window.grid["3:0"].state = 1;
            window.grid["2:1"].state = 1;
            window.grid["1:1"].state = 1;
            window.grid["2:-2"].state = 1;
            window.grid["-1:-1"].state = 1;
            window.grid["-2:3"].state = 1;
            window.grid["0:3"].state = 1;
            window.grid["2:-1"].state = 1;
            window.grid["-2:-1"].state = 1;
            window.grid["-1:-2"].state = 1;
            window.grid["0:-3"].state = 2;
            window.grid["1:-4"].state = 2;
            window.grid["2:0"].state = 2;
            window.grid["-4:2"].state = 2;
            window.grid["-4:1"].state = 2;
            window.grid["-4:0"].state = 2;
            window.grid["-3:-1"].state = 2;
            window.grid["-2:-2"].state = 2;
            window.grid["-3:0"].state = 2;
            window.grid["-2:0"].state = 2;
            window.grid["-2:2"].state = 2;
            window.grid["-2:1"].state = 2;
            window.grid["-1:0"].state = 2;
            window.grid["0:-1"].state = 2;
            window.grid["1:-1"].state = 2;
            window.grid["1:0"].state = 2;
            window.grid["0:1"].state = 2;
            window.grid["-1:1"].state = 2;
            window.grid["-1:2"].state = 2;
            window.grid["-1:3"].state = 2;
            window.grid["-2:4"].state = 2;
            window.grid["-1:4"].state = 2;
            window.grid["0:4"].state = 2;
            window.grid["1:2"].state = 2;
            window.grid["0:2"].state = 2;
            window.grid["3:-1"].state = 2;
            window.grid["4:-2"].state = 2;
            window.grid["4:-3"].state = 2;
            window.grid["3:-2"].state = 2;
            window.grid["3:-3"].state = 2;
            window.grid["2:-3"].state = 2;
        }else if(window.curStep == 20){
            $("#status").html("<p>We are ready to learn how to calculate the score at the end of the game</p>");
        }else if(window.curStep == 21){
            $("#status").html("<p>To calculate the final score, we first deal with groups that have less than two perimeter cells</p>");
            window.marks.push([0, -3, 3]);
            window.marks.push([1, -4, 3]);
        }else if(window.curStep == 22){
            $("#status").html("<p>This cells are given to the Blue player because it contains only one cell on the perimeter</p>");
        }else if(window.curStep == 23){
            $("#status").html("<p>This cells are to be given to the Blue player because it contains only one cell on the perimeter</p>");
            window.grid["0:-3"].state = 1;
            window.grid["1:-4"].state = 1;
            window.marks = [];
        }else if(window.curStep == 24){
            $("#status").html("<p>Next we count how many perimeter cells are owned by the blue player</p>");
        }else if(window.curStep == 25){
            $("#status").html("<p>The Blue player has 14 perimeter cells</p>");
            window.marks.push([-3, 4, -1]);
            window.marks.push([-4, 4, 0]);
            window.marks.push([-4, 3, 1]);
            window.marks.push([-1, -3, 4]);
            window.marks.push([0, -4, 4]);
            window.marks.push([1, -4, 3]);
            window.marks.push([2, -4, 2]);
            window.marks.push([3, -4, 1]);
            window.marks.push([4, -4, 0]);
            window.marks.push([4, -1, -3]);
            window.marks.push([4, 0, -4]);
            window.marks.push([3, 1, -4]);
            window.marks.push([2, 2, -4]);
            window.marks.push([1, 3, -4]);
        }else if(window.curStep == 26){
            $("#status").html("<p>The Orange player has 10 perimeter cells</p>");
            window.marks = [];
            window.marks.push([0, 4, -4]);
            window.marks.push([-1, 4, -3]);
            window.marks.push([-2, 4, -2]);
            window.marks.push([-4, 2, 2]);
            window.marks.push([-4, 1, 3]);
            window.marks.push([-4, 0, 4]);
            window.marks.push([-3, -1, 4]);
            window.marks.push([-2, -2, 4]);
            window.marks.push([4, -3, -1]);
            window.marks.push([4, -2, -2]);
        }else if(window.curStep == 27){
            $("#status").html("<p>One point is awarded for every cell owned on the perimeter</p>");
        }else if(window.curStep == 28){
            window.marks = [];
            $("#status").html("<p>A reward is given for having fewer groups than your opponent. A penalty is given for having more groups than your opponent</p>");
        }else if(window.curStep == 29){
            $("#status").html("<p>For the player with fewer groups, for each extra group that the opponent has, a reward of 2 points is given</p>");
        }else if(window.curStep == 30){
            $("#status").html("<p>For the player with more groups, for each extra group, there is a penalty of 2 points</p>");
        }else if(window.curStep == 31){
            $("#status").html("<p>In this example the Blue player has 3 groups, and the Orange player has only 1 group. Therefore the Blue player 2 more groups that Orange, and Orange has 2 fewer groups that Blue.</p>");
        }else if(window.curStep == 32){
            $("#status").html("<p>The Orange player will get a reward of (2 fewer groups) times 2 points for each group, equals 4 reward points </p>");
        }else if(window.curStep == 33){
            $("#status").html("<p>The Blue player will get a penalty of (2 extra groups) times 2 points for each group, equals 4 penalty points </p>");
        }else if(window.curStep == 34){
            $("#status").html("<p>Blue's final score is 14 points for owning 14 perimeter cells minus the penalty of having 2 more groups of 4 points = 14 - 4 = 10 total points</p>");
        }else if(window.curStep == 35){
            $("#status").html("<p>Orange's final score is 10 points for owning 10 perimeter cells plus the reward of having 2 fewer groups of 4 points = 10 + 4 = 14 total points</p>");
        }else if(window.curStep == 36){
            $("#status").html("<p>Therefore Orange wins by 4 points</p>");
        }else if(window.curStep == 37){
            $("#status").html("<p>Tiebreak rules</p>");
        }else if(window.curStep == 38){
            $("#status").html("<p>Passes</p>");
        }

        
        refreshBoard();
        window.marks.forEach(function(loc){
            markLastMove(loc[0], loc[1], loc[2]);
        });
        window.curStep += 1;
    }
	
    $("#btn_next").click(nextStep);

    function refreshBoard(){
		//figure out the size of each cell
		window.cellSize = window.c.width/(window.boardSize*4.8);
		//set the background color
		window.context.beginPath();
		window.context.rect(0, 0, window.c.width, window.c.height);
		window.context.closePath();
		window.context.fillStyle = window.background_col;
		window.context.fill();
		//Update Player Names
		
		for(var i=-window.boardSize; i<=window.boardSize; i++){
			for(var j=-window.boardSize; j<=window.boardSize; j++){
				k = -j-i;
				if(k <= window.boardSize && k >= -window.boardSize){
					if(window.grid[''+i+':'+j].state == 0){
						window.context.fillStyle=window.colBlank;
					} else if(window.grid[''+i+':'+j].state == 1){
						window.context.fillStyle=window.colb;
					} else if(window.grid[''+i+':'+j].state == 2){
						window.context.fillStyle=window.colw;
					}
					drawCell(i, j, k);
					if(window.grid[''+i+':'+j].edge == 1){
						markEdge(i, j, k);
					}
					if(window.grid[''+i+':'+j].center == 1){
						markSpecial(i, j, k);
					}
				}
			}
		}
    }
    //setInterval(refreshBoard, 500);
    adjustCanvas();
	

    //set the color size of canvas at the beginning
    function adjustCanvas(){
        window.c.width=$("#canv-div").width()*window.canvSizeCoeff;
        window.c.height=(Math.sqrt(3)/2) * window.c.width;
		refreshBoard()
    }

    $(window).resize(function() {
        adjustCanvas();
    });

    c.addEventListener('click', function(e){
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        coord = getHex(e.offsetX-centerX, e.offsetY-centerY, window.cellSize);
		window.grid[''+coord[0]+':'+coord[1]].state = 1;
		console.log('window.grid["'+coord[0]+':'+coord[1]+'"] = 1;');
		refreshBoard();
    }, false);

    $("#btn_pass").click(function(){
        $.get("command", {"cmd_text": "makemove", "x": "pass"});
    });

    $("#btn_smallerCanv").click(function(){
        window.canvSizeCoeff = window.canvSizeCoeff * 0.95;
        adjustCanvas();
    });

    $("#btn_resign").click(function(){
        $.get("command", {"cmd_text": "makemove", "x": "resign"});
    });

    $("#btn_lobby").click(function(){
        $.get("command", {"cmd_text": "backToLobby"});
        window.location = "/";
    });

    $("#btn_toggle").click(function(){
        if(window.view == "normal"){
            window.view = "score";
        }else{
            window.view = "normal";
        }
    });

    function getHex(xPos, yPos){
        var x = ((1/3)*Math.sqrt(3)*xPos - (1/3)*yPos) / window.cellSize;
        var z = (2/3)*yPos/window.cellSize;
        var y = -x-z;

        rx = Math.round(x);
        ry = Math.round(y);
        rz = Math.round(z);

        x_diff = Math.abs(rx - x);
        y_diff = Math.abs(ry - y);
        z_diff = Math.abs(rz - z);

        if (x_diff>y_diff && x_diff > z_diff){
            rx = -ry-rz;
        } else if (y_diff > z_diff){
            ry = -rx-rz;
        } else {
            rz = -rx-ry;
        }

        return [rx, ry, rz];
    }

    function isEqualCoord(c1, c2){
        if(c1.length !== c2.length)
            return false;
        for(var i = 0; i < c1.length; i++){
            if(c1[i] !== c2[i])
                return false;
        }
        return true;
    }

    function drawCell(x, y, z){
        coord = getRealCoord(x, y, z);
        drawHex(coord.x, coord.y, 0.97);
        window.context.fill();
    }

    function getRealCoord(x, y, z){
        coord = new Object();
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        coord.x = centerX+window.cellSize*Math.sqrt(3)*(x+z/2);
        coord.y = centerY+(3/2)*z*window.cellSize;
        return coord;
    }

    function drawCircle(x, y, z, coeff){
        coord = getRealCoord(x, y, z);
        window.context.beginPath();
        window.context.arc(coord.x, coord.y, window.cellSize*coeff, 0, 2*Math.PI, false);
        window.context.closePath();
    }

    function markLastMove(x, y, z){
        drawCircle(x, y, z, 0.3);
        window.context.fillStyle = "#ffffff";
        window.context.fill();
    }

    function markSpecial(x, y, z){
        drawCircle(x, y, z, 0.6);
        window.context.stokeStyle = "#ff00ff";
        window.context.stroke();
    }

    function drawHex(x, y, coeff){
        size = window.cellSize * coeff;
        window.context.beginPath();

        window.context.moveTo(x, y+size);
        for(var i=1; i<6; i++){
            xp = x + size*Math.sin(i*Math.PI*2/6);
            yp = y + size*Math.cos(i*Math.PI*2/6);
            window.context.lineTo(xp, yp);
        }
        window.context.closePath();
    }

    function markEdge(x, y, z){
        coord = getRealCoord(x, y, z);
        drawHex(coord.x, coord.y, 0.9);
        window.context.stroke();
    }

    $("#colorpicker1").spectrum(
    {
        color: "#f00",
        move: function(color){
            window.colb=color.toHexString();
        }
    }
    );
    $("#colorpicker2").spectrum(
    {
        color: "#f0f",
        move: function(color){
            window.colw=color.toHexString();
        }
    }
    );

});

