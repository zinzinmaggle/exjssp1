import Communications from '../../enums/communications.js'
import Communication from './communication.js';
import FrontOfficeCommunication from './frontOfficeCommunication.js';

class DataCommunication extends Communication {
    constructor(type,topic, message){
        super(type,topic,message);
        this.init();
    }
    init(){
        super.subscribe();
        super.listen(this.executeListen());
    }
   
    executeListen(){
        return (topic,message) => {
            new FrontOfficeCommunication(Communications.IO.communication,topic,message).publish();
        }
    }

    executePublish(){
        return (command, topic) => {
            console.log("published  command : " + command +", on topic : " + topic + " at " + new Date());
        }
    }
    publish(){
        super.publish(this.executePublish());
    }
}

module.exports = DataCommunication;