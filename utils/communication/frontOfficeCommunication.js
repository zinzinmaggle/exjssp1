import Communication from './communication.js';
import { io } from '../../server.js'

class FrontOfficeCommunication extends Communication {
    constructor(type){
        super(type);

        this.topic = null;
        this.message = null;
    }

    listen(){
        console.log("Implemented but no job to do.")
    }

    setMessage(message){
        this.message = message;
    }

    setTopic(topic){
        this.topic = topic;
    }

    publish(){
        io.emit(''+this.topic+'', this.message.toLocaleString());
    }
    
}
//.toLocaleString()
let t = new FrontOfficeCommunication("IO");
module.exports = t;