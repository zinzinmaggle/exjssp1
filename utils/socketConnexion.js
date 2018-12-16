import {io} from '../server.js'

let instance = null;
class SocketConnexion {
    constructor(mqttId, message){
        if(instance){
            return instance;
        }

        instance = this;
    }

    emit(destination,message){
        return io.emit(''+destination+'', message.toLocaleString());
    }

}
let _socketC = new SocketConnexion();
Object.freeze(_socketC);
module.exports = _socketC;