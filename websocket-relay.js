// Use the websocket-relay to serve a raw MPEG-TS over WebSockets. You can use
// ffmpeg to feed the relay. ffmpeg -> websocket-relay -> browser
// Example:
// node websocket-relay yoursecret 8081 8082
// ffmpeg -i <some input> -f mpegts http://localhost:8081/yoursecret
// https://www.npmjs.com/package/sh

var WebSocketRelay = require('./WebSocketClass'),
	sh = require('sh');

var data = [
	{
		"stream_secret":"supersecret",
		"stream_port":8081,
		"websocket_port":8082,
		"program_name":"test",
		"descriptor":"test"
	},
	{
		"stream_secret":"supersecret",
		"stream_port":5000,
		"websocket_port":5001,
		"program_name":"webc",
		"descriptor":"webc"
	}
];
/**
 * gets data config from array, an initiates a new screen and starts the web socket
 * server
 */

if (process.argv[2]){
    data = process.argv[2];
}else{
    console.log("Input is incorrect, the input should be an array of objects example");
    console.log("node websocket-relay.js ",data);
}
data.forEach(function (element) {
 	var program_name = element.program_name;
 	var descriptor = element.descriptor;
 	element = JSON.stringify(element);
 	element = "'"+ element +"'";
	 sh('initiate_screen.sh '+program_name+' '+descriptor+' '+ element );
 });