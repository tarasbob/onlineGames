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

		var col1 = "4E7512";
		var col2 = "6A51A1";
		var colBlank = "F7D8B7";
		var colMiddle = "7F4A13";
        var curCol = col1;


        //context.fillStyle="green";
        //drawCell(0, 0, 0, 20);
		
		//--------------
		
		//-------------
        //

		
        function refreshBoard(){
            $.get("gamestate", function(data){
                turn = data.curTurn;
                sz = data.boardSize;
                context.beginPath()
                context.rect(0, 0, c.width, c.height);
                context.closePath()
                context.fillStyle = 'yellow';
                context.fill();
                for(var i = 0; i<data.cells.length/4; i++){
                    x = data.cells[i*4+0];
                    y = data.cells[i*4+1];
                    z = data.cells[i*4+2];
                    c = data.cells[i*4+3];
                    if(c == 'e')
                        context.fillStyle=colBlank;
                    else if(c == 'b')
                        context.fillStyle=col1;
                    else if(c == 'w')
                        context.fillStyle=col2;
                    drawCell(x, y, z, cellSize);
                }
            }, "json");
        }
        setInterval(refreshBoard, 300);

        c.addEventListener('click', function(e){
            coord = getHex(e.offsetX-centerX, e.offsetY-centerY, cellSize);
            $.get(
                "makemove", { "x": coord[0], "y": coord[1], "z": coord[2] }
            );
        }, false);

        $("#randommove").click(function(){
            $.get("randommove");
        });

        $("#calculatescore").click(function(){
            $.get("calculatescore", function(data){
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

