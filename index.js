// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
//
// app.get('/', function (req,res) {
//     res.sendFile(__dirname+'/index.html');
// });
//
// io.on('connection', function (socket) {
//     console.log('one user connected ' + socket.id);
//     socket.on('chat message', function (data) {
//         io.emit('chat message', socket.id + ' ' + data)
//     });
//
//     socket.on('disconnect', function () {
//         console.log('one user disconnected ' + socket.id)
//     })
// });
//
//
// http.listen(3000, function () {
//     console.log('server listening on port 3000');
// });

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req,res) {
    res.sendFile(__dirname+'/index.html');
});

var waitingPlayers = [];

function try_pair() {
    if (waitingPlayers.length >= 2) {
        var a = waitingPlayers.pop();
        var b = waitingPlayers.pop();

        console.log('started game ' + a + ' vs ' + b);
        io.to(a).emit('game found', b, Date.now() + 1000, "red");
        io.to(b).emit('game found', a, Date.now() + 1000, "blue");
    }
}

io.on('connection', function (socket) {
    console.log('one user connected ' + socket.id);

    // socket.on('chat message', function (data) {
    //     io.emit('chat message', socket.id + ' ' + data)
    // });
    socket.on('find game', function () {
        console.log('snake ' + socket.id + ' waiting for opponent');
        waitingPlayers.push(socket.id);
        try_pair();
    });

    socket.on('move left', function (token) {
        io.to(token).emit('opp move left');
    });

    socket.on('move right', function (token) {
        io.to(token).emit('opp move right');
    });

    socket.on('send ping', function () {
       io.to(socket.id).emit('responce ping');
    });

    socket.on('disconnect', function () {
        console.log('one user disconnected ' + socket.id)
    })
});


http.listen(3000, function () {
    console.log('server listening on port 3000');
});

