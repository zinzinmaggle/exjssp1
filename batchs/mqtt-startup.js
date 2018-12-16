import Mqtt from '../models/mqtt.js'
import MqttConnexion from '../utils/mqttConnexion.js'
import StatutManager from '../utils/statutManager.js'

const re = /^.+(-statut-channel)$/g;
Mqtt.find({},function(err,docs){
    docs.forEach(element => {
        if(element.topic.match(re) == null){
            new MqttConnexion(element).listen();
        } else{
            new StatutManager(element, false);
        }
    });
});