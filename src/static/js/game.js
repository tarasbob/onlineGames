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
            $("#b_player").text(data.b_name);
            $("#w_player").text(data.w_name);
            //Update the times 
            $("#b_time").text(data.b_timeLeft);
            $("#w_time").text(data.w_timeLeft);
            //update the status
            $("#status").text(data.curTurn + " has " + data.movesLeft + " move(s) left");
            //draw the cells
            for(var i = 0; i<data.cells.length/4; i++){
                x = data.cells[i*4+0];
                y = data.cells[i*4+1];
                z = data.cells[i*4+2];
                col = data.cells[i*4+3];
                if(col == 'e')
                    window.context.fillStyle=window.colBlank;
                else if(col == 'b')
                    window.context.fillStyle=window.colb;
                else if(col == 'w')
                    window.context.fillStyle=window.colw;

                drawCell(x, y, z, window.cellSize);
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
            "command", { "cmd_text": "makemove", "x": coord[0], "y": coord[1], "z": coord[2] }
        );
    }, false);

    $("#calculatescore").click(function(){
        $.get("command", {"cmd_text": "calculatescore"}, function(data){
            $("#bscore").text(data.black);
            $("#wscore").text(data.white);
        }, "json");
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
        context.beginPath();
        context.arc(realX, realY, size/2, 0, 2*Math.PI, false);
        context.closePath();
        context.stroke();
        context.fill();
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
        window.context.strokeStyle="red";
        //window.context.stroke();
    }

    });

