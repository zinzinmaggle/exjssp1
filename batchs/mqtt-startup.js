import Mqtt from '../models/mqtt.js';
import Objet from '../models/objet.js';
import BinaryMessages from '../enums/binaryMessages.js'
import Communications from '../enums/communications.js'
import IntervalStack from '../utils/intervalStack.js';
import PingCommunication from '../utils/communication/pingCommunication.js';
import DataCommunication from '../utils/communication/dataCommunication.js';

Mqtt.find({},(err,docs)=>{
    docs.forEach(element => {
           let topic = element.topic;
            Objet.findOne({mqttId:topic},(err,doc)=>{
                if(doc){
                    IntervalStack.push(new PingCommunication(Communications.MQTT.communication,topic,BinaryMessages.ping).getIntervalId(),doc.code);
                    new DataCommunication(Communications.MQTT.communication,topic,BinaryMessages.command);
                }
            })
    });
});