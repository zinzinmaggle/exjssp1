import mqtt from 'mqtt'
import SocketConnexion from './socketConnexion.js'
import {memoryStack} from '../server.js'
class MqttConnexion {

    constructor(mqttDatas){
        
        this.mqttDatas = mqttDatas;
        this.client = null;

        this.connect();
        this.subscribe();        
    }
    connect(){
        this.client = mqtt.connect('mqtt://'+this.mqttDatas.broker+':1883');
    }
    subscribe(){
        this.client.subscribe(this.mqttDatas.topic);
    }
    listen(){
        var stack = [];
        const re = /^.+(-statut-channel)$/g;
        this.client.on('message', function (topic, message) {
            if(topic.match(re) == null){
                new SocketConnexion(topic, message).emit();
            }else{
                stack.push(message.toLocaleString());
                let t = '';
                if(stack.length === 2){
                    if(stack[0] === "###" && stack[1] === "###"){
                        t = "{\"badge\":\"OFFLINE\", \"message\":\"Vérifier que l\'objet est allumé ou qu'il dispose d\'une connexion internet. Il peut s\'agir d\'une panne matériel.\"}";
                    }else if(stack[0] === "#####" || stack[1]==="#####"){
                        t= "{\"badge\":\"WARNING\", \"message\":\"Les données fournies par l\'objet sont éronnées.\"}";
                    }else{
                        t = "{\"badge\":\"ONLINE\", \"message\":\"Transmission des données...\"}";
                    }
                    stack = [];
                    new SocketConnexion(topic, t).emit();
                }
            }
        });
    }
    publish(message){
        let topic = this.mqttDatas.topic;
        var _verification_connexion_mqtt = !this.client.connected  || this.client.reconnecting;
        if(_verification_connexion_mqtt){
            new SocketConnexion(topic, "{\"badge\":\"WARNING\", \"message\":\"L\'application ne parvient pas à se connecter au broker MQTT\"}").emit();
        }
        this.client.publish(topic, message, function(err){
            if(err){
                new SocketConnexion(topic, "{\"badge\":\"WARNING\", \"message\":\"Une erreur est survenue lors de la publication. Veuillez vérifier que le broker MQTT est en ligne.\"}").emit();
            }
            console.log("published " + message +" on topic : " + topic + " at " + new Date());
        });
    }    
}

module.exports = MqttConnexion;