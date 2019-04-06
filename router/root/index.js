import { app } from '../../server.js'
import { RootController } from '../../controllers/root/index.js'
import {validationResult} from 'express-validator/check';
import _root_validator_ajouter_action from '../../validators/root/index.js'
import { sanitizeBody } from 'express-validator/filter';


app.get('/', (req, res) => {
    RootController.getRoot(res);
});

app.post('/ajouter',_root_validator_ajouter_action, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    RootController.ajouterAction(req,res);
});

app.post('/envoyerCommande', (req,res) => {
    RootController.envoyerCommande(req,res);
});

app.post('/supprimer', sanitizeBody('code').customSanitizer(value => {
    console.log(value);
    let _o = [], retour = [];
    if(typeof value !== "object"){
        _o = [value];
    } else {
        value.forEach(e => {
            _o.push(e);
        });
    }
    _o.forEach(e =>{
        let _s = e.split("$");
        retour.push({topic : _s[1], code: _s[0]});
    });
    return retour;
}), (req,res) => {
    console.log(req.body);
    RootController.supprimerAction(req,res);
});

