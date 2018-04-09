var os = require('os');
var exports = module.exports = {};

exports.name = "PiPerformance";
exports.newConnection = function(){
    global.sendToDash({'event' : 'piStats' , data : piStats});
    return true;
}

piStats = {
    CPU : os.loadavg(),
    MEM : {
        total : os.totalmem(),
        free : os.freemem()},
    UPTIME : os.uptime()
};

setInterval(()=>{
    piStats = {
        CPU : os.loadavg(),
        MEM : {
            'total' : os.totalmem(),
            'free':os.freemem()},
        UPTIME : os.uptime()
    };
    global.sendToDash({'event' : 'piStats', data : piStats});
}, 500);
