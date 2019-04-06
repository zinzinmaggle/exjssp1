import{ RootServices } from '../../services/root/index.js'
var instance = null;
class RootController {
    constructor(name){
        if(!instance){
            instance = this;
        }
        instance.name = name;
        return instance;
    }

    ajouterAction(req,res){
        RootServices.ajouterAction(req.body);
        return res.status(200).json(req.body);
    }

    retourAjouterAction(req,res){
        res.redirect('/');
    }

    supprimerAction(req,res){
        RootServices.supprimerAction(req.body.code);
        res.redirect('/');
    }

    envoyerCommande(req,res){
        RootServices.envoyerCommandeAction(req.body);
        return res.status(200).json(req.body);
    }
    
    getRoot(res){
        let _rs = RootServices.getRoot();
        res.render('root/root', _rs);
    }
}

const _root_controller = new RootController("Home");

Object.freeze(_root_controller);
module.exports = { 
    RootController : _root_controller
}