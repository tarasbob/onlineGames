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

    window.cellSize = 10;

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
            for(var i = 0; i<data.cells.length/4; i++){
                if(data.cells[i*4+0] == "s"){
                    //handle the specially marked cells
                    x = data.cells[(i-1)*4+0];
                    y = data.cells[(i-1)*4+1];
                    z = data.cells[(i-1)*4+2];
                    col = data.cells[(i-1)*4+3];
                    if(col == 0)
                        window.context.fillStyle=window.colb;
                    else if(col == 1)
                        window.context.fillStyle=window.colw;
                    else if(col == 2)
                        window.context.fillStyle=window.colb;

                    drawCircle(x, y, z, window.cellSize);

                } else { 
                    //handle all the cells
                    x = data.cells[i*4+0];
                    y = data.cells[i*4+1];
                    z = data.cells[i*4+2];
                    col = data.cells[i*4+3];
                    if(col == 0)
                        window.context.fillStyle=window.colBlank;
                    else if(col == 1)
                        window.context.fillStyle=window.colb;
                    else if(col == 2)
                        window.context.fillStyle=window.colw;

                    drawCell(x, y, z, window.cellSize);
                }
            }
            if(window.view == "score" && data.state == "finished"){
                var statusText = "";
                if(data.type == "score"){
                    statusText += "<p>winner: " + data.winner + "</p>";
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

                        drawCell(x, y, z, window.cellSize);
                    }
                } else if(data.type == "resign"){
                    statusText += "<p>winner: " + data.winner + "</p>";
                }
                $("#status").html(statusText);
            }
        }, "json");
    }
    setInterval(refreshBoard, 500);

    //set the color size of canvas at the beginning
    window.c.width=$("#canv-div").width();
    window.c.height=(Math.sqrt(3)/2) * window.c.width

    $(window).resize(function() {
        window.c.width=$("#canv-div").width();
        window.c.height=(Math.sqrt(3)/2) * window.c.width
    });

    c.addEventListener('click', function(e){
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        coord = getHex(e.offsetX-centerX, e.offsetY-centerY, window.cellSize);
        $.get(
            "command", { "cmd_text": "makemove", "x": coord[0], "y": coord[1], "z": coord[2] });
    }, false);

    $("#btn_pass").click(function(){
        $.get("command", {"cmd_text": "makemove", "x": "pass"});
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

    function getHex(xPos, yPos, size){
        var x = ((1/3)*Math.sqrt(3)*xPos - (1/3)*yPos) / size;
        var z = (2/3)*yPos/size
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


    function drawCell(x, y, z, size){
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        drawHex(centerX+size*Math.sqrt(3)*(x+z/2), centerY+(3/2)*z*size, size);
        window.context.fill();
    }

    function drawText(x, y, z, inp_text){
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        var realX = centerX+cellSize*Math.sqrt(3)*(x+z/2);
        var realY = centerY+(3/2)*z*cellSize;
        context.font = "10px Arial";
        disp_coord = "";
        disp_coord.concat(x.toString());
        disp_coord.concat(" ");
        disp_coord.concat(y.toString());
        disp_coord.concat(" ");
        disp_coord.concat(z.toString());
        context.fillText(x.toString() + " " + y.toString() + " " + z.toString(), realX-10, realY);
    }

    function drawCircle(x, y, z, size){
        var centerX = window.c.width/2;
        var centerY = window.c.height/2;
        var realX = centerX+size*Math.sqrt(3)*(x+z/2);
        var realY = centerY+(3/2)*z*size;
        window.context.beginPath();
        window.context.arc(realX, realY, size/2, 0, 2*Math.PI, false);
        window.context.closePath();
        window.context.strokeStyle = window.background_col;
        window.context.stroke();
    }

    function drawHex(x, y, size){
        size = size * 0.97;
        window.context.beginPath();

        window.context.moveTo(x, y+size);
        for(var i=1; i<6; i++){
            xp = x + size*Math.sin(i*Math.PI*2/6);
            yp = y + size*Math.cos(i*Math.PI*2/6);
            window.context.lineTo(xp, yp);
        }
        window.context.closePath();
        //window.context.stroke();
    }

    });

