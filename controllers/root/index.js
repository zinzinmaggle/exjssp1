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
        let _t = RootServices.saveAjouterAction(req.body);
        if(typeof _t != Object && _t){
            res.redirect('/');
        }else{
            res.send(_t);
        }
    }

    retourAjouterAction(req,res){
        res.redirect('/');
    }

    supprimerAction(req,res){
        RootServices.deleteSupprimerAction(req.body);
        res.redirect('/');
    }

    getRoot(res,errors){
        let _rs = RootServices.getRoot();
        res.render('root/root', _rs);
    }
}

const _root_controller = new RootController("Home");

Object.freeze(_root_controller);
module.exports = { 
    RootController : _root_controller
}