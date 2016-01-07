$(function(){

    $("#btn_start").click(function() {
        var player_name = $("#player_name").val();
        var boardsize = $("#boardsize").val();
        var handicap = $("#handicap").val();
        var time_init = $("#time_init").val();
        var time_added = $("#time_added").val();

        if(!(2 < boardsize && boardsize < 16)){
            boardsize = 11;
        }
        
        if(!(0 < handicap && handicap < 100)){
            handicap = 0;
        }

        if(!(0 < time_init && time_init < 2000)){
            time_init = 30;
        }

        if(!(0 <= time_added && time_added < 2000)){
            time_added = 30;
        }

        data = {"player_name": player_name,
                "board_size": boardsize,
                "handicap": handicap,
                "time_init": time_init,
                "time_added": time_added}

        // send request to server
        $.get('create_game', data, function(response) { 
            if (response == "success") {
                 window.location.href = "/game";
            } else {
                window.location.href = "/";
            }
        });

    });

    $("#newGameModal").modal('show');
});
