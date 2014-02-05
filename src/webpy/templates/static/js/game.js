 $('document').ready(function() {
    window.c=document.getElementById("myCanvas");
    window.context=c.getContext("2d");

    window.colw = "#ff6400";
    window.colb= "#00a383";
    window.colBlank = "#fffa73";
    window.background_col = "#2e2337";
    window.circles_col = "#2e2337";
    window.lastmove_col = "#ffffff";
    window.center_col = "#888888";
	
    window.canvSizeCoeff = 1.0;
    window.cellSizeCoeff = 0.2;

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
		window.cellSize = window.cellSizeCoeff*(window.c.width/window.boardSize);
		//set the background color
		window.context.beginPath();
		window.context.rect(0, 0, window.c.width, window.c.height);
		window.context.closePath();
		window.context.fillStyle = window.background_col;
		window.context.fill();
		//Update Player Names
        
        $("#p1_name").css("color", window.colb);
        $("#p2_name").css("color", window.colw);
		
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
    $("#btn_largerCanv").click(function(){
        window.canvSizeCoeff = window.canvSizeCoeff / 0.95;
        adjustCanvas();
    });
    $("#btn_smallerCell").click(function(){
        window.cellSizeCoeff = window.cellSizeCoeff * 0.95;
        adjustCanvas();
    });
    $("#btn_largerCell").click(function(){
        window.cellSizeCoeff = window.cellSizeCoeff * 1.05;
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

    $("#p1_colpicker").spectrum(
    {
        color: window.colb,
        clickoutFiresChange: true,
        move: function(color){
            window.colb=color.toHexString();
            refreshBoard();
        }
    }
    );
    $("#p2_colpicker").spectrum(
    {
        color: window.colw,
        clickoutFiresChange: true,
        move: function(color){
            window.colw=color.toHexString();
            refreshBoard();
        }
    }
    );
    $("#empty_colpicker").spectrum(
    {
        color: window.colBlank,
        clickoutFiresChange: true,
        move: function(color){
            window.colBlank=color.toHexString();
            refreshBoard();
        }
    }
    );
    $("#background_colpicker").spectrum(
    {
        color: window.background_col,
        clickoutFiresChange: true,
        move: function(color){
            window.background_col=color.toHexString();
            refreshBoard();
        }
    }
    );
    $("#circles_colpicker").spectrum(
    {
        color: window.circles_col,
        clickoutFiresChange: true,
        move: function(color){
            window.circles_col=color.toHexString();
            refreshBoard();
        }
    }
    );
    $("#last_colpicker").spectrum(
    {
        color: window.lastmove_col,
        clickoutFiresChange: true,
        move: function(color){
            window.lastmove_col=color.toHexString();
            refreshBoard();
        }
    }
    );
    $("#center_colpicker").spectrum(
    {
        color: window.center_col,
        clickoutFiresChange: true,
        move: function(color){
            window.center_col=color.toHexString();
            refreshBoard();
        }
    }
    );

});

