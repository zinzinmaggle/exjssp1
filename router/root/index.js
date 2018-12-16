import { app } from '../../server.js'
import { RootController } from '../../controllers/root/index.js'

app.get('/', function (req, res) {
    RootController.render(res);
});

app.post('/ajouter', function (req, res) {
    RootController.ajouterAction(req,res)
});

app.post('/supprimer', function (req,res){
    RootController.supprimerAction(req,res)
});

