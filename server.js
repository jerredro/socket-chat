const express = require("express");
const app = express();
app.use(express.static(__dirname + "./static"));
const server = app.listen(1337, function(){})
const io = require('socket.io')(server);

app.set('views', (__dirname, './views'));
app.set('view engine', 'ejs');

var id = 0;
var messages = {};
var users = {};

io.sockets.on('connection', function (socket) {
    socket.on("got_new_user", function(data) { 
        users[socket.id] = {name: data.name};
        socket.emit("existing_messages", messages);
        io.emit("display_new_user", {name: data.name});
    });  
    socket.on("new_message", function(data) {
        messages[id] = {name: data.name, message: data.message};
        io.emit("update_messages", messages[id]);
        id++;
    });
});

app.get('/', function(req, res) {
      res.render('index');
})