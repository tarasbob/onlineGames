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

		var col1 = "4E7512";
		var col2 = "6A51A1";
		var colBlank = "F7D8B7";
		var colMiddle = "7F4A13";
        var curCol = col1;

        var sz = 4;
        for(var i = -sz; i <= sz; i++){
            for(var j = -sz; j <= sz; j++){
                for(var k = -sz; k <= sz; k++){
                    if(i + j + k == 0){
						if(i == 0 && j == 0 && k == 0){
							context.fillStyle=colMiddle;
						} else {
							context.fillStyle=colBlank;
						}
						drawCell(i, j, k, 20);
                    }
                }
            }
        }
        //context.fillStyle="green";
        //drawCell(0, 0, 0, 20);
		
		//--------------
		
		//-------------
		
        context.fill();

        c.addEventListener('click', function(e){
            //drawHex(e.offsetX, e.offsetY, 30);
            toggleHex(e.offsetX-centerX, e.offsetY-centerY, 20);
        }, false);

        function toggleHex(xPos, yPos, size){
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

            if(Math.max(Math.abs(rx), Math.abs(ry), Math.abs(rz)) <= sz){
                context.fillStyle=curCol;
                drawCell(rx, ry, rz, size);
                context.fill();
                if(curCol == col1){
                    curCol = col2;
                } else {
                    curCol = col1;
                }
            }

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

