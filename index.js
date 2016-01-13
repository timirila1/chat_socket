var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

    var login = "anon";

    socket.on("new user login", function(userLogin){
        if(userLogin !== '') {
            login = userLogin;
        }

        socket.emit("welcome", {login: userLogin});

        socket.broadcast.emit("new user", {login: userLogin});

        socket.on("from user message", function(text){
            io.emit('from server message', {msgtxt: text, login: userLogin});
        });

        socket.on("disconnect", function(){
            io.emit("some user disconnect", {login: userLogin});
        });
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
