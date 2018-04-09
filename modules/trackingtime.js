var request = require('request');
var fs = require('fs');
var exports = module.exports = {};

exports.name = "Trackingtime";
exports.newConnection = function(){
    sendTrackedTasks();
    return true;
}

const apiUrl = "https://app.trackingtime.co/api/v4/";
const useragent = "Kvalifik Dashboard. (services@kvalifik.dk)";
const username = "username";
const password = "password"
var auth = {'user': username, 'pass' : password};
var headers = {
    'User-Agent':useragent
}

function sendTrackedTasks(){
    request({'url':apiUrl+'tasks', qs: {'filter' : "TRACKING"}, 'headers' : headers, 'auth':auth}, (error, response, body)=>{
        var parsed = JSON.parse(body);
        var data = parsed.data;
        var toSend = []
        data.forEach((task) => {
            taskData = {
                'taskName' : task['name'],
                'project':task['project'],
                'customer':task['customer'],
            };
            var taskUser = task['user'];
            //We need to handle users helping with shared tasks
            if(task.users !== undefined && task.users.length > 1 ){
                task.users.forEach((user) => {
                    if(user['event']){

                    }
                });
            }
            taskData.user = {
                'name':taskUser['name'],
                'surname':taskUser['surname'],
                'avatarurl':taskUser['avatar_url']
            };
            toSend.push(taskData);
        });
        global.sendToDash({'event' : 'trackingUsers', 'data' : toSend});
    });

}
setInterval(sendTrackedTasks, 60000)
