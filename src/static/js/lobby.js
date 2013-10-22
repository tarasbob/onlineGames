 $('document').ready(function() {
    function refreshGames(){
        $.get("command", {"cmd_text": "getgames"}, function(data){
            for(var i=0; i<data.inProgress.length; i++){


            }
                

            }
        }, "json");
    }
    setInterval(refreshGames, 1000);

    $("#logout").click(function(){
        $.get("command", {"cmd_text": "logout"});
    });

});

