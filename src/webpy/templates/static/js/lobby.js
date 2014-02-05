 $('document').ready(function() {
    function refreshGames(){
        $.get("command", {"cmd_text": "getgames"}, function(data){
            $('#gameTable tbody').remove();
            $('#gameTable').append("<tbody></tbody>");
            for(var i=0; i<data.waitingGames.length; i++){
                $('#gameTable tbody').append('<tr><td><button class="btn btn-link" data-gname="'+data.waitingGames[i]+'">'+data.waitingGames[i]+'</button><td><td>10 min</td></tr>');
            }
                
        }, "json");
    }
    refreshGames();
    setInterval(refreshGames, 10000);

    $("canv-div")

    $("#logout").click(function(){
        $.get("command", {"cmd_text": "logout"});
        window.location = "/";
    });

    $("#btn-create").click(function(){
        var gname = $("#description").val();
        var bsize = $("#bsize").val();
        $.get("command", {"cmd_text": "create", 
            "gname": gname, "bsize": bsize}, function(){
            window.location = "/";
        });
    });

    $('#gameTable').on('click', '.btn-link', function(){
        ($(this).attr("data-gname"));
        $.get("command", {"cmd_text": "join", "gname": $(this).attr("data-gname")}, function(){
            window.location = "/";
        });
    });

});

