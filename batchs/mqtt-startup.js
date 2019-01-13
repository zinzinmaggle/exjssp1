import Mqtt from '../models/mqtt.js'
import Objet from '../models/objet.js'

import StatutManager from '../utils/statutManager.js'
import IntervalStack from '../utils/intervalStack.js'
import {MqttConnexion} from '../utils/mqttConnexion.js'
Mqtt.find({},(err,docs)=>{
    docs.forEach(element => {
           let topic = element.topic;
            Objet.findOne({mqttId:topic},(err,doc)=>{
                if(doc){
                    // Enregister cet interval dans la stack avec les autres interval de cet objet
                    setInterval(function(){
                        MqttConnexion.setTopic(topic);
                        MqttConnexion.subscribe();
                    },1000);
                    IntervalStack.push(new StatutManager(element,true).getIntervalId(),doc.code);
                }
            })
    });
});