import {MqttConnexion} from './mqttConnexion.js'

class StatutManager {
    constructor(mqtt, suffixe){
        this.mqtt = mqtt;
        this.mqtt['topic'] = this.mqtt.topic + (suffixe ? '-statut-channel' : '');
        this.intervalId = null;
        this.manage();
      
    }   
    manage(){
        let topic = this.mqtt.topic
        this.intervalId = setInterval(function(){
            MqttConnexion.setTopic(topic);
            MqttConnexion.subscribe();
            MqttConnexion.publish("###",false);
        }, 3000);
    }

    getMqtt(){
        return this.mqtt;
    }

    getIntervalId(){
        return this.intervalId;
    }
}

module.exports = StatutManager;