import { mqtt } from '../../server.js'

class Communication {
    constructor(type,topic,message){
        this.type = type;
        this.topic = topic;
        this.message = message;
    }

    checkClient(){
        return !mqtt.connected  || mqtt.reconnecting;
    }

    subscribe(){
        mqtt.subscribe(this.topic);    
    }

    listen(executeListen){
        let _executeListen = executeListen;
        mqtt.on('message',  _executeListen);
    }

    publish(executePublish){
        executePublish(this.topic, this.message);
    }
}

module.exports = Communication;