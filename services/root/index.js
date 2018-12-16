import Objet  from '../../models/objet.js'
import Mqtt  from '../../models/mqtt.js'
import MqttConnexion from '../../utils/mqttConnexion.js'
import TypesObjet  from '../../enums/typesObjet.js'
import Referentiels  from '../../enums/referentiels.js'
import StatutManager from '../../utils/statutManager.js'
import { find } from 'lodash';
import IntervalStack from '../../utils/intervalStack.js';

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
        IntervalStack.push(new StatutManager(mqtt,true).getIntervalId(),object.code);
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
            IntervalStack.pop(t[0]);
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