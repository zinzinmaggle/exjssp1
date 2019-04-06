import Objet  from '../../models/objet.js';
import Mqtt  from '../../models/mqtt.js';
import Command from '../../models/command.js'

import IntervalStack from '../../utils/intervalStack.js';
import DataCommunication from '../../utils/communication/dataCommunication.js';
import PingCommunication from '../../utils/communication/pingCommunication.js';
import TypesObjet  from '../../enums/typesObjet.js';
import Referentiels  from '../../enums/referentiels.js';
import BinaryMessages from '../../enums/binaryMessages.js'
import Communications from '../../enums/communications.js'
import { find } from 'lodash';

const _root_services = {
    getRoot:function(){
        let retour = {
            'ListeObjets': {
                'Objets' : []
            }
        };
        Objet.find({}, function (err, docs) {
                (docs).forEach(element => {
                    element['display'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['details'];      
                    element['commands'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['commands'];
                    retour['ListeObjets']['Objets'].push(element); 
                });
        });

        // .then(t => {
        //     retour.ListeObjets.Objets.forEach(e => {
        //         e.commands.forEach(c => {
        //             c['disabled'] = "";
        //             Command.find({mqttId : e.mqttId, statut : "PEN", command : c.command},function(err,docs) {
        //                 if(docs && docs !== []){
        //                     console.log(docs);
        //                     c['disabled'] = "disabled";
        //                 }
        //             });
        //         });
        //     });
        // });

        retour['ListeTypesObjet'] = {TypesObjet};
        return retour;
    },
    ajouterAction:function(object){
        let _r = find(TypesObjet, function(o) { return o.code === object.typeObjetCd});
        let _f = find(Referentiels, function(o) { return o.typeObjetCd === _r['code']});
        object['code'] = (_f['code']+object.libelle).toUpperCase();
        let _o = new Objet(object);
        Objet.create(_o).then(t =>{
            let _m = new Mqtt({
                'topic' : t.mqttId,
            });
            Mqtt.create(_m).then(o => {
                new DataCommunication(Communications.MQTT.communication,t.mqttId,BinaryMessages.command);
                IntervalStack.push(new PingCommunication(Communications.MQTT.communication,t.mqttId, BinaryMessages.ping).getIntervalId(),t.code);
            });
        });
    },
    supprimerAction:function(object){
        object.forEach(e => {
            Objet.deleteOne({code: e.code }, function (err) {
                if (err) return handleError(err);
            });
            IntervalStack.pop(e.code);
            Mqtt.deleteOne({topic: e.topic}, function (err) {
                if (err) return handleError(err);
            });
        });
    },
    envoyerCommandeAction:function(object) {
        let _d =  new DataCommunication(Communications.MQTT.communication,object.mqttId, BinaryMessages.command + object.command);
        _d.publish();
        _d.registerCommand();
    }
};

Object.freeze(_root_services);
module.exports = {
    RootServices: _root_services
}