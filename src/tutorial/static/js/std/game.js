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
	
	window.boardSize = 5;
    window.view = "normal"
	
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
		refreshBoard()
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

