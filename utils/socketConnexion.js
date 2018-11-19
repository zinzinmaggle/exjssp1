import {io} from '../server.js'
class SocketConnexion {
    constructor(mqttId, message){
       this.mqttId = mqttId;
       this.message = message;
    }

    emit(){
        return io.emit(''+this.mqttId+'', this.message.toLocaleString());
    }
}

module.exports = SocketConnexion;