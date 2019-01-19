import Mqtt from '../models/mqtt.js';
import Objet from '../models/objet.js';

// import StatutManager from '../utils/statutManager.js'
import IntervalStack from '../utils/intervalStack.js';
import PingCommunication from '../utils/communication/pingCommunication.js';
import DataCommunication from '../utils/communication/dataCommunication.js';

var _t;
Mqtt.find({},(err,docs)=>{
    docs.forEach(element => {
           let topic = element.topic;
            Objet.findOne({mqttId:topic},(err,doc)=>{
                if(doc){
                   
                    // Enregister cet interval dans la stack avec les autres interval de cet objet
                    // setInterval(function(){
                    //     MqttConnexion.setTopic(topic);
                    //     MqttConnexion.subscribe();
                    // },1000);
                    //IntervalStack.push(new StatutManager(element,true).getIntervalId(),doc.code);
                    IntervalStack.push(new PingCommunication("MQTT",topic+'-statut-channel',"###").getIntervalId(),doc.code);
                    _t = new DataCommunication("MQTT",topic,null);
                    _t.subscribe();
                    _t.listen();

                }
            })
    });
});