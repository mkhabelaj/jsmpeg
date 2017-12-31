/**
 * Created by jackson on 2017/12/31.
 */
var WebSocketRelay = require('./WebSocketClass'),
    sh = require('sh');
var element = process.argv[2];
element = JSON.parse(element);
test = new WebSocketRelay.WebSocketRelay(element.stream_secret,element.stream_port, element.websocket_port)
test.initiateService();
