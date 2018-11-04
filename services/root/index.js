import Objet  from '../../models/objet.js'
import Referentiels  from '../../enums/referentiels.js'
import TypesObjet  from '../../enums/typesObjet.js'
import { find } from 'lodash';

const _root_services = {
    getRoot:function(){
        let retour = {Objets:[]};
        Objet.find({}, function (err, docs) {
            (docs).forEach(element => {
                let obj = {};
                obj['libelleObjet'] = element.libelle;
                obj['identifiantConnexion'] = element.mqttId;
                let _t = find(Referentiels, function(o) { return o.code === element.referentielCd});
                let _r = find(TypesObjet, function(o) { return o.code === _t['typeObjetCd']})
                obj['typeObjetLabel'] = _r['libelle'];
                obj['datas'] = _r['details'];
                retour.Objets.push(obj);
                
            });
        });
        retour['Referentiels'] = {Referentiels};
        // Emettre les sockets
        return retour;
    },
    saveAjouterAction:function(object){
        // Create an instance of model Objet
        var small = new Objet(object);
        small.save();

        // Créer une connexion mqtt 
    }
};

module.exports = {
    RootServices: _root_services
}