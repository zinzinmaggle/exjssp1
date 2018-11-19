import mqtt from 'mqtt'
import SocketConnexion from './socketConnexion.js'

class MqttConnexion {

    constructor(mqttDatas){
        this.mqttDatas = mqttDatas;
        this.client = null;
    }

    connect(){
        this.client = mqtt.connect('mqtt://'+this.mqttDatas.broker+':1883');
    }
    subscribe(){
        this.client.subscribe(this.mqttDatas.topic);
    }
    listen(){
        let test = this.mqttDatas.topic;
        this.client.on('message', function (topic, message) {
            new SocketConnexion(test,message).emit();
        });
    }
}

module.exports = MqttConnexion;