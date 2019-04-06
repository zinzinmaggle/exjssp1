import Communications from '../../enums/communications.js'
import Communication from './communication.js';
import FrontOfficeCommunication from './frontOfficeCommunication.js';
import Command from '../../models/command.js';
import BinaryMessages from '../../enums/binaryMessages.js';
import { mqtt } from '../../server.js'

class DataCommunication extends Communication {
    constructor(type,topic, message){
        super(type,topic,message);
        this.init();
    }
    init(){
        super.subscribe();
        super.listen(this.executeListen());
    }
   
    executeListen(){
        return (topic,message) => {
            new FrontOfficeCommunication(Communications.IO.communication,topic,message).publish();
            if(message.toLocaleString().substring(0,3) === BinaryMessages.command){

            }
            // Si c'est une commande on change le statut de la commande si elle était pending 
        }
    }

    executePublish(){
        return (command, topic) => {
            mqtt.publish(topic, command);
            console.log("published  command : " + command +", on topic : " + topic + " at " + new Date());
        }
    }
    publish(){
        super.publish(this.executePublish());
    }

    registerCommand(){
        let command = new Command();
        command.date = new Date();
        command.statut = "PEN";
        command.mqttId = this.topic;
        command.command = this.message;
        // Vérifier qu'une commande n'est pas déjà enregistrer.
        // Si oui la supprimer et créer.
        console.log("coucou");
        Command.create(command).then( t => {
            
        });
    }
}

module.exports = DataCommunication;