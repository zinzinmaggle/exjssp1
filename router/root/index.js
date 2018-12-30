import { app } from '../../server.js'
import { RootController } from '../../controllers/root/index.js'
import {validationResult} from 'express-validator/check';
import _root_validator_ajouter_action from '../../validators/root/index.js'


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

app.post('/supprimer', (req,res) => {
    RootController.supprimerAction(req,res);
});

