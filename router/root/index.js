import { app } from '../../server.js'
import { RootController } from '../../controllers/root/index.js'
import {check} from 'express-validator/check';
app.get('/', function (req, res) {
    RootController.getRoot(res, null);
});

app.post('/ajouter',function (req, res) {
    RootController.ajouterAction(req,res)
});

app.post('/supprimer', function (req,res){
    RootController.supprimerAction(req,res)
});

