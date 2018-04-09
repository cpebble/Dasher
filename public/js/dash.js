var socket = io.connect('http://10.250.56.194:8080');

function kaffeDrukket(){
    console.log('sending event')
    socket.emit('moduleUpdate', {event: 'kaffeDrukket'});
    socket.emit('moduleUpdate', {event: 'kaffe'});

}

socket.on('update', (data)=>{
    console.log(data);
    switch (data.event) {
        case "kaffeCount":
            $('#kaffe').text(data.kaffeCount);
            break;
        case "uptime":
            if(data.isUp)
                $('#uptime').text(data.uptime);
            break;
        case "trackingUsers":
            addUsers(data.data);
            break;
        case "mopidyStatus":
            updateMopidyStatus(data.data);
            break;
        case "mopidyImage":
            $(".musicInfo#art").attr('src', data.data.uri);
            break;
        case "piStats":
            showStats(data.data);
            break;
        case "sysinfo":
            updateLiveStats(data);
            break;
        default:
            break;

    }
});

// Show Stats
function showStats(data){
    $(".piStats#cpu").text(data.CPU[0].toString().substring(0,5))

    $(".piStats#mem").text(formatMem(data.MEM.free, data.MEM.total));
}


// LIVE-SITES
var liveUptime = 0;
var cpuStats = [];
setInterval(()=>{
    liveUptime++;
    $(".live-sites#uptime").text("Uptime: "+liveUptime + " Sekunder");
},1000);

function updateLiveStats(data){
    switch (data.type) {
        case 'cpu':
            cpuStats.push(data.cpuLoad[0]);
            $(".live-sites#cpuLoad").text(`Load: ${data.cpuLoad[0]}`)
            break;
        case "uptime":
            liveUptime = Math.floor(data.uptime.raw);
            break;
        default:

    }
}


function formatMem(free, total){
    let used = Math.ceil((total - free)/1000/1000)
    let newTotal= Math.ceil(total / 1000 / 1000);
    return `${used}MB / ${newTotal}MB`
}
// MOPIDY
function updateMopidyStatus(mopidyStatus){
    $(".musicInfo#name").text(mopidyStatus.song);
    $(".musicInfo#album").text(mopidyStatus.album);
    $(".musicInfo#artist").text(mopidyStatus.artist);
    console.log(mopidyStatus);
}

// TRACKING USERS
// <li>
//         <h4>August "Lækre" Gjede</h4>
//         <img src="" height="50px" width="50px" />
//         <p>Din Hørespecialist:<span>01:35</span></p>
// </li>
function addUsers(data){
    $("#users").empty();
    data.forEach((task)=>{
        var listElement = `
        <li>

            <img src="${task.user.avatarurl}" height="75px" width="75px" />
            <div class="test">
	            <h4>${task.user.name} ${task.user.surname}</h4>
    	        <p>${task.project} - ${task.taskName}</p>
    	    </div>
        </li>`
        $("#users").append(listElement);
    });
}
