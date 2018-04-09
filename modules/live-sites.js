var request = require('request');

var exports = module.exports = {};

exports.name = "Live-sites";
exports.newConnection = ()=>{
    sendStats();
    return true;
};

var apiUrl = "http://sysinfo.live.kvalifik.dk/";
var password="password";

var stats = ['cpu','mem','uptime']

function reqStat(stat, callback){
    request.post(apiUrl+stat+".php", {form: {'auth' : password}}, callback);
}

function sendStats(){ //Send all stats. Should only be used on new connection;
    reqStat('cpu', (err, res, bod)=>{
        var _cpu = JSON.parse(bod);
        global.sendToDash({event: 'sysinfo', type : 'cpu', cpuLoad : _cpu});
    });
    reqStat('uptime', (err, res, bod)=>{
        var _uptime = JSON.parse(bod)
        global.sendToDash({event: 'sysinfo', type : 'uptime', uptime : _uptime });
    });
}


setInterval(()=>{
    reqStat('uptime', (err, res, bod)=>{
        var _uptime = JSON.parse(bod)
        global.sendToDash({event: 'sysinfo', type : 'uptime', uptime : _uptime });
    });
}, 900000 ); // How often to refresh uptime (900000 == 15min)

setInterval(()=>{
    reqStat('cpu', (err, res, bod)=>{
        var _cpu = JSON.parse(bod);
        global.sendToDash({event: 'sysinfo', type : 'cpu', cpuLoad : _cpu[0]});
    });
}, 60000 ); // How often to refresh cpu load(60000 == 1min)
