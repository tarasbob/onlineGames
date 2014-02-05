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
	
	window.boardSize = 4;
    window.view = "normal"

    window.curStep = 0;

    function emptyGrid(){
        window.specialCells = [];
        window.marks = [];
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
    }
    emptyGrid();

    function diagram_1(){
        emptyGrid();
    }

    function diagram_2(){
        diagram_1();
        window.grid["1:2"].state=1;
    }

    function diagram_3(){
        diagram_2();
        window.grid["-1:2"].state=2;
        window.grid["-2:2"].state=2;
    }

    function diagram_4(){
        diagram_3();
        window.grid["-1:3"].state=1;
        window.grid["2:-2"].state=1;
    }

    function diagram_5(){
        window.grid["4:0"].state = 1; 
        window.grid["3:0"].state = 1; 
        window.grid["2:0"].state = 1; 
        window.grid["1:0"].state = 1;
        window.grid["1:-1"].state = 1;
        window.grid["0:-1"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["0:-3"].state = 1;
        window.grid["0:-4"].state = 1;
        window.grid["-1:1"].state = 1;
        window.grid["-1:0"].state = 1;
        window.grid["-2:2"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["-4:4"].state = 1;
        window.grid["-4:3"].state = 1;
        window.grid["-3:2"].state = 1;
        window.grid["-2:1"].state = 1;
        window.grid["1:-2"].state = 1;
        window.grid["2:-2"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["3:1"].state = 1;
        window.grid["2:1"].state = 1;
        window.grid["1:-4"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["-1:-3"].state = 1;
        window.grid["-2:3"].state = 1;
        window.grid["-1:3"].state = 1;
        window.grid["3:-3"].state = 1;
        window.grid["-2:0"].state = 1;
        window.grid["-3:1"].state = 1;
        window.grid["1:2"].state = 2;
        window.grid["-3:0"].state = 2;
        window.grid["3:-2"].state = 2;
        window.grid["-2:-1"].state = 2;
        window.grid["-1:2"].state = 2;
        window.grid["0:1"].state = 2;
        window.grid["-4:2"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-1:-2"].state = 2;
        window.grid["-1:-1"].state = 2;
        window.grid["-4:1"].state = 2;
        window.grid["2:-4"].state = 2;
        window.grid["3:-4"].state = 2;
        window.grid["3:-4"].state = 2;
        window.grid["4:-4"].state = 2;
        window.grid["4:-3"].state = 2;
        window.grid["4:-2"].state = 2;
        window.grid["3:-1"].state = 2;
        window.grid["2:-1"].state = 2;
        window.grid["2:-3"].state = 2;
        window.grid["1:1"].state = 2;
        window.grid["0:2"].state = 2;
        window.grid["-3:4"].state = 2;
        window.grid["-2:4"].state = 2;
        window.grid["-1:4"].state = 2;
        window.grid["0:3"].state = 2;
        window.grid["0:4"].state = 2;
        window.grid["1:3"].state = 2;
        window.grid["2:2"].state = 2; 
    }
    function diagram_6(){
        diagram_5();
    }

    function diagram_7(){
        emptyGrid();
        window.grid["-1:1"].state = 1;
        window.grid["1:-1"].state = 1;
        window.grid["-2:2"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["-4:3"].state = 1;
        window.grid["2:-2"].state = 1;
        window.grid["3:-3"].state = 1;
        window.grid["3:-4"].state = 1;
        window.grid["-4:4"].state = 1;
        window.grid["-3:4"].state = 1;
        window.grid["-2:4"].state = 1;
        window.grid["-4:2"].state = 1;
        window.grid["-4:1"].state = 1;
        window.grid["4:-4"].state = 1;
        window.grid["4:-3"].state = 1;
        window.grid["4:-2"].state = 1;
        window.grid["2:-4"].state = 1;
        window.grid["1:-4"].state = 1;
        window.grid["2:-3"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["3:-2"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["3:-1"].state = 1;
        window.grid["3:0"].state = 1;
        window.grid["2:0"].state = 1;
        window.grid["2:-1"].state = 1;
        window.grid["1:-2"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["0:-3"].state = 1;
        window.grid["0:-4"].state = 1;
        window.grid["-4:0"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["-3:2"].state = 1;
        window.grid["-2:3"].state = 1;
        window.grid["-1:3"].state = 1;
        window.grid["-1:4"].state = 1;
        window.grid["0:4"].state = 2;
        window.grid["0:3"].state = 2;
        window.grid["-1:2"].state = 2;
        window.grid["-2:1"].state = 2;
        window.grid["-3:1"].state = 2;
        window.grid["-3:0"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["1:3"].state = 2;
        window.grid["4:0"].state = 2;
        window.grid["3:1"].state = 2;
        window.grid["2:1"].state = 2;
        window.grid["1:1"].state = 2;
        window.grid["1:0"].state = 2;
        window.grid["0:-1"].state = 2;
        window.grid["-1:-1"].state = 2;
        window.grid["-1:-2"].state = 2;
        window.grid["-1:-3"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-2:-1"].state = 2;
        window.grid["-2:0"].state = 2;
        window.grid["-1:0"].state = 2;
        window.grid["0:1"].state = 2;
        window.grid["0:2"].state = 2;
        window.grid["1:2"].state = 2;
        window.grid["2:2"].state = 2; 
    }

    function diagram_8(){
        window.grid["-4:4"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["-2:3"].state = 1;
        window.grid["-1:3"].state = 1;
        window.grid["-1:2"].state = 1;
        window.grid["0:2"].state = 1;
        window.grid["-4:1"].state = 1;
        window.grid["-3:0"].state = 1;
        window.grid["-2:0"].state = 1;
        window.grid["-1:-1"].state = 1;
        window.grid["-1:-2"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["4:0"].state = 1;
        window.grid["3:0"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["4:-2"].state = 1;
        window.grid["4:-3"].state = 1;
        window.grid["4:-4"].state = 1;
        window.grid["3:-3"].state = 1;
        window.grid["3:-2"].state = 1;
        window.grid["3:-1"].state = 1;
        window.grid["2:0"].state = 1;
        window.grid["2:-1"].state = 1;
        window.grid["2:-2"].state = 1;
        window.grid["3:1"].state = 1;
        window.grid["3:-4"].state = 1;
        window.grid["-2:2"].state = 1;
        window.grid["-2:-1"].state = 1;
        window.grid["0:-3"].state = 2;
        window.grid["-3:1"].state = 2;
        window.grid["-1:0"].state = 2;
        window.grid["2:1"].state = 2;
        window.grid["2:2"].state = 2;
        window.grid["1:3"].state = 2;
        window.grid["1:-3"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-1:-3"].state = 2;
        window.grid["0:-4"].state = 2;
        window.grid["1:-4"].state = 2;
        window.grid["2:-4"].state = 2;
        window.grid["2:-3"].state = 2;
        window.grid["1:-2"].state = 2;
        window.grid["0:-1"].state = 2;
        window.grid["-4:2"].state = 2;
        window.grid["-4:3"].state = 2;
        window.grid["-3:2"].state = 2;
        window.grid["-2:1"].state = 2;
        window.grid["-1:1"].state = 2;
        window.grid["1:-1"].state = 2;
        window.grid["1:0"].state = 2;
        window.grid["0:1"].state = 2;
        window.grid["1:1"].state = 2;
        window.grid["1:2"].state = 2;
        window.grid["0:3"].state = 2;
        window.grid["0:4"].state = 2;
        window.grid["-1:4"].state = 2;
        window.grid["-2:4"].state = 2;
        window.grid["-3:4"].state = 2;
        window.marks = [];
    }

    function diagram_9(){
        diagram_8();
        window.marks.push([-4, 4, 0]);
        window.marks.push([-4, 1, 3]);
    }

    function diagram_10(){
        diagram_9();
        window.marks = [];
        window.grid["-4:1"].state = 2;
        window.grid["-3:0"].state = 2;
        window.grid["-2:-1"].state = 2;
        window.grid["-1:-2"].state = 2;
        window.grid["0:-2"].state = 2;
        window.grid["-1:-1"].state = 2;
        window.grid["-2:0"].state = 2;
        window.grid["-4:4"].state = 2;
        window.grid["-3:3"].state = 2;
        window.grid["-2:2"].state = 2;
        window.grid["-1:2"].state = 2;
        window.grid["0:2"].state = 2;
        window.grid["-1:3"].state = 2;
        window.grid["-2:3"].state = 2;
    }

    function diagram_11(){
        window.grid["0:-4"].state = 1;
        window.grid["2:-4"].state = 1;
        window.grid["3:-4"].state = 1;
        window.grid["4:-4"].state = 1;
        window.grid["-1:-3"].state = 1;
        window.grid["-4:3"].state = 1;
        window.grid["-4:4"].state = 1;
        window.grid["-3:4"].state = 1;
        window.grid["1:3"].state = 1;
        window.grid["2:2"].state = 1;
        window.grid["3:1"].state = 1;
        window.grid["4:0"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["-3:2"].state = 1;
        window.grid["-3:1"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["1:-2"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["3:0"].state = 1;
        window.grid["2:1"].state = 1;
        window.grid["1:1"].state = 1;
        window.grid["2:-2"].state = 1;
        window.grid["-1:-1"].state = 1;
        window.grid["-2:3"].state = 1;
        window.grid["0:3"].state = 1;
        window.grid["2:-1"].state = 1;
        window.grid["-2:-1"].state = 1;
        window.grid["-1:-2"].state = 1;
        window.grid["0:-3"].state = 2;
        window.grid["1:-4"].state = 2;
        window.grid["2:0"].state = 2;
        window.grid["-4:2"].state = 2;
        window.grid["-4:1"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-3:0"].state = 2;
        window.grid["-2:0"].state = 2;
        window.grid["-2:2"].state = 2;
        window.grid["-2:1"].state = 2;
        window.grid["-1:0"].state = 2;
        window.grid["0:-1"].state = 2;
        window.grid["1:-1"].state = 2;
        window.grid["1:0"].state = 2;
        window.grid["0:1"].state = 2;
        window.grid["-1:1"].state = 2;
        window.grid["-1:2"].state = 2;
        window.grid["-1:3"].state = 2;
        window.grid["-2:4"].state = 2;
        window.grid["-1:4"].state = 2;
        window.grid["0:4"].state = 2;
        window.grid["1:2"].state = 2;
        window.grid["0:2"].state = 2;
        window.grid["3:-1"].state = 2;
        window.grid["4:-2"].state = 2;
        window.grid["4:-3"].state = 2;
        window.grid["3:-2"].state = 2;
        window.grid["3:-3"].state = 2;
        window.grid["2:-3"].state = 2;
        window.marks = [];
    }

    function diagram_12(){
        diagram_11();
        window.marks.push([0, -3, 3]);
        window.marks.push([1, -4, 3]);

    }

    function diagram_13(){
        diagram_12();
        window.grid["0:-3"].state = 1;
        window.grid["1:-4"].state = 1;
        window.marks = [];
    }

    function diagram_14(){
        diagram_13();
        window.marks.push([-3, 4, -1]);
        window.marks.push([-4, 4, 0]);
        window.marks.push([-4, 3, 1]);
        window.marks.push([-1, -3, 4]);
        window.marks.push([0, -4, 4]);
        window.marks.push([1, -4, 3]);
        window.marks.push([2, -4, 2]);
        window.marks.push([3, -4, 1]);
        window.marks.push([4, -4, 0]);
        window.marks.push([4, -1, -3]);
        window.marks.push([4, 0, -4]);
        window.marks.push([3, 1, -4]);
        window.marks.push([2, 2, -4]);
        window.marks.push([1, 3, -4]);
    }
    
    function diagram_15(){
        diagram_14();
        window.marks = [];
        window.marks.push([0, 4, -4]);
        window.marks.push([-1, 4, -3]);
        window.marks.push([-2, 4, -2]);
        window.marks.push([-4, 2, 2]);
        window.marks.push([-4, 1, 3]);
        window.marks.push([-4, 0, 4]);
        window.marks.push([-3, -1, 4]);
        window.marks.push([-2, -2, 4]);
        window.marks.push([4, -3, -1]);
        window.marks.push([4, -2, -2]);
    }

    function diagram_16(){
        diagram_15();
        window.marks = [];
    }

    function diagram_17(){
        window.grid["-4:1"].state = 1;
        window.grid["-1:4"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["1:-4"].state = 1;
        window.grid["-4:2"].state = 1;
        window.grid["4:-2"].state = 1;
        window.grid["-3:2"].state = 1;
        window.grid["-2:1"].state = 1;
        window.grid["-1:1"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["0:-1"].state = 1;
        window.grid["3:-2"].state = 1;
        window.grid["2:-1"].state = 1;
        window.grid["1:-1"].state = 1;
        window.grid["0:3"].state = 1;
        window.grid["0:2"].state = 1;
        window.grid["-1:2"].state = 1;
        window.grid["0:1"].state = 1;
        window.grid["-1:0"].state = 1;
        window.grid["1:0"].state = 1;
        window.grid["3:-1"].state = 1;
        window.grid["-1:-1"].state = 1;
        window.grid["-3:1"].state = 1;
        window.grid["-2:2"].state = 1;
        window.grid["1:-2"].state = 1;
        window.grid["2:0"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["1:2"].state = 1;
        window.grid["3:-3"].state = 1;
        window.grid["-2:-1"].state = 2;
        window.grid["-2:3"].state = 2;
        window.grid["3:0"].state = 2;
        window.grid["-1:-2"].state = 2;
        window.grid["-4:3"].state = 2;
        window.grid["-4:4"].state = 2;
        window.grid["-3:4"].state = 2;
        window.grid["-2:4"].state = 2;
        window.grid["0:4"].state = 2;
        window.grid["1:3"].state = 2;
        window.grid["2:2"].state = 2;
        window.grid["3:1"].state = 2;
        window.grid["4:0"].state = 2;
        window.grid["4:-3"].state = 2;
        window.grid["4:-4"].state = 2;
        window.grid["3:-4"].state = 2;
        window.grid["2:-4"].state = 2;
        window.grid["0:-4"].state = 2;
        window.grid["-1:-3"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["-3:0"].state = 2;
        window.grid["-2:0"].state = 2;
        window.grid["0:-3"].state = 2;
        window.grid["2:-3"].state = 2;
        window.grid["2:-2"].state = 2;
        window.grid["2:1"].state = 2;
        window.grid["1:1"].state = 2;
        window.grid["-1:3"].state = 2;
        window.specialCells = [];
    }

    function diagram_18(){
        emptyGrid();
        window.specialCells = [];
        window.specialCells.push([4, 0, -4]);
        window.specialCells.push([-3, 1, 2]);
        window.specialCells.push([0, 1, -1]);
        window.specialCells.push([0, -3, 3]);
        window.specialCells.push([0, 2, -2]);
    }

    function diagram_19(){
        diagram_18();
        window.grid["0:4"].state = 1;
        window.grid["-1:4"].state = 1;
        window.grid["-2:4"].state = 1;
        window.grid["-3:4"].state = 1;
        window.grid["-4:4"].state = 1;
        window.grid["-4:3"].state = 1;
        window.grid["1:3"].state = 1;
        window.grid["2:2"].state = 1;
        window.grid["3:1"].state = 1;
        window.grid["4:0"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["4:-2"].state = 1;
        window.grid["3:-2"].state = 1;
        window.grid["3:-1"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["0:3"].state = 1;
        window.grid["-2:2"].state = 1;
        window.grid["-2:1"].state = 1;
        window.grid["2:-2"].state = 1;
        window.grid["2:-1"].state = 1;
        window.grid["2:0"].state = 1;
        window.grid["1:1"].state = 1;
        window.grid["2:-3"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["-3:1"].state = 1;
        window.grid["-3:0"].state = 1;
        window.grid["0:1"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["-1:-2"].state = 1;
        window.grid["0:-1"].state = 1;
        window.grid["-3:2"].state = 1;
        window.grid["-4:2"].state = 2;
        window.grid["-4:1"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-1:-3"].state = 2;
        window.grid["0:-4"].state = 2;
        window.grid["1:-4"].state = 2;
        window.grid["2:-4"].state = 2;
        window.grid["3:-4"].state = 2;
        window.grid["4:-4"].state = 2;
        window.grid["4:-3"].state = 2;
        window.grid["3:-3"].state = 2;
        window.grid["0:-3"].state = 2;
        window.grid["1:-2"].state = 2;
        window.grid["-2:-1"].state = 2;
        window.grid["-1:-1"].state = 2;
        window.grid["-2:0"].state = 2;
        window.grid["-1:0"].state = 2;
        window.grid["1:-1"].state = 2;
        window.grid["1:0"].state = 2;
        window.grid["-1:1"].state = 2;
        window.grid["-1:2"].state = 2;
        window.grid["-2:3"].state = 2;
        window.grid["-1:3"].state = 2;
        window.grid["0:2"].state = 2;
        window.grid["1:2"].state = 2;
        window.grid["2:1"].state = 2;
        window.grid["3:0"].state = 2;

    }


    function diagram_20(){
        emptyGrid();
        window.specialCells = [];
        window.specialCells.push([3, 0, -3]);
        window.specialCells.push([-2, 3, -1]);
        window.specialCells.push([0, 1, -1]);
        window.specialCells.push([3, -4, 1]);
        window.specialCells.push([0, 2, -2]);

        window.grid["-4:4"].state = 1;
        window.grid["-3:4"].state = 1;
        window.grid["-2:4"].state = 1;
        window.grid["-1:4"].state = 1;
        window.grid["0:4"].state = 1;
        window.grid["1:3"].state = 1;
        window.grid["2:2"].state = 1;
        window.grid["4:0"].state = 1;
        window.grid["3:1"].state = 1;
        window.grid["4:-1"].state = 1;
        window.grid["4:-2"].state = 1;
        window.grid["4:-3"].state = 1;
        window.grid["3:-2"].state = 1;
        window.grid["2:-1"].state = 1;
        window.grid["1:0"].state = 1;
        window.grid["0:1"].state = 1;
        window.grid["-1:2"].state = 1;
        window.grid["-1:3"].state = 1;
        window.grid["-2:2"].state = 1;
        window.grid["-2:3"].state = 1;
        window.grid["-2:1"].state = 1;
        window.grid["-1:0"].state = 1;
        window.grid["-1:-1"].state = 1;
        window.grid["-1:-2"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["1:-2"].state = 1;
        window.grid["-2:0"].state = 1;
        window.grid["-3:0"].state = 1;
        window.grid["-3:1"].state = 1;
        window.grid["-3:3"].state = 1;
        window.grid["-4:3"].state = 2;
        window.grid["-3:2"].state = 2;
        window.grid["-4:2"].state = 2;
        window.grid["-4:1"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["-3:-1"].state = 2;
        window.grid["-2:-1"].state = 2;
        window.grid["-2:-2"].state = 2;
        window.grid["-1:-3"].state = 2;
        window.grid["0:-3"].state = 2;
        window.grid["0:-4"].state = 2;
        window.grid["1:-4"].state = 2;
        window.grid["2:-4"].state = 2;
        window.grid["3:-4"].state = 2;
        window.grid["4:-4"].state = 2;
        window.grid["3:-3"].state = 2;
        window.grid["2:-3"].state = 2;
        window.grid["2:-2"].state = 2;
        window.grid["1:-1"].state = 2;
        window.grid["0:-1"].state = 2;
        window.grid["-1:1"].state = 2;
        window.grid["0:3"].state = 2;
        window.grid["0:2"].state = 2;
        window.grid["1:2"].state = 2;
        window.grid["1:1"].state = 2;
        window.grid["2:1"].state = 2;
        window.grid["2:0"].state = 2;
        window.grid["3:0"].state = 2;
        window.grid["3:-1"].state = 2;
        

    }

    function diagram_21(){
        emptyGrid();
        window.grid["0:1"].state = 1;
        window.grid["-1:1"].state = 1;
        window.grid["-1:0"].state = 1;
        window.grid["0:-1"].state = 1;
        window.grid["2:-4"].state = 1;
        window.grid["1:-1"].state = 1;
        window.grid["-3:-1"].state = 1;
        window.grid["1:0"].state = 1;
        window.grid["0:2"].state = 1;
        window.grid["3:1"].state = 1;
        window.grid["0:3"].state = 1;
        window.grid["0:4"].state = 1;
        window.grid["0:-2"].state = 1;
        window.grid["0:-3"].state = 1;
        window.grid["-1:-3"].state = 1;
        window.grid["1:3"].state = 1;
        window.grid["2:2"].state = 1;
        window.grid["2:1"].state = 1;
        window.grid["-2:-2"].state = 1;
        window.grid["0:-4"].state = 1;
        window.grid["1:-4"].state = 1;
        window.grid["1:-3"].state = 1;
        window.grid["1:-2"].state = 1;
        window.grid["-1:4"].state = 1;
        window.grid["-2:4"].state = 2;
        window.grid["-3:4"].state = 2;
        window.grid["-4:4"].state = 2;
        window.grid["-4:3"].state = 2;
        window.grid["-4:2"].state = 2;
        window.grid["-4:1"].state = 2;
        window.grid["-4:0"].state = 2;
        window.grid["3:-4"].state = 2;
        window.grid["4:-4"].state = 2;
        window.grid["4:-3"].state = 2;
        window.grid["4:-2"].state = 2;
        window.grid["4:-1"].state = 2;
        window.grid["4:0"].state = 2;
        window.grid["3:0"].state = 2;
        window.grid["3:-3"].state = 2;
        window.grid["-3:0"].state = 2;

        window.specialCells = [];
        window.specialCells.push([-4, 3, 1]);
        window.specialCells.push([-3, 0, 3]);
        window.specialCells.push([4, -2, -2]);
        window.specialCells.push([1, 3, -4]);
        window.specialCells.push([1, -4, 3]);
    }

    function diagramPerimeter(){
        window.marks = [];
        window.marks.push([-3, 4, -1]);
        window.marks.push([-4, 4, 0]);
        window.marks.push([-4, 3, 1]);
        window.marks.push([-1, -3, 4]);
        window.marks.push([0, -4, 4]);
        window.marks.push([1, -4, 3]);
        window.marks.push([2, -4, 2]);
        window.marks.push([3, -4, 1]);
        window.marks.push([4, -4, 0]);
        window.marks.push([4, -1, -3]);
        window.marks.push([4, 0, -4]);
        window.marks.push([3, 1, -4]);
        window.marks.push([2, 2, -4]);
        window.marks.push([1, 3, -4]);
        window.marks.push([0, 4, -4]);
        window.marks.push([-1, 4, -3]);
        window.marks.push([-2, 4, -2]);
        window.marks.push([-4, 2, 2]);
        window.marks.push([-4, 1, 3]);
        window.marks.push([-4, 0, 4]);
        window.marks.push([-3, -1, 4]);
        window.marks.push([-2, -2, 4]);
        window.marks.push([4, -3, -1]);
        window.marks.push([4, -2, -2]);
    }

    function diagram_22(){
        diagram_21();
        window.grid["-1:3"].state = 2;
        window.grid["-2:3"].state = 2;
        window.grid["-3:3"].state = 2;
        window.grid["-3:2"].state = 2;
        window.grid["-3:1"].state = 2;
        window.grid["-2:0"].state = 2;
        window.grid["-2:-1"].state = 2;
        window.grid["-1:-2"].state = 2;
        window.grid["-1:-1"].state = 2;
        window.grid["-2:1"].state = 2;
        window.grid["-2:2"].state = 2;
        window.grid["-1:2"].state = 2;
        window.grid["1:2"].state = 2;
        window.grid["1:1"].state = 2;
        window.grid["2:0"].state = 2;
        window.grid["3:-1"].state = 2;
        window.grid["3:-2"].state = 2;
        window.grid["2:-1"].state = 2;
        window.grid["2:-2"].state = 2;
        window.grid["2:-3"].state = 2;
    }

    function showStep(){
        if(window.curStep == 1){
            diagram_1();
            $("#status").html("<p>Edge Connect is played on a hexagonal grid. Players claim any 2 unowned cells per move, except the specially marked center cell which already belongs to both players from the start</p>");
        }else if(window.curStep == 2){
            diagram_1();
            $("#status").html("<p>The object of the game is to own as many perimeter cells as possible, and to have as few groups on the board as possible.</p>");
        }else if(window.curStep == 3){
            diagram_2();
            $("#status").html("<p>The game begins with the first player claiming only one cell.</p>");
        }else if(window.curStep == 4){
            diagram_3();
            $("#status").html("<p>After the first move, both players can claim 2 cells per turn</p>");
        }else if(window.curStep == 5){
            diagram_4();
            $("#status").html("<p>It's the first player's turn again, he claims 2 cells. Only empty cells can be claimed</p>");
        }else if(window.curStep == 6){
            diagram_4();
            $("#status").html("<p>The game ends when all cells have been claimed and the board is filled up</p>");
        }else if(window.curStep == 7){
            diagram_5();
            $("#status").html("<p>At the end of the game, the board is divided up into groups of adjacent same colored cells.</p>");
        }else if(window.curStep == 8){
            diagram_6();
            $("#status").html("<p>In this example, the Orange player has 3 groups, and the Blue player has only one group.</p>");
        }else if(window.curStep == 9){
            diagram_7();
            $("#status").html("<p>How many groups does each player have in this position? Try to figure this out before clicking next.</p>");
        }else if(window.curStep == 10){
            diagram_7();
            $("#status").html("<p>If your answer is that both players have 2 groups, you're close, but not quite correct.</p>");
        }else if(window.curStep == 11){
            diagram_7();
            $("#status").html("<p>Both players have only one group. Remember that the center cell is special and belongs to Both players</p>");
        }else if(window.curStep == 12){
            emptyGrid();
            diagramPerimeter();
            $("#status").html("<p>There are 24 perimeter cells on this board. They play an important role.</p>");
        }else if(window.curStep == 13){
            emptyGrid();
            $("#status").html("<p>Notice that they are specially marked</p>");
        }else if(window.curStep == 14){
            diagram_8();
            $("#status").html("<p>At the end of the game, if there is a group on the board that contains less than 2 cells on the perimieter of the board, the entire group is given to the opponent</p>");
        }else if(window.curStep == 15){
            diagram_8();
            $("#status").html("<p>Therefore, it is important to make sure that each group contains at least 2 cells on the perimeter</p>");
        }else if(window.curStep == 16){
            diagram_9();
            $("#status").html("<p>In this case, Blue has 2 groups with fewer than 2 perimeter cells</p>");
        }else if(window.curStep == 17){
            diagram_9();
            $("#status").html("<p>Both groups have only one cell on the perimeter</p>");
        }else if(window.curStep == 18){
            diagram_9();
            $("#status").html("<p>These groups will be given to the opponent</p>");
        }else if(window.curStep == 19){
            diagram_11();
            $("#status").html("<p>SCORE CALCULATION</p>");
        }else if(window.curStep == 20){
            diagram_11();
            $("#status").html("<p>We are ready to learn how to calculate the score at the end of the game</p>");
        }else if(window.curStep == 21){
            diagram_11();
            $("#status").html("<p>To calculate the final score, we first deal with groups that have less than two perimeter cells</p>");
        }else if(window.curStep == 22){
            diagram_12();
            $("#status").html("<p>This group will be given to the Blue player because it contains only one cell on the perimeter</p>");
        }else if(window.curStep == 23){
            diagram_13();
            $("#status").html("<p>Next we count how many perimeter cells are owned by the blue player</p>");
        }else if(window.curStep == 24){
            diagram_14();
            $("#status").html("<p>The Blue player has 14 perimeter cells</p>");
        }else if(window.curStep == 25){
            diagram_15();
            $("#status").html("<p>The Orange player has 10 perimeter cells</p>");
        }else if(window.curStep == 26){
            diagram_15();
            $("#status").html("<p>One point is awarded for every cell owned on the perimeter</p>");
        }else if(window.curStep == 27){
            diagram_16();
            $("#status").html("<p>A reward is given for having fewer groups than your opponent. A penalty is given for having more groups than your opponent</p>");
        }else if(window.curStep == 28){
            diagram_16();
            $("#status").html("<p>For the player with fewer groups, for each extra group that the opponent has, a reward of 2 points is given</p>");
        }else if(window.curStep == 29){
            diagram_16();
            $("#status").html("<p>For the player with more groups, for each extra group, there is a penalty of 2 points</p>");
        }else if(window.curStep == 30){
            diagram_16();
            $("#status").html("<p>In this example the Blue player has 3 groups, and the Orange player has only 1 group. Therefore the Blue player has 2 more groups that Orange, and Orange has 2 fewer groups that Blue.</p>");
        }else if(window.curStep == 31){
            diagram_16();
            $("#status").html("<p>The Orange player will get a reward of 4 points, 2 points for each group</p>");
        }else if(window.curStep == 32){
            diagram_16();
            $("#status").html("<p>The Blue player will get a penalty of 4 points, 2 points for each extra group</p>");
        }else if(window.curStep == 33){
            diagram_16();
            $("#status").html("<p>Blue's final score is 14 points for owning 14 perimeter cells minus the penalty of having 2 more groups of 4 points = 10 total points</p>");
        }else if(window.curStep == 34){
            diagram_16();
            $("#status").html("<p>Orange's final score is 10 points for owning 10 perimeter cells plus the reward of having 2 fewer groups of 4 points = 14 total points</p>");
        }else if(window.curStep == 35){
            diagram_16();
            $("#status").html("<p>The final score is blue - 10 points, orange - 14 points. Therefore Orange wins by 4 points</p>");
        }else if(window.curStep == 36){
            diagram_17();
            $("#status").html("<p>Try to figure out the scores of both players in this example before clicking next.</p>");
        }else if(window.curStep == 37){
            diagram_17();
            $("#status").html("<p>Both players have the same score of 12 points!</p>");
        }else if(window.curStep == 38){
            diagram_17();
            $("#status").html("<p>To eliminate the possibility of draws, there is another rule.</p>");
        }else if(window.curStep == 39){
            diagram_18();
            $("#status").html("<p>At the beginning of each game, 5 cells are automatically randomly chosen and marked with a circle</p>");
        }else if(window.curStep == 40){
            diagram_18();
            $("#status").html("<p>The player who owns 3 or more of the marked cells at the end of the game gets an extra point</p>");
        }else if(window.curStep == 41){
            diagram_19();
            $("#status").html("<p>In this example, both players have 1 group, and own the same number of perimieter cells.</p>");
        }else if(window.curStep == 42){
            diagram_19();
            $("#status").html("<p>However, the blue player owns more marked cells than the orange player. So the blue player will be awarded an extra point.</p>");
        }else if(window.curStep == 43){
            diagram_19();
            $("#status").html("<p>The final score is 12 points for the orange player, and 13 points for the blue player. The blue player wins by 1 point!</p>");
        }else if(window.curStep == 44){
            diagram_20();
            $("#status").html("<p>Who do you think will get the extra point in this example?</p>");
        }else if(window.curStep == 45){
            diagram_20();
            $("#status").html("<p>At first it seems like the orange player owns more marked cells.</p>");
        }else if(window.curStep == 46){
            diagram_20();
            $("#status").html("<p>However, remember the rule that groups that do not contain at least 2 perimeter cells are given to the opponent?</p>");
        }else if(window.curStep == 47){
            diagram_20();
            $("#status").html("<p>The blue player owns 4 marked cells, and the organge player has only 1. The extra point will be given to the orange player</p>");
        }else if(window.curStep == 48){
            emptyGrid();
            $("#status").html("<p>PASSING</p>");
        }else if(window.curStep == 49){
            diagram_21();
            $("#status").html("<p>Quite often, the overall score has been completely decided and the board still has empty cells.</p>");
        }else if(window.curStep == 50){
            diagram_21();
            $("#status").html("<p>In this example, no matter what additional moves are made, the score will remain the same.</p>");
        }else if(window.curStep == 51){
            diagram_21();
            $("#status").html("<p>This is because all the edge cells have been acquired and it is not possible to connect or disconnect groups. Also all the marked cells have been acquired. The game is pretty much over.</p>");
        }else if(window.curStep == 52){
            diagram_21();
            $("#status").html("<p>In order to not waste time filling in empty cells, it is possible to speed up the process. Instead of playing a move, a pass can be played. When both players pass consecutively, the game ends.</p>");
        }else if(window.curStep == 53){
            diagram_22();
            $("#status").html("<p>To eliminate ambiguity, the empty cells are given to the orange player.</p>");
        }else if(window.curStep == 54){
            diagram_22();
            $("#status").html("<p>In this example the blue player wins 13 - 12</p>");
        }else if(window.curStep == 55){
            diagram_22();
            $("#status").html("<p>Congratulations! Now you know all of the rules, and are ready to play!</p>");
        }

        refreshBoard();
        window.marks.forEach(function(loc){
            markLastMove(loc[0], loc[1], loc[2]);
        });
        window.specialCells.forEach(function(loc){
            markSpecial(loc[0], loc[1], loc[2]);
        });

    }

    function nextStep(){
        window.curStep += 1;
        if(window.curStep > 56) window.curStep = 56;
        showStep();
    }

    function prevStep(){
        window.curStep -= 1;
        if(window.curStep < 1) window.curStep = 1;
        showStep();
    }
	
    $("#btn_next").click(nextStep);
    $("#btn_prev").click(prevStep);

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
		console.log('window.grid["'+coord[0]+':'+coord[1]+'"] = 1;');
		refreshBoard();
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

