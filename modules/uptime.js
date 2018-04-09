var exports = module.exports = {};
var request = require('request');

exports.name = "Uptime"
exports.newConnection = function(){
    getUptime();
    return true;
}

var uptimeUrl = "http://kvalifik.dk/uptime";

function getUptime(){
    request(uptimeUrl, (err, res, body) => {
        // console.log('[Uptime] :',err,res,body);
        if(body)
            global.sendToDash({event: "uptime", uptime: body, isUp: true});
        else {
            global.sendToDash({event: "uptime", uptime: "", isUp: false});
        }
    });
}
setInterval(getUptime, 60000);
