import Objet  from '../../models/objet.js'
import Mqtt  from '../../models/mqtt.js'
import MqttConnexion from '../../utils/mqttConnexion.js'
import TypesObjet  from '../../enums/typesObjet.js'
import Referentiels  from '../../enums/referentiels.js'
import StatutManager from '../../utils/statutManager.js'
import { find } from 'lodash';
import MemoryStack from '../../server.js'
const _root_services = {
    getRoot:function(){
        let retour = {'ListeObjets':{'Objets':[]}};
        Objet.find({}, function (err, docs) {
                (docs).forEach(element => {
                    element['display'] =  find(TypesObjet, function(o) { return o.code === element.typeObjetCd})['details'];           
                    retour['ListeObjets']['Objets'].push(element); 
                });
        });
        retour['ListeTypesObjet'] = {TypesObjet};
        return retour;
    },
    saveAjouterAction:function(object){
        let _r = find(TypesObjet, function(o) { return o.code === object.typeObjetCd});
        let _f = find(Referentiels, function(o) { return o.typeObjetCd === _r['code']});
        object['code'] = (_f['code']+object.libelle).toUpperCase();
        Objet.create(object);
    
        let mqtt = {
            'statutCd' : 'NC',
            'topic' : object.mqttId,
            'broker' : '127.0.0.1'
        }
        Mqtt.create(mqtt);
        new MqttConnexion(mqtt).listen();

        MemoryStack.push(new StatutManager(mqtt,true).getIntervalId(),object.code,true);
        // let test = mqtt['topic']+'-statut-channel';
        // let obj = {};
        // obj[test] = new StatutManager(mqtt,true);  
        // memoryStack.push(obj);
        // Mqtt.create( obj[test].getMqtt());
    },
    deleteSupprimerAction:function(object){
        var _o;
        if(typeof object.code !== "object"){
            _o = [object];
        } else {
            _o= [];
            for(let i in object.code){
                _o.push({code : object.code[i]}); 
            }      
        }
        for(let k in _o){
            let t = _o[k].code.split('$');
            Objet.deleteOne({code: t[0] }, function (err) {
                if (err) return handleError(err);
            });
            // for(let j in memoryStack){          
            //     if(memoryStack[j].hasOwnProperty(m)) {
            //        clearInterval(memoryStack[j][m].intervalId);
            //        memoryStack.splice(j, 1);
            //     }
            // }
            Mqtt.deleteOne({topic: t[1]}, function (err) {
                if (err) return handleError(err);
            });
        }
    }
};
Object.freeze(_root_services);
module.exports = {
    RootServices: _root_services
}