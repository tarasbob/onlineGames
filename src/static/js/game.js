 $('document').ready(function() {
    window.c=document.getElementById("myCanvas");
    window.context=c.getContext("2d");

    window.colw = "ff6400";
    window.colw_hover = "a64100";
    window.colb= "00a383";
    window.colb_hover = "006a55";
    window.colBlank = "fffa73";
    window.colBlank_hover = "a69f00";

    window.special_colw = "bf6830";
    window.special_colw_hover = "ff8b40";
    window.special_colb= "1f7a68";
    window.special_colb_hover = "34d1b2";
    window.special_colBlank = "bfba30";
    window.special_colBlank_hover = "fff840";

    window.background_col = "2e2337";
    window.canvSizeCoeff = 1.0;

    window.cellSize = 10;

    window.selectedCells = [];

    window.view = "normal"


    function refreshBoard(){
        $.get("command", {"cmd_text": "gamestate"}, function(data){
            //figure out the size of each cell
            window.cellSize = window.c.width/(data.boardSize*4.3);
            //set the background color
            window.context.beginPath();
            window.context.rect(0, 0, window.c.width, window.c.height);
            window.context.closePath();
            window.context.fillStyle = window.background_col;
            window.context.fill();
            //Update Player Names
            if(data.state == "playing"){
                $("#b_player").text(data.first_name);
                $("#w_player").text(data.second_name);
            }
            //update the status
            $("#status").html("<p>" + data.curTurn + " has " + data.movesLeft + " move(s) left</p>");
            //draw the cells
            for(var i = 0; i<data.cells.length/5; i++){
                x = data.cells[i*5+0];
                y = data.cells[i*5+1];
                z = data.cells[i*5+2];
                col = data.cells[i*5+3];
                if(col == 0)
                    window.context.fillStyle=window.colBlank;
                else if(col == 1)
                    window.context.fillStyle=window.colb;
                else if(col == 2)
                    window.context.fillStyle=window.colw;
                drawCell(x, y, z);
                if(data.cells[i*5+4] == "b"){
                    //both special and edge
                    markSpecial(x, y, z);
                    markEdge(x,y,z);
                } else if(data.cells[i*5+4] == "s"){
                    markSpecial(x, y, z);
                } else if(data.cells[i*5+4] == "e"){
                    //just edge
                    markEdge(x,y,z);
                }
            }
            //draw the cell in the center
            window.context.fillStyle="#e0e0e0";
            drawCell(0, 0, 0);
            for(var i=0; i<data.lastTwoMoves.length/3; i++){
                x = data.lastTwoMoves[i*3+0];
                y = data.lastTwoMoves[i*3+1];
                z = data.lastTwoMoves[i*3+2];
                markLastMove(x, y, z);
            }
            if(window.view == "score" && data.state == "finished"){
                var statusText = "";
                if(data.type == "score"){
                    statusText += "<p>winner: " + data.winner + "</p>";
                    statusText += "<p>score 1: " + data.totalScore[1] + "</p>";
                    statusText += "<p>score 2: " + data.totalScore[2] + "</p>";
                    statusText += "<p>edge score 1: " + data.edgeScore[1] + "</p>";
                    statusText += "<p>edge score 2: " + data.edgeScore[2] + "</p>";
                    statusText += "<p>reward 1: " + data.reward[1] + "</p>";
                    statusText += "<p>reward 2: " + data.reward[2] + "</p>";
                    statusText += "<p>bonus 1: " + data.bonus[1] + "</p>";
                    statusText += "<p>bonus 2: " + data.bonus[2] + "</p>";
                    for(var i=0; i<data.finCells.length/4; i++){
                        x = data.finCells[i*4+0];
                        y = data.finCells[i*4+1];
                        z = data.finCells[i*4+2];
                        col = data.finCells[i*4+3];
                        if(col == 0)
                            window.context.fillStyle=window.colBlank;
                        else if(col == 1)
                            window.context.fillStyle=window.colb;
                        else if(col == 2)
                            window.context.fillStyle=window.colw;

                        drawCell(x, y, z);
                    }
                } else if(data.type == "resign"){
                    statusText += "<p>winner: " + data.winner + "</p>";
                }
                $("#status").html(statusText);
            }
        }, "json");
    }
    setInterval(refreshBoard, 500);
    adjustCanvas();

    //set the color size of canvas at the beginning
    function adjustCanvas(){
        window.c.width=$("#canv-div").width()*window.canvSizeCoeff;
        window.c.height=(Math.sqrt(3)/2) * window.c.width;
    }

    $(window).resize(function() {
        adjustCanvas();
    });

    c.addEventListener('click', function(e){
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        coord = getHex(e.offsetX-centerX, e.offsetY-centerY, window.cellSize);
        //accidental click protection
        window.selectedCells.push(coord);
        if(window.selectedCells.length >= 2){
            if(isEqualCoord(window.selectedCells[0], window.selectedCells[1])){
                $.get("command", { 
                    "cmd_text": "makemove", 
                    "x": window.selectedCells[0][0], 
                    "y": window.selectedCells[0][1], 
                    "z": window.selectedCells[0][2]
                });
            }
            window.selectedCells = [];
        }
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

