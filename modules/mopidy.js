var exports = module.exports = {};

var Mopidy = require("mopidy");
var mopidy = new Mopidy({'webSocketUrl' : "ws://localhost:6680/mopidy/ws/", "callingConvention" : "by-position-or-by-name" });

exports.name = "MopidyClient";
exports.newConnection = function(){
    global.sendToDash({'event': 'mopidyStatus', "data" : mopidyStatus})
    return true;
};

var mopidyStatus = {'song' : "Undefined", 'album' : 'Undefined album', 'artist' : 'Undefined Kunstner', "playNext" : {'song' : "Undefined next", 'album' : 'Undefined next album', 'artist' : 'Undefined next Kunstner'}};

mopidy.on("state:online", ()=>{
    console.log("[Mopidy] Mopidy Server online");
    mopidy.playback.getCurrentTrack()
      .done(updateMopidyStatus);
});
mopidy.on("event:trackPlaybackStarted", ()=>{
    console.log("[Mopidy] New track started");
    mopidy.playback.getCurrentTrack().done(updateMopidyStatus);
});
//mopidy.on(console.log.bind(console));
function updateMopidyStatus(track){
    if(track){
        mopidyStatus.song = track.name;
        mopidyStatus.album = track.album.name;
        mopidyStatus.albumArt = (track.album.images ? track.album.images[0] : "No image");
        mopidyStatus.artist = (track.album.artists ? track.album.artists[0].name : track.artists[0]);
        mopidyStatus.uri = track.uri;
        mopidy.library.getImages({'uris' : [mopidyStatus.uri]}).done(
            (images)=>{
                for (var image in images){
                    global.sendToDash({'event':'mopidyImage', 'data' : {"uri" : images[image][0].uri}});
                }
            });


    }
    else{
        mopidyStatus.song = "Not playing";
        mopidyStatus.album = "Null";
        mopidyStatus.artists = "No artists";
    }
    global.sendToDash({'event' : 'mopidyStatus', data : mopidyStatus});
    // mopidy.tracklist.nextTrack({"tl_track": JSON.stringify(track)})
    //   .done(updateMopidyStatusNext);
}
function updateMopidyStatusNext(track){
    if(track){
        mopidyStatus.playNext.song = track.name;
        mopidyStatus.playNext.album = track.album.name;
        mopidyStatus.playNext.artist = track.album.artists[0].name;
    }
    else{
        mopidyStatus.playNext.song = "Not playing";
        mopidyStatus.playNext.album = "Null";
        mopidyStatus.playNext.artists = "No artists";
    }
    global.sendToDash({'event' : 'mopidyStatus', data : mopidyStatus});
}
