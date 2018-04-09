/* jshint esversion: 6 */
/* Kvalifik dashboard; Initial author: @ChristianPåbøl */
const express = require('express');
var app = express();
const path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server, {origins: ['*',"*:8080", "localhost:8080"]});
var bodyParser = require('body-parser');

//Handle modules
var mm = require('./moduleMan.js');
mm.addModule('kaffe.js');
// mm.addModule('uptime.js'); --DEPRECATED
mm.addModule('trackingtime.js');
mm.addModule('mopidy.js');
mm.addModule('piPerformance.js');
mm.addModule('live-sites.js');

// Start listening for http connections
server.listen(8080, ()=>{
    console.log("[App]Server listening on port 8080");
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use ejs.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Show the dashboard
app.get('/', function(req, res){
    console.log('[App] tried to get '+req.url);
    res.render('index');
});

io.on('connection', function (socket) {
    mm.newConnection(socket);
    socket.on('moduleUpdate', (data)=>{mm.incoming(data);});

});
global.sendToDash = (msg)=>{
    console.log("[App] sent msg to dash: "+msg.event);
    io.sockets.emit('update', msg);

}
