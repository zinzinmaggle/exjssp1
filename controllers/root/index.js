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

    ajouterAction(res,req){
        RootServices.saveAjouterAction(req.body);
        res.redirect('/');
    }

    render(res){
        res.render('root/root', RootServices.getRoot());
    }
}

const _root_controller = new RootController("Home");
module.exports = { 
    RootController : _root_controller
}