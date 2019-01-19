import Communication from './communication.js';
import { mqtt } from '../../server.js'
import FrontOfficeCommunication from './frontOfficeCommunication.js';

class PingCommunication extends Communication {
    constructor(type,topic, message){

        
        super(type);
        this.topic = topic;
        this.message = message;
        this.intervalId = null;

        this.subscribe();
        this.initPing();
        this.listen();

    }

   
    checkClient(){
        let _verification_connexion_mqtt = !mqtt.connected  || mqtt.reconnecting;
        if(_verification_connexion_mqtt){
            FrontOfficeCommunication.setTopic(this.topic);
            FrontOfficeCommunication.setMessage("{\"badge\":\"WARNING\", \"message\":\"L\'application ne parvient pas à se connecter au broker MQTT\"}");
            FrontOfficeCommunication.publish();
        }
    }
   

    subscribe(){
        this.checkClient();
        mqtt.subscribe(this.topic);
    }

    listen(){
       let stack = [];
       mqtt.on('message', function (topic, message) {
            stack.push(message.toLocaleString());
            let t = '';
            if(stack.length === 5){
                console.log(stack);
                let offline = stack[0] === "###" && stack[1] === "###" && stack[2] === "###" && stack[3] === "###" && stack[4] === "###";
                let warning = stack[0] === "#####" || stack[1]==="#####" ||  stack[2]==="#####" ||  stack[3]==="#####" ||  stack[4]==="#####";
                if(offline){
                    console.log("OFFLINE");
                    t = "{\"badge\":\"OFFLINE\", \"message\":\"Vérifier que l\'objet est allumé ou qu'il dispose d\'une connexion internet. Il peut s\'agir d\'une panne matériel.\"}";
                }else if(warning){
                    t= "{\"badge\":\"WARNING\", \"message\":\"Les données fournies par l\'objet sont éronnées.\"}";
                }else{
                    console.log("ONLINE");
                    t = "{\"badge\":\"ONLINE\", \"message\":\"Transmission des données...\"}";
                }
                stack = [];

                FrontOfficeCommunication.setTopic(topic);
                FrontOfficeCommunication.setMessage(t);
                FrontOfficeCommunication.publish();
            }    
       });
    }

    publish(){
        let _t = this;
        this.checkClient();
        mqtt.publish(_t.topic, _t.message, function(err){
            if(err){
                FrontOfficeCommunication.setTopic(_t.topic);
                FrontOfficeCommunication.setMessage("{\"badge\":\"WARNING\", \"message\":\"Une erreur est survenue lors de la publication du ping. Veuillez vérifier que le broker MQTT est en ligne.\"}");
                FrontOfficeCommunication.publish();
            }else{
                console.log("published ping : " + _t.message +", on topic : " + _t.topic + " at " + new Date());
            }
        });
    }

    initPing(){
        let _t = this;
        this.intervalId = setInterval(function(){
            _t.publish();
        }, 3000);
    }

    getIntervalId(){
        return this.intervalId;
    }
}

module.exports = PingCommunication;