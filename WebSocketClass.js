/**
 * Created by jackson on 2017/12/29.
 */
/**
 *
 * @param stream_secret String forms part on the url where stream will be received
 * @param this.stream_port Int the port where the stream will be received
 * @param this.websocket_port Int the port where the stream will be relayed to
 * @constructor
 */
function WebsocketRelay(stream_secret, stream_port,websocket_port){
    this.fs = require('fs');
    this.http = require('http');
    this.WebSocket = require('ws');
    this.stream_secret = stream_secret;
    this.stream_port = stream_port;
    this.websocket_port  = websocket_port;
    this.socketServer = new this.WebSocket.Server({port: this.websocket_port, perMessageDeflate: false})
    this.socketServer.connectionCount = 0
    this.socketServerConnectionInformation = function () {
        console.log('Setting up connection information')
        this.socketServer.on('connection',function (socket, upgradeReq) {
            console.log(
                'New WebSocket Connection: ',
                (upgradeReq || socket.upgradeReq).socket.remoteAddress,
                (upgradeReq || socket.upgradeReq).headers['user-agent'],
                '('+this.socketServer.connectionCount+' total)'
            );
            socket.on('close', function(code, message){
                this.socketServer.connectionCount--;
                console.log(
                    'Disconnected WebSocket ('+this.socketServer.connectionCount+' total)'
                );
            });
        })
        console.log('Done')
    };
    
    this.socketServerBroadcast = function () {
        console.log('Setting up Broadcast')
        this.socketServer.broadcast = function(data) {
            this.socketServer.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        };
        console.log('Done')
    };

    this.startListener = function () {
        console.log('Starting Lister')
        // this.http Server to accept incomming MPEG-TS Stream from ffmpeg
        var streamServer = this.http.createServer( function(request, response) {
            var params = request.url.substr(1).split('/');

            if (params[0] !== this.stream_secret) {
                console.log(
                    'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
                    request.socket.remotePort + ' - wrong secret.'
                );
                response.end();
            }

            response.connection.setTimeout(0);
            console.log(
                'Stream Connected: ' +
                request.socket.remoteAddress + ':' +
                request.socket.remotePort
            );
            request.on('data', function(data){
                socketServer.broadcast(data);
                if (request.socket.recording) {
                    request.socket.recording.write(data);
                }
            });
            request.on('end',function(){
                console.log('close');
                if (request.socket.recording) {
                    request.socket.recording.close();
                }
            });

            // Record the stream to a local file?
            // if (RECORD_STREAM) {
            //     var path = 'recordings/' + Date.now() + '.ts';
            //     request.socket.recording = fs.createWriteStream(path);
            // }
        }).listen(this.stream_port);

        console.log('Listening for incomming MPEG-TS Stream on http://127.0.0.1:'+this.stream_port+'/<secret>');
        console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+this.websocket_port+'/');

    }

    this.initiateService = function(){
        this.socketServerConnectionInformation()
        this.socketServerBroadcast()
        this.startListener()
    }
}


var test = new WebsocketRelay('supersecret',8081,8082)
test.initiateService()



