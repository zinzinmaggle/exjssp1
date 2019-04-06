import Communication from './communication.js';
import FrontOfficeCommunication from './frontOfficeCommunication.js';
import BinaryMessages from '../../enums/binaryMessages.js'
import Communications from '../../enums/communications.js'
import Badges from '../../enums/badges.js'
import { mqtt } from '../../server.js'

class PingCommunication extends Communication {
    constructor(type,topic, message) {
        super(type,topic,message);  
        this.intervalId = null;
        this.stack = [];
        this.init();
    }

    init(){
        super.subscribe();
        this.initPing();
        super.listen(this.executeListen());  
    }
   
    executeListen(){
        return (topic,message) => { 
            this.stack.push(message.toLocaleString());
            let t = '';
            if(this.stack.length == 5){
                // TODO : Remplacer ça par une fonction dans l'enum'
                let offline = this.stack[0] === BinaryMessages.ping && this.stack[1] === BinaryMessages.ping && this.stack[2] === BinaryMessages.ping && this.stack[3] === BinaryMessages.ping && this.stack[4] === BinaryMessages.ping;
                let warning = this.stack[0] === "#####" || this.stack[1]==="#####" ||  this.stack[2]==="#####" ||  this.stack[3]==="#####" ||  this.stack[4]==="#####";
                
                if(offline){
                    t = Badges.OFFLINE.DEVICE_OFFLINE.badge;
                }else if(warning){
                    t=  Badges.WARNING.ERRONEOUS_DATA.badge;
                }else{
                    t = Badges.ONLINE.DEVICE_ONLINE.badge;
                }
                //
                this.stack = [];
                new FrontOfficeCommunication(Communications.IO.communication, topic, t).publish();
            }    
        }
    }
    publish(){
        return () => {
            if(super.checkClient()){
                this.displayWarning();
            }else{
                super.publish(this.executePublish());
            }
        }
    }
    executePublish(){
        return (topic,message) => {
            mqtt.publish(topic, message);
            console.log("published ping : " + message.toLocaleString() +", on topic : " + topic + " at " + new Date());
        }      
    }
    initPing(){
        this.intervalId = setInterval(this.publish(), 3000);
    }
    

    getIntervalId(){
        return this.intervalId;
    }

    displayWarning(){
        new FrontOfficeCommunication(Communications.IO.communication,this.topic,Badges.WARNING.BROKER_OFFLINE.badge).publish();
    }
}

module.exports = PingCommunication;