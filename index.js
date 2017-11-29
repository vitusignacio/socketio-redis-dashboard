const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const redis = require('redis').createClient();

redis.subscribe('user-created');

app.get('/', (req, res) => {
    res.send('<h1>Simple Socket.IO Server welcomes you.</h1>');
});

io.on('connection', (client) => {
    console.log('client connected...');
    redis.on('message', function(channel, message) {
        console.log(channel + ' | ' + message);
        client.emit('user-created', message);
    });
});

let nsp = io.of('/internal');
nsp.on('connection', _ => {
    console.log('client connected to internal...');
});

http.listen(3030, _ => {
    console.log('listening on 3030...');
});