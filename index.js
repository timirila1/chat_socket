var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    var login = 'anon';

    socket.on("new user login", function(userLogin){
        if(userLogin !== '') {
            login = userLogin;
        }

        socket.emit("welcome", {name: login});

        socket.broadcast.emit("new user", {name: login});

        socket.on("from user message", function(text){
            io.emit('from server message', {msgtxt: text, name: login});
        });

        socket.on("disconnect", function(){
            io.emit("some user disconnect", {name: login});
        });

    });
    
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
