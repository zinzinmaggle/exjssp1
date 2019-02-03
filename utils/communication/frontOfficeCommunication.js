import Communication from './communication.js';
import { io } from '../../server.js'

class FrontOfficeCommunication extends Communication {
    constructor(type,topic, message){
        super(type,topic,message);
    }
    publish(){
        super.publish(this.executePublish(), this.type);
    }
    executePublish(){
        return (topic,message) => {
            io.emit(''+topic+'', message.toLocaleString());
        }
    }
}
module.exports = FrontOfficeCommunication;