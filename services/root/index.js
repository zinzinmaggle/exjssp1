import Objet  from '../../models/objet.js';
import Mqtt  from '../../models/mqtt.js';
import Command  from '../../models/command.js';

import IntervalStack from '../../utils/intervalStack.js';
import DataCommunication from '../../utils/communication/dataCommunication.js';
import PingCommunication from '../../utils/communication/pingCommunication.js';
import TypesObjet  from '../../enums/typesObjet.js';
import Referentiels  from '../../enums/referentiels.js';
import BinaryMessages from '../../enums/binaryMessages.js'
import { find } from 'lodash';


const _root_services = {
    getRoot:function(){
        let retour = {'ListeObjets':{'Objets':[]}};
        Objet.find({}, function (err, docs) {
                (docs).forEach(element => {
                    element['display'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['details'];      
                    element['commands'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['commands'];
                    element['commands'].forEach((c) => {
                        c['disabled'] = false;
                        Command.findOne({mqttId : element.mqttId, statut : "PEN", command : c.command}).sort({date: -1}).exec(function(err, docs) { 
                            if(docs){
                                c['disabled'] = true;
                            }
                        });
                    });   
                    retour['ListeObjets']['Objets'].push(element); 
                });
        });
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
                let _d = new DataCommunication("MQTT",t.mqttId,null);
                _d.subscribe();
                _d.listen();

                IntervalStack.push(new PingCommunication("MQTT",t.mqttId, BinaryMessages.ping).getIntervalId(),t.code);
               // IntervalStack.push(new PingCommunication("MQTT",t.mqttId,"###").getIntervalId(),t.code);
            });
        });
    },
    supprimerAction:function(object){
        let _o;
        // TODO : Sanitize l'objet avec express validators
        // Entrée : "" || {code: {'', '',''}}
        // Sortie 
        if(typeof object.code !== "object"){
            _o = [object];
        } else {
            _o= [];
            for(let i in object.code){
                _o.push({code : object.code[i]}); 
            }      
        }
        // TODO : Remplacer par
        // _o.forEach((e)=>{

        // });
        for(let k in _o){
            let t = _o[k].code.split('$');
            Objet.deleteOne({code: t[0] }, function (err) {
                if (err) return handleError(err);
            });
            IntervalStack.pop(t[0]);
            Mqtt.deleteOne({topic: t[1]}, function (err) {
                if (err) return handleError(err);
            });
        }
    },
    envoyerCommandeAction:function(object){
        let _d =  new DataCommunication("MQTT",object.mqttId,BinaryMessages.command + object.command);
       _d.subscribe();
       _d.publish();
       _d.listen();

       let command = new Command();
       command.setDate(new Date());
      // command.set
    }
};

Object.freeze(_root_services);
module.exports = {
    RootServices: _root_services
}