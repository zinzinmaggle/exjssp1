import Objet  from '../../models/objet.js';
import Mqtt  from '../../models/mqtt.js';

// import {MqttConnexion} from '../../utils/mqttConnexion.js'
// import StatutManager from '../../utils/statutManager.js'
import IntervalStack from '../../utils/intervalStack.js';
import DataCommunication from '../../utils/communication/dataCommunication.js';
import PingCommunication from '../../utils/communication/pingCommunication.js';
import TypesObjet  from '../../enums/typesObjet.js';
import Referentiels  from '../../enums/referentiels.js';

import { find } from 'lodash';


const _root_services = {
    getRoot:function(){
        let retour = {'ListeObjets':{'Objets':[]}};
        Objet.find({}, function (err, docs) {
                (docs).forEach(element => {
                    element['display'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['details'];      
                    element['commands'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['commands'];           
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
                // setInterval(function(){
                //     MqttConnexion.setTopic(t.mqttId);
                //     MqttConnexion.subscribe();
                // },1000)
                IntervalStack.push(new PingCommunication("MQTT",t.mqttId+'-statut-channel',"###").getIntervalId(),t.code);
                //IntervalStack.push(new StatutManager(o,true).getIntervalId(),t.code);
            });
        });
    },
    supprimerAction:function(object){
        let _o;
        if(typeof object.code !== "object"){
            _o = [object];
        } else {
            _o= [];
            for(let i in object.code){
                _o.push({code : object.code[i]}); 
            }      
        }
        // _o.forEach((e)=>{
        //     console.log(e);
        // })
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
        let _d =  new DataCommunication("MQTT",object.mqttId+"-command",object.command);
       _d.subscribe();
       _d.listen();
        // MqttConnexion.setTopic(object.mqttId+"-command");
        // MqttConnexion.subscribe();
        // MqttConnexion.publish(object.command,true);
    }
};
Object.freeze(_root_services);
module.exports = {
    RootServices: _root_services
}