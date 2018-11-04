import Objet  from '../../models/objet.js'
import Referentiels  from '../../enums/referentiels.js'

const _root_services = {
    getRoot:function(){
        var retour = {Objets:[]};
        Objet.find({}, function (err, docs) {
            (docs).forEach(element => {
                retour.Objets.push(element);
                // Pour chaque objet il faut trouver la connexion mqtt
                // Envoyer les datas par socket io
            });
        });
        retour['Referentiels'] = Referentiels;
        return retour;
    },
    saveAjouterAction:function(object){
        // Create an instance of model Objet
        var small = new Objet(object);
        small.save();
    }
};

module.exports = {
    RootServices: _root_services
}