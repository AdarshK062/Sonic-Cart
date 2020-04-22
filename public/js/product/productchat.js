$(document).ready(function(){
    var socket = io();
    $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
    $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
    var room= $('#productName').val();
    var sender= $('#sender').val();
    var userPic = $('#name-image').val();
    socket.on('connect',function(){
        var params = {
            room: room,
            name: sender
        }
        socket.emit('join',params, function(){
             //console.log('User joined a channel');
        });
    });

    socket.on('usersList', function(users){
        var ol=$('<ol></ol>');
        for (var i=0;i<users.length;i++){
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }

        $(document).on('click','#val', function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr("href", "/profile/"+$(this).text());
        });

        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });

    //shift functions
    socket.on('newMessage', function(data){
        var template=$('#message-template').html();
        var message=Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });
        $('#messages').append(message);
    });

    $('#message-form').on('submit', function(e){
        e.preventDefault();
        var msg=$('#msg').val();
        $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
        $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
        socket.emit('createMessage', 
            {
            text: msg,
            room: room,
            from: sender,
            userPic: userPic
            }, 
            function(){
                $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
                $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
                $('#msg').val('');
            });

        $.ajax({
            url: '/product/'+room,
            type: 'POST',
            data: {
                message: msg,
                productName: room
            },
            success: function(){
                $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
                $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
                $('#msg').val('');
            }
        })
    });

    socket.on('newIssue', function(data){
        var template=$('#issue-template').html();
        var message=Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });
        $('#issues').append(message);
    });

    $('#issue-form').on('submit', function(e){
        e.preventDefault();
        var iss=$('#iss').val();
        $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
        $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
        socket.emit('createIssue', 
            {
                text: iss,
                room: room,
                from: sender,
                image: userPic
            }, 
            function(){
                $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
                $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
                $('#iss').val('');
            });

        $.ajax({
            url: '/product/'+room,
            type: 'POST',
            data: {
                issue: iss,
                productName: room
            },
            success: function(){
                $("#mydiv1").scrollTop($("#mydiv1")[0].scrollHeight);
                $("#mydiv2").scrollTop($("#mydiv2")[0].scrollHeight);
                $('#iss').val('');
            }
        })
    });
});