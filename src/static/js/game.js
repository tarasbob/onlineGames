 $('document').ready(function() {
    var c=document.getElementById("myCanvas");
    var context=c.getContext("2d");
    var cells = [];

    for(var i=0; i<10; i++){
        cell = new Object();
        cell.x = 50+i*5;
        cell.y = 100+i*8;
        cells.push(cell);
    }

    //drawCircleAlt(300, 300, 30);

    var centerX = 500;
    var centerY = 500;
    var cellSize = 20;

    var colw = "ff6400";
    var colw_hover = "a64100";
    var colb= "00a383";
    var colb_hover = "006a55";
    var colBlank = "fffa73";
    var colBlank_hover = "a69f00";

    var special_colw = "bf6830";
    var special_colw_hover = "ff8b40";
    var special_colb= "1f7a68";
    var special_colb_hover = "34d1b2";
    var special_colBlank = "bfba30";
    var special_colBlank_hover = "fff840";

    var background_col = "2e2337";

    alert($("myCanvas").parent().width());

    $("myCanvas").attr('width', $("myCanvas").parent().width());
    $("myCanvas").attr('height', $("myCanvas").parent().height());

    function refreshBoard(){
        $.get("command", {"cmd_text": "gamestate"}, function(data){
            turn = data.curTurn;
            sz = data.boardSize;
            context.beginPath()
            context.rect(0, 0, c.width, c.height);
            context.closePath()
            context.fillStyle = background_col;
            context.fill();
            for(var i = 0; i<data.cells.length/4; i++){
                x = data.cells[i*4+0];
                y = data.cells[i*4+1];
                z = data.cells[i*4+2];
                c = data.cells[i*4+3];
                if(c == 'e')
                    context.fillStyle=colBlank;
                else if(c == 'b')
                    context.fillStyle=colb;
                else if(c == 'w')
                    context.fillStyle=colw;
                drawCell(x, y, z, cellSize);
            }
            if(data.state == "score"){
                for(var i = 0; i<data.groups.length/4; i++){
                    x = data.groups[i*4+0];
                    y = data.groups[i*4+1];
                    z = data.groups[i*4+2];
                    c = data.groups[i*4+3];
                    if(c == 'e')
                        context.fillStyle=colBlank;
                    else if(c == 'b')
                        context.fillStyle=col1;
                    else if(c == 'w')
                        context.fillStyle=col2;
                    drawCircle(x, y, z, cellSize);
                    $("#bscore").text(data.blackScore);
                    $("#bgroups").text(data.blackGroups);
                    $("#wscore").text(data.whiteScore);
                    $("#wgroups").text(data.whiteGroups);
                }
            }
        }, "json");
    }
    setInterval(refreshBoard, 300);

    c.addEventListener('click', function(e){
        coord = getHex(e.offsetX-centerX, e.offsetY-centerY, cellSize);
        $.get(
            "command", { "cmd_text": "makemove", "x": coord[0], "y": coord[1], "z": coord[2] }
        );
    }, false);

    $("#randommove").click(function(){
        $.get("command", {"cmd_text": "randommove"});
    });

    $("#increase_iters").click(function(){
        $.get("command", {"cmd_text": "inc_iter"});
    });

    $("#newgame").click(function(){
        $.get("command", {"cmd_text": "newgame"});
    });

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
        drawHex(centerX+size*Math.sqrt(3)*(x+z/2), centerY+(3/2)*z*size, size);
        context.fill();
    }

    function drawText(x, y, z, inp_text){
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
        var realX = centerX+size*Math.sqrt(3)*(x+z/2);
        var realY = centerY+(3/2)*z*size;
        context.beginPath();
        context.arc(realX, realY, size/2, 0, 2*Math.PI, false);
        context.closePath();
        context.stroke();
        context.fill();
    }

    function drawHex(x, y, size){
        context.beginPath();

        context.moveTo(x, y+size);
        for(var i=1; i<6; i++){
            xp = x + size*Math.sin(i*Math.PI*2/6);
            yp = y + size*Math.cos(i*Math.PI*2/6);
            context.lineTo(xp, yp);
        }
        context.closePath();
        context.stokeStyle="red";
        context.stroke();
    }

    });

