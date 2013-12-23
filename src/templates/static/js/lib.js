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
