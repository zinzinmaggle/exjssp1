import mqtt from 'mqtt'
import SocketConnexion from './socketConnexion.js'

class MqttConnexion {
    constructor(){

        this.client = null;
        this.topic = null;
        this.broker = "127.0.0.1";

        this.connect();
    }
    setTopic(topic){
        this.topic = topic;
    }
    connect(){
        this.client = mqtt.connect('mqtt://'+this.broker+':1883');
    }
    subscribe(){
        this.client.subscribe(this.topic);
        this.listen();
    }

    listen(){
        this.client.on('message', function (topic, message) {
            if(topic.substring(8) !== "-statut-channel"){
                SocketConnexion.emit(topic, message);
            }else{
                let stack = [];
                let topicP = this.topic;
                if(topicP != null && topicP === topic.substring(0, 7)){
                    stack.push(message.toLocaleString());
                    let t = '';
                    if(stack.length === 3){
                        let offline = stack[0] === "###" && stack[1] === "###" && stack[2] === "###";
                        let warning = stack[0] === "#####" || stack[1]==="#####" ||  stack[2]==="#####";
                        if(offline){
                            t = "{\"badge\":\"OFFLINE\", \"message\":\"Vérifier que l\'objet est allumé ou qu'il dispose d\'une connexion internet. Il peut s\'agir d\'une panne matériel.\"}";
                        }else if(warning){
                            t= "{\"badge\":\"WARNING\", \"message\":\"Les données fournies par l\'objet sont éronnées.\"}";
                        }else{
                            t = "{\"badge\":\"ONLINE\", \"message\":\"Transmission des données...\"}";
                        }
                        stack = [];
                        SocketConnexion.emit(topic, t);
                    }    
                } 
            }
        });
    }
   
    publishCommand(command){
        let topic = this.topic;
        this.client.publish(topic, command, function(err){
            if(err){
                SocketConnexion.emit(topic, "{\"badge\":\"WARNING\", \"message\":\"Une erreur est survenue lors de la publication de la commande. Veuillez vérifier que le broker MQTT est en ligne.\"}");
            }else{
                console.log("published  command : " + command +", on topic : " + topic + " at " + new Date());
            }
        });
    }
    publishPing(message){
        let topic = this.topic;
        this.client.publish(topic, message, function(err){
            if(err){
                SocketConnexion.emit(topic, "{\"badge\":\"WARNING\", \"message\":\"Une erreur est survenue lors de la publication du ping. Veuillez vérifier que le broker MQTT est en ligne.\"}");
            }else{
                console.log("published ping : " + message +", on topic : " + topic + " at " + new Date());
            }
        });
    }   
    publish(message, isCommand){
        let _verification_connexion_mqtt = !this.client.connected  || this.client.reconnecting;
        if(_verification_connexion_mqtt){
            SocketConnexion.emit(this.topic, "{\"badge\":\"WARNING\", \"message\":\"L\'application ne parvient pas à se connecter au broker MQTT\"}");
        }else{
            if(isCommand){
                this.publishCommand(message);
            }else{
                this.publishPing(message);
            }
        }  
    }
     
}

module.exports = MqttConnexion;
