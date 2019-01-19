import Communication from './communication.js';
import { mqtt } from '../../server.js'
import FrontOfficeCommunication from './frontOfficeCommunication.js';

class DataCommunication extends Communication {
    constructor(type,topic, message){
        super(type);
        this.topic = topic;
        this.message = message;
    }

    checkClient(){
        let _verification_connexion_mqtt = !mqtt.connected  || mqtt.reconnecting;
        if(_verification_connexion_mqtt){
            //SocketConnexion.emit(this.topic, "{\"badge\":\"WARNING\", \"message\":\"L\'application ne parvient pas à se connecter au broker MQTT\"}");
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
       mqtt.on('message', function (topic, message) {
            FrontOfficeCommunication.setTopic(topic);
            FrontOfficeCommunication.setMessage(message);
            FrontOfficeCommunication.publish();
       });
    }

    publish(){
        this.checkClient();
        mqtt.publish(this.topic, this.message, function(err){
            if(err){
                FrontOfficeCommunication.setTopic(this.topic);
                FrontOfficeCommunication.setMessage("{\"badge\":\"WARNING\", \"message\":\"Une erreur est survenue lors de la publication de la commande. Veuillez vérifier que le broker MQTT est en ligne.\"}");
                FrontOfficeCommunication.publish();
             //   SocketConnexion.emit(topic, "{\"badge\":\"WARNING\", \"message\":\"Une erreur est survenue lors de la publication de la commande. Veuillez vérifier que le broker MQTT est en ligne.\"}");
            }else{
                console.log("published  command : " + command +", on topic : " + topic + " at " + new Date());
            }
        });
        
    }
}

module.exports = DataCommunication;