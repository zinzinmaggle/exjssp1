import MqttConnexion from './mqttConnexion.js'
import {memoryStack} from '../server.js'

class StatutManager {
    constructor(mqtt, suffixe){
        this.mqtt = mqtt;
        this.mqtt['topic'] = this.mqtt.topic + (suffixe ? '-statut-channel' : '');
        this.mqttConnexion = null;
        this.intervalId = null;
        this.init();
      
    }   
    init(){
        this.mqttConnexion = new MqttConnexion(this.mqtt);
        this.mqttConnexion.listen();
        this.manage(this.mqttConnexion);
    }
    manage(mqttConnexion){
        this.intervalId = setInterval(function(){
            mqttConnexion.publish("###");
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