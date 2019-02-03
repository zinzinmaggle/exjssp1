import Communications from '../../enums/communications.js'
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
        mqtt.on('message',  (topic, message) => {
            _executeListen(topic, message);
        });
    }

    publish(executePublish,type){
        let _executePublish = executePublish;
        let _topic = this.topic;
        let _message = this.message;
        if(type === Communications.IO.communication){
                _executePublish(_topic,_message);
        }else {
            mqtt.publish(_topic, _message, function(err){
                _executePublish(_topic,_message);
            });
        }
    }
}

module.exports = Communication;