// This module keeps track of the different modules talking to our dashboard
var exports = module.exports = {};

var modules = []; //This array will keep track of which modules are connected
exports.addModule = function(modName){
    var newModule = require(`./modules/${modName}`);
    if(newModule.name !== undefined)
        console.log(`[Module] Started loading ${newModule.name}`);
    else
        return false;


    modules.push(newModule);
    console.log(`[Module] Loaded ${newModule.name}`);
    return true;
};
exports.newConnection = function(socket){
    modules.forEach(function(mod){
        if (mod.newConnection !== undefined && !mod.newConnection())
        {
            console.log("[Module] Failed to respond correctly to new connection: "+mod.name);
        }
        else{
            console.log(`[Module] Responded to new connection: ${mod.name}`)
        }
    });
}
exports.incoming = (data) =>{
    console.log("[Module] Incoming packet with event: "+data.event)
    modules.forEach((mod)=>{
        if(mod.events && mod.events.indexOf(data.event) >=0){
            mod.recieve(data);
            console.log(`[Module] Event recieved by module ${mod.name}`);
        }
    });
}
function sendTo(msg){
    console.log("[Module] Tried to send: "+msg);
}
