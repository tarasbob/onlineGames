var init = function(){
    addSVG();

    window.boardSize = 4;
    window.cellSize = 0.55*window.svgW/(window.boardSize*2+1);
    window.dataset = [];
    window.cellMap = new Object();
    
    for(var i=-window.boardSize; i<=window.boardSize; i++){
        for(var j=-window.boardSize; j<=window.boardSize; j++){
            var k = -j-i;
            if(k <= window.boardSize && k >= -window.boardSize){
                //figure out the tiling colors
                var col = 0;
                if((i-j)%3 == 0){
                    col = 1;
                } else if((i-j-1) % 3 == 0){
                    col = 2;
                }

                var edge = false;
                if(Math.max(Math.abs(i), Math.abs(j), Math.abs(k)) == window.boardSize)
                    edge = true;

                //Push returns the length of the array; To get the index of the element, we subtract 1.
                window.cellMap['' + i + ':' + j + ':' + k] = window.dataset.push(
                   {"x": i, 
                    "y": j, 
                    "z": k, 
                    "state": 0, 
                    "patternCol": col,
                    "edge": edge, 
                    "marked": false, 
                    "bonus": false, 
                    "isCenter": false, 
                    "scoreState": 0,
                    "group": -1}) - 1;
            }
        }
    }
    
    getCell(0, 0, 0).isCenter = true;

    drawHexes();
    redraw();
}

$(function(){

    init();

    window.posArray[0]();
    redraw();
    $("#status").text(window.comments);

    $("#btn_next").click(function(){
        if(window.posNum < window.posArray.length-1){
            window.posNum++;
            window.posArray[window.posNum]();
            redraw();
            $("#status").text(window.comments);
        }
    });

    $("#btn_prev").click(function(){
        if(window.posNum > 0){
            window.posNum--;
            window.posArray[window.posNum]();
            redraw();
            $("#status").text(window.comments);
        }
    });
    

});
