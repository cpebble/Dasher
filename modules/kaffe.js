// Basic Module demonstration
var exports = module.exports = {};

exports.name = "KaffeLog";
exports.newConnection = function(){
    global.sendToDash({'event' : 'kaffeCount', 'kaffeCount' : kaffeKopper});
    return true;
}
exports.events = ['kaffe', 'kaffeDrukket'];
exports.recieve= (data) => {
    switch(data.event){
        case 'kaffe':
            global.sendToDash({'event' : 'kaffeCount', 'kaffeCount' : kaffeKopper});
            console.log('[Kaffe] Antal kaffekopper drukket: ', kaffeKopper);
            break;
        case 'kaffeDrukket':
            console.log("[Kaffe] Varm ekstase i min mave");
            kaffeKopper++;
            break;
        default: break;
    }
};
var kaffeKopper = 0;



// setInterval(()=>{kaffeKopper++; global.sendToDash(kaffeKopper)}, 500);
