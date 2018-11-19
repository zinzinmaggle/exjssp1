import Objet  from '../../models/objet.js'
import Mqtt  from '../../models/mqtt.js'
import MqttConnexion from '../../utils/mqttConnexion.js'
import TypesObjet  from '../../enums/typesObjet.js'
import { find } from 'lodash';

const _root_services = {
    getRoot:function(){
        let retour = {Objets:[]};
        Objet.find({}, function (err, docs) {
            (docs).forEach(element => {
                let _r = find(TypesObjet, function(o) { return o.code === element.typeObjetCd})
                retour.Objets.push({
                    'libelleObjet' : element.libelle,
                    'identifiantConnexion' : element.mqttId,
                    'typeObjetLabel' : _r['libelle'],
                    'datas' : _r['details']
                });            
            });
        });

        retour['TypesObjet'] = {TypesObjet}
        // Ecouter les sockets
        // Préparer un beau retour pour la vue
        return retour;
    },
    saveAjouterAction:function(object){
        // Create an instance of model Objet
        new Objet(object).save();
    
        // Créer une connexion mqtt
        let mqtt = {
            'statutCd' : 'NC',
            'topic' : object.mqttId,
            'broker' : '127.0.0.1'
        }
        new Mqtt(mqtt).save();
   
        let mqttConnexion = new MqttConnexion(mqtt);
        mqttConnexion.connect();
        mqttConnexion.subscribe();
        mqttConnexion.listen();
    }
};

module.exports = {
    RootServices: _root_services
}