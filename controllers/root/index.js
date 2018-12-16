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
        RootServices.saveAjouterAction(req.body);
        res.redirect('/');
    }

    supprimerAction(req,res){
        RootServices.deleteSupprimerAction(req.body);
        res.redirect('/');
    }

    render(res){
        res.render('root/root', RootServices.getRoot());
    }
}

const _root_controller = new RootController("Home");

Object.freeze(_root_controller);
module.exports = { 
    RootController : _root_controller
}